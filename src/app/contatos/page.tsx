'use client';

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { AppHeader } from '@/components/app-header';
import { ContactCard } from '@/components/contact-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SearchIcon } from 'lucide-react';
import type { TipoEmpresa } from '@/lib/types';

type FilterType = 'todos' | TipoEmpresa;

export default function ContatosPage() {
  const [filter, setFilter] = useState<FilterType>('todos');
  const [search, setSearch] = useState('');

  const empresas = useLiveQuery(async () => {
    let query = db.empresas.orderBy('criado_em').reverse();
    if (filter !== 'todos') {
      return db.empresas
        .where('tipo')
        .equals(filter)
        .reverse()
        .sortBy('criado_em');
    }
    return query.toArray();
  }, [filter]);

  const filtered = empresas?.filter((e) =>
    e.nome.toLowerCase().includes(search.toLowerCase()) ||
    e.nome_contato?.toLowerCase().includes(search.toLowerCase())
  );

  const filters: { value: FilterType; label: string }[] = [
    { value: 'todos', label: 'Todos' },
    { value: 'expositor', label: 'Expositores' },
    { value: 'fornecedor', label: 'Fornecedores' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Contatos" showBack />

      <div className="p-4 space-y-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          {filters.map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f.value)}
              className={cn('flex-1')}
            >
              {f.label}
            </Button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered && filtered.length > 0 ? (
            filtered.map((empresa) => (
              <ContactCard key={empresa.id} empresa={empresa} />
            ))
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {search
                ? 'Nenhum contato encontrado.'
                : 'Nenhum contato cadastrado ainda.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
