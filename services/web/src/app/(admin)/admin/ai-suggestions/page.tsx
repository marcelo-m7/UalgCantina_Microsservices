// src/app/(admin)/admin/ai-suggestions/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sparkles, ChefHat, Loader2, AlertCircle, AlertTriangle as AlertTriangleIcon } from 'lucide-react';
import { suggestMenuPairings } from '@/ai/flows/suggest-menu-pairings';
import type { SuggestMenuPairingsInput, SuggestMenuPairingsOutput } from '@/ai/flows/suggest-menu-pairings';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery } from '@tanstack/react-query';
import { getDishes } from '@/services/dishService';
import type { Dish } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';


export default function AISuggestionsPage() {
  const [mainDish, setMainDish] = useState('');
  const [availableSideDishes, setAvailableSideDishes] = useState<string[]>([]);
  const [selectedSideDishes, setSelectedSideDishes] = useState<string[]>([]);
  const [suggestion, setSuggestion] = useState<SuggestMenuPairingsOutput | null>(null);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: allDishes = [], isLoading: isLoadingDishes, isError: isErrorDishes, error: dishesError } = useQuery<Dish[], Error>({
    queryKey: ['dishes'],
    queryFn: getDishes,
  });

  useEffect(() => {
    if (allDishes.length > 0) {
      const currentAvailableSideDishes = allDishes
        .filter(dish => 
          dish.type === 'vegetariano' || 
          dish.type === 'vegan' || 
          dish.name.toLowerCase().includes('arroz') || 
          dish.name.toLowerCase().includes('batata') || 
          dish.name.toLowerCase().includes('legumes') ||
          dish.type === 'sopa'
        )
        .map(dish => dish.name);
      
      setAvailableSideDishes(currentAvailableSideDishes);
      setSelectedSideDishes(currentAvailableSideDishes.slice(0, Math.min(5, currentAvailableSideDishes.length)));
    }
  }, [allDishes]);
  
  const handleSideDishToggle = (dishName: string) => {
    setSelectedSideDishes(prev =>
      prev.includes(dishName)
        ? prev.filter(name => name !== dishName)
        : [...prev, dishName]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainDish.trim() || selectedSideDishes.length === 0) {
      toast({
        title: "Entrada Inválida",
        description: "Por favor, insira um prato principal e selecione pelo menos um acompanhamento disponível.",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingSuggestion(true);
    setError(null);
    setSuggestion(null);

    const input: SuggestMenuPairingsInput = {
      mainDish,
      availableSideDishes: selectedSideDishes,
    };

    try {
      const result = await suggestMenuPairings(input);
      setSuggestion(result);
      toast({
        title: "Sugestão Recebida!",
        description: `Sugestão para "${mainDish}" pronta.`,
      });
    } catch (err: unknown) {
      let message = "Ocorreu um erro ao obter a sugestão.";
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === 'string' && err.length > 0) {
        message = err;
      } else if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as {message: unknown}).message === 'string') {
        message = (err as {message: string}).message;
      }
      console.error("Error getting AI suggestion:", err);
      setError(message);
      toast({
        title: "Erro na Sugestão",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingSuggestion(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Sugestões de Menu com IA
          </CardTitle>
          <CardDescription>
            Obtenha recomendações inteligentes para combinações de pratos e acompanhamentos.
            A IA considera compatibilidade nutricional e popularidade passada.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Gerar Sugestão de Acompanhamento</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="mainDish" className="text-base">Prato Principal</Label>
              <Input
                id="mainDish"
                value={mainDish}
                onChange={(e) => setMainDish(e.target.value)}
                placeholder="Ex: Frango Grelhado com Limão"
                className="mt-1"
                required
                disabled={isLoadingDishes}
              />
            </div>
            <div>
              <Label className="text-base">Acompanhamentos Disponíveis (selecione para considerar)</Label>
              <ScrollArea className="h-48 mt-1 border rounded-md p-3">
                {isLoadingDishes ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}
                  </div>
                ) : isErrorDishes ? (
                   <Alert variant="destructive" className="my-2">
                      <AlertTriangleIcon className="h-4 w-4" />
                      <AlertTitle>Erro</AlertTitle>
                      <AlertDescription>Não foi possível carregar os acompanhamentos. {dishesError?.message}</AlertDescription>
                  </Alert>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {availableSideDishes.length > 0 ? availableSideDishes.map((sideDish) => (
                      <div key={sideDish} className="flex items-center space-x-2 p-1.5 rounded hover:bg-muted transition-colors">
                        <Checkbox
                          id={`side-${sideDish.replace(/\s+/g, '-')}`}
                          checked={selectedSideDishes.includes(sideDish)}
                          onCheckedChange={() => handleSideDishToggle(sideDish)}
                          aria-label={`Selecionar ${sideDish}`}
                        />
                        <Label htmlFor={`side-${sideDish.replace(/\s+/g, '-')}`} className="text-sm font-normal cursor-pointer">
                          {sideDish}
                        </Label>
                      </div>
                    )) : (
                      <p className="text-sm text-muted-foreground col-span-full text-center py-4">Nenhum acompanhamento carregado ou compatível encontrado.</p>
                    )}
                  </div>
                )}
              </ScrollArea>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoadingSuggestion || isLoadingDishes || !mainDish.trim() || selectedSideDishes.length === 0} className="w-full md:w-auto">
              {isLoadingSuggestion ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  A Obter Sugestão...
                </>
              ) : (
                <>
                  <ChefHat className="mr-2 h-4 w-4" />
                  Obter Sugestão da IA
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {suggestion && !isLoadingSuggestion && (
        <Card className="bg-gradient-to-br from-primary/10 via-background to-background shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-primary flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Sugestão da IA para "{mainDish}"
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm font-semibold text-muted-foreground">Acompanhamento Sugerido:</Label>
              <p className="text-lg font-medium">{suggestion.suggestedSideDish}</p>
            </div>
            <div>
              <Label className="text-sm font-semibold text-muted-foreground">Justificação:</Label>
              <Textarea
                value={suggestion.reasoning}
                readOnly
                className="mt-1 min-h-[100px] bg-muted/50"
                aria-label="Justificação da sugestão"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
