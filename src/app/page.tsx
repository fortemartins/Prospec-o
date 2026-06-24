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
  DownloadIcon,
  XIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePwaInstall } from '@/hooks/use-pwa-install';

export default function HomePage() {
  const router = useRouter();
  const { evento, hasEvent } = useActiveEvent();
  const { canInstall, install } = usePwaInstall();
  const [dismissed, setDismissed] = useState(false);

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
        {/* Banner instalar app */}
        {canInstall && !dismissed && (
          <div className="flex items-center gap-3 rounded-lg bg-[#f0a500]/10 border border-[#f0a500]/30 px-4 py-3">
            <DownloadIcon className="h-5 w-5 shrink-0 text-[#f0a500]" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Instalar aplicativo</p>
              <p className="text-xs text-muted-foreground">
                Acesse direto da tela inicial
              </p>
            </div>
            <button
              onClick={install}
              className="shrink-0 rounded-md bg-[#f0a500] px-3 py-1.5 text-xs font-semibold text-[#102a43] transition-colors hover:bg-[#d4920a]"
            >
              Instalar
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="shrink-0 p-1 text-muted-foreground hover:text-foreground"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        )}

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
