# 🧪 ExploringTechs

A place to try out technologies — see how they work and how to set them up.

🌐 **Live Demo:** [ExploringTechs](https://ExploringTechs.vercel.app)

Each experiment lives at its own route. Open one and see for yourself.

## Tools

| Tool           | Route          |
| -------------- | -------------- |
| OCR Comparison | `/ocr-compare` |

More coming: barcode scanner, QR code generator, and whatever else looks interesting.

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:5173 and pick a tool from the home page.

New experiments are registered in `src/experiments/index.ts` — cards and routes are generated from there.

---

_Built as a space to experiment, compare technologies, and turn interesting ideas into working tools._
