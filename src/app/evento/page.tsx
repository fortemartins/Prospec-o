'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { useActiveEvent } from '@/hooks/use-active-event';
import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CheckIcon, PlusIcon, CalendarIcon, Trash2Icon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type ConfirmDelete = { id: string; nome: string; contactCount: number } | null;

export default function EventoPage() {
  const router = useRouter();
  const { eventId, selectEvent } = useActiveEvent();
  const eventos = useLiveQuery(() => db.eventos.orderBy('nome').toArray());
  const [showCreate, setShowCreate] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novaData, setNovaData] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<ConfirmDelete>(null);

  const handleCreate = async () => {
    if (!novoNome.trim()) return;
    const id = crypto.randomUUID();
    await db.eventos.add({
      id,
      nome: novoNome.trim(),
      data: novaData || undefined,
      criado_em: new Date().toISOString(),
    });
    selectEvent(id);
    toast.success('Evento criado!');
    setNovoNome('');
    setNovaData('');
    setShowCreate(false);
    router.push('/');
  };

  const handleSelect = (id: string) => {
    selectEvent(id);
    toast.success('Evento selecionado!');
    router.push('/');
  };

  const askDelete = async (e: React.MouseEvent, evento: { id: string; nome: string }) => {
    e.stopPropagation();
    const count = await db.empresas.where('evento_coleta_id').equals(evento.id).count();
    setConfirmDelete({ id: evento.id, nome: evento.nome, contactCount: count });
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    await db.empresas.where('evento_coleta_id').equals(confirmDelete.id).delete();
    await db.oportunidades.where('evento_futuro_id').equals(confirmDelete.id).delete();
    await db.eventos.delete(confirmDelete.id);
    if (eventId === confirmDelete.id) {
      selectEvent('');
    }
    toast.success('Evento apagado!');
    setConfirmDelete(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Selecionar Evento" showBack={!!eventId} />

      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2.5 px-1">
          <CalendarIcon className="h-4 w-4 text-[#f0a500]" />
          <p className="text-sm text-muted-foreground">
            Selecione o evento onde você está coletando contatos.
          </p>
        </div>

        {eventos && eventos.length > 0 && (
          <div className="space-y-2">
            {eventos.map((evento) => (
              <Card
                key={evento.id}
                className={cn(
                  'cursor-pointer transition-all',
                  evento.id === eventId
                    ? 'border-[#f0a500] bg-[#f0a500]/5 shadow-sm'
                    : 'hover:bg-muted/50'
                )}
                onClick={() => handleSelect(evento.id)}
              >
                <CardContent className="flex items-center gap-3 py-3">
                  <div className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                    evento.id === eventId
                      ? 'bg-[#f0a500] text-[#102a43]'
                      : 'bg-muted text-muted-foreground'
                  )}>
                    <CheckIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{evento.nome}</p>
                    {evento.data && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(evento.data).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={(e) => askDelete(e, evento)}
                    className="shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {confirmDelete && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="space-y-3 py-4">
              <p className="text-sm font-medium text-red-900">
                Apagar &ldquo;{confirmDelete.nome}&rdquo;?
              </p>
              {confirmDelete.contactCount > 0 && (
                <p className="text-xs text-red-700">
                  {confirmDelete.contactCount} contato{confirmDelete.contactCount !== 1 ? 's' : ''} vinculado{confirmDelete.contactCount !== 1 ? 's' : ''} também {confirmDelete.contactCount !== 1 ? 'serão apagados' : 'será apagado'}.
                </p>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 text-white hover:bg-red-700"
                >
                  Apagar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!showCreate ? (
          <Button
            variant="outline"
            onClick={() => setShowCreate(true)}
            className="w-full border-dashed"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Criar novo evento
          </Button>
        ) : (
          <Card>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="nome-evento">Nome do evento *</Label>
                <Input
                  id="nome-evento"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  placeholder='Ex: "Formóbile 2026"'
                  className="bg-background"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data-evento">Data (opcional)</Label>
                <Input
                  id="data-evento"
                  type="date"
                  value={novaData}
                  onChange={(e) => setNovaData(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCreate(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={!novoNome.trim()}
                  className="flex-1 bg-[#f0a500] text-[#102a43] hover:bg-[#d99400]"
                >
                  Criar e selecionar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
