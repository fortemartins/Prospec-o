'use client';

import { useRouter } from 'next/navigation';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { useActiveEvent } from '@/hooks/use-active-event';
import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BuildingIcon,
  StoreIcon,
  UsersIcon,
  CalendarIcon,
} from 'lucide-react';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();
  const { evento, hasEvent } = useActiveEvent();

  const stats = useLiveQuery(async () => {
    const expositores = await db.empresas
      .where('tipo')
      .equals('expositor')
      .count();
    const fornecedores = await db.empresas
      .where('tipo')
      .equals('fornecedor')
      .count();
    return { expositores, fornecedores };
  });

  useEffect(() => {
    if (!hasEvent) {
      router.replace('/evento');
    }
  }, [hasEvent, router]);

  if (!hasEvent) return null;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Prospecção" />

      <div className="p-4 space-y-6">
        <button
          onClick={() => router.push('/evento')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <CalendarIcon className="h-4 w-4" />
          <span className="font-medium">{evento?.nome ?? 'Carregando...'}</span>
        </button>

        <div className="grid gap-3">
          <Button
            onClick={() => router.push('/expositor')}
            size="lg"
            className="h-20 text-lg justify-start gap-4"
          >
            <BuildingIcon className="h-6 w-6" />
            <div className="text-left">
              <div>Novo Expositor</div>
              <div className="text-xs font-normal opacity-80">
                Potencial cliente para evento futuro
              </div>
            </div>
          </Button>

          <Button
            onClick={() => router.push('/fornecedor')}
            variant="secondary"
            size="lg"
            className="h-20 text-lg justify-start gap-4"
          >
            <StoreIcon className="h-6 w-6" />
            <div className="text-left">
              <div>Novo Fornecedor</div>
              <div className="text-xs font-normal opacity-80">
                Prestador de serviço para a agência
              </div>
            </div>
          </Button>
        </div>

        <Card>
          <CardContent className="py-4">
            <button
              onClick={() => router.push('/contatos')}
              className="flex w-full items-center gap-3"
            >
              <UsersIcon className="h-5 w-5 text-muted-foreground" />
              <span className="flex-1 text-left font-medium">
                Contatos salvos
              </span>
              <div className="flex gap-2">
                {stats && (
                  <>
                    <Badge variant="outline">
                      {stats.expositores} expositor{stats.expositores !== 1 ? 'es' : ''}
                    </Badge>
                    <Badge variant="secondary">
                      {stats.fornecedores} fornecedor{stats.fornecedores !== 1 ? 'es' : ''}
                    </Badge>
                  </>
                )}
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
