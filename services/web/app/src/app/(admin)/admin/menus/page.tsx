// src/app/(admin)/admin/menus/page.tsx
"use client";

import type { ChangeEvent } from 'react';
import React, { useState, useEffect } from 'react';
import type { WeeklyMenu, DayMenu, MenuEntry, Dish, DishType, Allergen } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { PlusCircle, Edit, Trash2, CalendarDays, Info, Loader2, AlertTriangle as AlertTriangleIcon } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { DishTypeIcons, getAllergenIcon } from '@/components/icons'; 
import { Badge } from '@/components/ui/badge'; 
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminWeeklyMenu, updateMenuEntry, MenuEntryUpdatePayload } from '@/services/menuService'; // Assuming getAdminWeeklyMenu for admin
import { getDishes } from '@/services/dishService';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface MenuDayEditFormData {
  date: string;
  mealType: 'lunch' | 'dinner';
  sopaId?: string;
  mainDishId: string; // Required in form
  altDishId?: string;
  dessertId: string; // Required in form
  notes?: string;
}

const NONE_SELECT_VALUE = "__NONE_VALUE__";

export default function MenusPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMenuEntry, setEditingMenuEntry] = useState<MenuDayEditFormData | null>(null);
  const [currentEditForm, setCurrentEditForm] = useState<MenuDayEditFormData | null>(null);

  const { data: weeklyMenu, isLoading: isLoadingMenu, isError: isErrorMenu, error: menuError } = useQuery<WeeklyMenu, Error>({
    queryKey: ['adminWeeklyMenu'],
    queryFn: getAdminWeeklyMenu, // Use admin-specific fetch
  });

  const { data: allDishes = [], isLoading: isLoadingDishes } = useQuery<Dish[], Error>({
    queryKey: ['dishes'],
    queryFn: getDishes,
  });

  const updateMenuMutation = useMutation({
    mutationFn: updateMenuEntry,
    onSuccess: (updatedDayMenu) => { // API should return the updated DayMenu or relevant part
      queryClient.invalidateQueries({ queryKey: ['adminWeeklyMenu'] });
      toast({ title: "Ementa Atualizada", description: `A ementa para ${getDayName(updatedDayMenu.date)} foi atualizada.` });
      setIsEditDialogOpen(false);
      setEditingMenuEntry(null);
      setCurrentEditForm(null);
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao Atualizar Ementa", description: error.message || "Não foi possível guardar as alterações.", variant: "destructive" });
    }
  });

  const handleEditMeal = (dayDate: string, mealType: 'lunch' | 'dinner') => {
    const day = weeklyMenu?.days.find(d => d.date === dayDate);
    const meal = day?.[mealType];
    if (meal) {
      const formData: MenuDayEditFormData = {
        date: dayDate,
        mealType: mealType,
        sopaId: meal.sopaId || undefined,
        mainDishId: meal.mainDishId!, // Should exist if meal exists
        altDishId: meal.altDishId || undefined,
        dessertId: meal.dessertId!, // Should exist
        notes: meal.notes || '',
      };
      setEditingMenuEntry(formData);
      setCurrentEditForm(formData);
      setIsEditDialogOpen(true);
    } else {
      // Handle case for creating a new meal entry if desired
      // For now, assumes editing existing entries from fetched menu
       const formData: MenuDayEditFormData = {
        date: dayDate,
        mealType: mealType,
        sopaId: undefined,
        mainDishId: '', // Needs selection
        altDishId: undefined,
        dessertId: '', // Needs selection
        notes: '',
      };
      setEditingMenuEntry(formData); // Store initial state for potential reset or comparison
      setCurrentEditForm(formData); // Initialize form with current meal data
      setIsEditDialogOpen(true);
      toast({ title: "Nova Refeição", description: `A configurar ${mealType === 'lunch' ? 'Almoço' : 'Jantar'} para ${getDayName(dayDate)}.`});
    }
  };
  
  const handleFormChange = (field: keyof MenuDayEditFormData, value: string) => {
    if (currentEditForm) {
      setCurrentEditForm(prev => ({ 
        ...prev!, 
        [field]: value === NONE_SELECT_VALUE && (field === 'sopaId' || field === 'altDishId') 
                  ? undefined 
                  : value 
      }));
    }
  };
  
  const handleSaveChanges = () => {
    if (!currentEditForm) return;
    if (!currentEditForm.mainDishId || !currentEditForm.dessertId) {
      toast({ title: "Campos Obrigatórios", description: "Prato Principal e Sobremesa são obrigatórios.", variant: "destructive" });
      return;
    }

    const payload: MenuEntryUpdatePayload = {
      date: currentEditForm.date,
      mealType: currentEditForm.mealType,
      sopaId: currentEditForm.sopaId || null, // API might expect null for empty optional fields
      mainDishId: currentEditForm.mainDishId,
      altDishId: currentEditForm.altDishId || null,
      dessertId: currentEditForm.dessertId,
      notes: currentEditForm.notes || '',
    };
    updateMenuMutation.mutate(payload);
  };

  const getDayName = (dateString?: string) => {
    if (!dateString) return "Data inválida";
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return "Data inválida";
      return format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };
  
  const renderDishSelection = (dishType: DishType | Array<DishType>, label: string, fieldName: keyof MenuDayEditFormData, required: boolean = false) => {
    const typesArray = Array.isArray(dishType) ? dishType : [dishType];
    const available = allDishes.filter(d => typesArray.includes(d.type));
    
    let selectValue = currentEditForm?.[fieldName] || "";
    if ((fieldName === 'sopaId' || fieldName === 'altDishId') && currentEditForm?.[fieldName] === undefined) {
        selectValue = NONE_SELECT_VALUE;
    }
    
    return (
      <div>
        <Label htmlFor={`${fieldName}-select`} className="block text-sm font-medium text-muted-foreground mb-1">{label} {required ? '*' : '(Opcional)'}</Label>
        <Select
          value={selectValue}
          onValueChange={(value) => handleFormChange(fieldName, value)}
          required={required}
          disabled={isLoadingDishes || updateMenuMutation.isPending}
        >
          <SelectTrigger id={`${fieldName}-select`}>
            <SelectValue placeholder={`Selecione ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {!required && <SelectItem value={NONE_SELECT_VALUE}>Nenhum</SelectItem>}
            {available.map(d => (
              <SelectItem key={d.id} value={d.id}>{d.name} ({(d.price || 0).toFixed(2)}€)</SelectItem>
            ))}
            {required && available.length === 0 && <SelectItem value="" disabled>Nenhum prato disponível</SelectItem>}
          </SelectContent>
        </Select>
      </div>
    );
  };

  const DishInfo = ({ dish }: { dish?: Dish }) => {
    if (!dish) return <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">Não selecionado</span>;
    const DishIcon = DishTypeIcons[dish.type];
    return (
      <span className="inline-flex items-center gap-2 text-sm">
        {DishIcon && <DishIcon className="h-4 w-4 text-primary" />}
        <span>{dish.name} ({(dish.price || 0).toFixed(2)}€)</span>
      </span>
    );
  };

  if (isLoadingMenu || isLoadingDishes) {
     return (
      <div className="space-y-6">
        <Card><CardHeader><Skeleton className="h-8 w-1/2" /><Skeleton className="h-4 w-3/4" /></CardHeader></Card>
        <Card><CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader><CardContent><Skeleton className="h-24 w-full" /></CardContent></Card>
         <Card><CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader><CardContent><Skeleton className="h-24 w-full" /></CardContent></Card>
      </div>
    );
  }

  if (isErrorMenu) {
     return <Alert variant="destructive"><AlertTriangleIcon className="h-4 w-4" /><AlertTitle>Erro ao Carregar Ementa</AlertTitle><AlertDescription>{menuError?.message || "Não foi possível buscar os dados da ementa."}</AlertDescription></Alert>;
  }
  if (!weeklyMenu) {
    return <div className="text-center py-10">Ementa não encontrada ou ainda não configurada.</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle className="text-2xl">Gestão de Ementas</CardTitle>
            <CardDescription>Visualize e edite a ementa semanal.</CardDescription>
          </div>
          {/* <Button disabled>  // Functionality for new weekly menu not implemented yet
            <PlusCircle className="mr-2 h-4 w-4" /> Nova Ementa Semanal
          </Button> */}
        </CardHeader>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" />
            Ementa de {format(parseISO(weeklyMenu.startDate), "dd/MM", { locale: ptBR })} a {format(parseISO(weeklyMenu.endDate), "dd/MM/yyyy", { locale: ptBR })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {weeklyMenu.days.map(day => (
            <Card key={day.date} className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">{getDayName(day.date)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(['lunch', 'dinner'] as const).map(mealType => {
                  const meal = day[mealType];
                  // Show edit button even if meal is undefined, to allow creating it
                  return (
                    <div key={mealType} className="p-3 border rounded-md bg-muted/30">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-md font-semibold capitalize text-primary">{mealType === 'lunch' ? 'Almoço' : 'Jantar'}</h4>
                        <Button variant="outline" size="sm" onClick={() => handleEditMeal(day.date, mealType)} disabled={updateMenuMutation.isPending}>
                          <Edit className="mr-2 h-3 w-3" /> {meal ? 'Editar' : 'Adicionar'}
                        </Button>
                      </div>
                      {meal ? (
                        <div className="space-y-1 text-sm">
                          <p><strong>Sopa:</strong> <DishInfo dish={meal.sopa} /></p>
                          <p><strong>Prato Principal:</strong> <DishInfo dish={meal.mainDish} /></p>
                          <p><strong>Prato Alternativo:</strong> <DishInfo dish={meal.altDish} /></p>
                          <p><strong>Sobremesa:</strong> <DishInfo dish={meal.dessert} /></p>
                          {meal.notes && <p className="italic text-xs text-accent mt-1 flex items-center gap-1"><Info size={12}/> {meal.notes}</p>}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground py-2">Não definido. Clique em Adicionar para configurar.</p>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {editingMenuEntry && currentEditForm && (
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => { if (!open) { setEditingMenuEntry(null); setCurrentEditForm(null); } setIsEditDialogOpen(open); }}>
          <DialogContent className="sm:max-w-lg max-h-[90vh]">
          <ScrollArea className="max-h-[80vh] p-0">
            <DialogHeader className="px-6 pt-6 pb-4">
              <DialogTitle>Editar Ementa - {getDayName(editingMenuEntry.date)} ({editingMenuEntry.mealType === 'lunch' ? 'Almoço' : 'Jantar'})</DialogTitle>
              <DialogDescription>Modifique os pratos para esta refeição.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 px-6 pb-6">
              {renderDishSelection('sopa', 'Sopa', 'sopaId')}
              {renderDishSelection(['carne', 'peixe', 'vegetariano', 'vegan'], 'Prato Principal', 'mainDishId', true)}
              {renderDishSelection(['vegetariano', 'vegan', 'carne', 'peixe'], 'Prato Alternativo', 'altDishId')}
              {renderDishSelection('sobremesa', 'Sobremesa', 'dessertId', true)}
              <div>
                <Label htmlFor="notes">Notas (Opcional)</Label>
                <Textarea 
                  id="notes" 
                  value={currentEditForm.notes || ""} 
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleFormChange('notes', e.target.value)}
                  placeholder="Notas adicionais para esta refeição..."
                  disabled={updateMenuMutation.isPending}
                />
              </div>
            </div>
            <DialogFooter className="px-6 pb-6 sticky bottom-0 bg-background py-3 border-t">
              <DialogClose asChild><Button type="button" variant="outline" disabled={updateMenuMutation.isPending}>Cancelar</Button></DialogClose>
              <Button type="button" onClick={handleSaveChanges} disabled={updateMenuMutation.isPending}>
                {updateMenuMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Alterações
              </Button>
            </DialogFooter>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
