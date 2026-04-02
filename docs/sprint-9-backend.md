# Sprint 9: Backend Server — Phase 1 Foundation

## What was built

QAtrial now has a real backend server, transforming it from a localStorage demo into a multi-user system.

### Stack
- **Runtime**: Node.js + tsx (TypeScript execution)
- **Framework**: Hono (lightweight, fast, TypeScript-first)
- **Database**: PostgreSQL via Prisma ORM v7
- **Auth**: JWT (24h access + 7d refresh tokens), bcrypt password hashing
- **RBAC**: Admin, Editor, Viewer roles

### Database Schema (10 models)
- `User` — email, password hash, name, role, organization
- `Organization` — company/team container
- `Workspace` — project grouping within org
- `Project` — name, description, country, vertical, modules, type
- `Requirement` — seqId (REQ-NNN), title, description, status, tags, riskLevel, regulatoryRef
- `Test` — seqId (TST-NNN), title, description, status, linkedRequirementIds
- `Risk` — severity, likelihood, detectability, riskScore, riskLevel, mitigation
- `CAPA` — lifecycle (open→investigation→in_progress→verification→resolved→closed)
- `AuditLog` — append-only, timestamp, userId, action, entity, previous/new values

### API Endpoints (8 route groups, 30+ endpoints)

| Route Group | Endpoints | Key Features |
|------------|-----------|--------------|
| `/api/auth` | register, login, refresh, me | JWT auth, creates org+workspace on register |
| `/api/projects` | CRUD | Workspace-scoped, audit logged |
| `/api/requirements` | CRUD | Auto seqId (REQ-NNN), audit logged, cascade link cleanup |
| `/api/tests` | CRUD | Auto seqId (TST-NNN), audit logged |
| `/api/capa` | CRUD | Status transition enforcement, audit logged |
| `/api/risks` | CRUD | Auto risk score/level calculation |
| `/api/audit` | GET, export CSV | Read-only, filterable by project/entity/date |
| `/api/users` | list, invite, change role | Admin-only for invite/role changes |

### Middleware
- `authMiddleware` — JWT verification, attaches user to context
- `requireRole(...roles)` — role-based access control guard

### Frontend Integration
- `src/lib/apiClient.ts` — authenticated fetch wrapper with auto Bearer token injection
- Environment variable: `VITE_API_URL` (defaults to `http://localhost:3001/api`)

### Scripts Added
```bash
npm run server        # Start server (tsx server/index.ts)
npm run server:dev    # Start with watch mode (tsx watch server/index.ts)
npm run db:generate   # Generate Prisma client
npm run db:migrate    # Run database migrations
npm run db:push       # Push schema to database
npm run db:studio     # Open Prisma Studio GUI
```

### To run the backend
```bash
# 1. Set DATABASE_URL (or use default postgresql://localhost:5432/qatrial)
export DATABASE_URL="postgresql://user:pass@localhost:5432/qatrial"

# 2. Generate Prisma client
npm run db:generate

# 3. Push schema to database
npm run db:push

# 4. Start server
npm run server:dev

# 5. Test health endpoint
curl http://localhost:3001/api/health
```

## Files created
```
server/
  index.ts                        # Hono server entry point (port 3001)
  prisma/
    schema.prisma                 # PostgreSQL schema (10 models)
    prisma.config.ts              # Prisma 7 migration config
  middleware/
    auth.ts                       # JWT auth + RBAC middleware
  services/
    audit.service.ts              # Append-only audit logging
  routes/
    auth.ts                       # Register, login, refresh, me
    projects.ts                   # Project CRUD
    requirements.ts               # Requirement CRUD + auto seqId
    tests.ts                      # Test CRUD + auto seqId
    capa.ts                       # CAPA CRUD + lifecycle enforcement
    risks.ts                      # Risk CRUD + auto scoring
    audit.ts                      # Read-only audit queries + CSV export
    users.ts                      # User management (admin)
src/
  lib/apiClient.ts                # Authenticated API fetch wrapper
docs/
  ROADMAP-product.md              # 12-18 month product roadmap
```

## Build status
- Frontend: ✅ Clean
- Backend: ✅ TypeScript clean (--noEmit --skipLibCheck)
