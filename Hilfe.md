welches Websearch MCP kann ich in KIRO Dev IDE installieren?





Ich habe nach "KIRO Dev IDE Websearch MCP" gesucht und Informationen dazu gefunden, was MCPs sind und wie man sie in der KIRO-Entwicklungsumgebung einsetzt.



MCP steht für Model Context Protocol. Es handelt sich um ein Protokoll, das es KIRO ermöglicht, sich mit externen Servern zu verbinden, um auf spezialisierte Werkzeuge und Informationen zuzugreifen. Das ist im Prinzip das, was bei anderen IDEs als "Erweiterung" oder "Plugin" bekannt ist, nur dass es bei KIRO über dieses spezifische Protokoll läuft.



Aus der Dokumentation von KIRO geht hervor, dass es einen "Web Search Server" gibt, der über MCP integriert werden kann. Dieser Web-Suchserver ermöglicht es KIRO, im Web nach Informationen zu suchen und Echtzeitinformationen zu erhalten, die nicht in den Trainingsdaten des KI-Modells enthalten sind.



Um den Web-Suchserver zu installieren und zu nutzen, musst du ihn in deiner KIRO-Konfiguration einrichten. Die Dokumentation beschreibt, dass du eine Konfigurationsdatei namens .kiro/settings/mcp.json in deinem Arbeitsbereich (oder im Benutzerverzeichnis) erstellen oder bearbeiten musst.



Ein Beispiel für die Konfiguration des Web-Suchservers, der uvx und mcp-server-brave-search verwendet, sieht wie folgt aus:



JSON



{

&nbsp; "mcpServers": {

&nbsp;   "web-search": {

&nbsp;     "command": "uvx",

&nbsp;     "args": \["mcp-server-brave-search"],

&nbsp;     "env": {

&nbsp;       "BRAVE\_API\_KEY": "your-api-key-here"

&nbsp;     },

&nbsp;     "disabled": false,

&nbsp;     "autoApprove": \["search"]

&nbsp;   }

&nbsp; }

}

Wichtige Schritte für die Installation:



Konfigurationsdatei erstellen: Erstelle die Datei .kiro/settings/mcp.json in deinem Projektverzeichnis.



Konfiguration hinzufügen: Füge den obigen JSON-Code in die Datei ein.



API-Key beschaffen: Für den mcp-server-brave-search benötigst du einen API-Schlüssel von Brave. Du musst "your-api-key-here" durch deinen tatsächlichen API-Schlüssel ersetzen.



MCP-Unterstützung aktivieren: Du musst die MCP-Unterstützung in den KIRO-Einstellungen aktivieren. Du findest diese Option, indem du die Einstellungen öffnest (Cmd + , auf Mac oder Strg + , auf Windows/Linux) und nach "MCP" suchst.



Neben dem Web-Suchserver gibt es auch andere offizielle MCPs wie den AWS Documentation Server und den GitHub MCP Server. Außerdem ist es möglich, benutzerdefinierte Server zu erstellen oder weitere MCP-Server im MCP Registry oder auf GitHub zu finden.



Zusammenfassend lässt sich sagen, dass der von KIRO bereitgestellte "Web Search Server" der MCP ist, den du suchst. Er wird nicht wie eine traditionelle Erweiterung aus einem Marketplace installiert, sondern durch eine Konfiguration in den JSON-Einstellungen von KIRO aktiviert.

