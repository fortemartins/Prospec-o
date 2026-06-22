import * as XLSX from 'xlsx';
import { db } from './db';
import type { TipoEmpresa } from './types';

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

async function getExportData(filterType?: TipoEmpresa) {
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

  const rows = empresas.map((e) => {
    const opps = oppsByEmpresa.get(e.id) ?? [];
    const oppEventos = opps.map((o) => o.evento_futuro_id ? eventos.get(o.evento_futuro_id) ?? '' : '').filter(Boolean).join('; ');
    const oppDores = opps.flatMap((o) => o.dores.map((id) => dores.get(id) ?? '')).filter(Boolean).join('; ');
    const oppInteresses = opps.flatMap((o) => o.interesses_solucao.map((id) => interesses.get(id) ?? '')).filter(Boolean).join('; ');

    return {
      'Tipo': e.tipo === 'expositor' ? 'Expositor' : 'Fornecedor',
      'Empresa': e.nome,
      'Contato': e.nome_contato ?? '',
      'WhatsApp': e.whatsapp ?? '',
      'Email': e.email ?? '',
      'Cargo': e.cargo_id ? cargos.get(e.cargo_id) ?? '' : '',
      'Segmento': e.segmento_id ? segmentos.get(e.segmento_id) ?? '' : '',
      'Tamanho Estande': e.tamanho_estande ?? '',
      'Tipo Serviço': e.tipo_servico_id ? tiposServico.get(e.tipo_servico_id) ?? '' : '',
      'Regiões Atuação': resolveLookupIds(e.regioes_atuacao ?? [], regioes),
      'Faixa Preço': e.faixa_preco_id ? faixasPreco.get(e.faixa_preco_id) ?? '' : '',
      'Instagram/Site': e.instagram_site ?? '',
      'Observações': e.observacoes ?? '',
      'Evento Coleta': e.evento_coleta_id ? eventos.get(e.evento_coleta_id) ?? '' : '',
      'Oportunidades - Evento': oppEventos,
      'Oportunidades - Dores': oppDores,
      'Oportunidades - Interesses': oppInteresses,
      'Data Cadastro': new Date(e.criado_em).toLocaleDateString('pt-BR'),
    };
  });

  return { rows, count: empresas.length };
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function getFilename(filterType?: TipoEmpresa, ext = 'xlsx') {
  const date = new Date().toISOString().slice(0, 10);
  const suffix = filterType ? `-${filterType}es` : '';
  return `contatos-gfm${suffix}-${date}.${ext}`;
}

export async function exportXlsx(filterType?: TipoEmpresa) {
  const { rows, count } = await getExportData(filterType);
  if (count === 0) return 0;

  const ws = XLSX.utils.json_to_sheet(rows);

  const headers = Object.keys(rows[0]);
  ws['!cols'] = headers.map((h) => {
    const maxLen = Math.max(
      h.length,
      ...rows.map((r) => (r[h as keyof typeof r] ?? '').toString().length)
    );
    return { wch: Math.min(Math.max(maxLen + 2, 12), 40) };
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Contatos');

  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  downloadBlob(blob, getFilename(filterType, 'xlsx'));

  return count;
}

export async function exportCsv(filterType?: TipoEmpresa) {
  const { rows, count } = await getExportData(filterType);
  if (count === 0) return 0;

  const headers = Object.keys(rows[0]);
  const csvRows = rows.map((row) =>
    headers.map((h) => {
      const val = row[h as keyof typeof row] ?? '';
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    }).join(',')
  );

  const bom = '﻿';
  const csv = bom + [headers.join(','), ...csvRows].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  downloadBlob(blob, getFilename(filterType, 'csv'));

  return count;
}
