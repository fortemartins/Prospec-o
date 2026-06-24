import { db } from './db';
import { getSupabase, isSupabaseConfigured } from './supabase';

const LIVE_LISTS = [
  'eventos',
  'tipos_servico',
  'cargos',
  'segmentos',
  'dores',
  'interesses_solucao',
  'regioes_atuacao',
  'feiras_participa',
  'faixas_preco',
] as const;

export async function pushUnsyncedEmpresas(): Promise<{
  success: number;
  failed: number;
}> {
  const unsynced = await db.empresas.where('sincronizado').equals(0).toArray();
  let success = 0;
  let failed = 0;

  for (const empresa of unsynced) {
    try {
      const { sincronizado: _, ...rest } = empresa;
      const { error } = await getSupabase().from('empresas').upsert({
        ...rest,
        sincronizado: true,
      });
      if (error) throw error;

      const opps = await db.oportunidades
        .where('empresa_id')
        .equals(empresa.id)
        .toArray();

      if (opps.length > 0) {
        const oppsForSupabase = opps.map(({ sincronizado: _, ...rest }) => ({
          ...rest,
          sincronizado: true,
        }));
        const { error: oppError } = await getSupabase()
          .from('oportunidades')
          .upsert(oppsForSupabase);
        if (oppError) throw oppError;

        for (const opp of opps) {
          await db.oportunidades.update(opp.id, { sincronizado: 1 });
        }
      }

      await db.empresas.update(empresa.id, { sincronizado: 1 });
      success++;
    } catch (e) {
      console.error(`Falha ao sincronizar empresa ${empresa.id}:`, e);
      failed++;
    }
  }

  return { success, failed };
}

async function pushLiveListItems(tableName: string): Promise<void> {
  const supabase = getSupabase();
  const localItems = await db.table(tableName).toArray();
  const localIds = new Set(localItems.map((item: { id: string }) => item.id));

  const { data: remoteItems } = await supabase.from(tableName).select('id');
  const idsToDelete = (remoteItems || [])
    .map((item: { id: string }) => item.id)
    .filter((id: string) => !localIds.has(id));

  if (idsToDelete.length > 0) {
    if (tableName === 'eventos') {
      await supabase.from('oportunidades').delete().in('evento_futuro_id', idsToDelete);
      await supabase.from('empresas').delete().in('evento_coleta_id', idsToDelete);
    }
    await supabase.from(tableName).delete().in('id', idsToDelete);
  }

  if (localItems.length > 0) {
    const { error } = await supabase
      .from(tableName)
      .upsert(localItems, { onConflict: 'id' });
    if (error) {
      console.error(`Falha ao sincronizar ${tableName}:`, error);
    }
  }
}

async function pullLiveListItems(tableName: string): Promise<void> {
  const { data, error } = await getSupabase().from(tableName).select('*');
  if (error) {
    console.error(`Falha ao baixar ${tableName}:`, error);
    return;
  }
  await db.table(tableName).clear();
  if (data && data.length > 0) {
    await db.table(tableName).bulkPut(data);
  }
}

export async function fullSync(): Promise<{
  success: number;
  failed: number;
}> {
  if (!isSupabaseConfigured()) {
    return { success: 0, failed: 0 };
  }

  await Promise.all(LIVE_LISTS.map((table) => pushLiveListItems(table)));
  await Promise.all(LIVE_LISTS.map((table) => pullLiveListItems(table)));

  return await pushUnsyncedEmpresas();
}

export async function getUnsyncedCount(): Promise<number> {
  return await db.empresas.where('sincronizado').equals(0).count();
}
