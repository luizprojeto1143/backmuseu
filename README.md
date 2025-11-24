# Cultura Viva - Backend

Backend em Node.js + TypeScript + Express + TypeORM.

- Autenticação com JWT (/api/auth/login, /api/auth/register)
- Multi-tenant (Tenants)
- Pontos, Trilhas, Eventos, Reviews
- Progresso do usuário (gamificação)
- IA com GPT-4o-mini via /api/ai/*
- Upload local de arquivos via /api/upload
- Analytics simples via /api/analytics

## Como rodar

```bash
npm install
cp .env.example .env
# ajuste as variáveis de ambiente
npm run start:dev
```
