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

    // Serve test file for debugging
    app.get('/test-profile', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'test-profile.html'));
    });

    // Fix Sales permissions endpoint (development only - no auth required)
    app.get('/api/fix-sales-permissions', async (req, res) => {
      try {
        const User = (await import('./models/User.js')).default;
        
        const result = await User.updateMany(
          { role: 'Sales' },
          {
            $set: {
              'permissions.modules': [
                {
                  name: 'sales',
                  dashboard: true,
                  features: [
                    { key: 'salesDashboard', view: true, add: true, edit: true, delete: true, alter: true },
                    { key: 'orders', view: true, add: true, edit: true, delete: true, alter: true },
                    { key: 'myCustomers', view: true, add: true, edit: true, delete: true, alter: true },
                    { key: 'myDeliveries', view: true, add: false, edit: false, delete: false, alter: false },
                    { key: 'myInvoices', view: true, add: false, edit: false, delete: false, alter: false },
                    { key: 'refundReturn', view: true, add: true, edit: true, delete: true, alter: true }
                  ]
                },
                {
                  name: 'inventory',
                  dashboard: false,
                  features: [
                    { key: 'items', view: true, add: false, edit: false, delete: false, alter: false }
                  ]
                }
              ]
            }
          }
        );

        res.json({
          success: true,
          message: 'Sales permissions updated successfully',
          result
        });
      } catch (error) {
        console.error('Error fixing sales permissions:', error);
        res.status(500).json({
          success: false,
          message: 'Error fixing sales permissions',
          error: error.message
        });
      }
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

      const { default: orderRoutes, salesRouter } = await import('./routes/orderRoutes.js');
      app.use('/api/orders', orderRoutes);
      app.use('/api/sales', salesRouter);
      console.log('Order routes registered at /api/orders');
      console.log('Sales routes registered at /api/sales');

      const returnRoutes = (await import('./routes/returnRoutes.js')).default;
      app.use('/api/returns', returnRoutes);
      console.log('Return routes registered at /api/returns');

      const dashboardRoutes = (await import('./routes/dashboardRoutes.js')).default;
      app.use('/api/dashboard', dashboardRoutes);
      console.log('Dashboard routes registered at /api/dashboard');



      // Customer seeding available via endpoint only

      // Seed routes without authentication (development only)
      app.get('/api/seed-customers-now', async (req, res) => {
        try {
          const { seedCustomersDirectly } = await import('./utils/seedCustomersDirect.js');
          const result = await seedCustomersDirectly();
          res.json(result);
        } catch (error) {
          console.error('Error seeding customers:', error);
          res.status(500).json({
            success: false,
            message: 'Error seeding customers',
            error: error.message
          });
        }
      });

      app.post('/api/seed/seed-customers', async (req, res) => {
        try {
          const { seedCustomersDirectly } = await import('./utils/seedCustomersDirect.js');
          const result = await seedCustomersDirectly();
          res.json(result);
        } catch (error) {
          console.error('Error seeding customers:', error);
          res.status(500).json({
            success: false,
            message: 'Error seeding customers',
            error: error.message
          });
        }
      });

      // Seed orders route (no auth required for development)
      app.post('/api/seed-orders', async (req, res) => {
        try {
          const { seedOrdersData } = await import('./seed/seedOrders.js');
          const result = await seedOrdersData();
          res.json(result);
        } catch (error) {
          console.error('Error seeding orders:', error);
          res.status(500).json({
            success: false,
            message: 'Error seeding orders',
            error: error.message
          });
        }
      });

      // Alternative direct seeding route
      app.post('/api/direct-seed-customers', async (req, res) => {
        try {
          const Customer = (await import('./models/Customer.js')).default;
          
          // Clear existing customers
          await Customer.deleteMany({});
          console.log('Cleared existing customers');

          // Complete 15 dummy customers
          const sampleCustomers = [
            { name: 'Kolkata Retail Ltd', contactPerson: 'Subrata Chatterjee', designation: 'Purchase Manager', category: 'Distributor', categoryNote: 'Main distributor for eastern region', active: 'Yes', mobile: '9876789012', email: 'subrata@kolkataretail.com', gstin: '19ABCDE1234F1Z5', address1: '123 Park Street, Central Kolkata', googlePin: 'https://goo.gl/maps/abc123', city: 'Kolkata', state: 'West Bengal', country: 'India', pin: '700001', salesContact: 'sales1' },
            { name: 'Chennai Manufacturing Co', contactPerson: 'Ravi Kumar', designation: 'Operations Head', category: 'Retailer', categoryNote: 'Large scale retailer in Tamil Nadu', active: 'Yes', mobile: '9876512345', email: 'ravi@chennaimanuf.com', gstin: '33FGHIJ5678G2A6', address1: '456 Anna Salai, T Nagar', googlePin: 'https://goo.gl/maps/def456', city: 'Chennai', state: 'Tamil Nadu', country: 'India', pin: '600017', salesContact: 'sales2' },
            { name: 'Technovision Systems', contactPerson: 'Amit Sharma', designation: 'Technical Director', category: 'End User', categoryNote: 'Technology solutions provider', active: 'Yes', mobile: '9988776655', email: 'amit@technovision.in', gstin: '06KLMNO9012H3B7', address1: '789 Cyber City, Sector 21', googlePin: 'https://goo.gl/maps/ghi789', city: 'Gurgaon', state: 'Haryana', country: 'India', pin: '122001', salesContact: 'sales3' },
            { name: 'Global Export House', contactPerson: 'Sunita Patel', designation: 'Export Manager', category: 'Wholesaler', categoryNote: 'International export specialist', active: 'Yes', mobile: '9445566778', email: 'sunita@globalexport.com', gstin: '36PQRST3456I4C8', address1: '321 Export Plaza, HITEC City', googlePin: 'https://goo.gl/maps/jkl012', city: 'Hyderabad', state: 'Telangana', country: 'India', pin: '500081', salesContact: 'sales1' },
            { name: 'Mumbai Traders Corp', contactPerson: 'Priya Mehta', designation: 'Business Head', category: 'Distributor', categoryNote: 'Leading trader in Maharashtra', active: 'Yes', mobile: '9123456789', email: 'priya@mumbaitraders.com', gstin: '27UVWXY7890J5D9', address1: '654 Commercial Street, Andheri', googlePin: 'https://goo.gl/maps/mno345', city: 'Mumbai', state: 'Maharashtra', country: 'India', pin: '400053', salesContact: 'sales2' },
            { name: 'Delhi Electronics Hub', contactPerson: 'Rajesh Gupta', designation: 'Store Manager', category: 'Retailer', categoryNote: 'Electronics retail chain', active: 'Yes', mobile: '9876543210', email: 'rajesh@delhielectronics.com', gstin: '07ABCDE2345K6E0', address1: '987 Nehru Place, Central Delhi', googlePin: 'https://goo.gl/maps/pqr678', city: 'New Delhi', state: 'Delhi', country: 'India', pin: '110019', salesContact: 'sales3' },
            { name: 'Bangalore Software Solutions', contactPerson: 'Meera Iyer', designation: 'Project Manager', category: 'End User', categoryNote: 'Software development company', active: 'Yes', mobile: '9988554433', email: 'meera@bangaloresoftware.com', gstin: '29FGHIJ6789L7F1', address1: '147 Brigade Road, Commercial Street', googlePin: 'https://goo.gl/maps/stu901', city: 'Bangalore', state: 'Karnataka', country: 'India', pin: '560025', salesContact: 'sales1' },
            { name: 'Pune Auto Parts', contactPerson: 'Vikram Singh', designation: 'Purchase Officer', category: 'Wholesaler', categoryNote: 'Automotive parts wholesaler', active: 'Yes', mobile: '9876123456', email: 'vikram@puneautoparts.com', gstin: '27KLMNO4567M8G2', address1: '258 Shivaji Road, Pimpri', googlePin: 'https://goo.gl/maps/vwx234', city: 'Pune', state: 'Maharashtra', country: 'India', pin: '411018', salesContact: 'sales2' },
            { name: 'Ahmedabad Textiles', contactPerson: 'Kiran Shah', designation: 'Production Head', category: 'Distributor', categoryNote: 'Textile manufacturing and distribution', active: 'Yes', mobile: '9445123789', email: 'kiran@ahmedabadtextiles.com', gstin: '24PQRST8901N9H3', address1: '369 Textile Market, Ashram Road', googlePin: 'https://goo.gl/maps/yzx567', city: 'Ahmedabad', state: 'Gujarat', country: 'India', pin: '380009', salesContact: 'sales3' },
            { name: 'Jaipur Handicrafts', contactPerson: 'Pooja Agarwal', designation: 'Creative Director', category: 'Retailer', categoryNote: 'Traditional handicrafts retailer', active: 'Yes', mobile: '9887654321', email: 'pooja@jaipurhandicrafts.com', gstin: '08UVWXY5432O0I4', address1: '741 Johari Bazaar, Pink City', googlePin: 'https://goo.gl/maps/abc890', city: 'Jaipur', state: 'Rajasthan', country: 'India', pin: '302003', salesContact: 'sales1' },
            { name: 'Cochin Spices Export', contactPerson: 'Suresh Nair', designation: 'Quality Manager', category: 'End User', categoryNote: 'Spices export business', active: 'Yes', mobile: '9876789123', email: 'suresh@cochinspices.com', gstin: '32ABCDE7890P1J5', address1: '852 Spice Market, Mattancherry', googlePin: 'https://goo.gl/maps/def123', city: 'Kochi', state: 'Kerala', country: 'India', pin: '682002', salesContact: 'sales2' },
            { name: 'Lucknow Food Products', contactPerson: 'Anita Verma', designation: 'Operations Manager', category: 'Wholesaler', categoryNote: 'Food products wholesaler', active: 'Yes', mobile: '9123789456', email: 'anita@lucknowfood.com', gstin: '09FGHIJ3456Q2K6', address1: '963 Chowk Area, Aminabad', googlePin: 'https://goo.gl/maps/ghi456', city: 'Lucknow', state: 'Uttar Pradesh', country: 'India', pin: '226018', salesContact: 'sales3' },
            { name: 'Chandigarh Electronics', contactPerson: 'Manpreet Kaur', designation: 'Store Owner', category: 'Distributor', categoryNote: 'Electronics distribution chain', active: 'Yes', mobile: '9988112233', email: 'manpreet@chandigarhelectronics.com', gstin: '04KLMNO6789R3L7', address1: '174 Sector 22, Industrial Area', googlePin: 'https://goo.gl/maps/jkl789', city: 'Chandigarh', state: 'Chandigarh', country: 'India', pin: '160022', salesContact: 'sales1' },
            { name: 'Bhopal Chemical Works', contactPerson: 'Rahul Tiwari', designation: 'Plant Manager', category: 'Retailer', categoryNote: 'Chemical manufacturing unit', active: 'No', mobile: '9876543987', email: 'rahul@bhopalchemical.com', gstin: '23PQRST2345S4M8', address1: '285 Industrial Estate, Mandideep', googlePin: 'https://goo.gl/maps/mno012', city: 'Bhopal', state: 'Madhya Pradesh', country: 'India', pin: '462046', salesContact: 'sales2' },
            { name: 'Indore Pharma Ltd', contactPerson: 'Dr. Kavita Jain', designation: 'Research Head', category: 'End User', categoryNote: 'Pharmaceutical research company', active: 'Yes', mobile: '9445667788', email: 'kavita@indorepharma.com', gstin: '23UVWXY9012T5N9', address1: '396 Pharma Park, Pithampur', googlePin: 'https://goo.gl/maps/pqr345', city: 'Indore', state: 'Madhya Pradesh', country: 'India', pin: '453661', salesContact: 'sales3' }
          ];

          // Insert new sample customers
          const insertedCustomers = await Customer.insertMany(sampleCustomers);
          console.log(`Successfully seeded ${insertedCustomers.length} customers`);

          res.json({
            success: true,
            message: `Successfully seeded ${insertedCustomers.length} customers`,
            customers: insertedCustomers
          });
        } catch (error) {
          console.error('Error seeding customers:', error);
          res.status(500).json({
            success: false,
            message: 'Error seeding customers',
            error: error.message
          });
        }
      });

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
