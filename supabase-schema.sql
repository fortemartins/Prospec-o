-- ============================================
-- Schema do App de Prospecção para Feiras
-- Execute este SQL no Supabase SQL Editor
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Eventos
CREATE TABLE eventos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  data DATE,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Tipos de serviço (fornecedores)
CREATE TABLE tipos_servico (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  unidade_cobranca TEXT NOT NULL
);

INSERT INTO tipos_servico (nome, unidade_cobranca) VALUES
  ('Montadora', 'm²'),
  ('Locação de plantas para cenografia', 'unidade');

-- Listas vivas
CREATE TABLE cargos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL
);

CREATE TABLE segmentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL
);

CREATE TABLE dores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL
);

CREATE TABLE interesses_solucao (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL
);

CREATE TABLE regioes_atuacao (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL
);

CREATE TABLE feiras_participa (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL
);

CREATE TABLE faixas_preco (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL
);

-- Empresas
CREATE TABLE empresas (
  id UUID PRIMARY KEY,
  tipo TEXT NOT NULL CHECK (tipo IN ('fornecedor', 'expositor')),
  nome TEXT NOT NULL,
  nome_contato TEXT,
  whatsapp TEXT,
  email TEXT,
  cargo_id UUID REFERENCES cargos(id),
  segmento_id UUID REFERENCES segmentos(id),
  tamanho_estande TEXT CHECK (tamanho_estande IN ('Até 9m²', '10-30m²', '30m²+')),
  tipo_servico_id UUID REFERENCES tipos_servico(id),
  regioes_atuacao UUID[] DEFAULT '{}',
  instagram_site TEXT,
  faixa_preco_id UUID REFERENCES faixas_preco(id),
  observacoes TEXT,
  evento_coleta_id UUID REFERENCES eventos(id),
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  sincronizado BOOLEAN DEFAULT TRUE,
  CONSTRAINT whatsapp_ou_email CHECK (whatsapp IS NOT NULL OR email IS NOT NULL)
);

-- Oportunidades (expositores)
CREATE TABLE oportunidades (
  id UUID PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  evento_futuro_id UUID REFERENCES eventos(id),
  dores UUID[] DEFAULT '{}',
  interesses_solucao UUID[] DEFAULT '{}',
  status TEXT,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  sincronizado BOOLEAN DEFAULT TRUE
);

-- RLS: permitir todas as operações (app single-user, sem auth)
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_eventos" ON eventos FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE tipos_servico ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_tipos_servico" ON tipos_servico FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE cargos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_cargos" ON cargos FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE segmentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_segmentos" ON segmentos FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE dores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_dores" ON dores FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE interesses_solucao ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_interesses_solucao" ON interesses_solucao FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE regioes_atuacao ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_regioes_atuacao" ON regioes_atuacao FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE feiras_participa ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_feiras_participa" ON feiras_participa FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE faixas_preco ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_faixas_preco" ON faixas_preco FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_empresas" ON empresas FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE oportunidades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_oportunidades" ON oportunidades FOR ALL USING (true) WITH CHECK (true);
