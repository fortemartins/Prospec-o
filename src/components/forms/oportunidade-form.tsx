'use client';

import { useState } from 'react';
import { ComboboxWithAdd } from '@/components/combobox-with-add';
import { MultiSelectWithAdd } from '@/components/multi-select-with-add';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CopyIcon, TrashIcon } from 'lucide-react';
import type { OportunidadeFormData } from '@/lib/schemas';

interface OportunidadeFormProps {
  index: number;
  value: OportunidadeFormData;
  onChange: (data: OportunidadeFormData) => void;
  onRemove: () => void;
  otherOportunidades: OportunidadeFormData[];
}

export function OportunidadeForm({
  index,
  value,
  onChange,
  onRemove,
  otherOportunidades,
}: OportunidadeFormProps) {
  const [showCloneOptions, setShowCloneOptions] = useState(false);

  const handleClone = (source: OportunidadeFormData) => {
    onChange({
      ...value,
      dores: [...source.dores],
      interesses_solucao: [...source.interesses_solucao],
    });
    setShowCloneOptions(false);
  };

  return (
    <Card className="relative">
      <CardContent className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Oportunidade {index + 1}</h4>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-8 w-8 text-destructive"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Evento futuro *</Label>
          <ComboboxWithAdd
            tableName="eventos"
            value={value.evento_futuro_id}
            onChange={(id) => onChange({ ...value, evento_futuro_id: id })}
            placeholder="Selecionar evento"
          />
        </div>

        {otherOportunidades.length > 0 && (
          <div>
            {!showCloneOptions ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowCloneOptions(true)}
                className="w-full"
              >
                <CopyIcon className="mr-2 h-4 w-4" />
                Copiar dores/interesses de outra oportunidade
              </Button>
            ) : (
              <div className="space-y-2 rounded-md border p-3">
                <p className="text-xs text-muted-foreground">Copiar de:</p>
                {otherOportunidades.map((opp, i) => (
                  <Button
                    key={i}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleClone(opp)}
                    className="w-full justify-start"
                  >
                    Oportunidade {i + 1}
                    {opp.dores.length > 0 && ` (${opp.dores.length} dores)`}
                  </Button>
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCloneOptions(false)}
                  className="w-full"
                >
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label>Dores relatadas</Label>
          <MultiSelectWithAdd
            tableName="dores"
            value={value.dores}
            onChange={(ids) => onChange({ ...value, dores: ids })}
            placeholder="Selecionar dores"
          />
        </div>

        <div className="space-y-2">
          <Label>Interesses de solução</Label>
          <MultiSelectWithAdd
            tableName="interesses_solucao"
            value={value.interesses_solucao}
            onChange={(ids) => onChange({ ...value, interesses_solucao: ids })}
            placeholder="Selecionar interesses"
          />
        </div>
      </CardContent>
    </Card>
  );
}
