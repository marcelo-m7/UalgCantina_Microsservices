// src/app/(admin)/admin/dishes/page.tsx
"use client";

import type { ChangeEvent } from 'react';
import React, { useState, useEffect } from 'react';
import type { Dish, Allergen } from '@/lib/types';
// import { mockDishes, mockAllergens } from '@/lib/mock-data'; // No longer primary source
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { PlusCircle, Edit, Trash2, Search, X, Loader2, AlertTriangle as AlertTriangleIcon } from 'lucide-react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DishTypeIcons, getAllergenIcon } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDishes, createDish, updateDish, deleteDish } from '@/services/dishService';
import { getAllergens } from '@/services/allergenService';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const dishTypes = [
  'carne',
  'peixe',
  'vegetariano',
  'vegan',
  'sobremesa',
  'sopa',
  'bebida',
] as const;

// Schema for form data, ensures price and kcals are numbers
const dishFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres."),
  type: z.enum(dishTypes, { errorMap: () => ({ message: "Tipo de prato inválido."}) }),
  description: z.string().optional(),
  price: z.coerce.number({invalid_type_error: "Preço deve ser um número"}).min(0, "Preço deve ser positivo."),
  kcals: z.coerce.number({invalid_type_error: "Calorias devem ser um número"}).min(0, "Calorias devem ser positivas.").optional().nullable(),
  allergenIds: z.array(z.string()).optional(),
});

type DishFormData = z.infer<typeof dishFormSchema>;

export default function DishesPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);

  const { control, handleSubmit, register, reset, formState: { errors, isSubmitting: isFormSubmitting } } = useForm<DishFormData>({
    resolver: zodResolver(dishFormSchema),
    defaultValues: {
      name: '', type: 'carne', description: '', price: 0, kcals: 0, allergenIds: [],
    },
  });

  const { data: dishes = [], isLoading: isLoadingDishes, isError: isErrorDishes, error: dishesError } = useQuery<Dish[], Error>({
    queryKey: ['dishes'],
    queryFn: getDishes,
  });

  const { data: allergens = [], isLoading: isLoadingAllergens } = useQuery<Allergen[], Error>({
    queryKey: ['allergens'],
    queryFn: getAllergens,
  });
  
  const createMutation = useMutation({
    mutationFn: createDish,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
      toast({ title: "Prato Criado", description: `O prato "${data.name}" foi adicionado.` });
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao Criar", description: error.message || "Não foi possível criar o prato.", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<DishFormData> }) => updateDish(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
      toast({ title: "Prato Atualizado", description: `O prato "${data.name}" foi atualizado.` });
      setIsDialogOpen(false);
      setEditingDish(null);
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao Atualizar", description: error.message || "Não foi possível atualizar o prato.", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDish,
    onSuccess: (_, dishId) => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
      const deletedDish = dishes.find(d => d.id === dishId);
      toast({ title: "Prato Removido", description: `O prato "${deletedDish?.name || 'selecionado'}" foi removido.`, variant: "destructive" });
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao Remover", description: error.message || "Não foi possível remover o prato.", variant: "destructive" });
    }
  });

  useEffect(() => {
    if (editingDish) {
      reset({
        id: editingDish.id,
        name: editingDish.name,
        type: editingDish.type,
        description: editingDish.description || '',
        price: editingDish.price,
        kcals: editingDish.kcals || 0, // Ensure kcals is number or 0
        allergenIds: editingDish.allergenIds || [],
      });
    } else {
      reset({ name: '', type: 'carne', description: '', price: 0, kcals: 0, allergenIds: [] });
    }
  }, [editingDish, reset]);

  const filteredDishes = dishes.filter(dish =>
    dish.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit: SubmitHandler<DishFormData> = (data) => {
    const mutationData = {
      ...data,
      price: Number(data.price), // Ensure price is number
      kcals: data.kcals ? Number(data.kcals) : null, // Ensure kcals is number or null
    };

    if (editingDish && editingDish.id) {
      updateMutation.mutate({ id: editingDish.id, data: mutationData });
    } else {
      createMutation.mutate(mutationData);
    }
  };

  const handleEdit = (dish: Dish) => {
    setEditingDish(dish);
    setIsDialogOpen(true);
  };

  const handleDelete = (dishId: string) => {
    deleteMutation.mutate(dishId);
  };

  const isMutating = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  if (isLoadingDishes || isLoadingAllergens) {
    return (
      <div className="space-y-6">
        <Card><CardHeader><Skeleton className="h-8 w-1/2" /><Skeleton className="h-4 w-3/4" /></CardHeader></Card>
        <Skeleton className="h-10 w-full max-w-sm" />
        <Card><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Ícone</TableHead><TableHead>Nome</TableHead><TableHead>Tipo</TableHead><TableHead>Preço</TableHead><TableHead>Calorias</TableHead><TableHead>Alérgenos</TableHead><TableHead>Ações</TableHead></TableRow></TableHeader><TableBody>{[...Array(3)].map((_, i) => (<TableRow key={i}><TableCell><Skeleton className="h-5 w-5 rounded-full" /></TableCell><TableCell><Skeleton className="h-5 w-24" /></TableCell><TableCell><Skeleton className="h-5 w-16" /></TableCell><TableCell><Skeleton className="h-5 w-12" /></TableCell><TableCell><Skeleton className="h-5 w-12" /></TableCell><TableCell><Skeleton className="h-5 w-20" /></TableCell><TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
      </div>
    );
  }

  if (isErrorDishes) {
    return <Alert variant="destructive"><AlertTriangleIcon className="h-4 w-4" /><AlertTitle>Erro ao Carregar Pratos</AlertTitle><AlertDescription>{dishesError?.message || "Não foi possível buscar os dados dos pratos."}</AlertDescription></Alert>;
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Gestão de Pratos</CardTitle>
          <CardDescription>Adicione, edite ou remova pratos do sistema.</CardDescription>
        </CardHeader>
      </Card>

      <div className="flex justify-between items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Input type="text" placeholder="Procurar pratos..." value={searchTerm} onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)} className="pl-10" />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          {searchTerm && (<Button variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7" onClick={() => setSearchTerm('')}><X className="h-4 w-4" /></Button>)}
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingDish(null); }}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingDish(null); reset({ name: '', type: 'carne', description: '', price: 0, kcals: 0, allergenIds: [] }); setIsDialogOpen(true); }}>
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Prato
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingDish ? 'Editar Prato' : 'Adicionar Novo Prato'}</DialogTitle>
              <DialogDescription>{editingDish ? 'Modifique os detalhes do prato.' : 'Preencha os detalhes do novo prato.'}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome do Prato</Label>
                  <Input id="name" {...register("name")} placeholder="Ex: Bife com Batata Frita" className={errors.name ? 'border-destructive' : ''} disabled={isFormSubmitting || isMutating}/>
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="type">Tipo de Prato</Label>
                  <Controller name="type" control={control} render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isFormSubmitting || isMutating}>
                        <SelectTrigger id="type" className={errors.type ? 'border-destructive' : ''}><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                        <SelectContent>{dishTypes.map(type => (<SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>))}</SelectContent>
                      </Select>
                    )}
                  />
                  {errors.type && <p className="text-xs text-destructive mt-1">{errors.type.message}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="description">Descrição (Opcional)</Label>
                <Textarea id="description" {...register("description")} placeholder="Breve descrição do prato..." disabled={isFormSubmitting || isMutating}/>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Preço (€)</Label>
                  <Input id="price" type="number" step="0.01" {...register("price")} placeholder="0.00" className={errors.price ? 'border-destructive' : ''} disabled={isFormSubmitting || isMutating}/>
                  {errors.price && <p className="text-xs text-destructive mt-1">{errors.price.message}</p>}
                </div>
                <div>
                  <Label htmlFor="kcals">Calorias (kcals, Opcional)</Label>
                  <Input id="kcals" type="number" {...register("kcals")} placeholder="0" className={errors.kcals ? 'border-destructive' : ''} disabled={isFormSubmitting || isMutating}/>
                   {errors.kcals && <p className="text-xs text-destructive mt-1">{errors.kcals.message}</p>}
                </div>
              </div>
              <div>
                <Label>Alérgenos (Opcional)</Label>
                <Controller name="allergenIds" control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 border p-3 rounded-md max-h-48 overflow-y-auto">
                      {allergens.map(allergen => {
                        const Icon = getAllergenIcon(allergen.icon || allergen.name);
                        return (
                          <div key={allergen.id} className="flex items-center space-x-2">
                            <Checkbox id={`allergen-${allergen.id}-form`} checked={field.value?.includes(allergen.id)} disabled={isFormSubmitting || isMutating}
                              onCheckedChange={(checked) => {
                                const newValue = checked ? [...(field.value || []), allergen.id] : (field.value || []).filter(id => id !== allergen.id);
                                field.onChange(newValue);
                              }}
                            />
                            <Label htmlFor={`allergen-${allergen.id}-form`} className="flex items-center gap-1 text-sm cursor-pointer"><Icon className="h-4 w-4 text-accent" />{allergen.name}</Label>
                          </div>
                        );
                      })}
                    </div>
                  )}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild><Button type="button" variant="outline" disabled={isFormSubmitting || isMutating}>Cancelar</Button></DialogClose>
                <Button type="submit" disabled={isFormSubmitting || isMutating}>
                  {(isFormSubmitting || isMutating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingDish ? 'Guardar Alterações' : 'Adicionar Prato'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead className="w-[50px]">Ícone</TableHead><TableHead>Nome</TableHead><TableHead>Tipo</TableHead><TableHead>Preço</TableHead><TableHead>Calorias</TableHead><TableHead>Alérgenos</TableHead><TableHead className="text-right w-[120px]">Ações</TableHead></TableRow></TableHeader>
            <TableBody>
              {filteredDishes.length > 0 ? filteredDishes.map(dish => {
                 const DishIcon = DishTypeIcons[dish.type];
                 // Resolve allergens for display based on IDs and the fetched allergens list
                 const dishAllergensToDisplay = dish.allergenIds?.map(id => allergens.find(a => a.id === id)).filter(Boolean) as Allergen[] || [];
                 return (
                  <TableRow key={dish.id}>
                    <TableCell><DishIcon className="h-5 w-5 text-primary" /></TableCell>
                    <TableCell className="font-medium">{dish.name}</TableCell>
                    <TableCell className="capitalize">{dish.type}</TableCell>
                    <TableCell>{(dish.price || 0).toFixed(2)}€</TableCell>
                    <TableCell>{dish.kcals || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {dishAllergensToDisplay.slice(0,3).map(allergen => {
                           const AllergenSpecificIcon = getAllergenIcon(allergen.icon || allergen.name);
                           return (
                             <AllergenSpecificIcon
                               key={allergen.id}
                               className="h-4 w-4"
                             />
                           );
                        })}
                        {dishAllergensToDisplay.length > 3 && <span className="text-xs">+{dishAllergensToDisplay.length-3}</span>}
                        {dishAllergensToDisplay.length === 0 && <span className="text-xs text-muted-foreground">N/A</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(dish)} className="hover:text-primary" disabled={isMutating}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(dish.id)} className="hover:text-destructive" disabled={isMutating}>
                         {deleteMutation.isPending && deleteMutation.variables === dish.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                  </TableRow>
                 );
              }) : (
                <TableRow><TableCell colSpan={7} className="text-center h-24">{searchTerm ? 'Nenhum prato encontrado com esse termo.' : 'Nenhum prato adicionado ainda.'}</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
