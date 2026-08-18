# 🍕 Qido Pizza — интернет-магазин пиццы

Полнофункциональный интернет-магазин пиццы на **Next.js 14 (App Router)** с онлайн-заказом, корзиной, аутентификацией и оплатой.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-blueviolet?logo=postgresql)
![NextAuth](https://img.shields.io/badge/Auth-NextAuth.js-green)
![Tailwindcss](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css)

---

## ✨ Возможности

- 🧭 **Каталог товаров** — категории, товары, поиск товаров
- 🔍 **Фильтрация** — по размерам, типу теста, ингредиентам
- 🛒 **Корзина** — работает как для авторизованных, так и для гостей
- 👤 **Аутентификация** — регистрация по email/паролю, OAuth авторизация через **GitHub** и **Google**, верификация email через письмо с кодом
- 💳 **Оплата** — интеграция с **ЮKassa**: создание платежа и приём вебхук-колбэка о статусе заказа
- 📦 **Оформление заказа** — форма с валидацией (**Zod** + **React Hook Form**), маска телефона, автодополнение адреса через **DaData**
- 📧 **Email-уведомления** — письма о подтверждении аккаунта и статусе заказа (**Resend** + **React Email**)
- 🖼️ **Stories** — лента сторис (react-insta-stories)
- 🪟 **Модалка товара** — Intercepting Routes Next.js
- ⚡ **Серверный рендер** — фильтры и данные каталога читаются из URL и рендерятся на сервере
- 🎨 **UI** — shadcn/ui-компоненты, тосты (react-hot-toast), лоадер страниц (nextjs-toploader)

## 🛠 Стек технологий

| Область | Технология | Зачем используется |
| --- | --- | --- |
| Фреймворк | **Next.js 14 (App Router)** | Серверные компоненты, route handlers, параллельные роуты |
| Язык | **TypeScript** | Типизация всего приложения |
| База данных | **PostgreSQL + Prisma** | Схема БД, миграции (`db push`), сиды с тестовыми данными |
| Авторизация | **NextAuth.js (v4)** | Сессии, JWT-стратегия, провайдеры Credentials / GitHub / Google, hash паролей через bcrypt |
| Платежи | **ЮKassa (YooMoney API)** | Создание платежа по API и обработка платёжного вебхука |
| Email | **Resend + React Email (@react-email/components)** | HTML-письма верификации и уведомления о заказе |
| Состояние | **Zustand** | Глобальные сторы |
| Формы | **React Hook Form + Zod + @hookform/resolvers** | Валидация форм |
| UI | **shadcn/ui** | Готовые настраиваемые компоненты |
| Стили | **Tailwind CSS** | Готовые CSS классы |
| HTTP клиент | **Axios** | API-клиент на стороне браузера, автоматическое преобразование в JSON |
| Адреса | **react-dadata (DaData API)** | Автодополнение адресов доставки |
| Маски ввода | **react-imask** | Форматирование номера телефона |
| Stories | **react-insta-stories** | Сторис-плеер на главной странице |
| Тосты / лоадер | **react-hot-toast, nextjs-toploader** | Уведомления и индикатор перехода между страницами |
| Утилиты | **react-use** | Готовые хуки для работа с localStorage, debounce, media query и т.д. |

## 📁 Структура проекта

```
src/
├── app/
│   ├── (home)/            # Главная, профиль, страница товара
│   ├── (checkout)/        # Оформление заказа
│   ├── (dashboard)/       # Дашборд админа
│   └── api/               # Route handlers
├── shared/
│   ├── components/        # UI и переиспользуемые компоненты
│   ├── constants/         # Конфиги, настройки
│   ├── hooks/             # Кастомные React-хуки
│   ├── lib/               # Расчёт корзины/цены, платёж ЮKassa, отправка email и прочие утилиты
│   ├── services/          # API-клиент и сервисы для запросов к БД
│   └── store/             # Zustand-сторы
├── prisma/
│   ├── schema.prisma      # Описание сущностей БД
│   └── seed.ts            # Заполнение БД тестовыми данными
```

## 🚀 Запуск проекта

### Требования

- **Node.js 18+**
- **PostgreSQL** (локальный или облачный — например, Vercel Postgres / Neon / Railway)
- Менеджер пакетов **pnpm** (в проекте зафиксирован `pnpm@9.5.0` через `packageManager`)

### Шаги

1. **Клонировать репозиторий**

   ```bash
   git clone https://github.com/ArtMedici/next-qido-pizza-shop.git
   cd next-qido-pizza-shop
   ```

2. **Установить зависимости**

   ```bash
   pnpm install
   ```

3. **Настроить окружение** — скопировать пример и заполнить значения

   ```bash
   cp .env.example .env
   ```

   | Переменная | Зачем нужна |
   | --- | --- |
   | `POSTGRES_URL`, `POSTGRES_URL_NON_POOLING` | Строка подключения PostgreSQL |
   | `HOMEPAGE_URL` | Базовый URL приложения |
   | `NEXTAUTH_SECRET` | Секрет NextAuth — сгенерировать: `openssl rand -base64 32` |
   | `GITHUB_ID`, `GITHUB_SECRET` | OAuth GitHub |
   | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | OAuth Google |
   | `RESEND_API_KEY` | Ключ Resend для отправки писем |
   | `YOOKASSA_STORE_ID`, `YOOKASSA_API_KEY`, `YOOKASSA_CALLBACK_URL` | Данные ЮKassa для теста оплаты |
   | `DADATA_API_KEY` | Ключ DaData для автодополнения адресов |

4. **Создать схему БД и заполнить данными**

   ```bash
   pnpm prisma:push
   pnpm prisma:seed
   ```

5. **Запустить dev-сервер**

   ```bash
   pnpm dev
   ```

   Открыть [http://localhost:3000](http://localhost:3000) 🎉

### Продакшен-сборка

```bash
pnpm build && pnpm start
```
