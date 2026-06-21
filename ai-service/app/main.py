from fastapi import FastAPI

from app.routers import health
from app.db import close_pool

app = FastAPI(title="ScholarAI Internal AI Service", version="1.0.0")

app.include_router(health.router)

@app.on_event("shutdown")
def shutdown() -> None:
    close_pool()
