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

## Если .gitignore добавили после первых коммитов

Чтобы перестать отслеживать уже запушенные файлы (node_modules, .env, venv и т.п.), выполните в корне репозитория:

```bash
# Убрать из индекса всё, что сейчас в .gitignore (файлы на диске не трогаем)
git rm -r --cached .

# Заново добавить файлы — игнорируемые не попадут в индекс
git add .

# Проверить, что в коммит уходят только нужные изменения
git status

# Закоммитить и отправить
git commit -m "Apply .gitignore, stop tracking ignored files"
git push
```

После этого в репозитории больше не будут отслеживаться пути из `.gitignore`.
