# Qoder Configuration

## AGENTS.md (Project Root)
The main agent configuration file at `/AGENTS.md` defines:
- Project context: FlashAsk (闪问) general knowledge quiz game
- General instructions: PRD, API, Schema locations; three tech stack principles
- Common commands: how to start server, admin, and client
- Agent-specific sub-configurations

## Rules Directory (`.qoder/rules/`)
Four rule files for different development contexts:

1. **project.md** — Global project rules
   - Tech stack overview
   - Core MVP features
   - Development conventions (Koa, SQLite, commit message format)

2. **backend.md** — Backend development rules
   - Koa 2 + better-sqlite3 + JWT stack
   - Directory structure under `server/`
   - API route style (prefix-based @koa/router)
   - Database naming conventions (snake_case, UUID primary keys)

3. **client.md** — UniApp client development rules
   - Vue 3 Composition API + Pinia
   - Page routes table (index, login, category, level, quiz, result, profile)
   - API and store conventions

4. **admin.md** — Admin dashboard development rules
   - React 18 + Ant Design 5 + Vite
   - Page routes table (login, questions CRUD, categories, levels, users)
   - Axios API call conventions

## Agent Types
- **backend-agent**: Node.js + Koa + SQLite focus
- **admin-agent**: React + Ant Design focus
- **client-agent**: UniApp focus
