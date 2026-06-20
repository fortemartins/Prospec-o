'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { db } from '@/lib/db';
import { expositorSchema, type ExpositorFormData, type OportunidadeFormData } from '@/lib/schemas';
import { getActiveEventId } from '@/lib/active-event';
import type { Empresa, Oportunidade } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ComboboxWithAdd } from '@/components/combobox-with-add';
import { OportunidadeForm } from './oportunidade-form';
import { PlusIcon } from 'lucide-react';

export function ExpositorForm() {
  const router = useRouter();
  const [oportunidades, setOportunidades] = useState<OportunidadeFormData[]>([]);
  const [showOportunidades, setShowOportunidades] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ExpositorFormData>({
    resolver: zodResolver(expositorSchema),
  });

  const cargoId = watch('cargo_id');
  const segmentoId = watch('segmento_id');
  const tamanhoEstande = watch('tamanho_estande');

  const addOportunidade = () => {
    setShowOportunidades(true);
    setOportunidades([
      ...oportunidades,
      { evento_futuro_id: '', dores: [], interesses_solucao: [] },
    ]);
  };

  const updateOportunidade = (index: number, data: OportunidadeFormData) => {
    const updated = [...oportunidades];
    updated[index] = data;
    setOportunidades(updated);
  };

  const removeOportunidade = (index: number) => {
    const updated = oportunidades.filter((_, i) => i !== index);
    setOportunidades(updated);
    if (updated.length === 0) setShowOportunidades(false);
  };

  const onSubmit = async (data: ExpositorFormData) => {
    const empresaId = crypto.randomUUID();

    const empresa: Empresa = {
      id: empresaId,
      tipo: 'expositor',
      nome: data.nome,
      nome_contato: data.nome_contato,
      whatsapp: data.whatsapp || undefined,
      email: data.email || undefined,
      cargo_id: data.cargo_id,
      segmento_id: data.segmento_id,
      tamanho_estande: data.tamanho_estande,
      regioes_atuacao: [],
      evento_coleta_id: getActiveEventId() || undefined,
      criado_em: new Date().toISOString(),
      sincronizado: 0,
    };

    await db.empresas.add(empresa);

    for (const opp of oportunidades) {
      if (!opp.evento_futuro_id) continue;
      const oportunidade: Oportunidade = {
        id: crypto.randomUUID(),
        empresa_id: empresaId,
        evento_futuro_id: opp.evento_futuro_id,
        dores: opp.dores,
        interesses_solucao: opp.interesses_solucao,
        criado_em: new Date().toISOString(),
        sincronizado: 0,
      };
      await db.oportunidades.add(oportunidade);
    }

    toast.success('Expositor salvo!', {
      description: `${oportunidades.length > 0 ? `Com ${oportunidades.length} oportunidade(s).` : ''} Dados salvos no dispositivo.`,
    });
    router.push('/');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome da empresa *</Label>
        <Input id="nome" {...register('nome')} placeholder="Nome da empresa" />
        {errors.nome && (
          <p className="text-sm text-destructive">{errors.nome.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="nome_contato">Nome do contato *</Label>
        <Input
          id="nome_contato"
          {...register('nome_contato')}
          placeholder="Nome da pessoa"
        />
        {errors.nome_contato && (
          <p className="text-sm text-destructive">{errors.nome_contato.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Cargo *</Label>
        <ComboboxWithAdd
          tableName="cargos"
          value={cargoId}
          onChange={(id) => setValue('cargo_id', id, { shouldValidate: true })}
          placeholder="Selecionar cargo"
        />
        {errors.cargo_id && (
          <p className="text-sm text-destructive">{errors.cargo_id.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Segmento *</Label>
        <ComboboxWithAdd
          tableName="segmentos"
          value={segmentoId}
          onChange={(id) => setValue('segmento_id', id, { shouldValidate: true })}
          placeholder="Selecionar segmento"
        />
        {errors.segmento_id && (
          <p className="text-sm text-destructive">{errors.segmento_id.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Tamanho do estande *</Label>
        <Select
          value={tamanhoEstande}
          onValueChange={(val) =>
            setValue('tamanho_estande', val as ExpositorFormData['tamanho_estande'], {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecionar tamanho" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Até 9m²">Até 9m² (Pequeno)</SelectItem>
            <SelectItem value="10-30m²">10-30m² (Médio)</SelectItem>
            <SelectItem value="30m²+">30m²+ (Grande)</SelectItem>
          </SelectContent>
        </Select>
        {errors.tamanho_estande && (
          <p className="text-sm text-destructive">{errors.tamanho_estande.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="whatsapp">WhatsApp</Label>
        <Input
          id="whatsapp"
          {...register('whatsapp')}
          placeholder="(11) 99999-9999"
          inputMode="tel"
        />
        {errors.whatsapp && (
          <p className="text-sm text-destructive">{errors.whatsapp.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          {...register('email')}
          placeholder="email@empresa.com"
          inputMode="email"
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Oportunidades de negócio</h3>

        {!showOportunidades ? (
          <Button
            type="button"
            variant="outline"
            onClick={addOportunidade}
            className="w-full"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Adicionar oportunidade para evento futuro
          </Button>
        ) : (
          <>
            <div className="space-y-3">
              {oportunidades.map((opp, index) => (
                <OportunidadeForm
                  key={index}
                  index={index}
                  value={opp}
                  onChange={(data) => updateOportunidade(index, data)}
                  onRemove={() => removeOportunidade(index)}
                  otherOportunidades={oportunidades.filter((_, i) => i !== index)}
                />
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={addOportunidade}
              className="w-full"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Adicionar outra oportunidade
            </Button>
          </>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : 'Salvar expositor'}
      </Button>
    </form>
  );
}
