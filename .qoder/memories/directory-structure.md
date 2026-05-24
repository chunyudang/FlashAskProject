# Project Directory Structure

```
flash-ask/                          # Project root: /Users/dcy/Workspace/FlashAskProject
├── .qoder/
│   ├── rules/
│   │   ├── project.md              # Global project rules & conventions
│   │   ├── backend.md              # Backend (Koa) development rules
│   │   ├── client.md               # UniApp client development rules
│   │   └── admin.md                # React admin dashboard rules
│   └── memories/                   # Project memory store (this file)
│       ├── tech-stack.md
│       ├── qoder-config.md
│       ├── mvp-scope.md
│       └── directory-structure.md
├── .github/
│   └── workflows/                  # CI/CD pipelines
├── docs/
│   ├── PRD.md                      # Product requirements document
│   ├── API.md                      # API interface documentation
│   └── DEPLOY.md                   # Deployment guide
├── client/                         # UniApp user-facing app (Vue 3)
│   ├── src/
│   │   ├── api/                    # API call modules
│   │   ├── store/                  # Pinia stores
│   │   └── pages/                  # Page components
│   └── ...
├── admin/                          # React admin dashboard
│   └── src/
│       ├── api/                    # Axios API modules
│       └── pages/                  # Route pages
├── server/                         # Koa backend API
│   ├── src/
│   │   ├── app.js                  # Entry point
│   │   ├── routes/                 # Route modules
│   │   │   ├── auth.js             # Authentication
│   │   │   ├── categories.js       # Categories
│   │   │   ├── levels.js           # Levels
│   │   │   ├── questions.js        # Questions & answering
│   │   │   ├── progress.js         # User progress
│   │   │   └── admin.js            # Admin API
│   │   ├── controllers/            # Business logic (optional)
│   │   ├── models/                 # Data models
│   │   └── middleware/
│   │       └── auth.js             # JWT auth middleware
│   └── database/
│       ├── schema.sql              # Table creation SQL
│       └── init.js                 # Database initialization script
├── AGENTS.md                       # Qoder agent configuration
├── README.md                       # Project readme
└── PRD.md                          # Product requirements (root level)
```

## Key File Locations
- **PRD**: `/docs/PRD.md` (also at root `/PRD.md`)
- **API Docs**: `/docs/API.md`
- **Database Schema**: `/server/database/schema.sql`
- **Agent Config**: `/AGENTS.md`
- **Qoder Rules**: `/.qoder/rules/`
- **Qoder Memories**: `/.qoder/memories/`
