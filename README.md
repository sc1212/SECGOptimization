# Finance Hub — SECG Phase 1 MVP (Starter)

## Run (Docker Desktop)
```bash
cp .env.example .env
docker compose up --build
```

- Frontend: http://localhost:5173
- API docs: http://localhost:8000/docs
- Health: http://localhost:8000/health

## UI Code
- `frontend/src/App.tsx`

Notes:
- This MVP uses `// @ts-nocheck` to prevent TypeScript build failures while iterating.
- Backend is minimal FastAPI.
