import mongoose from 'mongoose';
import Customer from './server/models/Customer.js';

const MONGODB_URI = 'mongodb+srv://jeeturadicalloop:Mjvesqnj8gY3t0zP@cluster0.by2xy6x.mongodb.net/manufacturing-erp';

const customers = [
  { name: 'Kolkata Retail Ltd', contactPerson: 'Subrata Chatterjee', designation: 'Purchase Manager', category: 'Distributor', categoryNote: 'Main distributor for eastern region', active: 'Yes', mobile: '9876789012', email: 'subrata@kolkataretail.com', address1: '123 Park Street, Central Kolkata', googlePin: 'https://goo.gl/maps/abc123', city: 'Kolkata', state: 'West Bengal', country: 'India', pin: '700001', salesContact: 'sales1' },
  { name: 'Chennai Manufacturing Co', contactPerson: 'Ravi Kumar', designation: 'Operations Head', category: 'Retailer', categoryNote: 'Large scale retailer in Tamil Nadu', active: 'Yes', mobile: '9876512345', email: 'ravi@chennaimanuf.com', address1: '456 Anna Salai, T Nagar', googlePin: 'https://goo.gl/maps/def456', city: 'Chennai', state: 'Tamil Nadu', country: 'India', pin: '600017', salesContact: 'sales2' },
  { name: 'Technovision Systems', contactPerson: 'Amit Sharma', designation: 'Technical Director', category: 'End User', categoryNote: 'Technology solutions provider', active: 'Yes', mobile: '9988776655', email: 'amit@technovision.in', address1: '789 Cyber City, Sector 21', googlePin: 'https://goo.gl/maps/ghi789', city: 'Gurgaon', state: 'Haryana', country: 'India', pin: '122001', salesContact: 'sales3' },
  { name: 'Global Export House', contactPerson: 'Sunita Patel', designation: 'Export Manager', category: 'Wholesaler', categoryNote: 'International export specialist', active: 'Yes', mobile: '9445566778', email: 'sunita@globalexport.com', address1: '321 Export Plaza, HITEC City', googlePin: 'https://goo.gl/maps/jkl012', city: 'Hyderabad', state: 'Telangana', country: 'India', pin: '500081', salesContact: 'sales1' },
  { name: 'Mumbai Traders Corp', contactPerson: 'Priya Mehta', designation: 'Business Head', category: 'Distributor', categoryNote: 'Leading trader in Maharashtra', active: 'Yes', mobile: '9123456789', email: 'priya@mumbaitraders.com', address1: '654 Commercial Street, Andheri', googlePin: 'https://goo.gl/maps/mno345', city: 'Mumbai', state: 'Maharashtra', country: 'India', pin: '400053', salesContact: 'sales2' },
  { name: 'Delhi Electronics Hub', contactPerson: 'Rajesh Gupta', designation: 'Store Manager', category: 'Retailer', categoryNote: 'Electronics retail chain', active: 'Yes', mobile: '9876543210', email: 'rajesh@delhielectronics.com', address1: '987 Nehru Place, Central Delhi', googlePin: 'https://goo.gl/maps/pqr678', city: 'New Delhi', state: 'Delhi', country: 'India', pin: '110019', salesContact: 'sales3' },
  { name: 'Bangalore Software Solutions', contactPerson: 'Meera Iyer', designation: 'Project Manager', category: 'End User', categoryNote: 'Software development company', active: 'Yes', mobile: '9988554433', email: 'meera@bangaloresoftware.com', address1: '147 Brigade Road, Commercial Street', googlePin: 'https://goo.gl/maps/stu901', city: 'Bangalore', state: 'Karnataka', country: 'India', pin: '560025', salesContact: 'sales1' },
  { name: 'Pune Auto Parts', contactPerson: 'Vikram Singh', designation: 'Purchase Officer', category: 'Wholesaler', categoryNote: 'Automotive parts wholesaler', active: 'Yes', mobile: '9876123456', email: 'vikram@puneautoparts.com', address1: '258 Shivaji Road, Pimpri', googlePin: 'https://goo.gl/maps/vwx234', city: 'Pune', state: 'Maharashtra', country: 'India', pin: '411018', salesContact: 'sales2' },
  { name: 'Ahmedabad Textiles', contactPerson: 'Kiran Shah', designation: 'Production Head', category: 'Distributor', categoryNote: 'Textile manufacturing and distribution', active: 'Yes', mobile: '9445123789', email: 'kiran@ahmedabadtextiles.com', address1: '369 Textile Market, Ashram Road', googlePin: 'https://goo.gl/maps/yzx567', city: 'Ahmedabad', state: 'Gujarat', country: 'India', pin: '380009', salesContact: 'sales3' },
  { name: 'Jaipur Handicrafts', contactPerson: 'Pooja Agarwal', designation: 'Creative Director', category: 'Retailer', categoryNote: 'Traditional handicrafts retailer', active: 'Yes', mobile: '9887654321', email: 'pooja@jaipurhandicrafts.com', address1: '741 Johari Bazaar, Pink City', googlePin: 'https://goo.gl/maps/abc890', city: 'Jaipur', state: 'Rajasthan', country: 'India', pin: '302003', salesContact: 'sales1' },
  { name: 'Cochin Spices Export', contactPerson: 'Suresh Nair', designation: 'Quality Manager', category: 'End User', categoryNote: 'Spices export business', active: 'Yes', mobile: '9876789123', email: 'suresh@cochinspices.com', address1: '852 Spice Market, Mattancherry', googlePin: 'https://goo.gl/maps/def123', city: 'Kochi', state: 'Kerala', country: 'India', pin: '682002', salesContact: 'sales2' },
  { name: 'Lucknow Food Products', contactPerson: 'Anita Verma', designation: 'Operations Manager', category: 'Wholesaler', categoryNote: 'Food products wholesaler', active: 'Yes', mobile: '9123789456', email: 'anita@lucknowfood.com', address1: '963 Chowk Area, Aminabad', googlePin: 'https://goo.gl/maps/ghi456', city: 'Lucknow', state: 'Uttar Pradesh', country: 'India', pin: '226018', salesContact: 'sales3' },
  { name: 'Chandigarh Electronics', contactPerson: 'Manpreet Kaur', designation: 'Store Owner', category: 'Distributor', categoryNote: 'Electronics distribution chain', active: 'Yes', mobile: '9988112233', email: 'manpreet@chandigarhelectronics.com', address1: '174 Sector 22, Industrial Area', googlePin: 'https://goo.gl/maps/jkl789', city: 'Chandigarh', state: 'Chandigarh', country: 'India', pin: '160022', salesContact: 'sales1' },
  { name: 'Bhopal Chemical Works', contactPerson: 'Rahul Tiwari', designation: 'Plant Manager', category: 'Retailer', categoryNote: 'Chemical manufacturing unit', active: 'No', mobile: '9876543987', email: 'rahul@bhopalchemical.com', address1: '285 Industrial Estate, Mandideep', googlePin: 'https://goo.gl/maps/mno012', city: 'Bhopal', state: 'Madhya Pradesh', country: 'India', pin: '462046', salesContact: 'sales2' },
  { name: 'Indore Pharma Ltd', contactPerson: 'Dr. Kavita Jain', designation: 'Research Head', category: 'End User', categoryNote: 'Pharmaceutical research company', active: 'Yes', mobile: '9445667788', email: 'kavita@indorepharma.com', address1: '396 Pharma Park, Pithampur', googlePin: 'https://goo.gl/maps/pqr345', city: 'Indore', state: 'Madhya Pradesh', country: 'India', pin: '453661', salesContact: 'sales3' }
];

async function seedCustomers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    await Customer.deleteMany({});
    console.log('Cleared existing customers');
    
    const inserted = await Customer.insertMany(customers);
    console.log(`Successfully seeded ${inserted.length} customers`);
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedCustomers();