# GitHub Setup & Deployment Checklist

## 1. GitHub Authentifizierung

### Option A: Personal Access Token (Empfohlen)
1. Gehe zu: https://github.com/settings/tokens
2. Klicke auf "Generate new token (classic)"
3. Wähle Scopes: `repo` (vollständiger Zugriff auf private Repositories)
4. Kopiere den Token

### Option B: GitHub CLI (Einfacher)
```bash
# Installiere GitHub CLI falls nicht vorhanden
winget install GitHub.cli

# Authentifiziere dich
gh auth login
```

## 2. Git Remote Setup & Push

```bash
cd c:\Users\skank\Pictures\mathe_fun

# Prüfe ob Repository initialisiert ist
git status

# Falls nicht initialisiert:
git init
git add .
git commit -m "Initial commit: MathMaster Neun"

# Setze Remote (falls noch nicht gesetzt)
git remote add origin https://github.com/CosmicSlothOracle/Rule_in_School.git

# Oder ändere bestehenden Remote:
git remote set-url origin https://github.com/CosmicSlothOracle/Rule_in_School.git

# Prüfe Remote
git remote -v

# Setze Branch auf main
git branch -M main

# Push zu GitHub
git push -u origin main --force
```

**Wenn Authentifizierung benötigt wird:**
- Bei HTTPS: Benutzername = `CosmicSlothOracle`, Passwort = Personal Access Token
- Oder verwende: `gh auth login` für automatische Authentifizierung

## 3. Netlify Deployment Check

### ✅ Prüfliste:

- [x] `netlify.toml` vorhanden
- [x] `package.json` mit Build-Script
- [x] `dist/` im .gitignore (wird beim Build erstellt)
- [x] Netlify Functions vorhanden (`netlify/functions/`)
- [x] Environment Variables benötigt: `GEMINI_API_KEY`

### Netlify Setup:

1. **Netlify Account**: https://app.netlify.com
2. **Neues Site erstellen**:
   - "Add new site" → "Import an existing project"
   - GitHub auswählen → `Rule_in_School` Repository
3. **Build Settings** (automatisch erkannt):
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **Environment Variables**:
   - `GEMINI_API_KEY` = dein API-Key
5. **Deploy!**

### Lokaler Test:
```bash
npm install
npm run build
# Prüfe ob dist/ Ordner erstellt wurde
```

