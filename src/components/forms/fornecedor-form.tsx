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
import { Card, CardContent } from '@/components/ui/card';
import { ComboboxWithAdd } from '@/components/combobox-with-add';
import { MultiSelectWithAdd } from '@/components/multi-select-with-add';
import { StoreIcon, UserIcon, PhoneIcon, InfoIcon } from 'lucide-react';

function FormSection({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#2e6b8a]" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/70">{title}</h2>
      </div>
      <Card>
        <CardContent className="space-y-4 pt-4 pb-4">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-4 pb-8">
      <FormSection title="Serviço" icon={StoreIcon}>
        <div className="space-y-2">
          <Label htmlFor="nome">Nome da empresa *</Label>
          <Input id="nome" {...register('nome')} placeholder="Nome da empresa" className="bg-background" />
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
          <Label>Regiões de atuação</Label>
          <MultiSelectWithAdd
            tableName="regioes_atuacao"
            value={regioesAtuacao ?? []}
            onChange={(ids) => setValue('regioes_atuacao', ids)}
            placeholder="Selecionar regiões"
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
      </FormSection>

      <FormSection title="Contato" icon={UserIcon}>
        <div className="space-y-2">
          <Label htmlFor="nome_contato">Nome do contato</Label>
          <Input
            id="nome_contato"
            {...register('nome_contato')}
            placeholder="Nome da pessoa"
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            {...register('whatsapp')}
            placeholder="(11) 99999-9999"
            inputMode="tel"
            className="bg-background"
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
            className="bg-background"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
      </FormSection>

      <FormSection title="Informações extras" icon={InfoIcon}>
        <div className="space-y-2">
          <Label htmlFor="instagram_site">Instagram / Site</Label>
          <Input
            id="instagram_site"
            {...register('instagram_site')}
            placeholder="@perfil ou www.site.com"
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea
            id="observacoes"
            {...register('observacoes')}
            placeholder="Observações adicionais"
            rows={3}
            className="bg-background"
          />
        </div>
      </FormSection>

      <Button
        type="submit"
        className="w-full h-12 text-base font-semibold bg-[#2e6b8a] text-white hover:bg-[#24576f]"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Salvando...' : 'Salvar fornecedor'}
      </Button>
    </form>
  );
}
