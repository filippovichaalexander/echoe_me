"""
Music Avatar - FastAPI backend.
Главная точка входа приложения.
"""
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.endpoints import auth, avatar, generation, voice, analysis

app = FastAPI(
    title="Music Avatar API",
    description="API цифрового музыкального аватара",
    version="0.1.0",
)

# CORS: при credentials: true браузер не принимает Allow-Headers: * — нужен явный список
_ALLOWED_ORIGINS = ["http://localhost:3000", "http://frontend:3000", "http://127.0.0.1:3000"]
_CORS_ALLOW_HEADERS = "Content-Type, Accept, Origin, Authorization, X-Requested-With"


class CorsAllResponsesMiddleware(BaseHTTPMiddleware):
    """Добавляет CORS-заголовки ко всем ответам (в т.ч. при 4xx/5xx и preflight)."""
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        origin = request.headers.get("origin")
        if origin in _ALLOWED_ORIGINS:
            response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = _CORS_ALLOW_HEADERS
        return response


app.add_middleware(
    CORSMiddleware,
    allow_origins=_ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Accept", "Origin", "Authorization", "X-Requested-With"],
)
app.add_middleware(CorsAllResponsesMiddleware)

app.include_router(auth.router)
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
