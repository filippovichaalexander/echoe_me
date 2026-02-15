"""
Регистрация, логин, логаут, текущий пользователь, восстановление пароля.
Сессия в httpOnly cookie.
"""
import asyncio
from fastapi import APIRouter, HTTPException, Response, Depends, Cookie
from pydantic import BaseModel, field_validator

from core.auth import (
    create_user,
    get_user_by_email,
    get_user_by_id,
    create_session,
    get_session,
    delete_session,
    verify_password,
    SESSION_COOKIE_NAME,
    SESSION_MAX_AGE,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.options("/login")
@router.options("/register")
@router.options("/logout")
@router.options("/me")
async def auth_preflight():
    """CORS preflight: браузер запрашивает OPTIONS перед POST; отвечаем 200 (CORS добавляет middleware)."""
    from starlette.responses import Response
    return Response(status_code=200)


class RegisterBody(BaseModel):
    name: str
    email: str
    password: str
    password_confirm: str

    @field_validator("password", "password_confirm")
    @classmethod
    def str_password(cls, v: str) -> str:
        return v if isinstance(v, str) else str(v)


class LoginBody(BaseModel):
    email: str
    password: str

    @field_validator("password")
    @classmethod
    def str_password(cls, v: str) -> str:
        return v if isinstance(v, str) else str(v)


class ForgotPasswordBody(BaseModel):
    email: str


def _user_response(user: dict) -> dict:
    return {"id": user["id"], "name": user["name"], "email": user["email"]}


def _validate_password_for_register(password: str, email: str) -> None:
    """Валидация пароля на бэкенде (не доверяем фронтенду)."""
    cleaned = password.strip()
    if len(cleaned) < 8:
        raise HTTPException(status_code=400, detail="Пароль должен содержать минимум 8 символов")
    if len(cleaned) > 128:
        raise HTTPException(status_code=400, detail="Пароль не более 128 символов")
    email_local = email.strip().lower().split("@")[0]
    if email_local and cleaned.lower() == email_local:
        raise HTTPException(
            status_code=400,
            detail="Пароль не должен совпадать с частью email до @",
        )
    # TODO: проверка по HIBP (Have I Been Pwned) — при желании добавить вызов API


@router.post("/register")
async def register(body: RegisterBody, response: Response):
    password = body.password.strip()
    password_confirm = body.password_confirm.strip()
    if password != password_confirm:
        raise HTTPException(status_code=400, detail="Пароли не совпадают")
    _validate_password_for_register(password, body.email)
    try:
        user = await asyncio.to_thread(
            create_user, body.name, body.email, password
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    session_id = create_session(user["id"])
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=session_id,
        max_age=SESSION_MAX_AGE,
        httponly=True,
        samesite="lax",
        path="/",
    )
    return {"user": _user_response(user)}


@router.post("/login")
async def login(body: LoginBody, response: Response):
    user = get_user_by_email(body.email)
    password = body.password
    ok = user and await asyncio.to_thread(
        verify_password, password, user["password_hash"]
    )
    if not ok:
        raise HTTPException(status_code=401, detail="Неверный email или пароль")
    session_id = create_session(user["id"])
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=session_id,
        max_age=SESSION_MAX_AGE,
        httponly=True,
        samesite="lax",
        path="/",
    )
    return {"user": _user_response(user)}


@router.post("/logout")
async def logout(response: Response, cookie: str | None = Cookie(default=None, alias=SESSION_COOKIE_NAME)):
    if cookie:
        delete_session(cookie)
    response.delete_cookie(SESSION_COOKIE_NAME, path="/")
    return {"ok": True}


@router.get("/me")
async def me(session_id: str | None = Cookie(default=None, alias=SESSION_COOKIE_NAME)):
    session = get_session(session_id) if session_id else None
    if not session:
        raise HTTPException(status_code=401, detail="Не авторизован")
    user = get_user_by_id(session["user_id"])
    if not user:
        raise HTTPException(status_code=401, detail="Пользователь не найден")
    return {"user": user}


@router.post("/forgot-password")
async def forgot_password(body: ForgotPasswordBody):
    user = get_user_by_email(body.email)
    if user:
        pass  # TODO: отправить письмо со ссылкой для сброса пароля
    return {"message": "Если аккаунт с таким email существует, вы получите письмо с инструкциями."}
