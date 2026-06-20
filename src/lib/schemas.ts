import { z } from 'zod';

export const fornecedorSchema = z.object({
  nome: z.string().min(1, 'Nome da empresa é obrigatório'),
  tipo_servico_id: z.string().min(1, 'Tipo de serviço é obrigatório'),
  whatsapp: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  nome_contato: z.string().optional(),
  regioes_atuacao: z.array(z.string()),
  instagram_site: z.string().optional(),
  faixa_preco_id: z.string().optional(),
  observacoes: z.string().optional(),
}).refine(
  (data) => (data.whatsapp && data.whatsapp.length > 0) || (data.email && data.email.length > 0),
  { message: 'Informe pelo menos WhatsApp ou email', path: ['whatsapp'] }
);

export const expositorSchema = z.object({
  nome: z.string().min(1, 'Nome da empresa é obrigatório'),
  nome_contato: z.string().min(1, 'Nome do contato é obrigatório'),
  cargo_id: z.string().min(1, 'Cargo é obrigatório'),
  segmento_id: z.string().min(1, 'Segmento é obrigatório'),
  tamanho_estande: z.enum(['Até 9m²', '10-30m²', '30m²+'], {
    message: 'Tamanho do estande é obrigatório',
  }),
  whatsapp: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
}).refine(
  (data) => (data.whatsapp && data.whatsapp.length > 0) || (data.email && data.email.length > 0),
  { message: 'Informe pelo menos WhatsApp ou email', path: ['whatsapp'] }
);

export const oportunidadeSchema = z.object({
  evento_futuro_id: z.string().min(1, 'Evento futuro é obrigatório'),
  dores: z.array(z.string()),
  interesses_solucao: z.array(z.string()),
});

export type FornecedorFormData = z.infer<typeof fornecedorSchema>;
export type ExpositorFormData = z.infer<typeof expositorSchema>;
export type OportunidadeFormData = z.infer<typeof oportunidadeSchema>;
