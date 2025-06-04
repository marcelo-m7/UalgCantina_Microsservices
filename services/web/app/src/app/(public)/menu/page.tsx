// src/app/(public)/menu/page.tsx
"use client";

import React, { useState, useMemo } from "react";
import type { WeeklyMenu, Allergen, Dish, MenuEntry } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, isValid } from "date-fns";
import { pt } from "date-fns/locale";
import { AlertCircle, Utensils, Info, AlertTriangle as AlertTriangleIcon } from "lucide-react";
import { DishTypeIcons, getAllergenIcon } from "@/components/icons";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useQuery } from "@tanstack/react-query";
import { getPublicWeeklyMenu } from "@/services/menuService";
import { getAllergens } from "@/services/allergenService";
import { Skeleton } from "@/components/ui/skeleton";

function AllergenFilter({ allergens, selectedAllergens, onAllergenToggle, isLoading }: {
  allergens: Allergen[];
  selectedAllergens: string[];
  onAllergenToggle: (allergenId: string) => void;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <Skeleton className="h-6 w-1/2 mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="mb-8 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Filtrar por alergénios</CardTitle>
        <CardDescription>Selecione os alergénios que pretende evitar.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {allergens.map((allergen) => {
          const Icon = getAllergenIcon(allergen.name);
          return (
            <div key={allergen.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors">
              <Checkbox
                id={`allergen-filter-${allergen.id}`}
                checked={selectedAllergens.includes(allergen.id)}
                onCheckedChange={() => onAllergenToggle(allergen.id)}
                aria-label={`Filtrar por ${allergen.name}`}
              />
              <Label htmlFor={`allergen-filter-${allergen.id}`} className="flex items-center gap-2 cursor-pointer text-sm">
                <Icon className="h-5 w-5 text-accent" />
                {allergen.name}
              </Label>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function DishItem({ dish, allAllergens }: { dish?: Dish; allAllergens: Allergen[] }) {
  if (!dish) return <p className="text-sm text-muted-foreground">Prato não disponível.</p>;

  const DishIcon = DishTypeIcons[dish.type] || Utensils;
  const dishAllergens = dish.allergenIds
    ?.map(id => allAllergens.find(a => a.id === id))
    .filter(Boolean) as Allergen[] || [];

  return (
    <div className="p-3 border rounded-lg bg-card/50 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-1">
        <DishIcon className="h-5 w-5 text-primary" />
        <h4 className="font-semibold text-md">{dish.name}</h4>
      </div>
      <p className="text-xs text-muted-foreground mb-1">{(dish.price || 0).toFixed(2)}€ - {dish.kcals || "N/D"} kcal</p>
      {dish.description && <p className="text-xs text-muted-foreground mb-2">{dish.description}</p>}
      {dishAllergens.length > 0 && (
        <div className="mt-1">
          <p className="text-xs font-medium mb-1">Alergénios:</p>
          <div className="flex flex-wrap gap-1">
            {dishAllergens.map(allergen => {
              const AllergenSpecificIcon = getAllergenIcon(allergen.icon || allergen.name);
              return (
                <Badge variant="outline" key={allergen.id} className="text-xs flex items-center gap-1">
                  <AllergenSpecificIcon className="h-3 w-3" />
                  {allergen.name}
                </Badge>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function MealCard({ meal, mealType, allAllergens }: { meal?: MenuEntry; mealType: string; allAllergens: Allergen[] }) {
  if (!meal) return null;
  const isEmptyAfterFilter = !meal.sopa && !meal.mainDish && !meal.altDish && !meal.dessert;
  if (isEmptyAfterFilter && (meal.sopaId || meal.mainDishId || meal.altDishId || meal.dessertId)) {
    return (
      <Card className="flex-1 min-w-[300px] bg-background shadow-md">
        <CardHeader><CardTitle className="text-lg capitalize">{mealType}</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Todos os pratos para esta refeição foram ocultados devido aos filtros de alergénios seleccionados.
          </p>
        </CardContent>
      </Card>
    );
  }
  if (isEmptyAfterFilter) return null;

  return (
    <Card className="flex-1 min-w-[300px] bg-background shadow-md">
      <CardHeader>
        <CardTitle className="text-lg capitalize">{mealType}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {meal.sopa && (
          <div><h5 className="text-sm font-medium text-muted-foreground mb-1">Sopa</h5><DishItem dish={meal.sopa} allAllergens={allAllergens} /></div>
        )}
        {meal.mainDish && (
          <div><h5 className="text-sm font-medium text-muted-foreground mb-1">Prato principal</h5><DishItem dish={meal.mainDish} allAllergens={allAllergens} /></div>
        )}
        {meal.altDish && (
          <div><h5 className="text-sm font-medium text-muted-foreground mb-1">Prato alternativo</h5><DishItem dish={meal.altDish} allAllergens={allAllergens} /></div>
        )}
        {meal.dessert && (
          <div><h5 className="text-sm font-medium text-muted-foreground mb-1">Sobremesa</h5><DishItem dish={meal.dessert} allAllergens={allAllergens} /></div>
        )}
      </CardContent>
      {meal.notes && (
        <CardFooter className="text-xs text-accent italic flex items-center gap-1"><Info size={14} /> {meal.notes}</CardFooter>
      )}
    </Card>
  );
}

export default function PublicMenuPage() {
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);

  const { data: weeklyMenu, isLoading: isLoadingMenu, isError: isErrorMenu, error: menuError } = useQuery<WeeklyMenu | null, Error>({
    queryKey: ["publicWeeklyMenu"],
    queryFn: getPublicWeeklyMenu,
  });

  const { data: allergens = [], isLoading: isLoadingAllergens, isError: isErrorAllergens, error: allergensError } = useQuery<Allergen[], Error>({
    queryKey: ["allergens"],
    queryFn: getAllergens,
  });

  const handleAllergenToggle = (allergenId: string) => {
    setSelectedAllergens(prev =>
      prev.includes(allergenId) ? prev.filter(id => id !== allergenId) : [...prev, allergenId]
    );
  };

  const filterDish = (dish?: Dish): Dish | undefined => {
    if (!dish) return undefined;
    if (selectedAllergens.length === 0) return dish;
    const hasSelectedAllergen = dish.allergenIds?.some(id => selectedAllergens.includes(id));
    return hasSelectedAllergen ? undefined : dish;
  };

// ⬇️ substitua TODO o bloco filteredMenu por este
const filteredMenu = useMemo(() => {
  if (!weeklyMenu) return null;

  const filterMenuEntry = (entry?: MenuEntry): MenuEntry | undefined => {
    if (!entry) return undefined;

    const filtered = {
      sopa:     filterDish(entry.sopa),
      mainDish: filterDish(entry.mainDish),
      altDish:  filterDish(entry.altDish),
      dessert:  filterDish(entry.dessert),
    };

    const allGone =
      !filtered.sopa && !filtered.mainDish && !filtered.altDish && !filtered.dessert;

    if (allGone) {
      // mantém o objeto para mostrar mensagem “filtrado”
      return { ...entry, ...filtered };
    }

    return { ...entry, ...filtered };
  };

  return {
    ...weeklyMenu,
    days: weeklyMenu.days.map((day) => ({
      ...day,
      lunch:  filterMenuEntry(day.lunch),
      dinner: filterMenuEntry(day.dinner),
    })),
  };
}, [weeklyMenu, selectedAllergens]);

  const getDayName = (dateString?: string) => {
    if (!dateString) return "Data inválida";
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return "Data inválida";
      // "EEEE, d 'de' MMMM" → "segunda-feira, 3 de junho"
      return format(date, "EEEE, d 'de' MMMM", { locale: pt });
    } catch (error) {
      return "Data inválida";
    }
  };

  if (isLoadingMenu || isLoadingAllergens) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <Skeleton className="h-10 w-3/4 mx-auto mb-2" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
        </div>
        <AllergenFilter allergens={[]} selectedAllergens={[]} onAllergenToggle={() => {}} isLoading={true} />
        <Accordion type="single" collapsible className="w-full space-y-4">
          {[...Array(3)].map((_, i) => (
            <AccordionItem value={`day-skeleton-${i}`} key={`day-skeleton-${i}`} className="border bg-card rounded-lg shadow-sm">
              <AccordionTrigger className="px-6 py-4 text-xl font-semibold hover:no-underline text-primary data-[state=open]:bg-primary/10">
                <Skeleton className="h-7 w-1/3" />
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4 border-t">
                <Skeleton className="h-40 w-full" />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    );
  }

  if (isErrorMenu || isErrorAllergens) {
    const errorToShow = menuError || allergensError;
    return (
      <div className="text-center py-10">
        <AlertTriangleIcon className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Erro ao carregar dados</h2>
        <p className="text-muted-foreground">{errorToShow?.message || "Não foi possível carregar a ementa ou alergénios. Tente novamente mais tarde."}</p>
      </div>
    );
  }

  if (!filteredMenu) {
    return (
      <div className="text-center py-10">
        <AlertCircle className="mx-auto h-12 w-12 text-primary mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Ementa indisponível</h2>
        <p className="text-muted-foreground">De momento não há ementa disponível para consulta.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">Ementa semanal da cantina</h1>
        <p className="text-lg text-muted-foreground">
          {getDayName(filteredMenu.startDate)} - {getDayName(filteredMenu.endDate)}
        </p>
      </div>

      <AllergenFilter
        allergens={allergens}
        selectedAllergens={selectedAllergens}
        onAllergenToggle={handleAllergenToggle}
      />

      <Accordion
        type="single"
        collapsible
        defaultValue={filteredMenu.days.length > 0 ? `day-${filteredMenu.days[0]?.date}` : undefined}
        className="w-full space-y-4"
      >
        {filteredMenu.days.map((day) => {
          const hasLunch = day.lunch && (day.lunch.mainDish || day.lunch.altDish || day.lunch.sopa || day.lunch.dessert);
          const hasDinner = day.dinner && (day.dinner.mainDish || day.dinner.altDish || day.dinner.sopa || day.dinner.dessert);
          const noMealsDefinedOrAllFiltered = !hasLunch && !hasDinner;

          return (
            <AccordionItem value={`day-${day.date}`} key={day.date} className="border bg-card rounded-lg shadow-sm">
              <AccordionTrigger className="px-6 py-4 text-xl font-semibold hover:no-underline text-primary data-[state=open]:bg-primary/10">
                {getDayName(day.date)}
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4 border-t">
                {noMealsDefinedOrAllFiltered ? (
                  <p className="text-center text-muted-foreground py-4">
                    {selectedAllergens.length > 0 ?
                      "Nenhum prato disponível para este dia com os filtros de alergénios seleccionados." :
                      "Sem ementa definida para este dia."}
                  </p>
                ) : (
                  <div className="space-y-6">
                    {hasLunch && <MealCard meal={day.lunch} mealType="Almoço" allAllergens={allergens} />}
                    {hasDinner && <MealCard meal={day.dinner} mealType="Jantar" allAllergens={allergens} />}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
      {filteredMenu.days.length === 0 && (
        <p className="text-center text-muted-foreground py-10">Nenhum dia com ementa disponível para esta semana.</p>
      )}
    </div>
  );
}
