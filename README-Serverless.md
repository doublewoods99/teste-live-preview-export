# Serverless PDF Export Setup

This project implements a **Preview → HTML Extraction → Puppeteer → PDF** flow using Vercel serverless functions with `@sparticuz/chromium`.

## Architecture

### Frontend (React + Vite)
- **Preview Component**: Renders resume using React components
- **HTML Extractor**: Captures exact HTML + CSS from rendered preview
- **PDF Exporter**: Sends extracted HTML to serverless function

### Backend (Vercel Serverless Functions)
- **`/api/pdf-export`**: Receives HTML, uses Puppeteer + Chromium to generate PDF
- **`/api/health`**: Health check endpoint

## Key Dependencies

```json
{
  "dependencies": {
    "@sparticuz/chromium": "^123.0.0",
    "puppeteer-core": "^22.6.2"
  },
  "devDependencies": {
    "puppeteer": "^22.6.2"
  }
}
```

## Configuration Files

### `vercel.json`
- Sets function timeout to 60 seconds (PDF generation can be slow)
- Configures API routing

### `vite.config.ts`
- Externalizes Puppeteer packages for proper bundling

## Local Development

1. **Start Vite dev server:**
   ```bash
   npm run dev
   ```

2. **Test serverless functions locally with Vercel CLI:**
   ```bash
   npx vercel dev --port 3000
   ```

## Deployment

Deploy to Vercel:
```bash
npx vercel --prod
```

## How It Works

1. **User clicks "Export PDF"**
2. **HTML Extraction**: Captures exact HTML + CSS from Preview component
3. **Serverless Function**: Receives HTML payload
4. **Puppeteer Generation**: 
   - Launches headless Chromium (via @sparticuz/chromium)
   - Sets HTML content
   - Generates PDF with proper formatting
5. **Download**: Returns PDF binary to frontend for download

## Benefits

- ✅ **Perfect Visual Fidelity**: Same browser engine for preview and PDF
- ✅ **No Dual Interpretation**: Single source of truth (Preview component)
- ✅ **Serverless**: No server maintenance, auto-scaling
- ✅ **Cost Effective**: Pay-per-use model
- ✅ **Complex Layout Support**: Handles all CSS, fonts, positioning

## Troubleshooting

### Function Timeout
- Increase `maxDuration` in `vercel.json`
- Consider using `@sparticuz/chromium-min` for faster cold starts

### Bundle Size Issues
- Functions must be <50MB
- Use `@sparticuz/chromium-min` if needed
- Host Chromium binary separately

### Local Development
- Puppeteer (full) for local development
- puppeteer-core + @sparticuz/chromium for production 