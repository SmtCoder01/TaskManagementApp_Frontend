# Task Management UI

React + Vite + TypeScript + Tailwind CSS frontend.

## Proje yapısı

```
src/
├── api/           # HTTP client ve response yardımcıları
├── components/    # Paylaşılan UI ve layout bileşenleri
│   ├── layout/
│   └── ui/
├── features/      # Domain modülleri (auth, members, workspaces)
├── lib/           # React Query, query key'ler
├── pages/         # Route sayfaları
└── types/         # Paylaşılan TypeScript tipleri
public/            # Statik dosyalar (favicon, görseller)
```

## Hızlı başlangıç

```bash
npm install
cp .env.example .env   # Windows: copy .env.example .env
npm run dev
```

Backend'in https://localhost:7052 adresinde çalıştığından emin olun.
