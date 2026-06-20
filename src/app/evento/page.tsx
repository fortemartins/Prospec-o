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
import { CheckIcon, PlusIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function EventoPage() {
  const router = useRouter();
  const { eventId, selectEvent } = useActiveEvent();
  const eventos = useLiveQuery(() => db.eventos.orderBy('nome').toArray());
  const [showCreate, setShowCreate] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novaData, setNovaData] = useState('');

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

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Selecionar Evento" showBack={!!eventId} />

      <div className="p-4 space-y-4">
        <p className="text-sm text-muted-foreground">
          Selecione o evento onde você está coletando contatos.
        </p>

        {eventos && eventos.length > 0 && (
          <div className="space-y-2">
            {eventos.map((evento) => (
              <Card
                key={evento.id}
                className={cn(
                  'cursor-pointer transition-colors hover:bg-muted/50',
                  evento.id === eventId && 'border-primary bg-primary/5'
                )}
                onClick={() => handleSelect(evento.id)}
              >
                <CardContent className="flex items-center gap-3 py-3">
                  <CheckIcon
                    className={cn(
                      'h-5 w-5 shrink-0',
                      evento.id === eventId
                        ? 'text-primary opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{evento.nome}</p>
                    {evento.data && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(evento.data).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!showCreate ? (
          <Button
            variant="outline"
            onClick={() => setShowCreate(true)}
            className="w-full"
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
                  className="flex-1"
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
