'use client';

import { useRouter } from 'next/navigation';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { useActiveEvent } from '@/hooks/use-active-event';
import { AppHeader } from '@/components/app-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BuildingIcon,
  StoreIcon,
  UsersIcon,
  CalendarIcon,
  ChevronRightIcon,
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

      <div className="p-4 space-y-5">
        {/* Evento ativo */}
        <button
          onClick={() => router.push('/evento')}
          className="flex w-full items-center gap-2.5 rounded-lg bg-[#102a43] px-4 py-3 text-white transition-colors hover:bg-[#1a3a56]"
        >
          <CalendarIcon className="h-4 w-4 text-[#f0a500]" />
          <span className="flex-1 text-left text-sm font-medium">
            {evento?.nome ?? 'Carregando...'}
          </span>
          <ChevronRightIcon className="h-4 w-4 opacity-50" />
        </button>

        {/* Ações principais */}
        <div className="space-y-2">
          <p className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Novo cadastro
          </p>
          <div className="grid gap-3">
            <Card
              className="cursor-pointer border-l-4 border-l-[#f0a500] transition-shadow hover:shadow-md"
              onClick={() => router.push('/expositor')}
            >
              <CardContent className="flex items-center gap-4 py-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f0a500]/10">
                  <BuildingIcon className="h-6 w-6 text-[#f0a500]" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Novo Expositor</p>
                  <p className="text-sm text-muted-foreground">
                    Potencial cliente para evento futuro
                  </p>
                </div>
                <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer border-l-4 border-l-[#2e6b8a] transition-shadow hover:shadow-md"
              onClick={() => router.push('/fornecedor')}
            >
              <CardContent className="flex items-center gap-4 py-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2e6b8a]/10">
                  <StoreIcon className="h-6 w-6 text-[#2e6b8a]" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Novo Fornecedor</p>
                  <p className="text-sm text-muted-foreground">
                    Prestador de serviço para a agência
                  </p>
                </div>
                <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contatos */}
        <div className="space-y-2">
          <p className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Registros
          </p>
          <Card
            className="cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => router.push('/contatos')}
          >
            <CardContent className="flex items-center gap-4 py-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/5">
                <UsersIcon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Contatos salvos</p>
                <div className="mt-1 flex gap-2">
                  {stats && (
                    <>
                      <Badge className="bg-[#f0a500]/10 text-[#b07800] hover:bg-[#f0a500]/15 border-0 text-xs">
                        {stats.expositores} expositor{stats.expositores !== 1 ? 'es' : ''}
                      </Badge>
                      <Badge className="bg-[#2e6b8a]/10 text-[#2e6b8a] hover:bg-[#2e6b8a]/15 border-0 text-xs">
                        {stats.fornecedores} fornecedor{stats.fornecedores !== 1 ? 'es' : ''}
                      </Badge>
                    </>
                  )}
                </div>
              </div>
              <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
