export interface Evento {
  id: string;
  nome: string;
  data?: string;
  criado_em: string;
}

export interface TipoServico {
  id: string;
  nome: string;
  unidade_cobranca: string;
}

export interface LiveListItem {
  id: string;
  nome: string;
}

export type TipoEmpresa = 'fornecedor' | 'expositor';
export type TamanhoEstande = 'Até 9m²' | '10-30m²' | '30m²+';

export interface Empresa {
  id: string;
  tipo: TipoEmpresa;
  nome: string;
  nome_contato?: string;
  whatsapp?: string;
  email?: string;
  cargo_id?: string;
  segmento_id?: string;
  tamanho_estande?: TamanhoEstande;
  tipo_servico_id?: string;
  regioes_atuacao: string[];
  instagram_site?: string;
  faixa_preco_id?: string;
  observacoes?: string;
  evento_coleta_id?: string;
  criado_em: string;
  sincronizado: number;
}

export interface Oportunidade {
  id: string;
  empresa_id: string;
  evento_futuro_id?: string;
  dores: string[];
  interesses_solucao: string[];
  status?: string;
  criado_em: string;
  sincronizado: number;
}
