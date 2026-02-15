"""
Music Avatar - FastAPI backend.
Главная точка входа приложения.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.endpoints import auth, avatar, generation, voice, analysis, library, subscription

app = FastAPI(
    title="Music Avatar API",
    description="API цифрового музыкального аватара",
    version="0.1.0",
)

# CORS: localhost с любым портом (Docker + браузер с хоста), credentials для cookie
_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://0.0.0.0:3000",
    "http://[::1]:3000",
    "http://frontend:3000",
]
# Регулярка: http(s)://localhost|127.0.0.1|[::1]|0.0.0.0 с любым портом (для Docker и разных портов)
_ORIGIN_REGEX = r"https?://(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0|host\.docker\.internal)(:\d+)?"

app.add_middleware(
    CORSMiddleware,
    allow_origins=_ORIGINS,
    allow_origin_regex=_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Accept", "Origin", "Authorization", "X-Requested-With"],
    expose_headers=[],
)

app.include_router(auth.router)
app.include_router(avatar.router, prefix="/api/avatar", tags=["avatar"])
app.include_router(generation.router, prefix="/api/generation", tags=["generation"])
app.include_router(voice.router, prefix="/api/voice", tags=["voice"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["analysis"])
app.include_router(library.router, prefix="/api/library", tags=["library"])
app.include_router(subscription.router, prefix="/api/subscription", tags=["subscription"])


@app.get("/")
async def root():
    return {"message": "Music Avatar API", "docs": "/docs"}


@app.get("/health")
async def health():
    return {"status": "ok"}
