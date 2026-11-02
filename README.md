# 🧪 Nerdspace

### Curiosity lives here.

🌐 **Live Demo:** [nerdspace.vercel.app](https://nerdspace.vercel.app)

Nerdspace is a growing collection of browser-based technology experiments, interactive tools, and interesting things built with code.

Inspired by [iLovePDF](https://www.ilovepdf.com/), Nerdspace brings independent tools together under one roof. Each experiment has its own route, components, and dependencies, while sharing a common application shell.

Whether it's exploring OCR engines, experimenting with document processing, or trying out a new technology, Nerdspace provides a space to build, test, compare, and learn.

The project uses a central registry to manage experiments, making it easy to add or remove tools without modifying the application's routing configuration.

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm

### Installation

```bash
npm install
npm run dev
```

Open the URL printed in your terminal (usually [http://localhost:5173](http://localhost:5173)).

The home page displays all registered experiments. Select a tool to open it at its dedicated route.

## 🗂 Available Experiments

| Experiment     | Route          | Technologies                                |
| -------------- | -------------- | ------------------------------------------- |
| OCR Comparison | `/ocr-compare` | Tesseract.js, Scribe.js OCR, React Dropzone |

More experiments will be added over time. The home page and application routes are generated from a central registry, keeping the catalog and routing configuration in sync.

## 🏗 Project Structure

```text
src/
├── App.tsx                     # Application router
├── experiments/
│   ├── index.ts                # Central experiment registry
│   └── ocr-compare/
│       ├── index.tsx           # OCR engine tab switcher
│       ├── TesseractOCR.tsx
│       ├── ScribeOCR.tsx
│       └── ocr.css
├── pages/
│   ├── Home.tsx                # Experiment catalog
│   └── NotFound.tsx
├── shared/
│   └── ExperimentLayout.tsx    # Shared experiment layout and navigation
└── scribe.d.ts                 # Scribe.js OCR type declarations
```

## ➕ Adding a New Experiment

Adding an experiment requires just three steps. No manual router configuration is necessary.

### 1. Create an experiment folder

```bash
mkdir src/experiments/barcode-scanner
```

Create its entry component:

```tsx
// src/experiments/barcode-scanner/index.tsx

export default function BarcodeScanner() {
  return <div>Coming soon...</div>;
}
```

### 2. Add it to the registry

Open `src/experiments/index.ts` and register the new experiment:

```typescript
{
  id: 'barcode-scanner',
  title: 'Barcode Scanner',
  description: 'Detect 1D and 2D barcodes from images or a camera.',
  icon: '📷',
  tags: ['zxing', 'camera'],
  component: lazy(() => import('./barcode-scanner')),
}
```

### 3. That's it!

The experiment automatically gets:

- A card on the home page.
- Its own route at `/barcode-scanner`.
- The shared experiment layout and back navigation.

Each experiment owns its implementation, including components, styles, hooks, types, and supporting services. This keeps experiments independent and easy to maintain.

## 🔍 OCR Comparison Experiment

The OCR experiment provides a playground for comparing two JavaScript-based OCR solutions.

| Feature             | Tesseract.js | Scribe.js OCR |
| ------------------- | ------------ | ------------- |
| Image processing    | ✓            | ✓             |
| PDF support         | —            | ✓             |
| Processing progress | ✓            | ✓             |
| Dedicated interface | ✓            | ✓             |

**Key features:**

- Drag-and-drop file uploads using `react-dropzone`.
- Separate interfaces and state for each OCR engine.
- Read-only text output for extracted content.
- Automatic cleanup of Scribe.js resources when its component unmounts.

The experiment makes it easier to compare extraction results, processing behaviour, and document compatibility between the two libraries.

## ⚙️ Vite Configuration

Scribe.js OCR includes a platform-specific native canvas dependency that can cause issues with Vite's dependency optimizer.

To avoid this, exclude Scribe.js from dependency optimization in `vite.config.ts`:

```typescript
optimizeDeps: {
  exclude: ['scribe.js-ocr'],
}
```

If you encounter an error similar to:

```text
Error: Could not load node_modules/@scribe.js/canvas-win32-x64-msvc/skia.win32-x64-msvc.node
stream did not contain valid UTF-8
```

Clear Vite's dependency cache and restart the development server:

**Linux / macOS:**

```bash
rm -rf node_modules/.vite
npm run dev
```

**Windows (PowerShell):**

```powershell
Remove-Item -Recurse -Force node_modules/.vite
npm run dev
```

## 🧠 Design Principles

- **One application, multiple tools** — A central home page provides access to every experiment.
- **Lazy loading** — Experiments are loaded on demand, keeping the initial application bundle lightweight.
- **Independent experiments** — Each tool lives in its own directory and manages its own implementation and dependencies.
- **Registry-driven architecture** — A single registry controls which experiments appear in the catalog and which routes are available.
- **Easy extraction** — Experiments can eventually be moved into standalone repositories when they grow into independent projects.

## 🛠 Technology Stack

| Technology       | Purpose                              |
| ---------------- | ------------------------------------ |
| React 18         | UI development                       |
| TypeScript       | Static typing                        |
| Vite             | Development server and build tooling |
| React Router DOM | Client-side routing                  |
| React Dropzone   | Drag-and-drop file uploads           |
| Tesseract.js     | Optical character recognition        |
| Scribe.js OCR    | Image and PDF text extraction        |

Additional libraries can be introduced as individual experiments require them.

## 📌 Notes

- The first OCR run may require downloading language data. English language data can take approximately 10–20 MB, depending on the engine and configuration.
- OCR languages can be configured using language codes such as `eng`, `fra`, `spa`, and `chi_sim`.
- Global styles and shared layout rules live in `src/index.css`.
- Individual experiments can maintain their own CSS files for experiment-specific styling.

---

_Built as a space to experiment, compare technologies, and turn interesting ideas into working tools._

---
