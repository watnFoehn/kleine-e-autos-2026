# Kleine E-Autos 2026

Vergleich kleiner Elektroautos für den Alltag.

Die Seite stellt ausgewählte kleine Elektroautos gegenüber und bietet Sortierung nach Preis, Reichweite und Länge sowie einen direkten Vergleich von bis zu drei Fahrzeugen.

## Technik

- Statische HTML-Seite ohne Build-System
- JavaScript für Datenladen, Sortierung und Vergleich
- Fahrzeugdaten als `data/vehicles.json`
- Tailwind CSS über CDN
- Deployment über Vercel

## Daten

Die Fahrzeugdaten liegen bewusst getrennt von der Darstellungslogik in `data/vehicles.json`. Fehlende Werte werden im Frontend als `—` dargestellt.

## Status

Das Projekt ist als kleines, bewusst überschaubares Showcase-Projekt angelegt. Der Fokus liegt auf sauberer Struktur, verständlichem JavaScript, responsiver Darstellung und grundlegender Barrierefreiheit.
