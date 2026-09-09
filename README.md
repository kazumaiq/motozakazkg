# MotoZakazKG

Коммерческий сайт MotoZakazKG — подбор, проверка, покупка на японских аукционах и доставка мотоциклов в Кыргызстан.

## Stack

- React
- Vite
- JavaScript/JSX
- CSS с локальными design tokens

## Local development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Deployment

Проект разворачивается как Vite SPA. Для Vercel используется `vercel.json` с fallback на `index.html`.

## Project structure

- `src/components` — переиспользуемые UI-компоненты;
- `src/pages` — каталоги, карточка мотоцикла, калькулятор и аукционы;
- `src/services` — repository/provider слой данных;
- `src/config` — контакты и параметры расчёта;
- `src/styles` — page-specific styles;
- `public/assets` — изображения бренда и мотоциклов.

## Data layer

Каталог и аукционные страницы сейчас используют локальный provider-слой. `AuctionProvider` отделяет интерфейс каталога от источника данных и готов к подключению серверного провайдера без переписывания страниц.

## Environment variables

Текущая клиентская сборка не требует секретных environment variables. Секреты и ключи внешних сервисов не хранятся в репозитории.
