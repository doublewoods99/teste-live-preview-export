import puppeteer from 'puppeteer';
import puppeteerCore from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const config = {
  maxDuration: 60
};

async function getBrowser() {
  console.log('Environment check:', {
    VERCEL_ENV: process.env.VERCEL_ENV,
    NODE_ENV: process.env.NODE_ENV,
    isProduction: process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production'
  });

  if (process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production') {
    console.log('Using puppeteer-core with @sparticuz/chromium for production...');
    
    try {
      const executablePath = await chromium.executablePath();
      console.log('Chromium executable path:', executablePath);
      
      // Set essential environment variables for compatibility
      if (!process.env.AWS_LAMBDA_JS_RUNTIME) {
        process.env.AWS_LAMBDA_JS_RUNTIME = 'nodejs22.x';
      }
      
      const browser = await puppeteerCore.launch({
        args: [
          ...chromium.args,
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding'
        ],
        defaultViewport: chromium.defaultViewport,
        executablePath,
        headless: chromium.headless,
      });
      
      console.log('Browser launched successfully');
      return browser;
    } catch (error) {
      console.error('Failed to launch puppeteer-core:', error);
      throw error;
    }
  } else {
    console.log('Using full puppeteer for development...');
    
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      console.log('Development browser launched successfully');
      return browser;
    } catch (error) {
      console.error('Failed to launch puppeteer:', error);
      throw error;
    }
  }
}

export default async function handler(request, response) {
  console.log('PDF export request received:', {
    method: request.method,
    timestamp: new Date().toISOString()
  });

  // Set CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    console.log('Handling preflight request');
    response.status(200).end();
    return;
  }

  if (request.method !== 'POST') {
    console.log('Invalid method:', request.method);
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let browser = null;

  try {
    const { html, options = {} } = request.body;

    if (!html) {
      console.log('No HTML content provided');
      response.status(400).json({ error: 'HTML content is required' });
      return;
    }

    console.log('HTML content length:', html.length);
    console.log('PDF options:', options);

    console.log('Starting browser launch...');
    browser = await getBrowser();

    console.log('Creating new page...');
    const page = await browser.newPage();

    console.log('Setting HTML content...');
    await page.setContent(html, { 
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    console.log('Generating PDF...');
    const pdfOptions = {
      format: options.format || 'A4',
      printBackground: true,
      margin: {
        top: '0',
        right: '0',
        bottom: '0',
        left: '0'
      },
      ...(options.margin && {
        margin: {
          top: '0',
          right: '0', 
          bottom: '0',
          left: '0'
        }
      })
    };

    console.log('PDF options applied:', pdfOptions);

    const pdfBuffer = await page.pdf(pdfOptions);
    console.log('PDF generated successfully, size:', pdfBuffer.length, 'bytes');

    await browser.close();
    browser = null;

    // Return PDF as binary data
    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
    response.status(200).send(pdfBuffer);

  } catch (error) {
    console.error('PDF generation error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    // Ensure browser is closed even on error
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }

    response.status(500).json({ 
      error: 'Failed to generate PDF',
      details: error.message,
      type: error.name || 'Unknown'
    });
  }
} 