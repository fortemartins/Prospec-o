# Especificação técnica — App de prospecção para feiras (PWA)

## Contexto do projeto

Agência organizadora de eventos especializada em feiras corporativas (estandes). Primeiro projeto vendido: estande na Formóbile (final de junho de 2026).

O app vai ser usado **em campo, andando pela feira**, para cadastrar rapidamente contatos de duas naturezas diferentes:

1. **Fornecedores** (pré-evento): empresas que prestam serviço PARA a agência (montadoras, fotógrafos, filmmakers, promotores freelance, locação de plantas para cenografia, lojas de itens gráficos, etc.)
2. **Expositores** (durante o evento): empresas que expõem na feira e que demonstraram interesse real em contratar a agência para um evento futuro — não é uma lista de "todo mundo que visitei", é uma lista de **potenciais clientes filtrados em campo**.

## Prazo

Versão funcional até quarta-feira à noite. Priorizar o essencial: cadastro funcionando + salvamento offline confiável. Painel bonito e exportação automática ficam para depois.

## Requisito não-negociável: funcionamento offline

Pavilhões de feira têm sinal de internet instável. O app **precisa salvar os dados localmente no dispositivo primeiro**, e sincronizar com o banco de dados na nuvem (Supabase) assim que detectar conexão. Nenhum dado pode ser perdido por falta de internet no momento do cadastro.

## Stack técnica

- **Frontend:** Next.js, configurado como PWA (instalável, ícone na tela inicial, funciona offline)
- **Backend / banco de dados:** Supabase
- **Publicação:** Vercel
- **Ambiente de desenvolvimento:** Cursor + Claude Code

## Exportação de dados

Não precisa ser automática nesta primeira versão. Os dados ficam salvos no Supabase e serão exportados manualmente (CSV/planilha) depois do evento, para importação manual em um CRM de vendas (RD Station / Pipedrive / HubSpot).

---

## Modelo de dados

### Tabela: `eventos`
Reaproveitada tanto para o evento "atual" (onde a coleta está acontecendo) quanto para eventos futuros mencionados durante uma conversa em campo. É uma lista viva: cresce conforme o usuário cadastra eventos novos.

| Campo | Tipo | Observação |
|---|---|---|
| id | uuid (PK) | |
| nome | texto | Ex: "Formóbile 2026", "Móvel Sul 2026" |
| data | data | opcional |
| criado_em | timestamp | |

### Tabela: `tipos_servico`
Lista viva, exclusiva de Fornecedores. Cada tipo de serviço tem sua própria unidade de cobrança fixa — perguntada apenas na primeira vez que o tipo é criado.

| Campo | Tipo | Observação |
|---|---|---|
| id | uuid (PK) | |
| nome | texto | Ex: "Montadora", "Locação de plantas" |
| unidade_cobranca | texto | Ex: "m²", "unidade", "diária" — definida uma única vez |

**Pré-popular esta tabela com:**
- Montadora → unidade: m²
- Locação de plantas para cenografia → unidade: unidade

### Tabelas de listas vivas (mesmo padrão, repetir para cada uma)
Cada uma dessas é uma tabela simples com `id` e `nome`, e uma tela permite adicionar um valor novo na hora do cadastro, que passa a ficar disponível para os próximos cadastros:

- `cargos` (cargo da pessoa de contato — ex: CEO, Marketing, Financeiro/Compras)
- `segmentos` (segmento da empresa expositora)
- `dores` (dores relatadas pelos expositores)
- `interesses_solucao` (interesses de solução relatados)
- `regioes_atuacao` (cidade/estado de atuação do fornecedor — múltipla escolha)
- `feiras_participa` (outras feiras que a empresa expositora participa — múltipla escolha)
- `faixas_preco` (faixas de valor, contextualizadas pela unidade de cobrança do tipo de serviço)

### Tabela: `empresas`
Cadastro-mãe, usado tanto para Fornecedores quanto Expositores (campo `tipo` diferencia).

| Campo | Tipo | Observação |
|---|---|---|
| id | uuid (PK) | |
| tipo | enum | "fornecedor" ou "expositor" |
| nome | texto | obrigatório |
| nome_contato | texto | obrigatório para expositor; opcional para fornecedor |
| whatsapp | texto | opcional |
| email | texto | opcional |
| **regra:** | | pelo menos um entre whatsapp e email é obrigatório |
| cargo_id | uuid (FK → cargos) | só para expositor |
| segmento_id | uuid (FK → segmentos) | só para expositor |
| tamanho_estande | texto | só para expositor — múltipla escolha fixa (ex: P/M/G), serve como indicador de investimento/perfil de cliente |
| tipo_servico_id | uuid (FK → tipos_servico) | só para fornecedor |
| regioes_atuacao | array de uuid (FK → regioes_atuacao) | só para fornecedor, múltipla escolha |
| instagram_site | texto | só para fornecedor, opcional |
| faixa_preco_id | uuid (FK → faixas_preco) | só para fornecedor, opcional |
| observacoes | texto livre | só para fornecedor, opcional |
| evento_coleta_id | uuid (FK → eventos) | evento onde o contato foi coletado (preenchido automaticamente pelo evento ativo no momento, sem perguntar ao usuário) |
| criado_em | timestamp | |
| sincronizado | boolean | controla se já subiu para o Supabase ou ainda está só local |

### Tabela: `oportunidades`
Exclusiva de Expositores. Uma empresa expositora pode ter **uma ou mais oportunidades de negócio**. Cada oportunidade representa uma necessidade específica vinculada a um evento futuro onde a agência pode atuar.

| Campo | Tipo | Observação |
|---|---|---|
| id | uuid (PK) | |
| empresa_id | uuid (FK → empresas) | |
| evento_futuro_id | uuid (FK → eventos) | evento onde essa necessidade vai ser resolvida — pode ser criado na hora se ainda não existir |
| dores | array de uuid (FK → dores) | múltipla escolha, opcional (não pode ser obrigatório — nem toda empresa quer compartilhar isso) |
| interesses_solucao | array de uuid (FK → interesses_solucao) | múltipla escolha, opcional |
| status | texto | opcional, para uso futuro (ex: "a contatar", "orçamento enviado") |
| criado_em | timestamp | |

**Funcionalidade importante:** ao criar uma nova oportunidade para uma empresa que já tem outra(s), oferecer um botão "usar a mesma dor/interesse de outra oportunidade", que clona os valores de `dores` e `interesses_solucao` de uma oportunidade existente, evitando preenchimento repetido. Só o `evento_futuro_id` tende a mudar entre oportunidades da mesma empresa.

---

## Fluxo do formulário (Expositor)

1. Usuário abre o app → evento ativo já está definido (não precisa perguntar)
2. Toca em "Novo contato" → escolhe "Expositor"
3. Preenche dados da empresa: nome, nome do contato, cargo (lista suspensa + adicionar novo), segmento (lista suspensa + adicionar novo), whatsapp/email (pelo menos um), tamanho do estande
4. Sistema pergunta: "Tem interesse em algum serviço para um evento futuro?"
   - Se sim → abre formulário de oportunidade: evento futuro (lista + adicionar novo), dores (múltipla escolha + adicionar novo, opcional), interesse de solução (múltipla escolha + adicionar novo, opcional)
   - Se a empresa já tiver outra oportunidade cadastrada nesta sessão, oferecer botão de clonar dor/interesse
   - Permitir adicionar mais de uma oportunidade para a mesma empresa
5. Salva localmente. Sincroniza com Supabase quando houver conexão.

## Fluxo do formulário (Fornecedor)

1. Usuário abre o app → toca em "Novo contato" → escolhe "Fornecedor"
2. Preenche: nome da empresa, tipo de serviço (lista suspensa + adicionar novo — se for tipo novo, perguntar a unidade de cobrança nesse momento)
3. Whatsapp (teclado numérico) / e-mail — pelo menos um
4. Campos opcionais: nome do contato, região de atuação (múltipla escolha + adicionar novo), Instagram/site, faixa de preço (já na unidade certa do tipo de serviço escolhido), observações
5. Salva localmente. Sincroniza com Supabase quando houver conexão.

---

## Prioridade de implementação (para o prazo de quarta-feira)

1. Estrutura do banco de dados no Supabase (tabelas acima)
2. Formulário de cadastro funcionando (Fornecedor + Expositor), com salvamento local garantido
3. Sincronização local → Supabase quando houver internet
4. Lista simples para o usuário conferir os contatos já salvos
5. PWA configurado (manifest, ícone, instalável, funcionamento offline via service worker)

Fora do escopo desta primeira versão: painel com gráficos, exportação automática para planilha, múltiplos usuários simultâneos (a estrutura já comporta isso no futuro, mas não é necessário agora).
