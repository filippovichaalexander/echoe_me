"""
Music Avatar - FastAPI backend.
Главная точка входа приложения.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.endpoints import avatar, generation, voice, analysis

app = FastAPI(
    title="Music Avatar API",
    description="API цифрового музыкального аватара",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://frontend:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(avatar.router, prefix="/api/avatar", tags=["avatar"])
app.include_router(generation.router, prefix="/api/generation", tags=["generation"])
app.include_router(voice.router, prefix="/api/voice", tags=["voice"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["analysis"])


@app.get("/")
async def root():
    return {"message": "Music Avatar API", "docs": "/docs"}


@app.get("/health")
async def health():
    return {"status": "ok"}
