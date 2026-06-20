'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { db } from '@/lib/db';
import { fornecedorSchema, type FornecedorFormData } from '@/lib/schemas';
import { getActiveEventId } from '@/lib/active-event';
import type { Empresa } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ComboboxWithAdd } from '@/components/combobox-with-add';
import { MultiSelectWithAdd } from '@/components/multi-select-with-add';

export function FornecedorForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FornecedorFormData>({
    resolver: zodResolver(fornecedorSchema),
    defaultValues: {
      regioes_atuacao: [],
    },
  });

  const tipoServicoId = watch('tipo_servico_id');
  const regioesAtuacao = watch('regioes_atuacao');
  const faixaPrecoId = watch('faixa_preco_id');

  const onSubmit = async (data: FornecedorFormData) => {
    const empresa: Empresa = {
      id: crypto.randomUUID(),
      tipo: 'fornecedor',
      nome: data.nome,
      nome_contato: data.nome_contato || undefined,
      whatsapp: data.whatsapp || undefined,
      email: data.email || undefined,
      tipo_servico_id: data.tipo_servico_id,
      regioes_atuacao: data.regioes_atuacao ?? [],
      instagram_site: data.instagram_site || undefined,
      faixa_preco_id: data.faixa_preco_id || undefined,
      observacoes: data.observacoes || undefined,
      evento_coleta_id: getActiveEventId() || undefined,
      criado_em: new Date().toISOString(),
      sincronizado: 0,
    };

    await db.empresas.add(empresa);
    toast.success('Fornecedor salvo!', {
      description: 'Dados salvos no dispositivo.',
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
        <Label>Tipo de serviço *</Label>
        <ComboboxWithAdd
          tableName="tipos_servico"
          value={tipoServicoId}
          onChange={(id) => setValue('tipo_servico_id', id, { shouldValidate: true })}
          placeholder="Selecionar tipo de serviço"
          extraFieldOnCreate={{
            fieldName: 'unidade_cobranca',
            label: 'Unidade de cobrança',
            placeholder: 'Ex: m², unidade, diária',
          }}
        />
        {errors.tipo_servico_id && (
          <p className="text-sm text-destructive">{errors.tipo_servico_id.message}</p>
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

      <div className="space-y-2">
        <Label htmlFor="nome_contato">Nome do contato</Label>
        <Input
          id="nome_contato"
          {...register('nome_contato')}
          placeholder="Nome da pessoa"
        />
      </div>

      <div className="space-y-2">
        <Label>Regiões de atuação</Label>
        <MultiSelectWithAdd
          tableName="regioes_atuacao"
          value={regioesAtuacao ?? []}
          onChange={(ids) => setValue('regioes_atuacao', ids)}
          placeholder="Selecionar regiões"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="instagram_site">Instagram / Site</Label>
        <Input
          id="instagram_site"
          {...register('instagram_site')}
          placeholder="@perfil ou www.site.com"
        />
      </div>

      <div className="space-y-2">
        <Label>Faixa de preço</Label>
        <ComboboxWithAdd
          tableName="faixas_preco"
          value={faixaPrecoId}
          onChange={(id) => setValue('faixa_preco_id', id)}
          placeholder="Selecionar faixa de preço"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          {...register('observacoes')}
          placeholder="Observações adicionais"
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : 'Salvar fornecedor'}
      </Button>
    </form>
  );
}
