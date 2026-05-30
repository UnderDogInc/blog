# monorepo

Три фронтенд-приложения на Nuxt layers

| App              | Домен (prod)        | Dev port | Команда           |
|------------------|---------------------|----------|-------------------|
| Blog             | `blog.domain.com`   | 3000     | `pnpm dev:blog`   |
| Writer (админка) | `writer.domain.com` | 3001     | `pnpm dev:writer` |
| Resto (лендинг)  | `resto.domain.com`  | 3002     | `pnpm dev:resto`  |
| unknow (лендинг) | `*.domain.com`      | 300*     | `pnpm dev:*`      |

## Быстрый старт

```bash
pnpm install
cp .env.example .env
pnpm dev
```

## Структура

```
apps/
  blog/
  writer/
  resto/ 
layers/
  shared/    → UI, API-плагин, стили
  blog/      → публичный блог
  admin/     → админка 
  resto/     → лендинг
```

## Переменные окружения (.env)

### Frontend — один файл в корне репозитория

```
/blog/.env          ← сюда (скопируй из .env.example)
```

Все app читают `.env` из **корня monorepo** (`vite.envDir` указывает на корень).

| Переменная | Dev | Production                     |
|------------|-----|--------------------------------|
| `NUXT_PUBLIC_API_BASE` | `/api` | `https://api.domain.com/api`   |
| `NUXT_API_PROXY_TARGET` | `http://localhost:4000` | не нужен                       |
| `NUXT_PUBLIC_BLOG_URL` | `http://localhost:3000` | `https://blog.domain.com`   |
| `NUXT_PUBLIC_WRITER_URL` | `http://localhost:3001` | `https://writer.domain.com` |
| `NUXT_PUBLIC_SITE_URL` | см. ниже | canonical URL текущего app     |

`NUXT_PUBLIC_SITE_URL` при деплое задаётся **для каждого app отдельно** (в CI или `.env` на сервере):

- blog → `https://blog.domain.com`
- writer → `https://writer.domain.com`
- resto → `https://resto.domain.com`

## API в dev

```
Браузер → http://localhost:3001/api/session/login
              ↓ (Nuxt devProxy)
         http://localhost:4000/api/session/login
```

По умолчанию `NUXT_PUBLIC_API_BASE=/api` — не меняй на `http://localhost:4000/api` в dev, иначе writer/blog на других портах получат CORS-ошибку.

## Форма обратной связи (Nuxt server + SMTP)

Отправка заявок на почту через **Nitro** (`layers/shared/server/api/contact.post.ts`). Nest и отдельный backend не нужны — SMTP-настройки читаются из `.env` в корне monorepo.

```
Браузер → POST /api/contact
              ↓ (Nuxt Nitro)
         nodemailer → SMTP → NUXT_CONTACT_TO
```

**Важно:** `devProxy` на Nest есть только у blog/writer. Лендинги с формой (resto и новые) **не должны** проксировать `/api` — иначе запросы уйдут на `:4000` вместо Nitro.

---

### Подключение к новому layer

Пример: лендинг `food-man` на `food.domain.com`.

#### 1. Layer с UI

```
layers/food-man/
  app/
    pages/index.vue      ← форма
  nuxt.config.ts
```

`layers/food-man/nuxt.config.ts` — имя сайта в теме письма:

```ts
export default defineNuxtConfig({
  layer: { meta: { name: 'food-man-layer' } },
  runtimeConfig: {
    contactForm: {
      siteName: 'Food-man'
    }
  }
})
```

#### 2. App-обёртка

```
apps/food-man/
  nuxt.config.ts
  tsconfig.json          ← extends ./.nuxt/tsconfig.json
```

`apps/food-man/nuxt.config.ts`:

```ts
import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  extends: ['../../layers/shared', '../../layers/food-man'],
  devtools: { enabled: process.env.NODE_ENV === 'development' },

  vite: {
    envDir: fileURLToPath(new URL('../..', import.meta.url)),
    cacheDir: fileURLToPath(new URL('./.cache/vite', import.meta.url))
  },

  runtimeConfig: {
    public: {
      app: 'food-man',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api'
    }
  }
})
```

**Не добавляй** `nitro.devProxy` — форма обрабатывается самим Nuxt.

#### 3. Скрипты в корневом `package.json`

```json
"dev:food-man": "nuxt dev apps/food-man --port 3003",
"build:food-man": "nuxt build apps/food-man",
"preview:food-man": "nuxt preview apps/food-man --port 3003"
```

И пункт в `scripts/app-picker.mjs` / `scripts/lib/picker.mjs`, если нужно меню `pnpm dev`.

#### 4. Форма во Vue

Composable `useContactForm` auto-importится из `layers/shared`:

```vue
<script setup lang="ts">
const {
  name,
  phone,
  email,
  message,       // опционально
  honeypot,      // антиспам, скрытое поле
  isLoading,
  isSuccess,
  isError,
  submit
} = useContactForm()
</script>

<template>
  <form @submit.prevent="submit">
    <!-- honeypot: скрытое поле, боты заполнят — письмо не уйдёт -->
    <input
      v-model="honeypot"
      type="text"
      name="_gotcha"
      tabindex="-1"
      autocomplete="off"
      aria-hidden="true"
      style="position: absolute; left: -9999px; opacity: 0"
    >
    <input v-model="name" type="text" required :disabled="isLoading">
    <input v-model="phone" type="tel" required :disabled="isLoading">
    <input v-model="email" type="email" required :disabled="isLoading">
    <textarea v-model="message" :disabled="isLoading" />
    <button type="submit" :disabled="isLoading">Отправить</button>
    <p v-if="isSuccess">Заявка отправлена</p>
    <p v-if="isError">Ошибка, попробуйте позже</p>
  </form>
</template>
```

Эндпоинт: `POST /api/contact`

```json
{ "name": "Иван", "phone": "+79991234567", "email": "ivan@example.com", "message": "..." }
```

Ответ при успехе: `{ "ok": true }`.

Живой пример: `layers/resto` + `apps/resto`.

---

### Переменные окружения (форма)

Добавь в `.env` в **корне репозитория** (см. `.env.example`):

| Переменная | Описание |
|------------|----------|
| `NUXT_CONTACT_SMTP_HOST` | SMTP-хост (`smtp.yandex.ru`, `smtp.mail.ru`) |
| `NUXT_CONTACT_SMTP_PORT` | `465` (SSL) или `587` (STARTTLS) |
| `NUXT_CONTACT_SMTP_SECURE` | `false` для порта 587 |
| `NUXT_CONTACT_SMTP_USER` | логин SMTP |
| `NUXT_CONTACT_SMTP_PASS` | пароль приложения |
| `NUXT_CONTACT_TO` | получатель (по умолчанию) |
| `NUXT_CONTACT_FROM` | адрес From (по умолчанию = SMTP user) |
| `NUXT_CONTACT_FROM_NAME` | имя отправителя в письме |
| `NUXT_CONTACT_SITE_NAME` | fallback темы, если не задано в layer |

Имя в теме письма берётся из `runtimeConfig.contactForm.siteName` layer'а → `[RestoPro] Новая заявка`.

**mail.ru (порт 587):**

```env
NUXT_CONTACT_SMTP_HOST=smtp.mail.ru
NUXT_CONTACT_SMTP_PORT=587
NUXT_CONTACT_SMTP_SECURE=false
NUXT_CONTACT_SMTP_USER=bot@mail.ru
NUXT_CONTACT_SMTP_PASS=app-password
NUXT_CONTACT_TO=your@mail.ru
NUXT_CONTACT_FROM=bot@mail.ru
NUXT_CONTACT_FROM_NAME=My Bot
```

---

### Dev

```bash
cp .env.example .env
pnpm dev:resto
```

Проверка без UI:

```bash
curl -X POST http://localhost:3002/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Тест","phone":"+79991234567","email":"test@example.com"}'
# → {"ok":true}
```

Preview (prod-сборка локально):

```bash
pnpm build:resto
pnpm preview:resto
```

---

### Production

Каждый лендинг с формой — **отдельный Nuxt-процесс** со своим доменом. SMTP-переменные задаются на сервере (не коммить в git).

#### 1. Сборка

```bash
pnpm install
pnpm build:resto    # или build:food-man
```

Артефакт: `apps/resto/.output/`

#### 2. Env на сервере

```env
NUXT_PUBLIC_SITE_URL=https://resto.domain.com
NUXT_PUBLIC_API_BASE=/api

NUXT_CONTACT_SMTP_HOST=smtp.mail.ru
NUXT_CONTACT_SMTP_PORT=587
NUXT_CONTACT_SMTP_SECURE=false
NUXT_CONTACT_SMTP_USER=domain_bot@mail.ru
NUXT_CONTACT_SMTP_PASS=***
NUXT_CONTACT_TO=your@mail.ru
NUXT_CONTACT_FROM=domain_bot@mail.ru
NUXT_CONTACT_FROM_NAME=YourName
```

#### 3. Запуск

```bash
PORT=3002 node apps/domain/.output/server/index.mjs
```

Или через systemd / PM2:

```bash
PORT=3002 NITRO_HOST=127.0.0.1 node apps/domain/.output/server/index.mjs
```

#### 4. Nginx (reverse proxy)

```nginx
server {
  server_name domain.com;

  location / {
    proxy_pass http://127.0.0.1:3002;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

`POST https://domain.com/api/contact` обрабатывает Nitro на том же процессе

#### 5. Несколько лендингов

| App | Домен | Порт | `contactForm.siteName` |
|-----|-------|------|------------------------|
| resto | `1.domain.com` | 3002 | RestoPro |
| food-man | `2.domain.com` | 3003 | Food-man |

SMTP (`NUXT_CONTACT_*`) может быть общим для всех — в письме будет разный `[siteName]` и поле «Источник» (`runtimeConfig.public.app`).

---

## Скрипты

```bash
pnpm dev              # меню: blog / writer / resto / all
pnpm dev:blog
pnpm dev:writer
pnpm dev:resto

pnpm build            # меню сборки
pnpm build:blog
pnpm build:writer
pnpm build:resto
```

## Production (blog / writer)

```bash
pnpm build:blog
node apps/blog/.output/server/index.mjs

pnpm build:writer
PORT=3001 node apps/writer/.output/server/index.mjs
```

Blog и writer проксируют `/api` на Nest-backend — см. раздел «API в dev». Для лендингов с формой — раздел «Форма обратной связи → Production».

---

## PM2 (production)

Конфиг: `ecosystem.config.cjs` — три процесса после `pnpm build`:

| PM2 name | App | Порт | Nginx → |
|----------|-----|------|---------|
| `rassvet-blog` | blog | 3000 | `blog.domain.com` |
| `rassvet-writer` | writer | 3001 | `writer.domain.com` |
| `rassvet-resto` | resto | 3002 | `resto.domain.com` |

### Первый запуск на сервере

```bash
pnpm install
cp .env.example .env          # SMTP, API, site URLs
pnpm build                    # или pnpm build:blog && ...

# глобально: npm i -g pm2
pnpm pm2:start                # поднять все три app
pnpm pm2:status
pnpm pm2:logs
```

Сборка + старт одной командой:

```bash
pnpm prod
```

### Управление

```bash
pnpm pm2:restart    # перезапуск всех
pnpm pm2:reload     # zero-downtime reload
pnpm pm2:stop
pnpm pm2:delete     # убрать из pm2

# один app:
pm2 restart rassvet-resto
pm2 logs rassvet-blog
```

### Env

Общий `.env` в корне подхватывается через `env_file` (SMTP, API и т.д.).

У каждого app свой `NUXT_PUBLIC_SITE_URL` — задаётся в `ecosystem.config.cjs` из переменных:

```env
NUXT_PUBLIC_BLOG_SITE_URL=https://blog.domain.com
NUXT_PUBLIC_WRITER_SITE_URL=https://writer.domain.com
NUXT_PUBLIC_RESTO_SITE_URL=https://resto.domain.com
```

После изменения `.env` или ecosystem:

```bash
pnpm pm2:restart
```

### Автозапуск после reboot

```bash
pm2 save
pm2 startup    # выполни команду, которую выведет pm2
```

### Добавить новый лендинг

1. `pnpm build:food-man`
2. Добавь в `ecosystem.config.cjs`:

```js
nuxtApp('food-man', 3003, {
  NUXT_PUBLIC_SITE_URL: process.env.NUXT_PUBLIC_FOOD_MAN_SITE_URL
})
```

3. `pm2 start ecosystem.config.cjs --only rassvet-food-man`

Логи PM2: `logs/pm2/` (в `.gitignore`).

### Nginx

Шаблоны vhost: `deploy.example/nginx/` (в git). Рабочие конфиги — локально:

```bash
cp -R deploy.example deploy   # один раз на машине / сервере
# правь deploy/nginx/*.conf под себя — папка deploy/ в .gitignore
```
