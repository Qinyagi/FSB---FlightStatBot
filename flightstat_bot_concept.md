# FlightStat Bot - Granulares Entwicklungskonzept

**Ziel:** HTML5 Standalone WebApp für PC-Desktop (alle Monitorgrößen/Auflösungen 2025) - Live-Monitor für spezifischen Zielflughafen mit Google Flights-ähnlicher Detailverfolgung.

## 1. Technische Grundarchitektur

### 1.1 Plattform & Kompatibilität
- **Format:** Einzelne HTML5-Datei mit eingebettetem CSS/JavaScript
- **Browser:** Brave, Vivaldi, Chrome, Firefox, Edge (2025 Standards)
- **Auflösungen:** 1280px bis 4K (3840px) responsive
- **Offline:** Nur UI-Funktionen, API-abhängig für Live-Daten

### 1.2 Technologie-Stack
- **Frontend:** HTML5, CSS3 Grid/Flexbox, Vanilla JavaScript ES2025
- **APIs:** FlightAware AeroAPI (primär), API Ninjas (Flughafen-DB)
- **CORS-Handling:** Integrierter Proxy (`api.allorigins.win/raw`) im Quellcode
- **Speicherung:** LocalStorage für Persistierung, Session-Management

## 2. Datenarchitektur

### 2.1 Spaltenstruktur (finale Reihenfolge)
| Nr | Spalte | Quelle | Typ | Beschreibung |
|---|---|---|---|---|
| 0 | Monitor Toggle | UI | Boolean | Monitoring an/aus pro Flug |
| 1 | FlugNr | Import/API | String | Airline + Nummer (LH 441) |
| 2 | Callsign | Import/API | String | ICAO Funkrufzeichen (DLH441) |
| 3 | REG | API | String | Flugzeugregistrierung (D-AIHF) |
| 4 | Airline ICAO | Ableitung | String | 3-Letter Code (DLH) |
| 5 | Origin ICAO | Import/API | String | Abflughafen 3-Letter (FRA) |
| 6 | STA | Import | Time | Geplante Ankunftszeit |
| 7 | ETA | API/Berechnung | Time | Geschätzte Ankunftszeit |
| 8 | Verspätung | Berechnung | String | Differenz STA-ETA (+15m/-5m) |
| 9 | Flugphase | API/Logik | Enum | Pre-Flight, Cruise, Descent, Final |

### 2.2 Datenquellen-Integration

#### 2.2.1 Zwischenablage-Import
- **Formate:** CSV, TSV, Excel-Kopie (alle gängigen Trennzeichen)
- **Import-Methode:** Button-Klick, direkter Zugriff via Clipboard API
- **Spalten-Mapping:** Automatische Erkennung verschiedener Spaltennamen
- **Eingabe-Spalten:** FlugNr, Callsign, REG (optional), Origin, STA, ETA (optional)

#### 2.2.2 FlightAware AeroAPI Integration (Personal Use)
- **Endpoints:** `/airports/{airport_code 3-letter}/flights/arrivals`, `/flights/{flight_id}`, `/airports/{airport_code}/flights/departures`
- **Datenfelder:** Flight Identifier, Aircraft Registration, Aircraft Type, Scheduled/Actual Times, Gate Info, Position Data
- **Kostenfreie Limits:** 500 API-Calls/Monat (Personal/Academic Use)
- **Rate-Limit:** 10 Requests/Minute
- **Kosten:** 0€ solange innerhalb der monatlichen Limits
- **Datenformat:** JSON Response mit umfangreichen Flugdetails
- **Fehlerbehandlung:** Fallback-Mechanismen bei API-Ausfall

### 2.3 Datenabgleich-Logik
**Priorität (stopp beim ersten Match):**
1. **Callsign-Match** (exakt)
2. **Flugnummer-Match** (normalisiert)
3. **REG-Match** (falls verfügbar)
4. **Origin-Abgleich** (Hintergrund-Verification)

**Update-Regeln:**
- REG und ETA werden API-seitig ergänzt/aktualisiert
- Neu eingefügte/aktualisierte Daten: 5 Minuten gelb markiert
- Eindeutige Zeilen-Identifikation über Match-Priorität

## 3. Rate-Limiting & Update-Logik

### 3.1 AeroAPI Limit-Management (Kostenfreie Version)
```javascript
class FlightAwareRateLimiter {
    constructor() {
        this.monthlyLimit = 500;         // 500 kostenfreie Calls/Monat
        this.maxCallsPerMinute = 10;     // 10 Calls/Minute Rate-Limit
        this.callsUsedThisMonth = 0;     // Verbrauchte Calls tracken
        this.lastCallTimestamp = 0;      // Für Minute-basierte Limits
    }
    
    calculateUpdateInterval(activeFlightCount, remainingCalls) {
        // Limit-basierte Intervall-Berechnung
        if (remainingCalls < 50) return 1800;   // 30 Minuten bei <50 Calls
        if (remainingCalls < 100) return 900;   // 15 Minuten bei <100 Calls
        if (activeFlightCount < 20) return 600; // 10 Minuten
        if (activeFlightCount < 50) return 360; // 6 Minuten  
        if (activeFlightCount < 80) return 240; // 4 Minuten
        return 180; // 3 Minuten (Peak-Zeit)
    }
    
    canMakeRequest() {
        return this.callsUsedThisMonth < this.monthlyLimit && 
               this.checkMinuteLimit();
    }
}
```

### 3.2 Final Approach Boost
- **Trigger:** Flüge <30 Minuten vor geschätzter Landung
- **Intervall:** 2 Minuten für Final Approach Flüge (nur bei verfügbaren Calls)
- **Limit-Check:** Vor jedem Call Verfügbarkeit prüfen
- **Scope:** Nur Flüge mit aktivem Monitoring

### 3.4 Realistische API-Verbrauchsberechnung

**Szenario-Analyse für FlightStat Bot:**

#### Typisches Monitoring-Event:
- **Airport:** 100 Flugzeuge über 8 Stunden verteilt
- **Rolling Window:** 5 Stunden (Flüge verschwinden nach Landung)
- **Ein API-Call:** Alle verfügbaren Arrivals für Airport X (unabhängig von Anzahl)

#### Request-Bedarf pro Event:
```
Monitoring-Dauer: 8 Stunden
Update-Intervall: Alle 15-20 Minuten
API-Calls pro Event: 20-30 Calls
Dynamischer Inhalt: 40-80 Flüge gleichzeitig (nicht konstant 100)
```

#### Monatliche Kapazitätsberechnung:
```
Verfügbare Calls: 500/Monat
Bei 20 Calls/Event: 25 Events möglich
Bei 25 Calls/Event: 20 Events möglich

Ziel-Szenario: 20-25 Events/Monat
Benötigte Calls: 400-625 Calls
Resultat: Funktioniert mit intelligenter Intervall-Planung
```

#### Optimale Konfiguration:
- **Update-Intervall:** Alle 20 Minuten (24 Calls/Event)
- **Monatliche Events:** 20 Events bei 480 Calls
- **Reserve:** 20 Calls für Tests/Notfälle

#### Rate-Limit Management:
- **10 Calls/Minute:** Nie überschritten bei 20-Minuten-Intervall
- **Ein Call pro Update:** Keine Pagination-Probleme
- **Live-Counter:** Verbrauchte Calls im UI anzeigen

**Fazit:** Das kostenlose 500-Call-Limit reicht für 20-25 Monitoring-Events pro Monat aus. Ein API-Call liefert alle Flüge im Rolling Window, unabhängig von deren Anzahl.

## 4. Flughafen-Management

### 4.1 Destination Airport Selection
- **Input:** 3-Letter IATA-Code (FRA, MUC, BER)
- **UI:** Autocomplete mit lokaler Flughafen-DB
- **Validation:** IATA→ICAO Mapping (FRA→EDDF)

### 4.2 Rolling Window System
- **Zeitfenster:** 5 Stunden ab Abfragezeitpunkt (konfigurierbar)
- **Rolling Logic:** Fenster verschiebt sich bei jedem Update
- **Filter:** Nur Flüge die zum selektierten Airport fliegen

### 4.3 Relevanz-Algorithmus für AeroAPI
**AeroAPI liefert bereits gefilterte Ankunftsdaten:**
- **Endpoint:** `/airports/{airport_code}/flights/arrivals` 
- **Zeitfilter:** Query-Parameter für Zeitbereich
- **Automatische Filterung:** API liefert nur relevante Flüge für den Airport
- **Zusätzliche Filterung:** Cargo-Flüge, Deaktivierte Flüge ausblenden

## 5. User Interface Design

### 5.1 Design-Prinzipien
- **Theme:** Dunkler Hintergrund, High-Contrast
- **Style:** Modernes 2025er Professional Design
- **Responsiveness:** Grid-System für alle Desktop-Größen
- **Accessibility:** WCAG 2.1 konform

### 5.2 Hauptkomponenten

#### 5.2.1 Header-Bereich
- **Titel:** "FlightStat Bot"
- **API-Status:** "AeroAPI: 347/500 Calls verwendet (153 verbleibend)"
- **Airport-Selection:** Input-Feld mit Autocomplete
- **Live-Update Toggle:** An/Aus-Schalter

#### 5.2.2 Haupt-Tabelle
- **Sortierung:** Nach Relevanz, dann ETA
- **Row-Highlighting:** Neue/aktualisierte Daten gelb (5min)
- **Click-Handler:** Jede Zeile klickbar für Detail-Popup
- **Status-Coloring:** Pünktlich (grün), Verspätet (orange), Gelandet (grau)

#### 5.2.3 Filter-Bereich
- **Cargo-Filter:** Toggle für Cargo-Flüge
- **Langstrecken-Filter:** >6h Flugzeit ausblenden
- **Monitoring-Filter:** Nur überwachte Flüge anzeigen
- **Live-Counter:** "X Flüge aktiv überwacht"

### 5.3 Detail-Popup (Modal)
**Anzuzeigende Informationen (in dieser Reihenfolge):**
- Callsign, Flugnummer, REG, Airline
- Origin ICAO, Länder-Name
- Scheduled/Actual Departure Times
- Scheduled/Actual Arrival Times
- Aircraft Type, Gate Information
- FlightAware Map-Button (direkter Link)

## 6. Monitoring-System

### 6.1 Per-Flight Monitoring Toggle
- **UI:** Checkbox in Spalte 0
- **Default:** Aktiv für alle Flüge, inaktiv für Cargo
- **Funktion:** Deaktivierte Flüge werden nicht live aktualisiert
- **Zweck:** API-Request-Reduktion, personalisierte Überwachung

### 6.2 Automatische Filter
- **Cargo-Erkennung:** Flugnummer-Pattern, Airline-DB
- **Langstrecken-Erkennung:** Flugzeit >6h, interkontinentale Routes
- **Auto-Deaktivierung:** Cargo-Flüge standardmäßig ausgeschlossen

### 6.3 Benachrichtigungs-System
- **Browser-Notifications:** Bei kritischen Verspätungen (>15min)
- **Anzeige-Dauer:** Minimum 10 Sekunden
- **Permission:** Nutzer-Einverständnis bei erstem Start

## 7. Import/Export-System

### 7.1 Zwischenablage-Import
- **Button:** "📋 Aus Zwischenablage einfügen"
- **Parser:** Intelligent für CSV/TSV/Excel-Format
- **Validation:** Spalten-Mapping und Datenvalidierung
- **Merge:** Kombination mit Airport-Ankünften

### 7.2 Export-Funktionen
- **Formate:** CSV, JSON, Excel
- **Scope:** Aktuelle Tabelle mit allen Metadaten
- **Filename:** "FlightStat_Bot_Export_YYYY-MM-DD_HH-MM.csv"

### 7.3 Lokale Speicherung
- **Fluglisten:** Persistierung zwischen Sessions
- **Settings:** API-Key, Filter-Präferenzen
- **History:** Letzte Airport-Auswahl

## 8. API-Key Management

### 8.1 Settings-Modal
- **Trigger:** Einstellungen-Button im Header
- **UI:** Modal-Dialog mit Tabs
- **Sections:** API-Key, Einstellungen, About

### 8.2 API-Key Handling
- **Input:** Sicheres Passwort-Feld
- **Storage:** LocalStorage (verschlüsselt)
- **Validation:** Test-Request bei Eingabe
- **Optional:** Login-Sicherung für Multi-User

### 8.3 Security Features & Limit-Überwachung
- **Encryption:** API-Key Base64 + Salt
- **Session-Timeout:** Auto-Logout nach Inaktivität
- **Clear-Function:** Komplettes Daten-Reset
- **Monatliches Limit:** 500 API-Calls kostenlos (Personal/Academic Use)
- **Call-Tracking:** Verbrauchte Calls pro Monat überwachen
- **Warnsystem:** Benachrichtigung bei 80% Limit-Verbrauch (400 Calls)
- **Auto-Pause:** Live-Updates pausieren bei Limit-Erreichen

## 9. Erweiterte Features

### 9.1 Intelligente Flugphasen-Erkennung
- **Pre-Flight:** Scheduled aber noch nicht departed
- **En Route:** Departed aber noch nicht arrived
- **Approach:** ETA <30min, Position nahe Zielflughafen
- **Landed:** Actual arrival time verfügbar
- **Cancelled/Diverted:** Entsprechende Status-Flags

### 9.2 Google Flights-Style Features
- **Progress Bar:** Visueller Flugfortschritt basierend auf ETA
- **ETA-Calculation:** AeroAPI-basierte Ankunftszeit
- **Delay-Detection:** STA vs ETA Vergleich
- **Status-Updates:** Live-Änderungen bei Gate/Time Updates

### 9.3 Performance-Optimierungen
- **Selective Updates:** Nur überwachte Flüge
- **Efficient Rendering:** Minimale DOM-Updates
- **Memory Management:** Cleanup alter Daten
- **API Efficiency:** Batch-Requests wo möglich

## 10. Technische Implementierung

### 10.1 JavaScript-Architektur
```javascript
class FlightStatBot {
    constructor() {
        this.flights = [];
        this.rateLimiter = new FlightAwareRateLimiter();
        this.apiManager = new AeroAPIManager();
        this.uiManager = new UIManager();
    }
}

// Modulare Klassen-Struktur
class AeroAPIManager { /* FlightAware AeroAPI Integration */ }
class RateLimiter { /* Smart Update Logic mit 500 Calls/Monat */ }
class FlightFilter { /* Cargo/Langstrecke/Relevanz */ }
class UIManager { /* DOM-Manipulation, Events */ }
class DataMerger { /* Zwischenablage + API Abgleich */ }
```

### 10.2 AeroAPI Request-Handling
```javascript
class AeroAPIManager {
    constructor(apiKey) {
        this.baseURL = 'https://aeroapi.flightaware.com/aeroapi';
        this.apiKey = apiKey;
    }
    
    async getArrivals(airportCode, timeWindow = 5) {
        const response = await fetch(
            `${this.baseURL}/airports/${airportCode}/flights/arrivals?max_pages=3`,
            {
                headers: { 'x-apikey': this.apiKey }
            }
        );
        return response.json();
    }
}
```

### 10.3 Error-Handling & Fallbacks
- **API-Ausfall:** Demo-Daten aktivieren
- **CORS-Probleme:** Proxy-Fallback-Chain
- **Rate-Limit:** Intelligente Pause-Mechanismen
- **Browser-Compatibility:** Feature-Detection

## 11. Qualitätssicherung

### 11.1 Testing-Kriterien
- **ETA-Genauigkeit:** ±5min Abweichung zu echten Ankunftszeiten
- **Performance:** Gleichzeitiges Tracking von 50+ Flügen
- **Reliability:** 48h Dauerlauf ohne Ausfälle
- **API-Compliance:** Einhaltung AeroAPI Rate-Limits (500 Calls/Monat)

### 11.2 Browser-Testing
- **Primär:** Chrome, Brave, Vivaldi
- **Sekundär:** Firefox, Edge
- **Auflösungen:** 1280px, 1920px, 2560px, 4K

### 11.3 Usability-Standards
- **Intuitive Bedienung:** Keine Erklärung nötig
- **Responsive Feedback:** Alle Aktionen bestätigt
- **Professional Look:** Airline-Industry Standards

## 12. Deployment & Distribution

### 12.1 Auslieferung
- **Format:** Einzelne HTML-Datei (`FlightStat_Bot.html`)
- **Größe:** <2MB (inklusive Airline/Airport-DBs)
- **Abhängigkeiten:** Keine (vollständig standalone)

### 12.2 Installation
- **User-Action:** Datei herunterladen, im Browser öffnen
- **Setup:** AeroAPI-Key eingeben über Settings-Modal
- **Ready:** Sofort einsatzbereit

### 12.3 Updates
- **Methode:** Neue HTML-Datei
- **Migration:** Settings/Daten aus localStorage übernehmen
- **Versioning:** Eindeutige Build-Nummern im Footer

---

## Entwicklungs-Prioritäten

### Phase 1: Core Foundation (Stunden 1-3)
1. HTML-Template mit dunklem Design
2. Basis-Tabellen-Struktur
3. FlightAware AeroAPI-Integration
4. CORS-Proxy Implementation

### Phase 2: Data Management (Stunden 4-5)
1. Zwischenablage-Import
2. Datenabgleich-Logik
3. Rate-Limiting-System (500 Calls/Monat)
4. Lokale Speicherung

### Phase 3: UI Enhancement (Stunden 6-7)
1. Detail-Modal
2. Filter-System
3. Monitoring-Toggles
4. Settings-Modal

### Phase 4: Advanced Features (Stunden 8-9)
1. Benachrichtigungen
2. Export-Funktionen
3. Progress-Bars
4. Performance-Optimierung

### Phase 5: Polish & Testing (Stunde 10)
1. Cross-Browser-Testing
2. Error-Handling
3. UI-Polish
4. Dokumentation

**Geschätzter Gesamtaufwand:** 10 Stunden AI-Agent Coding

---

*FlightStat Bot - Professional Flight Tracking für Desktop 2025*