#!/usr/bin/env python3
"""Удалить пользователя по email из backend/data/users.json. Запуск: python scripts/remove_user.py alex-filpr@mail.ru"""
import json
import sys
from pathlib import Path

users_file = Path(__file__).resolve().parent.parent / "data" / "users.json"
if not users_file.exists():
    print("Файл users.json не найден.")
    sys.exit(1)

email = (sys.argv[1] or "").strip().lower()
if not email:
    print("Использование: python scripts/remove_user.py <email>")
    sys.exit(1)

data = json.loads(users_file.read_text(encoding="utf-8"))
if email not in data:
    print(f"Пользователь {email} не найден.")
    sys.exit(0)

del data[email]
users_file.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Пользователь {email} удалён.")
