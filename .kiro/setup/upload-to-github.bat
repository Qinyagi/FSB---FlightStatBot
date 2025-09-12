@echo off
echo 🚀 FlightStat Bot - GitHub Upload Script
echo ========================================
echo.
echo Dieses Script hilft dir beim Upload zu GitHub
echo.

REM Prüfe ob Git installiert ist
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git ist nicht installiert!
    echo Bitte installiere Git von: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo ✅ Git ist installiert
echo.

REM Frage nach GitHub Repository URL
set /p REPO_URL="Gib deine GitHub Repository URL ein (z.B. https://github.com/username/flightstat-bot.git): "

if "%REPO_URL%"=="" (
    echo ❌ Keine URL eingegeben!
    pause
    exit /b 1
)

echo.
echo 📁 Initialisiere Git Repository...
git init

echo 📝 Füge alle Dateien hinzu...
git add .

echo 💾 Erstelle ersten Commit...
git commit -m "Initial commit: FlightStat Bot with Quality Assurance System"

echo 🔗 Verbinde mit GitHub Repository...
git branch -M main
git remote add origin %REPO_URL%

echo 🚀 Lade Dateien zu GitHub hoch...
git push -u origin main

if errorlevel 1 (
    echo.
    echo ❌ Upload fehlgeschlagen!
    echo Mögliche Lösungen:
    echo 1. Prüfe deine GitHub-Anmeldedaten
    echo 2. Stelle sicher, dass das Repository existiert
    echo 3. Prüfe deine Internetverbindung
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Upload erfolgreich!
echo.
echo 🎉 Deine FlightStat Bot App ist jetzt auf GitHub!
echo.
echo Nächste Schritte:
echo 1. Gehe zu deinem GitHub Repository
echo 2. Aktiviere GitHub Pages in den Settings
echo 3. Deine App wird verfügbar unter: https://USERNAME.github.io/flightstat-bot/
echo.
pause