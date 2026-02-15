# Music Avatar (EchoeMe)

Цифровой музыкальный аватар: Next.js + FastAPI + Docker.

## Структура

- **frontend/** — Next.js 14 + TypeScript + Tailwind
- **backend/** — FastAPI, ядро TasteAvatar, API генерации/голоса/анализа
- **docker-compose.yml** — фронт, бэк, PostgreSQL, Redis

## Запуск через Docker

```bash
# Переменные (опционально)
cp .env.example .env
# Добавьте API ключи в .env при необходимости: STABLE_AUDIO_API_KEY, GEMINI_API_KEY, LALAL_API_KEY

# Запуск
docker compose up -d

# Фронт: http://localhost:3000
# API: http://localhost:8000, документация: http://localhost:8000/docs
```

## Локальный запуск (без Docker)

**Бэкенд:**

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**Фронтенд:**

```bash
cd frontend
npm install
npm run dev
```

Фронт по умолчанию ходит на `http://localhost:8000` (задаётся через `NEXT_PUBLIC_API_URL`).

## Основные эндпоинты

- `GET /api/avatar/profile` — профиль аватара
- `POST /api/avatar/action` — добавить действие
- `POST /api/avatar/generate` — генерация музыки (body: `{ "context": { "prompt": "..." } }`)
- `POST /api/voice/analyze` — анализ голоса (multipart)
- `POST /api/generation/from-prompt` — генерация по промпту

Для MVP аватар хранится in-memory; для продакшена — подключить БД и Redis по `DATABASE_URL` и `REDIS_URL`.
