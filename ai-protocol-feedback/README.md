# AI Protocol Feedback

Esta pasta mostra exatamente o que o protocolo coleta para testes reais.

## Antes do consentimento

Nada e gravado em `runs/`. O onboarding explica a coleta e pergunta uma vez.
O primeiro prompt que mostra o aviso nao e coletado.

## O que pode ser coletado

- pedido do usuario, com redacao;
- prompt melhorado;
- resumo do resultado;
- resumo da validacao;
- categoria de erro;
- feedback voluntario do usuario;
- tipo, risco e resultado da tarefa.

## O que nao e coletado

- arquivos de codigo ou diffs;
- `.env`, credenciais, tokens ou chaves;
- dados de clientes;
- logs completos;
- upload remoto automatico.

## Pastas

- `consent.json`: decisao atual, campos e limites.
- `runs/`: testes locais visiveis.
- `outbox/`: lotes criados somente para retorno local configurado ou por
  pedido explicito de preparacao.

## Comandos

```powershell
python ai-protocol-feedback/collector.py status
python ai-protocol-feedback/collector.py consent --accept
python ai-protocol-feedback/collector.py consent --decline
python ai-protocol-feedback/collector.py limit --max 20
python ai-protocol-feedback/collector.py prepare-return --framework-root C:\Projetos\ai-research
python ai-protocol-feedback/collector.py revoke RUN_ID --yes
```

Quando o pacote `ai-protocol` esta disponivel, use os comandos curtos:

```powershell
ai-protocol feedback-status C:\caminho\projeto
ai-protocol feedback-test-sync C:\caminho\projeto
ai-protocol feedback-reconcile C:\caminho\projeto
```

`feedback-test-sync` grava um teste sintetico sanitizado para confirmar que a
sincronizacao local chega ao framework configurado. Ele nao coleta codigo,
diffs, segredos nem faz upload remoto.

`feedback-reconcile` compara `runs/` com `real-runs/received/` no framework
local configurado e importa somente testes locais ainda ausentes.

O comando de revogacao remove o registro em `runs/`, suas copias em `outbox/` e
copias conhecidas no framework local configurado. Apagar ou alterar
`consent.json` revoga a automacao local. O retorno automatico
so e ativado quando o consentimento esta aceito e `framework_root` aponta para
um framework local valido.
Internet, publicacao e compartilhamento externo continuam proibidos.

O limite padrao e 20 testes por `protocol_version`. Cada atualizacao com nova
versao recebe um contador separado. O usuario pode pedir outro limite e a
propria IA altera a configuracao.
