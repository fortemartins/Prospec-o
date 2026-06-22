import { db } from './db';
import type { TipoEmpresa } from './types';

function escapeCsv(value: string | undefined | null): string {
  if (!value) return '';
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

async function buildLookup(table: 'cargos' | 'segmentos' | 'tipos_servico' | 'faixas_preco' | 'eventos' | 'regioes_atuacao' | 'dores' | 'interesses_solucao') {
  const items = await db[table].toArray();
  const map = new Map<string, string>();
  for (const item of items) {
    map.set(item.id, item.nome);
  }
  return map;
}

function resolveLookupIds(ids: string[], lookup: Map<string, string>): string {
  return ids.map((id) => lookup.get(id) ?? '').filter(Boolean).join('; ');
}

export async function exportCsv(filterType?: TipoEmpresa) {
  const [cargos, segmentos, tiposServico, faixasPreco, eventos, regioes, dores, interesses] = await Promise.all([
    buildLookup('cargos'),
    buildLookup('segmentos'),
    buildLookup('tipos_servico'),
    buildLookup('faixas_preco'),
    buildLookup('eventos'),
    buildLookup('regioes_atuacao'),
    buildLookup('dores'),
    buildLookup('interesses_solucao'),
  ]);

  let empresas = await db.empresas.orderBy('criado_em').reverse().toArray();
  if (filterType) {
    empresas = empresas.filter((e) => e.tipo === filterType);
  }

  const oportunidades = await db.oportunidades.toArray();
  const oppsByEmpresa = new Map<string, typeof oportunidades>();
  for (const opp of oportunidades) {
    const list = oppsByEmpresa.get(opp.empresa_id) ?? [];
    list.push(opp);
    oppsByEmpresa.set(opp.empresa_id, list);
  }

  const headers = [
    'Tipo',
    'Empresa',
    'Contato',
    'WhatsApp',
    'Email',
    'Cargo',
    'Segmento',
    'Tamanho Estande',
    'Tipo Serviço',
    'Regiões Atuação',
    'Faixa Preço',
    'Instagram/Site',
    'Observações',
    'Evento Coleta',
    'Oportunidades - Evento',
    'Oportunidades - Dores',
    'Oportunidades - Interesses',
    'Data Cadastro',
  ];

  const rows = empresas.map((e) => {
    const opps = oppsByEmpresa.get(e.id) ?? [];
    const oppEventos = opps.map((o) => o.evento_futuro_id ? eventos.get(o.evento_futuro_id) ?? '' : '').filter(Boolean).join('; ');
    const oppDores = opps.flatMap((o) => o.dores.map((id) => dores.get(id) ?? '')).filter(Boolean).join('; ');
    const oppInteresses = opps.flatMap((o) => o.interesses_solucao.map((id) => interesses.get(id) ?? '')).filter(Boolean).join('; ');

    return [
      e.tipo === 'expositor' ? 'Expositor' : 'Fornecedor',
      e.nome,
      e.nome_contato,
      e.whatsapp,
      e.email,
      e.cargo_id ? cargos.get(e.cargo_id) : '',
      e.segmento_id ? segmentos.get(e.segmento_id) : '',
      e.tamanho_estande,
      e.tipo_servico_id ? tiposServico.get(e.tipo_servico_id) : '',
      resolveLookupIds(e.regioes_atuacao ?? [], regioes),
      e.faixa_preco_id ? faixasPreco.get(e.faixa_preco_id) : '',
      e.instagram_site,
      e.observacoes,
      e.evento_coleta_id ? eventos.get(e.evento_coleta_id) : '',
      oppEventos,
      oppDores,
      oppInteresses,
      new Date(e.criado_em).toLocaleDateString('pt-BR'),
    ].map(escapeCsv).join(',');
  });

  const bom = '﻿';
  const csv = bom + [headers.join(','), ...rows].join('\r\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;

  const date = new Date().toISOString().slice(0, 10);
  const suffix = filterType ? `-${filterType}es` : '';
  a.download = `contatos-gfm${suffix}-${date}.csv`;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return empresas.length;
}
