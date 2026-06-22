'use client';

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { exportCsv } from '@/lib/export-csv';
import { AppHeader } from '@/components/app-header';
import { ContactCard } from '@/components/contact-card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { SearchIcon, DownloadIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { TipoEmpresa } from '@/lib/types';

type FilterType = 'todos' | TipoEmpresa;

export default function ContatosPage() {
  const [filter, setFilter] = useState<FilterType>('todos');
  const [search, setSearch] = useState('');
  const [exporting, setExporting] = useState(false);

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

  const handleExport = async () => {
    setExporting(true);
    try {
      const filterArg = filter === 'todos' ? undefined : filter;
      const count = await exportCsv(filterArg);
      toast.success(`${count} contato(s) exportado(s)!`, {
        description: 'Arquivo CSV salvo na pasta de downloads.',
      });
    } catch {
      toast.error('Erro ao exportar CSV');
    } finally {
      setExporting(false);
    }
  };

  const filters: { value: FilterType; label: string; color: string; activeColor: string }[] = [
    { value: 'todos', label: 'Todos', color: 'border-primary/20 text-foreground', activeColor: 'bg-primary text-primary-foreground border-primary' },
    { value: 'expositor', label: 'Expositores', color: 'border-[#f0a500]/30 text-[#b07800]', activeColor: 'bg-[#f0a500] text-[#102a43] border-[#f0a500]' },
    { value: 'fornecedor', label: 'Fornecedores', color: 'border-[#2e6b8a]/30 text-[#2e6b8a]', activeColor: 'bg-[#2e6b8a] text-white border-[#2e6b8a]' },
  ];

  const hasContacts = empresas && empresas.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Contatos" showBack />

      <div className="p-4 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>
          {hasContacts && (
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f0a500] text-[#102a43] transition-colors hover:bg-[#d99400] disabled:opacity-50"
              title="Exportar CSV"
            >
              <DownloadIcon className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all',
                filter === f.value ? f.activeColor : f.color
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered && filtered.length > 0 ? (
            filtered.map((empresa) => (
              <ContactCard key={empresa.id} empresa={empresa} />
            ))
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">
                {search
                  ? 'Nenhum contato encontrado.'
                  : 'Nenhum contato cadastrado ainda.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
