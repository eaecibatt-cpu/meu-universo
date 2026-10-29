# MEU UNIVERSO

Aplicativo de organização pessoal para **Windows 11** e **Android**, instalável como PWA. Reúne agenda, tarefas, listas de compras, diário, faculdade, finanças e um espaço pessoal em um só lugar, com visual minimalista inspirado no Windows 11 e no estilo *Liquid Glass*.

## Recursos atuais

- Cadastro, login e perfil por usuário (Supabase Auth)
- Dados isolados por conta (Row Level Security)
- Tema claro, escuro ou automático
- Liquid Glass ativado, reduzido ou desativado
- Cor de destaque personalizável
- Cartões da tela inicial configuráveis (mostrar, ocultar e reordenar)

## Roadmap

- [x] Etapa 0: projeto base e tema
- [x] Etapa 1: autenticação e perfil
- [x] Etapa 2: cartões da tela inicial configuráveis
- [x] Etapa 3: redesenho visual e cor de destaque
- [ ] Etapa 4: agenda e tarefas
- [ ] Etapa 5: anotações, diário e listas de compras
- [ ] Etapa 6: módulo Minha Faculdade
- [ ] Etapa 7: sincronização entre dispositivos (offline-first) e PWA instalável
- [ ] Etapa 8: conector opcional para o SIGAA (Python + Playwright, com login manual)

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Interface | React, TypeScript, Vite |
| Backend e banco | Supabase (Auth, Postgres, Row Level Security) |
| Instalação | PWA (planejado) |
| Integração acadêmica (planejada) | Python + Playwright |
## Estrutura

~~~
meu-universo/
├── apps/
│   └── web/            # Aplicativo React + TypeScript
│       └── src/
│           ├── data/       # Cliente do Supabase
│           └── features/   # auth, home e módulos futuros
├── supabase/
│   └── migrations/     # SQL versionado (tabelas e regras de segurança)
├── docs/               # Decisões de arquitetura
└── README.md
~~~

## Como executar

Requisitos: Node.js 20 ou superior e uma conta no Supabase.

1. Crie um projeto no Supabase e execute, no **SQL Editor**, os arquivos de `supabase/migrations/` em ordem numérica.
2. Instale e configure:

~~~powershell
cd apps\web
npm install
Copy-Item .env.example .env.local
~~~

3. Edite `apps\web\.env.local` com a **Project URL** e a chave pública (**anon** ou **publishable**) do seu projeto. Nunca use a chave `service_role` e nunca envie o `.env.local` ao Git.
4. Inicie:

~~~powershell
npm run dev
~~~

Abra `http://localhost:5173/`.

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Verifica tipos e gera a versão de produção |
| `npm run lint` | Análise estática do código |

## Segurança

- Cada usuário só acessa os próprios dados, garantido por Row Level Security no banco.
- Chaves ficam em `.env.local`, ignorado pelo Git.
- O conector do SIGAA (planejado) não armazenará senhas e só funcionará com login feito pelo próprio usuário e se o portal permitir.