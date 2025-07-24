import Customer from '../models/Customer.js';
import * as XLSX from 'xlsx';
import multer from 'multer';
import { body, validationResult, query } from 'express-validator';
import notificationService from '../services/notificationService.js';

// Configure multer for file upload
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files (.xlsx, .xls) are allowed'), false);
    }
  }
});

// Validation rules for customer creation
export const validateCustomer = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['Distributor', 'Retailer', 'Wholesaler', 'End User'])
    .withMessage('Category must be one of: Distributor, Retailer, Wholesaler, End User'),
  
  body('active')
    .optional()
    .isIn(['Yes', 'No'])
    .withMessage('Active must be either Yes or No'),
  
  body('gstin')
    .optional()
    .custom((value) => {
      if (value && value.length !== 15) {
        throw new Error('GSTIN must be exactly 15 characters');
      }
      return true;
    }),
  
  body('mobile')
    .notEmpty()
    .withMessage('Mobile number is required')
    .matches(/^[0-9]{10}$/)
    .withMessage('Mobile number must be exactly 10 digits'),
  
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  body('pin')
    .optional()
    .matches(/^\d{6}$/)
    .withMessage('PIN code must be exactly 6 digits'),
  
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
];

// Validation rules for queries
export const validateCustomerQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('status')
    .optional()
    .isIn(['Active', 'Inactive'])
    .withMessage('Status filter must be Active or Inactive'),
  
  query('customerType')
    .optional()
    .isIn(['Distributor', 'Retailer', 'Wholesaler', 'End User'])
    .withMessage('Customer type filter is invalid'),
  
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'name', 'category', 'active'])
    .withMessage('Sort field must be one of: createdAt, name, category, active'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc')
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

export const getCustomers = [
  validateCustomerQuery,
  handleValidationErrors,
  async (req, res) => {
    try {
      const {
        page = 1,
        limit = 50,
        status,
        customerType,
        name,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      // Build filter object
      const filter = {};
      if (status) {
        // Handle status filter - backend stores 'Yes'/'No' but query might send 'Active'/'Inactive'
        if (status === 'Active') filter.active = 'Yes';
        else if (status === 'Inactive') filter.active = 'No';
        else filter.active = status; // Handle direct 'Yes'/'No' values
      }
      if (customerType) filter.category = customerType;
      if (name) {
        filter.$or = [
          { name: { $regex: name, $options: 'i' } },
          { contactPerson: { $regex: name, $options: 'i' } },
          { mobile: { $regex: name, $options: 'i' } },
          { email: { $regex: name, $options: 'i' } },
          { city: { $regex: name, $options: 'i' } },
          { state: { $regex: name, $options: 'i' } }
        ];
      }

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Execute queries
      const [customers, total] = await Promise.all([
        Customer.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Customer.countDocuments(filter)
      ]);

      res.json({
        success: true,
        customers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching customers:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching customers',
        error: error.message
      });
    }
  }
];

export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid customer ID format'
      });
    }

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.json({
      success: true,
      customer
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customer',
      error: error.message
    });
  }
};

export const createCustomer = [
  validateCustomer,
  handleValidationErrors,
  async (req, res) => {
    try {
      // Check for duplicate mobile number
      const existingCustomer = await Customer.findOne({ mobile: req.body.mobile });
      if (existingCustomer) {
        return res.status(400).json({
          success: false,
          message: 'Customer with this mobile number already exists',
          errors: [{ field: 'mobile', message: 'Mobile number must be unique' }]
        });
      }

      // Check for duplicate email if provided
      if (req.body.email) {
        const existingEmail = await Customer.findOne({ email: req.body.email });
        if (existingEmail) {
          return res.status(400).json({
            success: false,
            message: 'Customer with this email already exists',
            errors: [{ field: 'email', message: 'Email must be unique' }]
          });
        }
      }

      const customer = new Customer(req.body);
      await customer.save();

      // Trigger notification for new customer
      try {
        await notificationService.triggerCustomerNotification(customer);
      } catch (notificationError) {
        console.error('Failed to send customer notification:', notificationError);
      }

      res.status(201).json({
        success: true,
        message: 'Customer created successfully',
        customer
      });
    } catch (error) {
      console.error('Error creating customer:', error);
      
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }));
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error creating customer',
        error: error.message
      });
    }
  }
];

export const updateCustomer = [
  validateCustomer,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid customer ID format'
        });
      }

      // Check for duplicate mobile number (excluding current customer)
      if (req.body.mobile) {
        const existingCustomer = await Customer.findOne({ 
          mobile: req.body.mobile,
          _id: { $ne: id }
        });
        if (existingCustomer) {
          return res.status(400).json({
            success: false,
            message: 'Customer with this mobile number already exists',
            errors: [{ field: 'mobile', message: 'Mobile number must be unique' }]
          });
        }
      }

      // Check for duplicate email if provided (excluding current customer)
      if (req.body.email) {
        const existingEmail = await Customer.findOne({ 
          email: req.body.email,
          _id: { $ne: id }
        });
        if (existingEmail) {
          return res.status(400).json({
            success: false,
            message: 'Customer with this email already exists',
            errors: [{ field: 'email', message: 'Email must be unique' }]
          });
        }
      }

      const customer = await Customer.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      res.json({
        success: true,
        message: 'Customer updated successfully',
        customer
      });
    } catch (error) {
      console.error('Error updating customer:', error);
      
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }));
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error updating customer',
        error: error.message
      });
    }
  }
];

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid customer ID format'
      });
    }

    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting customer',
      error: error.message
    });
  }
};

export const getCustomerStats = async (req, res) => {
  try {
    const [
      totalCustomers,
      activeCustomers,
      distributorCustomers,
      retailerCustomers,
      wholesalerCustomers,
      endUserCustomers
    ] = await Promise.all([
      Customer.countDocuments(),
      Customer.countDocuments({ active: 'Yes' }),
      Customer.countDocuments({ category: 'Distributor' }),
      Customer.countDocuments({ category: 'Retailer' }),
      Customer.countDocuments({ category: 'Wholesaler' }),
      Customer.countDocuments({ category: 'End User' })
    ]);

    res.json({
      success: true,
      stats: {
        total: totalCustomers,
        active: activeCustomers,
        inactive: totalCustomers - activeCustomers,
        byType: {
          distributor: distributorCustomers,
          retailer: retailerCustomers,
          wholesaler: wholesalerCustomers,
          endUser: endUserCustomers
        }
      }
    });
  } catch (error) {
    console.error('Error fetching customer stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customer statistics',
      error: error.message
    });
  }
};

// Export customers to Excel
export const exportCustomersToExcel = async (req, res) => {
  try {
    const customers = await Customer.find({}).sort({ createdAt: -1 });
    
    const excelData = customers.map(customer => ({
      'Customer Code': customer.customerCode || '',
      'Customer Name': customer.customerName || '',
      'Customer Type': customer.customerType || '',
      'Status': customer.status || '',
      'GSTIN': customer.gstin || '',
      'Contact Name': customer.contactName || '',
      'Mobile': customer.mobile || '',
      'Email': customer.email || '',
      'Address Line 1': customer.addressLine1 || '',
      'City': customer.city || '',
      'State': customer.state || '',
      'Country': customer.country || '',
      'PIN': customer.pin || '',
      'Notes': customer.notes || '',
      'Credit Limit': customer.creditLimit || 0,
      'Outstanding Amount': customer.outstandingAmount || 0,
      'Created Date': customer.createdAt ? customer.createdAt.toISOString().split('T')[0] : ''
    }));

    if (excelData.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No customers found to export'
      });
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Auto-size columns
    const colWidths = [];
    Object.keys(excelData[0] || {}).forEach(key => {
      const maxLength = Math.max(
        key.length,
        ...excelData.map(row => String(row[key] || '').length)
      );
      colWidths.push({ width: Math.min(maxLength + 2, 50) });
    });
    worksheet['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
    
    const excelBuffer = XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx'
    });

    const filename = `customers_export_${Date.now()}.xlsx`;
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(excelBuffer);

    console.log(`Customers Excel file exported: ${filename} (${excelData.length} records)`);
  } catch (error) {
    console.error('Error exporting customers to Excel:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting customers to Excel',
      error: error.message
    });
  }
};

// Import customers from Excel
export const importCustomersFromExcel = [upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    if (jsonData.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Excel file is empty or has no valid data'
      });
    }

    const results = {
      total: jsonData.length,
      successful: 0,
      failed: 0,
      errors: [],
      warnings: []
    };

    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      const rowNumber = i + 2;

      try {
        // Map Excel columns to database fields with multiple possible column names
        const customerData = {
          customerName: row['Customer Name'] || row['Name'] || '',
          customerType: row['Customer Type'] || row['Type'] || 'Retail',
          status: row['Status'] || 'Active',
          gstin: row['GSTIN'] || row['GST'] || '',
          contactName: row['Contact Name'] || row['Contact'] || '',
          mobile: row['Mobile'] || row['Phone'] || '',
          email: row['Email'] || '',
          addressLine1: row['Address Line 1'] || row['Address'] || '',
          city: row['City'] || '',
          state: row['State'] || '',
          country: row['Country'] || 'India',
          pin: row['PIN'] || row['Pincode'] || '',
          notes: row['Notes'] || '',
          creditLimit: parseFloat(row['Credit Limit']) || 0,
          outstandingAmount: parseFloat(row['Outstanding Amount']) || 0
        };

        // Validate required fields
        if (!customerData.customerName) {
          results.errors.push(`Row ${rowNumber}: Customer name is required`);
          results.failed++;
          continue;
        }

        if (!customerData.contactName) {
          results.errors.push(`Row ${rowNumber}: Contact name is required`);
          results.failed++;
          continue;
        }

        if (!customerData.mobile) {
          results.errors.push(`Row ${rowNumber}: Mobile number is required`);
          results.failed++;
          continue;
        }

        // Validate mobile number format
        if (!/^[6-9]\d{9}$/.test(customerData.mobile)) {
          results.errors.push(`Row ${rowNumber}: Mobile number must be 10 digits starting with 6, 7, 8, or 9`);
          results.failed++;
          continue;
        }

        // Validate customer type
        if (!['Retail', 'Wholesale', 'Export', 'Distributor', 'Manufacturer'].includes(customerData.customerType)) {
          results.warnings.push(`Row ${rowNumber}: Invalid customer type "${customerData.customerType}", using "Retail"`);
          customerData.customerType = 'Retail';
        }

        // Validate status
        if (!['Active', 'Inactive'].includes(customerData.status)) {
          results.warnings.push(`Row ${rowNumber}: Invalid status "${customerData.status}", using "Active"`);
          customerData.status = 'Active';
        }

        // Check for duplicate mobile number
        const existingCustomer = await Customer.findOne({ mobile: customerData.mobile });
        if (existingCustomer) {
          // Update existing customer
          await Customer.findByIdAndUpdate(existingCustomer._id, customerData, { runValidators: true });
          results.warnings.push(`Row ${rowNumber}: Customer with mobile ${customerData.mobile} updated`);
        } else {
          // Create new customer
          await Customer.create(customerData);
        }

        results.successful++;
      } catch (rowError) {
        console.error(`Error processing row ${rowNumber}:`, rowError);
        let errorMessage = rowError.message;
        
        if (rowError.name === 'ValidationError') {
          const validationErrors = Object.values(rowError.errors).map(err => err.message);
          errorMessage = validationErrors.join(', ');
        }
        
        results.errors.push(`Row ${rowNumber}: ${errorMessage}`);
        results.failed++;
      }
    }

    res.json({
      success: results.failed === 0,
      message: `Import completed: ${results.successful} successful, ${results.failed} failed`,
      results
    });

  } catch (error) {
    console.error('Error importing Excel file:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error importing Excel file', 
      error: error.message
    });
  }
}];