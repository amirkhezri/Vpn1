# Shinobu Proxy — Backend Setup

## Структура

```
vpn-backend/
├── app.py            # Flask приложение
├── requirements.txt
├── .env.example      → скопируй в .env
└── shinobu.db        # создаётся автоматически
```

## Быстрый старт

```bash
# 1. Установить зависимости
pip install -r requirements.txt

# 2. Настроить переменные окружения
cp .env.example .env
nano .env   # вставить BOT_TOKEN и ADMIN_SECRET

# 3. Запустить
python app.py
```

Сервер стартует на http://0.0.0.0:5000

---

## Настройка Telegram Webhook

После деплоя на сервер с HTTPS зарегистрируй вебхук:

```bash
curl "https://api.telegram.org/botВАШ_ТОКЕН/setWebhook?url=https://ТВОЙ_ДОМЕН/api/webhook"
```

---

## API эндпоинты

### Публичные (фронтенд → бэкенд)

| Метод | Путь | Описание |
|-------|------|----------|
| GET  | `/api/user/<id>` | Получить данные пользователя |
| POST | `/api/user/<id>` | Обновить / активировать триал |
| POST | `/api/create_stars_invoice` | Создать Stars инвойс |
| GET  | `/api/health` | Проверка работы сервера |

### Вебхук

| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/webhook` | Получать апдейты от Telegram |

Обрабатывает:
- `pre_checkout_query` — подтверждает платёж Stars
- `successful_payment` — выдаёт ключ, продлевает подписку
- `/start ref_XXXX` — фиксирует реферала

### Админка (Header: `X-Admin-Secret: твой_секрет`)

| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/admin/set_key` | Выдать ключ вручную (YooMoney) |
| POST | `/api/admin/add_key_to_pool` | Добавить ключи в пул |
| GET  | `/api/admin/users` | Список всех пользователей |
| GET  | `/api/admin/payments` | История платежей |
| GET  | `/api/admin/stats` | Статистика |

---

## Добавление VLESS ключей в пул

```bash
curl -X POST http://localhost:5000/api/admin/add_key_to_pool \
  -H "Content-Type: application/json" \
  -H "X-Admin-Secret: мой_секрет" \
  -d '{"keys": ["vless://uuid@host:port?...", "vless://..."]}'
```

---

## Ручная выдача ключа (после YooMoney)

```bash
curl -X POST http://localhost:5000/api/admin/set_key \
  -H "Content-Type: application/json" \
  -H "X-Admin-Secret: мой_секрет" \
  -d '{"user_id": "123456789", "months": 1}'
```

Если `vless_key` не указан — ключ берётся из пула автоматически.

---

## Схема базы данных (SQLite)

**users** — пользователи  
**payments** — все платежи  
**keys_pool** — пул VLESS ключей  

---

## Деплой (пример с systemd)

```ini
# /etc/systemd/system/shinobu.service
[Unit]
Description=Shinobu Proxy API
After=network.target

[Service]
WorkingDirectory=/opt/shinobu-backend
EnvironmentFile=/opt/shinobu-backend/.env
ExecStart=/usr/bin/python3 app.py
Restart=always
User=www-data

[Install]
WantedBy=multi-user.target
```

```bash
systemctl enable shinobu && systemctl start shinobu
```
