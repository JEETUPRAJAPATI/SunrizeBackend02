import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
// Removed cookieParser - using JWT Bearer tokens only
import cors from "cors";
import path from "path";
import { setupVite, serveStatic, log } from "./vite";

// Import ES modules
import connectDB from "./config/database.js";
import createSeedUsers from "./seed/seedUsers.js";
import { seedInventoryData } from "./seed/seedInventory.js";

const app = express();
// Basic middleware - JSON parsing will be handled by API router

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Add body parsing and static file serving
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


// Serve static files for profile pictures
app.use('/uploads', express.static('uploads'));

(async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Create seed users after database connection
    // await createSeedUsers();

    // Seed inventory data
    // await seedInventoryData();
    // aa
    // Seed company data
    // const { seedCompanyData } = await import('./seed/seedCompanies.js');
    // await seedCompanyData();

    // Create HTTP server first
    const server = createServer(app);

    // STEP 1: Add middleware
    app.use(cors({
      origin: ['http://localhost:5000', 'https://3119338b-e714-42ee-ad89-db926ce8b72e-00-19uqh907sthf1.kirk.replit.dev'],
      credentials: true
    }));
    app.use(express.json());


    // Static file serving for uploaded images
    app.use('/uploads', express.static('uploads'));

    // Placeholder image endpoint - no auth required for UI elements
    app.get('/api/placeholder/:width/:height', (req, res) => {
      const { width, height } = req.params;
      // Generate a simple SVG placeholder
      const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <rect x="2" y="2" width="${width-4}" height="${height-4}" fill="#e5e7eb" rx="4"/>
        <circle cx="${width/2}" cy="${height/2-4}" r="8" fill="#9ca3af"/>
        <rect x="${width/2-6}" y="${height/2+4}" width="12" height="2" fill="#9ca3af" rx="1"/>
      </svg>`;
      
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      res.send(svg);
    });

    // Serve test file for debugging
    app.get('/test-profile', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'test-profile.html'));
    });

    // STEP 2: Register API routes DIRECTLY
    try {
      const authRoutes = (await import('./auth-routes.js')).default;
      app.use('/api', authRoutes);

      const profileRoutes = (await import('./routes/profileRoutes.js')).default;
      app.use('/api', profileRoutes);

      const inventoryRoutes = (await import('./routes/inventoryRoutes.js')).default;
      app.use('/api', inventoryRoutes);

      const customerRoutes = (await import('./routes/customerRoutes.js')).default;
      app.use('/api', customerRoutes);

      const supplierRoutes = (await import('./routes/supplierRoutes.js')).default;
      app.use('/api', supplierRoutes);

      const companyRoutes = (await import('./routes/companyRoutes.js')).default;
      app.use('/api/companies', companyRoutes);
      console.log('Company routes registered at /api/companies');

      log("API routes registered successfully");
    } catch (error) {
      log(`Error importing routes: ${error.message}`);
      throw error;
    }

    // Setup Vite/static serving AFTER API routes
    if (process.env.NODE_ENV === "production") {
      serveStatic(app);
    } else {
      await setupVite(app, server);
      log("Vite middleware setup complete");
    }

    // Add catch-all for unmatched API routes AFTER Vite
    app.use('/api/*', (req, res) => {
      res.status(404).json({ error: 'API endpoint not found', method: req.method, path: req.originalUrl });
    });



    // Error handling middleware (should be last)
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      log(`Error ${status}: ${message}`, "error");
      res.status(status).json({ message });
    });

    // ALWAYS serve the app on port 5000
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = 5000;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`serving on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
