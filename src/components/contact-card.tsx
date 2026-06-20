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
    <Card>
      <CardContent className="py-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {isExpositor ? (
              <BuildingIcon className="h-4 w-4 shrink-0 text-primary" />
            ) : (
              <StoreIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
            <span className="font-medium truncate">{empresa.nome}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Badge variant={isExpositor ? 'default' : 'secondary'} className="text-xs">
              {isExpositor ? 'Expositor' : 'Fornecedor'}
            </Badge>
            {empresa.sincronizado === 1 ? (
              <CheckCircleIcon className="h-4 w-4 text-green-500" />
            ) : (
              <ClockIcon className="h-4 w-4 text-amber-500" />
            )}
          </div>
        </div>

        {empresa.nome_contato && (
          <p className="text-sm text-muted-foreground">{empresa.nome_contato}</p>
        )}

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
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
          <Badge variant="outline" className="text-xs">
            Estande: {empresa.tamanho_estande}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
