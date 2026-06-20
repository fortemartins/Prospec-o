'use client';

import { useState } from 'react';
import { useLiveList } from '@/hooks/use-live-list';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExtraFieldOnCreate {
  fieldName: string;
  label: string;
  placeholder: string;
}

interface ComboboxWithAddProps {
  tableName: string;
  value: string | undefined;
  onChange: (id: string) => void;
  placeholder?: string;
  extraFieldOnCreate?: ExtraFieldOnCreate;
}

export function ComboboxWithAdd({
  tableName,
  value,
  onChange,
  placeholder = 'Selecionar...',
  extraFieldOnCreate,
}: ComboboxWithAddProps) {
  const items = useLiveList(tableName);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newName, setNewName] = useState('');
  const [extraFieldValue, setExtraFieldValue] = useState('');

  const selectedItem = items?.find((item) => item.id === value);

  const filtered = items?.filter((item) =>
    item.nome.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (id: string) => {
    onChange(id);
    setOpen(false);
    setSearch('');
  };

  const handleAddNew = async () => {
    if (!newName.trim()) return;
    const id = crypto.randomUUID();
    const record: Record<string, string> = { id, nome: newName.trim() };
    if (extraFieldOnCreate && extraFieldValue.trim()) {
      record[extraFieldOnCreate.fieldName] = extraFieldValue.trim();
    }
    await db.table(tableName).add(record);
    onChange(id);
    setNewName('');
    setExtraFieldValue('');
    setShowAddDialog(false);
    setOpen(false);
    setSearch('');
  };

  const openAddDialog = () => {
    setNewName(search);
    setShowAddDialog(true);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
        className="w-full justify-between font-normal"
      >
        <span className={cn(!selectedItem && 'text-muted-foreground')}>
          {selectedItem ? selectedItem.nome : placeholder}
        </span>
        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

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
                  onClick={() => handleSelect(item.id)}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors',
                    value === item.id && 'bg-muted'
                  )}
                >
                  <CheckIcon
                    className={cn(
                      'h-4 w-4 shrink-0',
                      value === item.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {'nome' in item ? item.nome : ''}
                  {'unidade_cobranca' in item && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      {(item as Record<string, string>).unidade_cobranca}
                    </span>
                  )}
                </button>
              ))
            ) : (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Nenhum item encontrado
              </p>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={openAddDialog}
            className="w-full"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Adicionar novo
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar novo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nome do novo item"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !extraFieldOnCreate) {
                    e.preventDefault();
                    handleAddNew();
                  }
                }}
              />
            </div>
            {extraFieldOnCreate && (
              <div className="space-y-2">
                <Label>{extraFieldOnCreate.label}</Label>
                <Input
                  value={extraFieldValue}
                  onChange={(e) => setExtraFieldValue(e.target.value)}
                  placeholder={extraFieldOnCreate.placeholder}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddNew();
                    }
                  }}
                />
              </div>
            )}
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
