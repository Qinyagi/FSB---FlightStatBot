# Requirements Document

## Introduction

Der FlightStat Bot ist eine HTML5 Standalone WebApp für PC-Desktop, die als Live-Monitor für spezifische Zielflughäfen fungiert. Die Anwendung bietet Google Flights-ähnliche Detailverfolgung und ermöglicht es Benutzern, Flugankünfte in Echtzeit zu überwachen. Die App ist als einzelne HTML-Datei konzipiert und nutzt die FlightAware AeroAPI für Live-Flugdaten.

## Requirements

### Requirement 1: Plattform und Kompatibilität

**User Story:** Als Benutzer möchte ich eine standalone HTML5-Anwendung, die auf allen modernen Desktop-Browsern funktioniert, damit ich keine zusätzliche Software installieren muss.

#### Acceptance Criteria

1. WHEN die Anwendung geöffnet wird THEN soll sie als einzelne HTML-Datei mit eingebettetem CSS und JavaScript funktionieren
2. WHEN die Anwendung in Brave, Vivaldi, Chrome, Firefox oder Edge geöffnet wird THEN soll sie vollständig funktionsfähig sein
3. WHEN die Anwendung auf Bildschirmen von 1280px bis 4K (3840px) angezeigt wird THEN soll sie responsive und benutzerfreundlich sein
4. WHEN keine Internetverbindung verfügbar ist THEN sollen UI-Funktionen weiterhin verfügbar sein (nur Live-Daten sind API-abhängig)

### Requirement 2: Flugdaten-Management und API-Integration

**User Story:** Als Benutzer möchte ich Live-Flugdaten von der FlightAware AeroAPI abrufen können, damit ich aktuelle Ankunftsinformationen erhalte.

#### Acceptance Criteria

1. WHEN ein API-Key eingegeben wird THEN soll die Anwendung eine Testverbindung zur FlightAware AeroAPI durchführen
2. WHEN Flugdaten abgerufen werden THEN sollen maximal 500 API-Calls pro Monat verwendet werden (kostenfreies Limit)
3. WHEN API-Requests gesendet werden THEN sollen maximal 10 Requests pro Minute eingehalten werden
4. WHEN CORS-Probleme auftreten THEN soll ein integrierter Proxy (api.allorigins.win/raw) verwendet werden
5. WHEN die API nicht verfügbar ist THEN sollen Fallback-Mechanismen aktiviert werden

### Requirement 3: Datenstruktur und Spalten-Management

**User Story:** Als Benutzer möchte ich Flugdaten in einer strukturierten Tabelle mit spezifischen Spalten anzeigen, damit ich alle relevanten Informationen auf einen Blick sehe.

#### Acceptance Criteria

1. WHEN Flugdaten angezeigt werden THEN sollen folgende Spalten in dieser Reihenfolge dargestellt werden: Monitor Toggle, FlugNr, Callsign, REG, Airline ICAO, Origin ICAO, STA, ETA, Verspätung, Flugphase
2. WHEN neue Daten eingefügt oder aktualisiert werden THEN sollen diese 5 Minuten lang gelb markiert werden
3. WHEN Flugdaten abgeglichen werden THEN soll die Priorität sein: Callsign-Match (exakt), Flugnummer-Match (normalisiert), REG-Match, Origin-Abgleich
4. WHEN REG und ETA fehlen THEN sollen diese API-seitig ergänzt werden

### Requirement 4: Zwischenablage-Import

**User Story:** Als Benutzer möchte ich Flugdaten aus der Zwischenablage importieren können, damit ich bestehende Fluglisten schnell einlesen kann.

#### Acceptance Criteria

1. WHEN der Import-Button geklickt wird THEN soll die Anwendung auf die Zwischenablage zugreifen
2. WHEN CSV, TSV oder Excel-Daten in der Zwischenablage sind THEN sollen diese automatisch erkannt und geparst werden
3. WHEN Spaltennamen variieren THEN soll eine automatische Erkennung und Zuordnung erfolgen
4. WHEN importierte Daten ungültig sind THEN soll eine Validierung mit Fehlermeldungen durchgeführt werden

### Requirement 5: Flughafen-Auswahl und Rolling Window

**User Story:** Als Benutzer möchte ich einen Zielflughafen auswählen und nur relevante Ankünfte in einem Zeitfenster sehen, damit ich fokussiert überwachen kann.

#### Acceptance Criteria

1. WHEN ein 3-Letter IATA-Code eingegeben wird THEN soll eine Autocomplete-Funktion mit lokaler Flughafen-DB verfügbar sein
2. WHEN ein Flughafen ausgewählt wird THEN soll eine IATA→ICAO Mapping-Validierung durchgeführt werden
3. WHEN Flugdaten abgerufen werden THEN soll ein 5-Stunden Rolling Window ab Abfragezeitpunkt verwendet werden
4. WHEN das Zeitfenster aktualisiert wird THEN soll es sich bei jedem Update automatisch verschieben

### Requirement 6: Rate-Limiting und Update-Logik

**User Story:** Als Benutzer möchte ich, dass die Anwendung intelligent mit API-Limits umgeht, damit ich das kostenfreie Kontingent optimal nutzen kann.

#### Acceptance Criteria

1. WHEN weniger als 50 API-Calls verbleiben THEN soll das Update-Intervall auf 30 Minuten erhöht werden
2. WHEN weniger als 100 API-Calls verbleiben THEN soll das Update-Intervall auf 15 Minuten erhöht werden
3. WHEN Flüge weniger als 30 Minuten vor geschätzter Landung sind THEN soll ein 2-Minuten-Intervall verwendet werden (Final Approach Boost)
4. WHEN das monatliche Limit erreicht wird THEN sollen Live-Updates automatisch pausiert werden
5. WHEN 80% des Limits erreicht sind THEN soll eine Warnung angezeigt werden

### Requirement 7: Monitoring-System

**User Story:** Als Benutzer möchte ich einzelne Flüge für die Überwachung aktivieren/deaktivieren können, damit ich API-Requests reduzieren und personalisiert überwachen kann.

#### Acceptance Criteria

1. WHEN ein Flug angezeigt wird THEN soll ein Monitor-Toggle in der ersten Spalte verfügbar sein
2. WHEN ein Flug deaktiviert wird THEN soll er nicht mehr live aktualisiert werden
3. WHEN Cargo-Flüge erkannt werden THEN sollen diese standardmäßig deaktiviert sein
4. WHEN Langstreckenflüge (>6h) erkannt werden THEN sollen Filter-Optionen verfügbar sein

### Requirement 8: User Interface Design

**User Story:** Als Benutzer möchte ich eine moderne, professionelle Benutzeroberfläche mit dunklem Theme, damit ich die Anwendung angenehm nutzen kann.

#### Acceptance Criteria

1. WHEN die Anwendung geöffnet wird THEN soll ein dunkler Hintergrund mit High-Contrast-Design angezeigt werden
2. WHEN der Header angezeigt wird THEN sollen Titel, API-Status, Airport-Selection und Live-Update Toggle sichtbar sein
3. WHEN die Haupttabelle angezeigt wird THEN soll sie nach Relevanz und ETA sortiert sein
4. WHEN eine Tabellenzeile geklickt wird THEN soll ein Detail-Popup geöffnet werden
5. WHEN Flugstatus angezeigt wird THEN sollen Farben verwendet werden: Pünktlich (grün), Verspätet (orange), Gelandet (grau)

### Requirement 9: Detail-Popup und Erweiterte Informationen

**User Story:** Als Benutzer möchte ich detaillierte Informationen zu einem Flug in einem Popup sehen, damit ich umfassende Flugdaten einsehen kann.

#### Acceptance Criteria

1. WHEN ein Detail-Popup geöffnet wird THEN sollen folgende Informationen angezeigt werden: Callsign, Flugnummer, REG, Airline, Origin ICAO, Länder-Name
2. WHEN Zeitinformationen angezeigt werden THEN sollen Scheduled/Actual Departure und Arrival Times dargestellt werden
3. WHEN verfügbar THEN sollen Aircraft Type und Gate Information angezeigt werden
4. WHEN möglich THEN soll ein direkter Link zur FlightAware Map bereitgestellt werden

### Requirement 10: Benachrichtigungssystem

**User Story:** Als Benutzer möchte ich Browser-Benachrichtigungen bei kritischen Verspätungen erhalten, damit ich wichtige Änderungen nicht verpasse.

#### Acceptance Criteria

1. WHEN eine Verspätung von mehr als 15 Minuten erkannt wird THEN soll eine Browser-Benachrichtigung gesendet werden
2. WHEN eine Benachrichtigung angezeigt wird THEN soll sie mindestens 10 Sekunden sichtbar bleiben
3. WHEN die Anwendung zum ersten Mal gestartet wird THEN soll um Benachrichtigungs-Berechtigung gefragt werden
4. WHEN Benachrichtigungen deaktiviert sind THEN sollen sie in den Einstellungen aktivierbar sein

### Requirement 11: Import/Export und Datenpersistierung

**User Story:** Als Benutzer möchte ich Daten importieren, exportieren und zwischen Sessions speichern können, damit ich meine Arbeit nicht verliere.

#### Acceptance Criteria

1. WHEN Daten exportiert werden THEN sollen CSV, JSON und Excel-Formate verfügbar sein
2. WHEN ein Export durchgeführt wird THEN soll der Dateiname das Format "FlightStat_Bot_Export_YYYY-MM-DD_HH-MM" haben
3. WHEN die Anwendung geschlossen wird THEN sollen Fluglisten, Settings und API-Key in LocalStorage gespeichert werden
4. WHEN die Anwendung erneut geöffnet wird THEN sollen gespeicherte Daten automatisch geladen werden

### Requirement 12: API-Key Management und Sicherheit

**User Story:** Als Benutzer möchte ich meinen API-Key sicher verwalten können, damit meine Zugangsdaten geschützt sind.

#### Acceptance Criteria

1. WHEN ein API-Key eingegeben wird THEN soll er in einem sicheren Passwort-Feld eingegeben werden
2. WHEN der API-Key gespeichert wird THEN soll er verschlüsselt (Base64 + Salt) in LocalStorage abgelegt werden
3. WHEN ein Settings-Modal geöffnet wird THEN sollen Tabs für API-Key, Einstellungen und About verfügbar sein
4. WHEN eine Session-Timeout konfiguriert ist THEN soll ein Auto-Logout nach Inaktivität erfolgen

### Requirement 13: Flugphasen-Erkennung

**User Story:** Als Benutzer möchte ich den aktuellen Status und die Phase eines Fluges sehen, damit ich den Fortschritt verfolgen kann.

#### Acceptance Criteria

1. WHEN ein Flug geplant aber noch nicht gestartet ist THEN soll der Status "Pre-Flight" angezeigt werden
2. WHEN ein Flug gestartet aber noch nicht angekommen ist THEN soll der Status "En Route" angezeigt werden
3. WHEN ein Flug weniger als 30 Minuten vor Ankunft ist THEN soll der Status "Approach" angezeigt werden
4. WHEN ein Flug gelandet ist THEN soll der Status "Landed" mit Actual Arrival Time angezeigt werden
5. WHEN ein Flug storniert oder umgeleitet wurde THEN sollen entsprechende Status-Flags angezeigt werden

### Requirement 14: Performance und Optimierung

**User Story:** Als Benutzer möchte ich, dass die Anwendung auch bei vielen gleichzeitigen Flügen performant läuft, damit die Benutzerfreundlichkeit erhalten bleibt.

#### Acceptance Criteria

1. WHEN mehr als 50 Flüge gleichzeitig überwacht werden THEN soll die Anwendung weiterhin flüssig funktionieren
2. WHEN DOM-Updates durchgeführt werden THEN sollen nur geänderte Elemente aktualisiert werden
3. WHEN alte Flugdaten nicht mehr relevant sind THEN sollen sie automatisch aus dem Speicher entfernt werden
4. WHEN möglich THEN sollen API-Requests gebündelt werden um Effizienz zu steigern

### Requirement 15: Filter und Suchfunktionen

**User Story:** Als Benutzer möchte ich Flüge filtern und durchsuchen können, damit ich relevante Informationen schnell finde.

#### Acceptance Criteria

1. WHEN Cargo-Flüge angezeigt werden THEN soll ein Toggle zum Ausblenden verfügbar sein
2. WHEN Langstreckenflüge (>6h) angezeigt werden THEN soll ein Filter zum Ausblenden verfügbar sein
3. WHEN nur überwachte Flüge angezeigt werden sollen THEN soll ein entsprechender Filter verfügbar sein
4. WHEN Filter aktiv sind THEN soll ein Live-Counter "X Flüge aktiv überwacht" angezeigt werden