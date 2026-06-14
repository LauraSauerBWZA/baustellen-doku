# Baustellen-Dokumentation

Zwei eigenständige, statische Offline-Web-Tools für die Baustelle – ohne Build,
ohne Server, ohne externe Abhängigkeiten. Alles läuft lokal im Browser.

## Tools

### Gefährdungsbeurteilung (`gefaehrdungsbeurteilung/`)
Gefährdungsbeurteilung für **Industrieklettern im Hochregallager**: Basisdaten,
Grundsatzprüfung der Zugangsmethode, Gefährdungen mit Risikobewertung (vorher/
nachher), Rettungskonzept, PSA, Stop-Kriterien, Unterweisung und Freigabe.

### Bau-Tagesbericht (`tagesbericht/`)
Tagesberichte erfassen: Basisdaten, Wetter, Personal, ausgeführte Arbeiten,
Geräte & Material, besondere Vorkommnisse, Arbeitssicherheit, **Fotos** und
Planung für den nächsten Tag.

## Nutzung

- `index.html` (im Projekt-Root) öffnen – sie verlinkt beide Tools.
- Eingaben werden **automatisch lokal im Browser** gespeichert (`localStorage`).
- **JSON-Export/-Import** sichert bzw. lädt einen Stand als Datei (Feld `schema`
  zur Versionierung; ältere Exporte ohne `schema` bleiben ladbar).
- **Drucken / PDF** über den jeweiligen Druck-Button.
- Fotos im Tagesbericht werden vor dem Speichern automatisch verkleinert
  (längste Kante max. 1280 px, JPEG), damit der Browser-Speicher nicht überläuft.

## Offline & Installation (PWA)

Beide Tools und die Landingpage funktionieren dank Service Worker vollständig
**offline** und lassen sich auf dem Handy oder Desktop **installieren**
(„Zum Startbildschirm hinzufügen“). Beim ersten Aufruf online laden, danach
läuft alles auch ohne Empfang.

## Datenschutz

🔒 **Alle Daten bleiben lokal im Browser.** Es findet keine Übertragung an
Server statt, es werden keine externen Dienste, CDNs oder Tracker geladen. Der
Service Worker cacht ausschließlich die eigenen, lokalen Dateien.

## GitHub Pages

Das Projekt ist für die Veröffentlichung unter einem Unterpfad ausgelegt
(z. B. `https://<user>.github.io/baustellen-doku/`). Alle Pfade sind relativ,
daher funktionieren Landingpage, Tools und Service Worker sowohl lokal als auch
unter GitHub Pages ohne Anpassung.

Zum lokalen Testen im Projektordner:

```
python3 -m http.server 8080
```

Dann `http://localhost:8080` im Browser öffnen.

## Lizenz

MIT – © 2026 Laura Sauer (siehe [LICENSE](LICENSE)).
