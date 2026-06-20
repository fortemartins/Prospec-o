import Dexie, { type EntityTable } from 'dexie';
import type { Empresa, Evento, LiveListItem, Oportunidade, TipoServico } from './types';

const db = new Dexie('ProspeccaoFeiras') as Dexie & {
  eventos: EntityTable<Evento, 'id'>;
  tipos_servico: EntityTable<TipoServico, 'id'>;
  cargos: EntityTable<LiveListItem, 'id'>;
  segmentos: EntityTable<LiveListItem, 'id'>;
  dores: EntityTable<LiveListItem, 'id'>;
  interesses_solucao: EntityTable<LiveListItem, 'id'>;
  regioes_atuacao: EntityTable<LiveListItem, 'id'>;
  feiras_participa: EntityTable<LiveListItem, 'id'>;
  faixas_preco: EntityTable<LiveListItem, 'id'>;
  empresas: EntityTable<Empresa, 'id'>;
  oportunidades: EntityTable<Oportunidade, 'id'>;
};

db.version(1).stores({
  eventos: 'id, nome',
  tipos_servico: 'id, nome',
  cargos: 'id, nome',
  segmentos: 'id, nome',
  dores: 'id, nome',
  interesses_solucao: 'id, nome',
  regioes_atuacao: 'id, nome',
  feiras_participa: 'id, nome',
  faixas_preco: 'id, nome',
  empresas: 'id, tipo, nome, evento_coleta_id, sincronizado, criado_em',
  oportunidades: 'id, empresa_id, evento_futuro_id, sincronizado',
});

export { db };
