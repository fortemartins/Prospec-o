'use client';

import type { Empresa } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BuildingIcon,
  StoreIcon,
  PhoneIcon,
  MailIcon,
  CheckCircleIcon,
  ClockIcon,
} from 'lucide-react';

interface ContactCardProps {
  empresa: Empresa;
}

export function ContactCard({ empresa }: ContactCardProps) {
  const isExpositor = empresa.tipo === 'expositor';

  return (
    <Card className={`border-l-4 ${isExpositor ? 'border-l-[#f0a500]' : 'border-l-[#2e6b8a]'}`}>
      <CardContent className="py-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
              isExpositor ? 'bg-[#f0a500]/10' : 'bg-[#2e6b8a]/10'
            }`}>
              {isExpositor ? (
                <BuildingIcon className="h-4 w-4 text-[#f0a500]" />
              ) : (
                <StoreIcon className="h-4 w-4 text-[#2e6b8a]" />
              )}
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-sm truncate block">{empresa.nome}</span>
              {empresa.nome_contato && (
                <p className="text-xs text-muted-foreground truncate">{empresa.nome_contato}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Badge className={`text-xs border-0 ${
              isExpositor
                ? 'bg-[#f0a500]/10 text-[#b07800]'
                : 'bg-[#2e6b8a]/10 text-[#2e6b8a]'
            }`}>
              {isExpositor ? 'Expositor' : 'Fornecedor'}
            </Badge>
            {empresa.sincronizado === 1 ? (
              <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
            ) : (
              <ClockIcon className="h-4 w-4 text-[#f0a500]" />
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pl-10.5">
          {empresa.whatsapp && (
            <span className="flex items-center gap-1">
              <PhoneIcon className="h-3 w-3" />
              {empresa.whatsapp}
            </span>
          )}
          {empresa.email && (
            <span className="flex items-center gap-1">
              <MailIcon className="h-3 w-3" />
              {empresa.email}
            </span>
          )}
        </div>

        {empresa.tamanho_estande && (
          <div className="pl-10.5">
            <Badge variant="outline" className="text-xs">
              Estande: {empresa.tamanho_estande}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
