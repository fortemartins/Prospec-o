'use client';

import { useState } from 'react';
import { useLiveList } from '@/hooks/use-live-list';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { CheckIcon, ChevronsUpDownIcon, PlusIcon, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MultiSelectWithAddProps {
  tableName: string;
  value: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
}

export function MultiSelectWithAdd({
  tableName,
  value,
  onChange,
  placeholder = 'Selecionar...',
}: MultiSelectWithAddProps) {
  const items = useLiveList(tableName);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newName, setNewName] = useState('');

  const selectedItems = items?.filter((item) => value.includes(item.id)) ?? [];

  const filtered = items?.filter((item) =>
    item.nome.toLowerCase().includes(search.toLowerCase())
  );

  const toggleItem = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  const removeItem = (id: string) => {
    onChange(value.filter((v) => v !== id));
  };

  const handleAddNew = async () => {
    if (!newName.trim()) return;
    const id = crypto.randomUUID();
    await db.table(tableName).add({ id, nome: newName.trim() });
    onChange([...value, id]);
    setNewName('');
    setShowAddDialog(false);
  };

  return (
    <>
      <div className="space-y-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(true)}
          className="w-full justify-between font-normal"
        >
          <span className={cn(selectedItems.length === 0 && 'text-muted-foreground')}>
            {selectedItems.length > 0
              ? `${selectedItems.length} selecionado(s)`
              : placeholder}
          </span>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>

        {selectedItems.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {selectedItems.map((item) => (
              <Badge key={item.id} variant="secondary" className="gap-1">
                {item.nome}
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="ml-1 rounded-full hover:bg-muted-foreground/20"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{placeholder}</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <div className="flex-1 overflow-y-auto max-h-60 space-y-1">
            {filtered && filtered.length > 0 ? (
              filtered.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors',
                    value.includes(item.id) && 'bg-muted'
                  )}
                >
                  <CheckIcon
                    className={cn(
                      'h-4 w-4 shrink-0',
                      value.includes(item.id) ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {item.nome}
                </button>
              ))
            ) : (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Nenhum item encontrado
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setNewName(search);
                setShowAddDialog(true);
              }}
              className="flex-1"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Adicionar novo
            </Button>
            <Button type="button" onClick={() => setOpen(false)} className="flex-1">
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar novo</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nome do novo item"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddNew();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleAddNew} disabled={!newName.trim()}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
