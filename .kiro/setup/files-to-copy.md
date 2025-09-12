# 📂 Dateien für GitHub Upload

## Hauptdateien (WICHTIG):
```
✅ flightstat-bot.html                    ← Die Haupt-App
✅ README.md                              ← Beschreibung für GitHub
```

## .kiro Ordner (KOMPLETT kopieren):
```
✅ .kiro/
   ├── specs/
   │   └── flightstat-bot/
   │       ├── requirements.md
   │       ├── design.md
   │       └── tasks.md
   ├── quality/
   │   ├── feature-registry.json
   │   ├── feature-validator.js
   │   ├── quality-gates.js
   │   ├── rollback-system.js
   │   └── FORWARD-ONLY-DEVELOPMENT.md
   ├── monitoring/
   │   └── performance-monitor.js
   ├── analytics/
   │   └── ux-tracker.js
   ├── testing/
   │   ├── jest-unit-tests.js
   │   ├── ci-test-runner.js
   │   └── visual-regression-tests.js
   ├── automation/
   │   ├── continuous-monitor.js
   │   └── setup-github-automation.md
   ├── backups/
   │   ├── flightstat-bot-golden-master.html
   │   └── flightstat-bot-golden-master-backup.html
   └── setup/
       ├── github-setup-guide.md
       ├── upload-to-github.bat
       └── files-to-copy.md
```

## .github Ordner (WICHTIG für Automatisierung):
```
✅ .github/
   └── workflows/
       └── quality-assurance.yml
```

## Zusätzliche Dateien (falls vorhanden):
```
✅ .gitignore                             ← Git-Konfiguration
✅ package.json                           ← Falls vorhanden
```

## NICHT kopieren:
```
❌ node_modules/                          ← Falls vorhanden
❌ .git/                                  ← Wird automatisch erstellt
❌ Temporäre Dateien (.tmp, .log, etc.)
```

## Einfache Kopiermethode:
1. Öffne deinen aktuellen Projekt-Ordner: `C:\Users\XyZ\Documents\PROJECT FLIGHTSTAT BOT`
2. Markiere ALLE Dateien und Ordner (Strg+A)
3. Kopiere sie (Strg+C)
4. Gehe zum GitHub-Ordner: `C:\Users\XyZ\Documents\GitHub\flightstat-bot`
5. Füge sie ein (Strg+V)

## Überprüfung:
Nach dem Kopieren solltest du im GitHub-Ordner sehen:
- ✅ flightstat-bot.html
- ✅ README.md
- ✅ .kiro/ Ordner
- ✅ .github/ Ordner
- ✅ Alle anderen Projekt-Dateien