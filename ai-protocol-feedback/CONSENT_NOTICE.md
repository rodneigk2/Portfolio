# Aviso de coleta de testes reais

O AI Execution Protocol gostaria de guardar testes resumidos desta utilizacao
e copia-los automaticamente para a base local do framework, para medir se ele
esta ajudando.

Se voce aceitar, apos tarefas tecnicas a IA podera registrar automaticamente:

- seu pedido, com redacao automatica;
- o prompt melhorado;
- resumo do que foi feito;
- resumo dos testes e validacoes;
- categoria de erro, resultado e nivel de risco;
- feedback que voce fornecer voluntariamente.

Nao serao coletados:

- arquivos de codigo, diffs ou repositorio;
- `.env`, senhas, tokens, chaves ou credenciais;
- dados de clientes;
- logs completos;
- caminhos pessoais identificaveis;
- qualquer upload remoto automatico.

Tudo fica visivel em `ai-protocol-feedback/runs/`. Voce pode revisar e revogar
qualquer registro, incluindo copias locais conhecidas. Quando houver um framework local configurado, uma copia
validada vai para `real-runs/received/`. Nao ha internet, servidor ou
publicacao.

Ao aceitar os testes, voce autoriza a coleta local. Se um framework local
valido estiver configurado, autoriza tambem o retorno local automatico descrito
acima. A decisao pode ser revogada depois. Qualquer envio pela internet ou
publicacao continua proibido e exigiria outro consentimento.

Por padrao, no maximo 20 testes sao registrados por versao do protocolo. Ao
atingir o limite, a coleta para automaticamente ate uma nova atualizacao ou
alteracao explicita do limite.

Os registros ficam armazenados ate revogacao pelo usuario ou limpeza local
explicita. Copias recebidas pelo framework ficam como `received_unreviewed` ate
curadoria ou revogacao.

Aceitar o uso do framework nao significa aceitar esta coleta. A escolha inicial
e apresentada pelo onboarding junto da opcao independente de reforcar regras do
host.
