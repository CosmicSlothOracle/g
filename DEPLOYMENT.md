# Deployment-Anleitung: MathMaster Neun

## Netlify Deployment

### Voraussetzungen

1. **Netlify Account** (kostenlos auf netlify.com)
2. **GitHub Repository** mit dem Code
3. **Gemini API Key** (für KI-Tutor)

### Schritt 1: Repository mit Netlify verbinden

1. Gehe zu [Netlify Dashboard](https://app.netlify.com)
2. Klicke auf "Add new site" → "Import an existing project"
3. Wähle GitHub und autorisiere Netlify
4. Wähle dein Repository aus

### Schritt 2: Build-Einstellungen

Netlify erkennt automatisch die `netlify.toml` Datei. Falls nicht, setze manuell:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: `20` (wird in `netlify.toml` gesetzt)

### Schritt 3: Environment Variables

Setze folgende Environment Variables im Netlify Dashboard:

1. **GEMINI_API_KEY**: Dein Google Gemini API Key
   - Gehe zu: Site settings → Environment variables
   - Füge hinzu: `GEMINI_API_KEY` = `dein-api-key`

2. **NETLIFY_BLOB_TOKEN**: Wird automatisch von Netlify generiert
   - Wird automatisch in Functions verfügbar gemacht
   - Keine manuelle Konfiguration nötig

### Schritt 4: Netlify Blobs aktivieren

1. Gehe zu: Site settings → Functions
2. Aktiviere "Netlify Blobs" (falls noch nicht aktiviert)
3. Der Token wird automatisch als `NETLIFY_BLOB_TOKEN` verfügbar gemacht

### Schritt 5: Analytics aktivieren (Optional)

1. Gehe zu: Site settings → Analytics
2. Aktiviere "Netlify Analytics" (kostenlos für kleine Projekte)
3. Du siehst dann Traffic-Statistiken im Dashboard

### Schritt 6: Deployment

1. Netlify deployt automatisch bei jedem Push zu `main`
2. Oder klicke auf "Trigger deploy" → "Deploy site"
3. Warte auf Build-Abschluss (ca. 2-3 Minuten)

### Schritt 7: Custom Domain (Optional)

1. Gehe zu: Site settings → Domain management
2. Klicke auf "Add custom domain"
3. Folge den DNS-Anweisungen

## Lokale Entwicklung

### Development-Modus

Die App nutzt automatisch `localStorage` im Development-Modus:

```bash
npm run dev
```

### Production-Test lokal

Um Netlify Functions lokal zu testen:

```bash
npm install -g netlify-cli
netlify dev
```

Dies startet:
- Frontend auf `http://localhost:8888`
- Netlify Functions auf `http://localhost:8888/.netlify/functions/`

## Troubleshooting

### Functions funktionieren nicht

- Prüfe, ob `NETLIFY_BLOB_TOKEN` in den Functions verfügbar ist
- Prüfe die Function-Logs im Netlify Dashboard
- Stelle sicher, dass `@netlify/blobs` installiert ist: `npm install @netlify/blobs`

### Build-Fehler

- Prüfe Node-Version (sollte 20 sein)
- Prüfe ob alle Dependencies installiert sind: `npm install`
- Prüfe die Build-Logs im Netlify Dashboard

### Analytics zeigt keine Daten

- Warte 24 Stunden (Analytics aktualisiert täglich)
- Prüfe ob Analytics im Dashboard aktiviert ist
- Custom Events werden in `analytics/events` Blob gespeichert

## Daten-Migration

### Von localStorage zu Netlify Blobs

Beim ersten Deployment werden keine Daten migriert. Alle User starten neu.

Falls du bestehende Daten migrieren möchtest:

1. Exportiere Daten aus localStorage (Browser DevTools)
2. Erstelle ein Migration-Script in `netlify/functions/migrate.ts`
3. Führe es einmalig aus

## Monitoring

### Netlify Dashboard

- **Functions**: Zeigt Aufrufe, Fehler, Latenz
- **Analytics**: Zeigt Traffic, Top Pages, Referrer
- **Logs**: Zeigt Function-Logs und Errors

### Custom Analytics

Die `analytics.ts` Function sammelt:
- Quest-Completions
- Battle-Wins/Losses
- Shop-Purchases
- Coin-Transactions

Zugriff via: `GET /.netlify/functions/analytics`

## Kosten

- **Netlify Free Tier**:
  - 100 GB Bandwidth/Monat
  - 300 Build Minutes/Monat
  - 125k Function Invocations/Monat
  - 1 GB Blob Storage

Für kleine bis mittlere Projekte völlig ausreichend!

