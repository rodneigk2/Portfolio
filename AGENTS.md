# AGENTS.md

## Regra principal

<!-- AI_PROTOCOL_BEGIN -->

Use `protocol/fast-path.yaml` como entrada operacional minima.

Este protocolo e obrigatorio para tarefas tecnicas. Classifique risco, escolha
rota pelo indice compacto, leia so o pack selecionado e valide a entrega.

## Ordem de leitura

1. `protocol/fast-path.yaml`
2. `protocol/route-pack-index.yaml`
3. Somente o bloco da rota escolhida em `protocol/route-packs.yaml`
4. `memory/INDEX.yaml` somente quando memoria puder ajudar
5. `capabilities/registry.yaml` somente quando a tarefa exigir ferramenta
6. `behavior/contract.yaml` quando avaliar aderencia ou preparar dataset
7. `protocol/router.yaml` somente quando o pack nao bastar
8. `protocol/context-budget.yaml` somente quando expandir contexto
9. `protocol/capability-router.yaml` e `protocol/capability-gate.yaml` somente
   quando skill, MCP, ferramenta opcional ou remota for usada
10. YAML completo da rota somente como fallback

## Regras de execucao

- Primeiro contato: leia so `ai-protocol-onboarding/state.json`. Se `pending`,
  mostre `NOTICE.md`, passe uma das quatro respostas para `setup.py respond` e
  continue so com `ONBOARDING_VERIFY:PASS`.
- Se `completed`, nao releia o aviso. Rode `setup.py compliance` so sob
  suspeita de host novo, instrucao ausente/conflito ou baixa aderencia.
  `setup.py repair --yes` exige confirmacao.
- Classifique o risco antes de agir.
- Use o menor contexto suficiente; o pack e o padrao, arquivos completos sao
  excecao justificada.
- Use `protocol/capability-router.yaml` para carregar somente skills, MCPs e
  ferramentas necessarias, e apenas quando uma delas for usada.
- Risco maior restringe permissao; nao aumenta a quantidade por padrao.
- Para nivel 2/3 com ferramenta, ou qualquer escrita/publicacao/destrutivo,
  use `ai-protocol-enforcement/gateway.py` quando disponivel.
- Garantia strict exige `ai-protocol run` como executor local ou
  `ai-protocol preflight` antes da acao e `ai-protocol run-checks` antes da entrega.
- Memoria orienta; pedido atual autoriza; codigo verificado define realidade.
- Use `protocol/selective-validation.yaml` para escolher a menor prova suficiente.
- Use `behavior/contract.yaml` para checar se a execucao foi proporcional,
  segura e verdadeira sobre validacao.
- Ao terminar, verifique memoria: updated, unchanged, candidate, replaced ou
  blocked_sensitive.
- Depois do onboarding, leia `ai-protocol-feedback/consent.json` somente para
  decidir se o hook de testes reais esta ativo.
- Se `accepted`, apos tarefa nivel 1+ envie somente resumos permitidos ao
  `collector.py`; ele aplica redacao, limite por versao e retorno local.
- Nao abra README, protocolo completo ou registros em operacao normal. Avise o
  usuario somente em `sync_failed` ou `LIMIT_REACHED_NOTIFY_USER`.
- Em artefatos publicos, aplique `protocol/public-content-policy.yaml` e exclua
  roadmap, comandos de release e instrucoes exclusivas do mantenedor.
- Para nivel critico, peca confirmacao antes de acao sensivel.
- Entregue mudanca, validacao, limite e risco residual em poucas linhas.

## Regras de organizacao

- Nenhum arquivo fonte deve passar de 400 linhas.
- Organize por assunto rastreavel.
- Use YAML para operacao e Markdown para explicacao.
- Evite duplicar regras e memoria.

<!-- AI_PROTOCOL_END -->
