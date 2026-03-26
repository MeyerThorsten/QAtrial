# QAtrial — Requirements & Test Management Tool

Ein webbasiertes Requirements- und Test-Management-Tool, inspiriert von IBM DOORS. Ermöglicht die Verwaltung von Requirements und Tests in Tabellenform, deren Verlinkung und eine umfassende Auswertung mit Traceability Matrix.

## Features

### 1. Requirements-Verwaltung
- CRUD-Operationen (Erstellen, Lesen, Bearbeiten, Löschen)
- Automatische ID-Generierung (`REQ-001`, `REQ-002`, ...)
- Status-Tracking: **Draft**, **Active**, **Closed**
- Sortierung und Volltextsuche
- Anzeige der Anzahl verlinkter Tests pro Requirement

### 2. Test-Verwaltung
- CRUD-Operationen für Testfälle
- Automatische ID-Generierung (`TST-001`, `TST-002`, ...)
- Status-Tracking: **Not Run**, **Passed**, **Failed**
- **Multi-Select-Linking**: Tests können mit einem oder mehreren Requirements verlinkt werden
- Verlinkte Requirements werden als Tag-Chips angezeigt

### 3. Auswertungs-Dashboard
- **Coverage-Anzeige**: Prozentsatz der Requirements mit mindestens einem verlinkten Test
- **Requirement-Status-Verteilung**: Interaktives Tortendiagramm
- **Test-Status-Verteilung**: Balkendiagramm
- **Traceability Matrix**: Vollständige Kreuzreferenz-Tabelle (Requirements × Tests) mit:
  - Grünes Häkchen bei vorhandener Verlinkung
  - Zusammenfassungsspalte (Links pro Requirement)
  - Zusammenfassungszeile (Links pro Test)
  - Farbcodierung: Rot bei fehlenden Links, Grün bei vorhandenen
  - Sticky Headers für große Datensätze
- **Orphaned Requirements**: Liste aller Requirements ohne verlinkte Tests
- **Orphaned Tests**: Liste aller Tests ohne verlinkte Requirements
- **Filterbar**: Filterung nach Requirement-Status und Test-Status

### 4. Datenmanagement
- **Persistenz**: Alle Daten werden im Browser-localStorage gespeichert
- **JSON-Export**: Kompletter Datenexport als `.json`-Datei
- **JSON-Import**: Datenimport mit Validierung und referenzieller Integritätsprüfung
- **Cascade-Delete**: Beim Löschen eines Requirements werden alle Verlinkungen in Tests automatisch bereinigt

## Tech Stack

| Technologie | Zweck |
|---|---|
| [React](https://react.dev/) 19 | UI-Framework |
| [TypeScript](https://www.typescriptlang.org/) | Typsicherheit |
| [Vite](https://vite.dev/) | Build-Tool & Dev-Server |
| [Tailwind CSS](https://tailwindcss.com/) 4 | Utility-first CSS |
| [Zustand](https://zustand.docs.pmnd.rs/) | State Management mit localStorage-Persistenz |
| [TanStack Table](https://tanstack.com/table/) v8 | Headless Table (Sortierung, Filterung) |
| [Recharts](https://recharts.org/) | Charts (Pie, Bar) |
| [Lucide React](https://lucide.dev/) | Icon-Bibliothek |

## Projektstruktur

```
src/
├── main.tsx                          # Entry Point
├── App.tsx                           # Root-Komponente
├── index.css                         # Tailwind CSS Directives
│
├── types/
│   └── index.ts                      # TypeScript Interfaces & Types
│
├── lib/
│   ├── constants.ts                  # Status-Werte, Farben, Chart-Konfiguration
│   └── idGenerator.ts                # ID-Generierung (REQ-001, TST-001)
│
├── store/
│   ├── useRequirementsStore.ts       # Zustand Store: Requirements (CRUD + Persist)
│   ├── useTestsStore.ts             # Zustand Store: Tests (CRUD + Persist + Linking)
│   └── useImportExport.ts           # JSON Import/Export Hook
│
├── hooks/
│   └── useEvaluationData.ts          # Abgeleitete Dashboard-Metriken (Coverage, Orphans)
│
├── components/
│   ├── layout/
│   │   └── AppShell.tsx              # Hauptlayout mit Tab-Navigation
│   │
│   ├── requirements/
│   │   ├── RequirementsTable.tsx      # Requirements-Tabelle (TanStack Table)
│   │   └── RequirementModal.tsx       # Erstellen/Bearbeiten Dialog
│   │
│   ├── tests/
│   │   ├── TestsTable.tsx            # Tests-Tabelle (TanStack Table)
│   │   └── TestModal.tsx             # Erstellen/Bearbeiten Dialog mit Req-Linking
│   │
│   ├── dashboard/
│   │   ├── EvaluationDashboard.tsx    # Dashboard Container
│   │   ├── CoverageCard.tsx           # Coverage-Prozentsatz + Fortschrittsbalken
│   │   ├── StatusChart.tsx            # Wiederverwendbarer Chart (Pie/Bar)
│   │   ├── TraceabilityMatrix.tsx     # Kreuzreferenz-Matrix (Req × Test)
│   │   ├── OrphanedRequirements.tsx   # Requirements ohne verlinkte Tests
│   │   ├── OrphanedTests.tsx          # Tests ohne verlinkte Requirements
│   │   └── FilterBar.tsx             # Status-Filter für Dashboard
│   │
│   └── shared/
│       ├── StatusBadge.tsx            # Farbcodierte Status-Anzeige
│       ├── ConfirmDialog.tsx          # Lösch-Bestätigung
│       ├── EmptyState.tsx             # Platzhalter bei leeren Tabellen
│       └── ImportExportBar.tsx        # Import/Export Buttons
```

## Datenmodell

### Requirement
| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | `string` | Auto-generiert, z.B. `REQ-001` |
| `title` | `string` | Titel des Requirements |
| `description` | `string` | Detaillierte Beschreibung |
| `status` | `Draft \| Active \| Closed` | Aktueller Status |
| `createdAt` | `string` | ISO-Zeitstempel der Erstellung |
| `updatedAt` | `string` | ISO-Zeitstempel der letzten Änderung |

### Test
| Feld | Typ | Beschreibung |
|---|---|---|
| `id` | `string` | Auto-generiert, z.B. `TST-001` |
| `title` | `string` | Titel des Testfalls |
| `description` | `string` | Detaillierte Beschreibung |
| `status` | `Not Run \| Passed \| Failed` | Aktuelles Testergebnis |
| `linkedRequirementIds` | `string[]` | Array verlinkter Requirement-IDs |
| `createdAt` | `string` | ISO-Zeitstempel der Erstellung |
| `updatedAt` | `string` | ISO-Zeitstempel der letzten Änderung |

### Verlinkung
Die Verlinkung zwischen Requirements und Tests ist eine **n:m-Beziehung**:
- Ein Test kann mit mehreren Requirements verlinkt werden
- Ein Requirement kann von mehreren Tests abgedeckt werden
- Links werden ausschließlich im Test-Modal verwaltet
- Beim Löschen eines Requirements werden alle Referenzen in Tests automatisch entfernt (Cascade)

## Installation

```bash
# Repository klonen
git clone https://github.com/MeyerThorsten/QAtrial.git
cd QAtrial

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

## Verwendung

### Workflow
1. **Requirements anlegen**: Im Tab "Requirements" neue Anforderungen erstellen
2. **Tests anlegen und verlinken**: Im Tab "Tests" Testfälle erstellen und über den Multi-Select im Dialog mit Requirements verlinken
3. **Auswertung prüfen**: Im Tab "Auswertung" die Coverage, Traceability Matrix und fehlende Verlinkungen einsehen

### Daten sichern
- **Export**: Button oben rechts → speichert alle Daten als JSON-Datei
- **Import**: Button oben rechts → lädt eine zuvor exportierte JSON-Datei
- Daten bleiben auch nach Browser-Neustart erhalten (localStorage)

## Skripte

| Befehl | Beschreibung |
|---|---|
| `npm run dev` | Startet den Entwicklungsserver (Port 5174) |
| `npm run build` | Erstellt den Produktions-Build in `dist/` |
| `npm run preview` | Vorschau des Produktions-Builds |
| `npm run lint` | ESLint-Prüfung |

## Lizenz

Privates Projekt.
