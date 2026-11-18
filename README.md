# Usza Apiary – Headless E-Commerce Platform

> [English Version](#-english-version) | [Wersja Polska](#-wersja-polska)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38bdf8.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![WooCommerce](https://img.shields.io/badge/WooCommerce-REST_API_v3-96588a.svg?logo=woocommerce)](https://woocommerce.com/)
[![Vitest](https://img.shields.io/badge/Vitest-5.1-6E9F18.svg?logo=vitest)](https://vitest.dev/)
[![CI](https://github.com/kicpir99/pasieka-wedrowna-usza/actions/workflows/ci.yml/badge.svg)](https://github.com/kicpir99/pasieka-wedrowna-usza/actions/workflows/ci.yml)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900.svg?logo=leaflet)](https://leafletjs.com/)

---

# 🇬🇧 English Version

> Headless e-commerce storefront for the migratory apiary **Usza Apiary**, built with React 19, TypeScript, and Vite on top of a WordPress and WooCommerce REST API v3 backend.

## 🎯 Architecture & Project Overview

This project replaces a slow traditional WordPress theme with a React single-page application. Separating the storefront from the CMS keeps page navigation fast and lets us build custom interactive tools (such as the 360° jar viewer and parcel locker map), while store owners continue managing products, stock, and orders inside the standard WordPress and WooCommerce admin panel.

```
┌────────────────────────────────────────────────────────┐
│            Frontend: React 19 + Vite (SPA)             │
│   Tailwind CSS v4 • Lenis Smooth Scroll • GSAP 3       │
└──────────────────────────┬─────────────────────────────┘
                           │
                 HTTPS / REST API v3
              (Basic Auth / HMAC / CORS)
                           │
┌──────────────────────────▼─────────────────────────────┐
│          Backend: WordPress + WooCommerce v3           │
│     Custom Post Types • ACF Meta • Mailer Endpoints    │
└────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features & Engineering Highlights

### 1. Headless WooCommerce Engine
- **Two-way REST API integration (`/wp-json/wc/v3`):** fetches live product catalogs, categories, and stock levels, and submits orders directly via `POST /orders`.
- **Offline fallback & `localStorage` caching:** if the backend times out or is temporarily unreachable, the storefront falls back to cached snapshots in `localStorage` and local static data so browsing still works.
- **Weight variants & pricing:** parses jar size attributes (400g / 1200g) and recalculates line-item prices dynamically.

### 2. Checkout & Logistics
- **InPost Parcel Lockers (14,000+ points):**
  - Offline-searchable directory indexed by locker code, street, and city.
  - Interactive **Leaflet** + OpenStreetMap picker with custom SVG pins and viewport auto-centering.
- **Gross weight & parcel size calculator:** estimates total parcel weight (net honey mass, glass jar tare, and protective cardboard insert) to pick the right InPost locker size (A, B, or C).
- **Free shipping progress bar:** suggests add-on products when the cart is close to the 180 PLN free-delivery threshold.
- **B2B invoice support:** validates Polish NIP tax numbers according to Article 106e VAT rules and attaches invoice fields to WooCommerce order metadata.
- **1-Click reorder reminders:** optional email reminders every 30, 60, or 90 days when honey runs low.

### 3. Interactive Product Experience
- **360° jar viewer (`FramelessJar360Viewer`):**
  - Frame-sequence player with WebP preloading.
  - Sensory hotspots showing harvest metadata (diastase number, HMF content, water percentage, botanical origin).
  - Auto-rotates slowly when idle, pauses on drag or touch, and resumes after 2.5s.
- **Honey Finder Quiz (`HoneyFinderQuiz`):** short questionnaire matching taste preferences and intended use to specific honey varieties.
- **Honey Comparator (`ComparisonModal`):** side-by-side comparison of up to 3 honey varieties across sweetness, acidity, aroma intensity, and crystallization speed.

---

## 🛠️ Tech Stack

| Domain | Technology / Library | Role & Implementation |
|---|---|---|
| **Core** | React 19, TypeScript 5.8 | Component architecture, strict domain modeling |
| **Build & Tooling** | Vite 6.2, PostCSS | Fast HMR, code splitting, asset optimization |
| **Styling & UI** | Tailwind CSS v4, Lucide React | Utility-first styling, custom palette, SVG icons |
| **Motion & UX** | GSAP 3, Lenis | Scroll-triggered transitions, smooth scrolling |
| **GIS & Mapping** | Leaflet 1.9, OpenStreetMap | Parcel locker picking on interactive vector maps |
| **Backend & CMS** | WooCommerce REST API v3, WordPress | Headless inventory, order processing, ACF schema |
| **Testing & CI** | Vitest 5.1, GitHub Actions | Unit test suite (`src/__tests__/`), automated typecheck & build |
| **Deployment** | Apache / Nginx, GitHub Actions | CI/CD automation, `.htaccess` SPA fallback routing |

---

## 📁 Repository Structure

```text
├── .github/workflows/          # GitHub Actions CI pipeline (typecheck, tests, build)
├── public/
│   ├── .htaccess               # Apache mod_rewrite rules for SPA routing
│   ├── assets/                 # Optimized WebP assets, photography & caustics
│   ├── data/                   # Static InPost parcel locker points
│   └── frames/                 # 360-degree prerendered animation frames
├── scripts/                    # Automation utilities
│   └── sync_all_products_to_woocommerce.js  # Node.js batch sync with WooCommerce REST API
├── src/
│   ├── __tests__/              # Vitest unit tests (assets, http, storage, WooCommerce)
│   ├── components/             # Reusable UI modules (CartDrawer, InPostModal, 360Viewer)
│   ├── context/                # Global state stores (AuthContext, ProductContext)
│   ├── data/                   # Fallback datasets, sensory scales, harvest records
│   ├── hooks/                  # Custom React hooks (useDisplayResolution)
│   ├── pages/                  # Route views (ShopPage, ProductPage, CheckoutPage)
│   ├── services/               # REST API gateways (wooCommerceService, contactService)
│   ├── types.ts                # TypeScript strict interface contracts
│   └── utils/                  # Shared helpers & algorithms (assets, http, storage, tare, preloader)
├── .env.example                # Environment configuration template
└── vite.config.ts              # Vite bundler configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** `>= 20.x`
- **npm:** `>= 10.x`

### 1. Clone the repository
```bash
git clone https://github.com/kicpir99/pasieka-wedrowna-usza.git
cd pasieka-wedrowna-usza
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your WooCommerce REST API credentials, or leave them unset to run in offline fallback mode:
```env
VITE_WOOCOMMERCE_URL="https://your-domain.com"
VITE_WOOCOMMERCE_KEY="ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
VITE_WOOCOMMERCE_SECRET="cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
```

### 4. Run development server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 5. Verification & production build
```bash
# Type check without emitting files
npm run lint

# Run Vitest unit tests
npm test

# Compile optimized production bundle
npm run build
```

---

## 👤 Author

**Kacper Łamasz**  
- GitHub: [@kicpir99](https://github.com/kicpir99)  
- LinkedIn: [kacper-lamasz](https://www.linkedin.com/in/kacper-lamasz/)  
- Role: Junior Python / Fullstack Developer

<br />

---
---

<br />

# 🇵🇱 Wersja Polska

> Sklep internetowy typu headless dla dolnośląskiej pasieki wędrownej **Pasieka Usza**, zbudowany w React 19, TypeScript i Vite oraz zintegrowany z backendem WordPress i WooCommerce REST API v3.

## 🎯 Architektura i Założenia Projektu

Projekt powstał, aby zastąpić wolny, klasyczny motyw WordPress lekką aplikacją SPA w Reactcie. Oddzielenie warstwy prezentacji od CMS-a przyspiesza przejścia między stronami i pozwala budować niestandardowe widoki (np. podgląd słoików 360° czy mapę paczkomatów), a właściciele pasieki nadal zarządzają produktami i zamówieniami w znanym panelu WordPress / WooCommerce.

---

## ✨ Kluczowe Funkcjonalności

### 1. Headless WooCommerce Engine
- **Dwukierunkowa integracja REST API (`/wp-json/wc/v3`):** pobieranie katalogu produktów, kategorii i stanów magazynowych oraz wysyłanie nowych zamówień (`POST /orders`).
- **Fallback i cache w `localStorage`:** gdy backend nie odpowiada lub przekroczy limit czasu, aplikacja korzysta z zapisanej kopii w `localStorage` oraz lokalnych danych zapasowych, dzięki czemu sklep działa także offline.
- **Obsługa wariantów i gramatur:** mapowanie atrybutów wagowych (400g / 1200g) oraz przeliczanie cen pozycji w koszyku.

### 2. Checkout i Logistyka
- **Integracja InPost Paczkomaty 24/7:**
  - Wbudowana baza ponad 14 000 paczkomatów w Polsce z wyszukiwaniem po kodzie, ulicy i mieście.
  - Mapa oparta o **Leaflet** i OpenStreetMap z własnymi markerami i automatycznym centrowaniem.
- **Kalkulator gabarytów i wagi brutto:** szacowanie wagi paczki (masa miodu, szkło słoika i tekturowa tuba ochronna) w celu automatycznego doboru gabarytu skrytki (Gabaryt A / B / C).
- **Pasek darmowej dostawy:** podpowiedzi produktów pomagających uzupełnić koszyk do progu darmowej wysyłki (180 zł).
- **Obsługa B2B / Faktury VAT:** walidacja numeru NIP po stronie klienta oraz przekazywanie danych do faktury w metadanych zamówienia WooCommerce.
- **Przypomnienia 1-Click Reorder:** cykliczne przypomnienia e-mail o uzupełnieniu zapasów miodu (co 30, 60 lub 90 dni).

### 3. Komponenty Interaktywne
- **Wizualizator słoików 360° (`FramelessJar360Viewer`):**
  - Odtwarzacz sekwencji klatek WebP z wcześniejszym ładowaniem zasobów.
  - Interaktywne punkty sensoryczne z parametrami zbioru (liczba diastazowa, HMF, zawartość wody, pochodzenie botaniczne).
  - Powolny auto-obrót w spoczynku, zatrzymanie przy przeciągnięciu myszą lub dotykiem i wznowienie po 2,5 s.
- **Quiz doboru miodu (`HoneyFinderQuiz`):** krótka ankieta dopasowująca odmianę miodu do preferencji smakowych i zastosowania.
- **Komparator produktów (`ComparisonModal`):** zestawienie do 3 wybranych odmian miodu pod kątem słodyczy, kwasowości, intensywności aromatu i tempa krystalizacji.

---

## 🛠️ Stack Technologiczny

| Warstwa | Technologia / Biblioteka | Zastosowanie |
|---|---|---|
| **Core** | React 19, TypeScript 5.8 | Architektura komponentowa, ścisłe typowanie domenowe |
| **Build & Tooling** | Vite 6.2, PostCSS | HMR, optymalizacja chunków, kompresja assetów |
| **Styling** | Tailwind CSS v4, Lucide React | Utility-first styling, responsywny design, system ikon |
| **Animacje** | GSAP 3, Lenis | Płynny scroll (smooth scrolling), animacje wejść |
| **Mapy & GIS** | Leaflet 1.9, OpenStreetMap | Wybór paczkomatów na interaktywnej mapie wektorowej |
| **Backend / API** | WooCommerce REST API v3, WordPress Core | Zarządzanie bazą produktów, logistyką i zamówieniami |
| **Testy & CI** | Vitest 5.1, GitHub Actions | Testy jednostkowe (`src/__tests__/`), automatyczna weryfikacja PR/push |
| **Deployment** | Nginx / Apache, GitHub Actions | CI/CD pipeline, automatyczny build i routing SPA `.htaccess` |

---

## 🚀 Uruchomienie Lokalne

```bash
# Klonowanie repozytorium
git clone https://github.com/kicpir99/pasieka-wedrowna-usza.git
cd pasieka-wedrowna-usza

# Instalacja zależności
npm install

# Uruchomienie serwera deweloperskiego
npm run dev

# Weryfikacja typów, testy jednostkowe i build produkcyjny
npm run lint
npm test
npm run build
```

---

## 👤 Autor

**Kacper Łamasz**  
- GitHub: [@kicpir99](https://github.com/kicpir99)  
- LinkedIn: [kacper-lamasz](https://www.linkedin.com/in/kacper-lamasz/)  
- Portfolio: Junior Python / Fullstack Developer
