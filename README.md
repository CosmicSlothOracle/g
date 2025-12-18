# MathMaster Neun - Architektur & Dokumentation

Diese Plattform ist eine hochmoderne Lernumgebung für Geometrie (9. Klasse), die auf eine schnelle Skalierung und Backend-Integration vorbereitet ist.

## 🏗 Architektur

Die Anwendung folgt dem **Service-Layer-Pattern**, um die Geschäftslogik von der UI (React) zu trennen.

### 1. Frontend (UI Layer)

- **React 19**: Nutzt moderne Hooks (`useMemo`, `useRef`, `useState`) für ein flüssiges Erlebnis.
- **Tailwind CSS**: Für ein responsives "High-End" Design mit Glasmorphismus-Effekten.
- **Gemini API**: Integrierter KI-Tutor für kontextuelle Tipps ohne direktes Vorsagen der Lösung.

### 2. Service Layer (Hybrid Backend)

Alle API-Aufrufe sind in `services/` gekapselt und geben `Promises` zurück.

- **AuthService**: Handhabt Login/Logout. Unterstützt `localStorage` (Development) und Netlify Functions (Production).
- **DataService**: Synchronisiert User-Fortschritt (XP, Coins, Quests).
- **SocialService**: Verwaltet das Leaderboard, den Chat und das **Math Battle System**.
- **Logger**: Zeichnet alle kritischen Aktionen (Quest-Erfolg, Käufe, Battles) auf und sendet sie optional an Analytics.

### 3. Math Battle System ✅ VOLLSTÄNDIG IMPLEMENTIERT

Ein kompetitives Feature, das Schüler motiviert:

- **Herausforderung**: Über das Leaderboard können andere User (oder Bots) zum Duell gefordert werden.
- **UI**: Vollständige BattleView-Komponente mit VS-Screen, Timer (20s pro Aufgabe), Score-Tracking.
- **Einsatz**: 100 Coins werden automatisch gesetzt. Bei Sieg: +100 Coins, +300 XP. Bei Niederlage: -100 Coins.
- **Siegbedingungen**:
  1. Anzahl korrekter Antworten (höchste Priorität).
  2. Perfekter Score (Tie-Breaker bei gleicher Korrektheit).
- **Bot-System**: Drei Bots mit unterschiedlichen Schwierigkeitsgraden (bot1: 3, bot2: 4, bot3: 5 korrekte Antworten).

## 🚀 Deployment & Backend-Integration

### Netlify Deployment (Empfohlen)

Die App ist **bereit für Production** mit Netlify Functions und Netlify Blobs.

#### Setup-Schritte:

1. **Netlify Account erstellen** und Repository verbinden
2. **Environment Variables setzen:**
   - `NETLIFY_BLOB_TOKEN` (wird automatisch von Netlify generiert)
   - `GEMINI_API_KEY` (für KI-Tutor)
3. **Build-Konfiguration:**
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Node Version: `20`

#### Netlify Functions:

Die folgenden Functions sind bereits implementiert:

- `netlify/functions/users.ts` - User-Management
- `netlify/functions/chat.ts` - Chat-Nachrichten
- `netlify/functions/battles.ts` - Battle-System
- `netlify/functions/leaderboard.ts` - Leaderboard
- `netlify/functions/analytics.ts` - Event-Logging

#### Daten-Persistenz:

- **Netlify Blobs**: Key-Value Store für User-Daten, Chat, Battles
- **Automatischer Fallback**: In Development nutzt die App weiterhin `localStorage`
- **Hybrid-Modus**: `services/apiService.ts` erkennt automatisch die Umgebung

#### Analytics:

- **Netlify Analytics**: Integriert, zeigt Traffic-Übersicht (Page Views, Unique Visitors)
- **Custom Events**: Optional via `analytics.ts` Function (Quest-Completions, Battles, Shop-Käufe)

### Migration von localStorage zu Netlify:

Die App nutzt automatisch Netlify Functions in Production (`import.meta.env.PROD`).
In Development bleibt `localStorage` aktiv für schnelles Testen.

## 🛠 Features

- **Quest Map**: Strukturierter Lernpfad nach Lehrplan (6 Lern-Einheiten).
- **Spickzettel**: Kontextueller Splitscreen-Modus während Quests (vollständig mit allen Formeln).
- **KI-Tutor**: Intelligente Hilfestellungen via **Gemini 3 Flash Preview** (keine direkten Lösungen).
- **Shop**: Gamification durch Avatare und visuelle Effekte (Dark Mode, Rainbow, etc.).
- **Math Battle**: Vollständiges PvP-System mit Bots, Coin-Einsatz und Leaderboard-Integration.
- **Chat-System**: Live Community Feed mit System-Events.
- **Progress-System**: 35 Level mit kreativen Namen, XP-basiert.
