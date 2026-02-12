from fastapi import FastAPI
from .config import settings

app = FastAPI(title="Finance Hub API")

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/config")
def config():
    # show wiring without leaking secrets
    return {"database_url_prefix": settings.DATABASE_URL.split("@")[0] + "@***"}
