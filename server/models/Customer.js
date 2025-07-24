import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  contactPerson: {
    type: String,
    trim: true,
    maxlength: [50, 'Contact person cannot exceed 50 characters']
  },
  designation: {
    type: String,
    trim: true,
    maxlength: [50, 'Designation cannot exceed 50 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Distributor', 'Retailer', 'Wholesaler', 'End User'],
      message: 'Category must be one of: Distributor, Retailer, Wholesaler, End User'
    },
    default: 'Distributor'
  },
  categoryNote: {
    type: String,
    trim: true,
    maxlength: [200, 'Category note cannot exceed 200 characters']
  },
  active: {
    type: String,
    required: [true, 'Active status is required'],
    enum: {
      values: ['Yes', 'No'],
      message: 'Active must be either Yes or No'
    },
    default: 'Yes'
  },
  
  // Contact Information
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    validate: {
      validator: function(v) {
        return /^[0-9]{10}$/.test(v); // 10 digit mobile number
      },
      message: 'Mobile number must be exactly 10 digits'
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  gstin: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Optional field
        return v.length === 15; // Just check length
      },
      message: 'GSTIN must be exactly 15 characters'
    }
  },
  salesContact: {
    type: String,
    trim: true,
    maxlength: [50, 'Sales contact cannot exceed 50 characters']
  },

  // Address Information
  address1: {
    type: String,
    trim: true,
    maxlength: [200, 'Address cannot exceed 200 characters']
  },
  googlePin: {
    type: String,
    trim: true,
    maxlength: [100, 'Google Pin cannot exceed 100 characters']
  },
  city: {
    type: String,
    trim: true,
    maxlength: [50, 'City cannot exceed 50 characters']
  },
  state: {
    type: String,
    trim: true,
    maxlength: [50, 'State cannot exceed 50 characters']
  },
  country: {
    type: String,
    trim: true,
    default: 'India',
    maxlength: [50, 'Country cannot exceed 50 characters']
  },
  pin: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Optional field
        return /^\d{6}$/.test(v);
      },
      message: 'PIN code must be exactly 6 digits'
    }
  },

  // Financial fields (optional for future use)
  creditLimit: {
    type: Number,
    default: 0,
    min: 0
  },
  outstandingAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true }
});

// Auto-generate customer code before saving
customerSchema.pre('save', function(next) {
  if (!this.customerCode) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    this.customerCode = `CUST-${timestamp}-${random}`;
  }
  next();
});

// Indexes for better query performance
customerSchema.index({ name: 1 });
customerSchema.index({ category: 1 });
customerSchema.index({ active: 1 });
customerSchema.index({ mobile: 1 });
customerSchema.index({ email: 1 });
customerSchema.index({ createdAt: -1 });

export default mongoose.model('Customer', customerSchema);
