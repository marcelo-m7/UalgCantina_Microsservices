// src/app/(admin)/admin/menus/page.tsx
"use client";

import type { ChangeEvent } from "react";
import React, { useState } from "react";
import type {
  WeeklyMenu,
  MenuEntry,
  Dish,
  DishType,
} from "@/lib/types";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  ScrollArea,
  Label,
  Badge,
  Alert,
  AlertTitle,
  AlertDescription,
  Skeleton,
} from "@/components/ui"; // (↳ ajuste: re-export das UI usadas para encurtar)
import {
  CalendarDays,
  Edit,
  Info,
  Loader2,
  AlertTriangle as AlertTriangleIcon,
} from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import { pt } from "date-fns/locale";
import { DishTypeIcons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminWeeklyMenu,
  updateMenuEntry,
  type MenuEntryUpdatePayload,
} from "@/services/menuService";
import { getDishes } from "@/services/dishService";

interface MenuDayEditFormData {
  date: string;
  mealType: "lunch" | "dinner";
  sopaId?: string;
  mainDishId: string;
  altDishId?: string;
  dessertId: string;
  notes?: string;
}

const NONE_SELECT_VALUE = "__NONE_VALUE__";

/* ---------- helpers ---------- */
const safeParseISO = (dateStr?: string) => {
  if (!dateStr) return null;
  try {
    const d = parseISO(dateStr);
    return isValid(d) ? d : null;
  } catch {
    return null;
  }
};

const getDayName = (dateStr?: string) => {
  const d = safeParseISO(dateStr);
  return d ? format(d, "EEEE, d 'de' MMMM", { locale: pt }) : "Data inválida";
};

export default function MenusPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMenuEntry, setEditingMenuEntry] =
    useState<MenuDayEditFormData | null>(null);
  const [currentEditForm, setCurrentEditForm] =
    useState<MenuDayEditFormData | null>(null);

  /* ---------- queries ---------- */
  const {
    data: weeklyMenu,
    isLoading: isLoadingMenu,
    isError: isErrorMenu,
    error: menuError,
  } = useQuery<WeeklyMenu, Error>({
    queryKey: ["adminWeeklyMenu"],
    queryFn: getAdminWeeklyMenu,
  });

  const {
    data: allDishes = [],
    isLoading: isLoadingDishes,
  } = useQuery<Dish[], Error>({
    queryKey: ["dishes"],
    queryFn: getDishes,
  });

  /* ---------- mutations ---------- */
  const updateMenuMutation = useMutation({
    mutationFn: updateMenuEntry,
    onSuccess: (updatedDay) => {
      queryClient.invalidateQueries({ queryKey: ["adminWeeklyMenu"] });
      toast({
        title: "Ementa actualizada",
        description: `A ementa para ${getDayName(updatedDay.date)} foi gravada.`,
      });
      setIsEditDialogOpen(false);
      setEditingMenuEntry(null);
      setCurrentEditForm(null);
    },
    onError: (err: Error) => {
      toast({
        title: "Erro ao gravar ementa",
        description: err.message ?? "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  /* ---------- handlers ---------- */
  const handleEditMeal = (date: string, mealType: "lunch" | "dinner") => {
    const day = weeklyMenu?.days.find((d) => d.date === date);
    const meal: MenuEntry | undefined =
      mealType === "lunch" ? day?.lunch : day?.dinner;

    const baseForm: MenuDayEditFormData = {
      date,
      mealType,
      mainDishId: meal?.mainDishId ?? "",
      dessertId: meal?.dessertId ?? "",
      sopaId: meal?.sopaId ?? undefined,
      altDishId: meal?.altDishId ?? undefined,
      notes: meal?.notes ?? "",
    };

    setEditingMenuEntry(baseForm);
    setCurrentEditForm(baseForm);
    setIsEditDialogOpen(true);
  };

  const handleFormChange = (
    field: keyof MenuDayEditFormData,
    value: string,
  ) => {
    setCurrentEditForm((prev) =>
      prev
        ? {
            ...prev,
            [field]:
              value === NONE_SELECT_VALUE &&
              (field === "sopaId" || field === "altDishId")
                ? undefined
                : value,
          }
        : prev,
    );
  };

  const handleSave = () => {
    if (!currentEditForm) return;
    if (!currentEditForm.mainDishId || !currentEditForm.dessertId) {
      toast({
        title: "Campos obrigatórios",
        description: "Prato principal e sobremesa são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const payload: MenuEntryUpdatePayload = {
      date: currentEditForm.date,
      mealType: currentEditForm.mealType,
      sopaId: currentEditForm.sopaId ?? null,
      mainDishId: currentEditForm.mainDishId,
      altDishId: currentEditForm.altDishId ?? null,
      dessertId: currentEditForm.dessertId,
      notes: currentEditForm.notes ?? "",
    };
    updateMenuMutation.mutate(payload);
  };

  /* ---------- UI helpers ---------- */
  const renderSelect = (
    types: DishType | DishType[],
    label: string,
    field: keyof MenuDayEditFormData,
    required = false,
  ) => {
    const typeArr = Array.isArray(types) ? types : [types];
    const available = allDishes.filter((d) => typeArr.includes(d.type));
    const val =
      (currentEditForm?.[field] ??
        (field === "sopaId" || field === "altDishId"
          ? NONE_SELECT_VALUE
          : "")) as string;

    return (
      <div>
        <Label className="block text-sm text-muted-foreground mb-1">
          {label} {required ? "*" : "(Opcional)"}
        </Label>
        <Select
          value={val}
          onValueChange={(v) => handleFormChange(field, v)}
          disabled={isLoadingDishes || updateMenuMutation.isPending}
          required={required}
        >
          <SelectTrigger>
            <SelectValue placeholder={`Selecione ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {!required && <SelectItem value={NONE_SELECT_VALUE}>Nenhum</SelectItem>}
            {available.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.name} ({d.price.toFixed(2)}€)
              </SelectItem>
            ))}
            {required && available.length === 0 && (
              <SelectItem disabled value="">
                Nenhum prato disponível
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    );
  };

  const DishInfo = ({ dish }: { dish?: Dish }) => {
    if (!dish)
      return (
        <span className="text-sm text-muted-foreground">Não seleccionado</span>
      );
    const Icon = DishTypeIcons[dish.type];
    return (
      <span className="inline-flex items-center gap-2 text-sm">
        {Icon && <Icon className="h-4 w-4 text-primary" />}
        {dish.name} ({dish.price.toFixed(2)}€)
      </span>
    );
  };

  /* ---------- loading / error ---------- */
  if (isLoadingMenu || isLoadingDishes)
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-8 w-1/2 mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );

  if (isErrorMenu)
    return (
      <Alert variant="destructive">
        <AlertTriangleIcon className="h-4 w-4" />
        <AlertTitle>Erro ao carregar ementa</AlertTitle>
        <AlertDescription>
          {menuError?.message || "Não foi possível obter os dados."}
        </AlertDescription>
      </Alert>
    );

  if (!weeklyMenu)
    return <div className="text-center py-10">Sem ementa disponível.</div>;

  /* ---------- main render ---------- */
  const startDate = safeParseISO(weeklyMenu.startDate);
  const endDate = safeParseISO(weeklyMenu.endDate);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex justify-between">
          <div>
            <CardTitle className="text-2xl">Gestão de ementas</CardTitle>
            <CardDescription>Edite o menu semanal.</CardDescription>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <CalendarDays className="h-6 w-6 text-primary" />
            Ementa de{" "}
            {startDate ? format(startDate, "dd/MM", { locale: pt }) : "??/??"} a{" "}
            {endDate ? format(endDate, "dd/MM/yyyy", { locale: pt }) : "??/??/????"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {weeklyMenu.days.map((day) => (
            <Card key={day.date} className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">{getDayName(day.date)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(["lunch", "dinner"] as const).map((mealType) => {
                  const meal =
                    mealType === "lunch" ? day.lunch : day.dinner;
                  return (
                    <div
                      key={mealType}
                      className="p-3 border rounded-md bg-muted/30"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="capitalize font-semibold text-primary">
                          {mealType === "lunch" ? "Almoço" : "Jantar"}
                        </h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditMeal(day.date, mealType)}
                          disabled={updateMenuMutation.isPending}
                        >
                          <Edit className="h-3 w-3 mr-2" />
                          {meal ? "Editar" : "Adicionar"}
                        </Button>
                      </div>

                      {meal ? (
                        <div className="space-y-1 text-sm">
                          <p>
                            <strong>Sopa:</strong> <DishInfo dish={meal.sopa} />
                          </p>
                          <p>
                            <strong>Prato principal:</strong>{" "}
                            <DishInfo dish={meal.mainDish} />
                          </p>
                          <p>
                            <strong>Prato alternativo:</strong>{" "}
                            <DishInfo dish={meal.altDish} />
                          </p>
                          <p>
                            <strong>Sobremesa:</strong>{" "}
                            <DishInfo dish={meal.dessert} />
                          </p>
                          {meal.notes && (
                            <p className="italic text-xs text-accent mt-1 flex items-center gap-1">
                              <Info size={12} /> {meal.notes}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground py-2">
                          Não definido. Clique em Adicionar para configurar.
                        </p>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* ------ Dialog de edição ------ */}
      {editingMenuEntry && currentEditForm && (
        <Dialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setEditingMenuEntry(null);
              setCurrentEditForm(null);
            }
            setIsEditDialogOpen(open);
          }}
        >
          <DialogContent className="sm:max-w-lg max-h-[90vh]">
            <ScrollArea className="max-h-[80vh] p-0">
              <DialogHeader className="px-6 pt-6 pb-4">
                <DialogTitle>
                  Editar ementa – {getDayName(editingMenuEntry.date)} (
                  {editingMenuEntry.mealType === "lunch" ? "Almoço" : "Jantar"})
                </DialogTitle>
                <DialogDescription>
                  Modifique os pratos desta refeição.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 px-6 pb-6">
                {renderSelect("sopa", "Sopa", "sopaId")}
                {renderSelect(
                  ["carne", "peixe", "vegetariano", "vegan"],
                  "Prato principal",
                  "mainDishId",
                  true,
                )}
                {renderSelect(
                  ["vegetariano", "vegan", "carne", "peixe"],
                  "Prato alternativo",
                  "altDishId",
                )}
                {renderSelect("sobremesa", "Sobremesa", "dessertId", true)}
                <div>
                  <Label htmlFor="notes">Notas (opcional)</Label>
                  <Textarea
                    id="notes"
                    value={currentEditForm.notes ?? ""}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                      handleFormChange("notes", e.target.value)
                    }
                    disabled={updateMenuMutation.isPending}
                  />
                </div>
              </div>

              <DialogFooter className="px-6 pb-6 sticky bottom-0 bg-background border-t">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    disabled={updateMenuMutation.isPending}
                  >
                    Cancelar
                  </Button>
                </DialogClose>
                <Button
                  onClick={handleSave}
                  disabled={updateMenuMutation.isPending}
                >
                  {updateMenuMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Guardar
                </Button>
              </DialogFooter>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
Z