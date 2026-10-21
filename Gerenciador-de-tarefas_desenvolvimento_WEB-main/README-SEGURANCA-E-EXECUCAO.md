# Gerenciador de Tarefas — versão endurecida

## O que foi alterado nesta revisão

- CORS passa a usar lista explícita `CORS_ORIGINS`.
- Cabeçalhos HTTP básicos, limite de corpo JSON e rate limiting.
- Validação de `JWT_SECRET`, `POSTGRES_PASSWORD` e `MONGODB_URI` na inicialização.
- JWT com `issuer`, `audience` e `subject`; middleware consulta o usuário no PostgreSQL em toda requisição para respeitar bloqueios e mudanças de perfil.
- Erros 500 não retornam detalhes internos ao cliente.
- Removida a senha padrão exibida na tela de login.
- A inicialização do esquema não altera mais a senha do administrador a cada reinício.
- Seed de administrador separado, que não sobrescreve conta existente.
- Redefinição de senha exige 12 caracteres e revoga tokens ativos do usuário.
- Verificação de escopo ao consultar usuários e histórico de tarefas.
- Criação da tarefa e seus relacionamentos PostgreSQL ocorre em transação.
- Portas do Compose vinculadas a `127.0.0.1` no host.

## Configuração local (sem Docker)

1. Entre em `backend/`.
2. Copie `.env.example` para `.env`.
3. Preencha `POSTGRES_PASSWORD`, `MONGODB_URI` e `JWT_SECRET` com valores fortes.
4. Para gerar segredo aleatório, execute `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.
5. Ajuste `POSTGRES_HOST=localhost` e `MONGODB_URI=mongodb://localhost:27017/gerenciador_tarefas` para o ambiente local.
6. Instale dependências com `npm ci`.
7. Inicialize o esquema com `npm run db:init`.
8. Crie o administrador uma única vez com `npm run seed`.
9. Inicie a API com `npm start`.

O `seed` exige `ADMIN_EMAIL` e `ADMIN_PASSWORD`; a senha precisa ter pelo menos 12 caracteres. Ele falha se o e-mail já existir e não redefine uma conta existente.

## Configuração Docker

1. Copie o `.env.example` da raiz para `.env` e defina `POSTGRES_PASSWORD`.
2. Copie `backend/.env.example` para `backend/.env`.
3. No `backend/.env`, configure a MESMA `POSTGRES_PASSWORD` da raiz, `POSTGRES_HOST=postgres` e `MONGODB_URI=mongodb://mongodb:27017/gerenciador_tarefas`.
4. Gere `JWT_SECRET` aleatório e configure `ADMIN_EMAIL` e `ADMIN_PASSWORD`.
5. Execute `docker compose up --build -d`.
6. Crie o administrador uma única vez: `docker compose exec backend npm run seed`.
7. Verifique `http://localhost:3000/api/health` e `http://localhost:3000/api/ready`.

A configuração padrão do MongoDB no Compose ainda é destinada a desenvolvimento local. Para produção, habilite autenticação, rede privada, backups e credenciais de menor privilégio.

## Atenção sobre migrações

`src/config/initDatabase.js` ainda é um inicializador idempotente com `CREATE TABLE IF NOT EXISTS`, preservado para manter compatibilidade com a estrutura do projeto. Ele NÃO substitui migrações versionadas e não altera automaticamente tabelas já existentes para refletir mudanças futuras. Antes de produção, converta o esquema em migrações versionadas (por exemplo, `node-pg-migrate` ou Knex Migrations), aplique-as em staging e teste rollback. Não apague volumes de banco para aplicar esta revisão.

## Segurança importante ainda a planejar antes de produção

- O rate limiter incluído usa memória local e não coordena réplicas; substitua por Redis em implantação horizontal.
- O fluxo atual do frontend mantém access/refresh token em `localStorage`. Para produção web, prefira refresh token em cookie `HttpOnly`, `Secure`, `SameSite` e proteção CSRF; access token em memória. Para mobile, use Keychain/Keystore.
- A transação PostgreSQL protege a criação da tarefa e relacionamentos, mas histórico/notificações no MongoDB ainda são efeitos posteriores. Para entrega garantida, implemente transactional outbox e worker idempotente.
- Configure envio real de e-mail, política de retenção LGPD, backups testados, monitoramento e revisão de permissões por negócio.
- Revise autorização por escopo em todos os endpoints antes de publicar. Esta revisão não substitui auditoria profissional de segurança.

## Testes e verificações

Dentro de `backend/`:
- `npm run check` verifica sintaxe de arquivos críticos.
- `npm start` exige variáveis de ambiente válidas e bancos acessíveis.
- Teste login, refresh, logout, recuperação de senha, acesso a tarefa de outro setor e bloqueio de usuário com contas de teste.

A API utiliza `/api` no momento. Uma versão `/api/v1` deve ser adicionada com estratégia de migração para não quebrar o frontend existente.
