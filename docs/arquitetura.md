# Arquitetura

## Decisões

- **PWA em React + TypeScript:** uma única base de código para Windows 11 e Android.
- **Supabase:** autenticação, Postgres e Row Level Security sem manter servidor próprio no início.
- **Offline-first (planejado):** dados locais em IndexedDB sincronizados com o Supabase. Toda tabela terá `id` UUID gerado no cliente, `updated_at` e exclusão lógica (`deleted_at`).
- **Temas por CSS variables:** tema, intensidade do Liquid Glass e cor de destaque são tokens salvos no perfil do usuário.

## Conector do SIGAA (planejado)

- Roda localmente, na máquina do usuário, em Python + Playwright.
- Login feito manualmente pelo usuário; nenhuma senha é armazenada.
- Saída em JSON com esquema fixo (turmas, atividades, prazos, avaliações, horários).
- Antes de implementar: verificar os termos de uso do portal e mapear a estrutura real das páginas.
- Alternativa sempre disponível: cadastro manual e importação por texto ou CSV.

## Banco de dados

As migrações em `supabase/migrations/` são o registro oficial da estrutura. Cada alteração entra como um novo arquivo numerado.