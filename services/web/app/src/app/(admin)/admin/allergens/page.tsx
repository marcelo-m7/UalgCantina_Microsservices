// src/app/(admin)/admin/allergens/page.tsx
"use client";

import type { ChangeEvent } from 'react';
import React, { useState, useEffect } from 'react';
import type { Allergen } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { PlusCircle, Edit, Trash2, Search, X, Loader2, AlertTriangle as AlertTriangleIcon } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getAllergenIcon } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllergens, createAllergen, updateAllergen, deleteAllergen } from '@/services/allergenService';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const allergenSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres."),
  icon: z.string().optional(), 
  description: z.string().optional(),
});

type AllergenFormData = z.infer<typeof allergenSchema>;

export default function AllergensPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAllergen, setEditingAllergen] = useState<Allergen | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting: isFormSubmitting } } = useForm<AllergenFormData>({
    resolver: zodResolver(allergenSchema),
    defaultValues: { name: '', icon: 'AlertTriangle', description: '' },
  });

  const { data: allergens = [], isLoading, isError, error: queryError } = useQuery<Allergen[], Error>({
    queryKey: ['allergens'],
    queryFn: getAllergens,
  });

  const createMutation = useMutation({
    mutationFn: createAllergen,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['allergens'] });
      toast({ title: "Alérgeno Criado", description: `O alérgeno "${data.name}" foi adicionado.`});
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao Criar", description: error.message || "Não foi possível criar o alérgeno.", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: AllergenFormData }) => updateAllergen(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['allergens'] });
      toast({ title: "Alérgeno Atualizado", description: `O alérgeno "${data.name}" foi atualizado.`});
      setIsDialogOpen(false);
      setEditingAllergen(null);
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao Atualizar", description: error.message || "Não foi possível atualizar o alérgeno.", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAllergen,
    onSuccess: (_, allergenId) => {
      queryClient.invalidateQueries({ queryKey: ['allergens'] });
      const deletedAllergen = allergens.find(a => a.id === allergenId);
      toast({ title: "Alérgeno Removido", description: `O alérgeno "${deletedAllergen?.name || 'selecionado'}" foi removido.`, variant: "destructive" });
    },
    onError: (error: Error) => {
      toast({ title: "Erro ao Remover", description: error.message || "Não foi possível remover o alérgeno.", variant: "destructive" });
    }
  });
  
  useEffect(() => {
    if (editingAllergen) {
      reset(editingAllergen);
    } else {
      reset({ name: '', icon: 'AlertTriangle', description: '' });
    }
  }, [editingAllergen, reset]);

  const filteredAllergens = allergens.filter(allergen =>
    allergen.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit: SubmitHandler<AllergenFormData> = (data) => {
    if (editingAllergen && editingAllergen.id) {
      updateMutation.mutate({ id: editingAllergen.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (allergen: Allergen) => {
    setEditingAllergen(allergen);
    setIsDialogOpen(true);
  };

  const handleDelete = (allergenId: string) => {
    deleteMutation.mutate(allergenId);
  };

  const isMutating = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
        </Card>
        <Skeleton className="h-10 w-full max-w-sm" />
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>Ícone</TableHead><TableHead>Nome</TableHead><TableHead>Descrição</TableHead><TableHead>Ações</TableHead></TableRow></TableHeader>
              <TableBody>
                {[...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-5 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTriangleIcon className="h-4 w-4" />
        <AlertTitle>Erro ao Carregar Alérgenos</AlertTitle>
        <AlertDescription>{queryError?.message || "Não foi possível buscar os dados dos alérgenos."}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Gestão de Alérgenos</CardTitle>
          <CardDescription>Adicione, edite ou remova alérgenos do sistema.</CardDescription>
        </CardHeader>
      </Card>

      <div className="flex justify-between items-center">
         <div className="relative w-full max-w-sm">
          <Input
            type="text"
            placeholder="Procurar alérgenos..."
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
           {searchTerm && (
            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7" onClick={() => setSearchTerm('')}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) setEditingAllergen(null); }}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingAllergen(null); reset({ name: '', icon: 'AlertTriangle', description: '' }); setIsDialogOpen(true); }}>
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Alérgeno
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingAllergen ? 'Editar Alérgeno' : 'Adicionar Novo Alérgeno'}</DialogTitle>
              <DialogDescription>
                {editingAllergen ? 'Modifique os detalhes do alérgeno.' : 'Preencha os detalhes do novo alérgeno.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Nome do Alérgeno</Label>
                <Input id="name" {...register("name")} placeholder="Ex: Glúten" className={errors.name ? 'border-destructive' : ''} disabled={isFormSubmitting || createMutation.isPending || updateMutation.isPending} />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="icon">Ícone (Lucide Icon Name)</Label>
                <Input id="icon" {...register("icon")} placeholder="Ex: Wheat" disabled={isFormSubmitting || createMutation.isPending || updateMutation.isPending}/>
                <p className="text-xs text-muted-foreground mt-1">Use nomes de ícones da biblioteca Lucide-React (ex: Wheat, Milk, Fish). <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Ver ícones</a>.</p>
              </div>
              <div>
                <Label htmlFor="description">Descrição (Opcional)</Label>
                <Textarea id="description" {...register("description")} placeholder="Breve descrição do alérgeno..." disabled={isFormSubmitting || createMutation.isPending || updateMutation.isPending}/>
              </div>
              <DialogFooter>
                 <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={isFormSubmitting || createMutation.isPending || updateMutation.isPending}>Cancelar</Button>
                 </DialogClose>
                <Button type="submit" disabled={isFormSubmitting || createMutation.isPending || updateMutation.isPending}>
                  {(isFormSubmitting || createMutation.isPending || updateMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingAllergen ? 'Guardar Alterações' : 'Adicionar Alérgeno'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Ícone</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right w-[120px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAllergens.length > 0 ? filteredAllergens.map(allergen => {
                const IconComponent = getAllergenIcon(allergen.icon || allergen.name);
                return (
                  <TableRow key={allergen.id}>
                    <TableCell>
                      <IconComponent className="h-5 w-5 text-accent" />
                    </TableCell>
                    <TableCell className="font-medium">{allergen.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{allergen.description || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(allergen)} className="hover:text-primary" disabled={isMutating}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(allergen.id)} className="hover:text-destructive" disabled={isMutating}>
                        {deleteMutation.isPending && deleteMutation.variables === allergen.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              }) : (
                 <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    {searchTerm ? 'Nenhum alérgeno encontrado.' : 'Nenhum alérgeno adicionado ainda.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
