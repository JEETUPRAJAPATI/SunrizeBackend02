# Manufacturing ERP System

## Overview

This is a full-stack Manufacturing Enterprise Resource Planning (ERP) system built with React frontend and Express.js backend. The system is designed to manage various aspects of manufacturing operations including orders, production, inventory, dispatches, sales, and accounts. The application features role-based access control with different user roles having specific permissions for different modules.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with Vite for fast development and building
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation
- **Authentication**: Context-based auth with protected routes

### Backend Architecture
- **Framework**: Express.js with TypeScript support
- **Database**: Dual database support - MongoDB (legacy) and PostgreSQL (new)
- **ORM**: Drizzle ORM for PostgreSQL with type-safe queries
- **Authentication**: JWT-based authentication with role-based authorization
- **API Design**: RESTful API with Express routing
- **Development**: Hot reload with tsx for TypeScript execution

### Database Design
The system supports two database configurations:

**PostgreSQL (Current)**:
- Drizzle ORM for type safety
- Schema defined in `shared/schema.ts`
- Migrations handled by Drizzle Kit

**MongoDB (Legacy)**:
- Mongoose ODM
- Models in `server/models/` directory
- Complete schema for all business entities

## Key Components

### User Management & Authentication
- Role-based access control with 6 user roles:
  - Super User (full access)
  - Unit Head (management level)
  - Production (manufacturing focus)
  - Packing (packaging operations)
  - Dispatch (shipping and delivery)
  - Accounts (financial operations)
- JWT-based authentication with secure cookie storage
- Module-based permissions system

### Business Modules
1. **Dashboard**: Real-time metrics and analytics
2. **Orders**: Customer order management and tracking
3. **Manufacturing**: Production planning and execution
4. **Dispatches**: Shipping and delivery management
5. **Sales**: Invoice generation and sales tracking
6. **Accounts**: Financial management and reporting
7. **Inventory**: Stock management with low-stock alerts
8. **Customers**: Customer relationship management
9. **Suppliers**: Vendor management
10. **Purchases**: Purchase order management
11. **Settings**: System configuration

### UI Components
- Comprehensive component library using Shadcn/ui
- Responsive design with mobile-first approach
- Dark/light theme support
- Accessibility-focused components
- Form validation and error handling

## Data Flow

1. **Authentication Flow**:
   - User login → JWT token generation → Cookie storage → Protected route access
   - Role-based module access based on user permissions

2. **API Request Flow**:
   - Frontend components → TanStack Query → API service layer → Express routes → Database operations

3. **Real-time Updates**:
   - Query invalidation for data consistency
   - Optimistic updates for better UX

## External Dependencies

### Frontend Dependencies
- **UI & Styling**: Tailwind CSS, Radix UI components, Lucide React icons
- **State & Data**: TanStack Query for server state, React Hook Form for forms
- **Utilities**: date-fns for date handling, clsx for conditional styling

### Backend Dependencies
- **Database**: Drizzle ORM for PostgreSQL, Mongoose for MongoDB
- **Authentication**: JWT for tokens, bcrypt for password hashing
- **Validation**: Zod for schema validation
- **Development**: tsx for TypeScript execution, Vite for frontend building

### Third-party Services
- **Database**: Neon serverless PostgreSQL for production
- **Development**: Replit for cloud development environment

## Deployment Strategy

### Development Environment
- Replit-based development with hot reload
- Vite dev server for frontend with HMR
- tsx for backend TypeScript execution
- PostgreSQL database provisioned through Replit

### Production Build
- Frontend: Vite build generates optimized static assets
- Backend: esbuild bundles server code for Node.js
- Database: Drizzle migrations for schema management
- Deployment: Replit autoscale deployment target

### Environment Configuration
- Development: `npm run dev` starts both frontend and backend
- Production: `npm run build` → `npm run start`
- Database: `npm run db:push` for schema updates

## Recent Changes

**June 18, 2025 - Modern Admin Panel Implementation**
- Replaced login screen with attractive demo accounts selection page
- Implemented modern, responsive UI with gradient backgrounds and glass-morphism effects
- Added comprehensive dark/light mode toggle throughout the application
- Enhanced sidebar with improved styling and theme integration
- Created interactive demo accounts showcase with role-based permissions display
- Implemented responsive design patterns for mobile, tablet, and desktop
- Added proper loading states and smooth transitions
- Integrated theme toggle in both sidebar and mobile header

**June 19, 2025 - Dashboard Modernization**
- Removed work timer section for cleaner, more professional appearance
- Replaced timer with Quick Overview panel showing key business metrics
- Streamlined clock display and improved layout spacing
- Fixed profile picture upload issues and resolved route conflicts
- Enhanced overall dashboard user experience

**June 20, 2025 - Enhanced Inventory Management System**
- Implemented comprehensive inventory form with structured sections (Item Details, Category Info, Pricing, Stock Info)
- Added customer category field integration with MongoDB schema
- Enhanced backend validation with detailed JSON error responses
- Improved frontend error handling with inline field messages and toast notifications
- Added loading states, form validation, and auto-scroll to error fields
- Created modern, responsive UI using shadcn/ui components with color-coded sections
- Implemented proper data sanitization and field-specific error display

**June 20, 2025 - Critical Inventory Module Fixes**
- Fixed Customer Category field binding and MongoDB integration for add/edit operations
- Enhanced server-side validation with structured JSON error responses including success flags
- Implemented comprehensive frontend error handling with toast notifications and inline field messages
- Refactored form validation to prevent submission when errors exist and show visual error cues
- Added proper form state management with red borders for invalid fields and disabled submit buttons
- Improved real-time state updates with proper query invalidation and forced refetches
- Fixed all form control value binding issues using controlled components

**June 20, 2025 - Complete Modern Inventory UI Redesign**
- Created completely new modern, responsive inventory management interface
- Implemented card-based design with advanced stats dashboard showing total items, value, low stock, and categories
- Built comprehensive filtering system with search, category selection, and sorting options
- Redesigned table with modern dropdown actions menu and improved data visualization
- Enhanced category management with tabbed interface for product and customer categories
- Added proper loading states, skeleton components, and empty states throughout
- Integrated simplified form component with working validation and error handling
- Implemented responsive design for mobile, tablet, and desktop viewports
- Added modern icons, proper spacing, and professional color schemes
- Fixed all form submission issues and real-time state updates

**June 20, 2025 - Complete Frontend Error Handling and Modern Form Implementation**
- Completely refactored inventory form with comprehensive error handling and modern sectioned UI
- Implemented structured error capture from backend validation with inline field messages and red borders
- Created sectioned form layout: Item Information, Category Information, Pricing, Stock Information
- Added comprehensive validation with real-time error display and submit button state management
- Enhanced backend responses with consistent success flags and structured error objects
- Implemented toast notifications for validation summaries and success/error feedback
- Added visual error indicators, form state management, and auto-scroll to error fields
- Ensured immediate UI refresh after successful form submissions with forced cache invalidation
- Fixed all form value binding issues and real-time state synchronization problems

**June 20, 2025 - Smart Toast Notifications with Error Categorization**
- Implemented intelligent error categorization system with automatic error type detection
- Created smart toast notifications with context-aware messages and severity-based styling
- Added actionable error buttons with appropriate responses (retry, login, refresh, etc.)
- Implemented network status monitoring with automatic online/offline notifications
- Enhanced validation error handling with field-specific highlighting and auto-scroll
- Added loading toasts for better user feedback during operations
- Created comprehensive toast utility library with success, warning, info, and error variants
- Integrated batch operation notifications for multi-item actions
- Added duration management based on error severity levels

**June 20, 2025 - Final Inventory Module Completion and Duplicate Component Cleanup**
- Removed all duplicate inventory components and consolidated to single modern component
- Fixed database schema issues and made customerCategory field optional with default values
- Corrected API endpoint routing issues preventing frontend-backend communication
- Enhanced form data processing to ensure all field values are properly captured and submitted
- Implemented comprehensive server-side validation with structured JSON error responses
- Fixed TypeScript compilation errors and form component conflicts
- Established seamless real-time state synchronization with immediate UI updates
- Completed integration of smart toast notifications with error categorization throughout inventory module

**June 20, 2025 - Modern Interactive UI Redesign and Error Resolution**
- Created modern gradient action bar with Quick Actions (Add Item, Add Category, Customer Category, Refresh)
- Fixed categories.map error with proper API response data extraction and array validation
- Redesigned CategoryManagement component with modern tabbed interface and gradient headers
- Enhanced table design with alternating row colors, better spacing, and professional styling
- Implemented color-coded buttons with proper theme integration for light/dark modes
- Added comprehensive error handling for all form operations with smart toast notifications
- Created modern dialog forms with centered icons and improved visual hierarchy
- Fixed DOM nesting warnings by replacing p tags with div elements in stats components

**June 20, 2025 - Complete UI Overhaul with Modern Design**
- Completely redesigned inventory interface with modern grid layout and navigation sidebar
- Removed redundant tabs and replaced with clean button navigation system
- Implemented professional card-based layout with gradient headers and clean spacing
- Created dedicated views for Categories and Customer Categories with seamless switching
- Enhanced visual hierarchy with improved typography, spacing, and color schemes
- Integrated modern action buttons with hover effects and proper theme support
- Streamlined user experience by removing duplicate navigation elements
- Added comprehensive CRUD operations for both category types with modern dialogs

**June 20, 2025 - Advanced Modal-Based Category Management System**
- Implemented comprehensive modal-based Category Management with nested forms and dynamic subcategory management
- Created interactive Category Management Modal displaying all existing categories with their subcategories in card format
- Added dynamic subcategory input system allowing multiple subcategories to be added/removed during category creation/editing
- Built Customer Category Management Modal with table view and comprehensive CRUD operations
- Integrated Edit and Delete icons for each category item with pre-filled forms and confirmation modals
- Implemented scrollable content areas with sectioned headers ("Existing Categories", "Add New") for better organization
- Added real-time form validation, toast notifications, and automatic list refresh without page reload
- Created modern dialog interfaces with centered icons, proper visual hierarchy, and theme integration
- Enhanced user experience with loading states, empty states, and comprehensive error handling

**June 20, 2025 - UI Cleanup and Enhanced Category Display**
- Removed unnecessary sidebar navigation for cleaner, streamlined interface
- Enhanced Category Management Modal with proper table layout showing categories, descriptions, and subcategories
- Improved subcategory display with badge system and "more" indicator for multiple subcategories
- Fixed subcategory state management with proper useEffect handling for edit operations
- Enhanced Customer Category Modal with improved table structure and visual hierarchy
- Increased modal height for better content viewing and scrolling experience
- Added proper tooltips for action buttons and improved accessibility
- Optimized layout for full-width content display without sidebar constraints

**June 20, 2025 - Fixed Subcategory Database Storage and Display Issues**
- Fixed database schema inconsistency between `subCategories` and `subcategories` fields
- Enhanced backend category controllers to properly handle subcategory data with validation and filtering
- Improved frontend subcategory state management with proper useEffect handling and console logging
- Enhanced subcategory input component with better visual design and user feedback
- Added proper data filtering to remove empty subcategories before database storage
- Fixed category form submission to include all required fields (name, description, subcategories)
- Added comprehensive logging for debugging subcategory creation and editing operations
- Improved visual hierarchy with sectioned subcategory management and scrollable input areas

**June 20, 2025 - Completed Subcategory Integration and Fixed React Import Issue**
- Resolved React import error that was preventing inventory form from loading
- Fixed subcategory dropdown display in item creation/editing forms
- Implemented React.useMemo for efficient subcategory lookup and filtering
- Added comprehensive debugging output to track category selection and subcategory retrieval
- Enhanced form validation to clear subcategory when parent category changes
- Verified database integration with proper subcategory storage and retrieval from MongoDB
- Completed full subcategory workflow from creation to display in inventory forms

**June 20, 2025 - Implemented Proper JWT Authentication System**
- Migrated from cookie-based authentication to proper JWT token system using Authorization headers
- Updated backend middleware to prioritize Bearer tokens over cookies for authentication
- Enhanced frontend API client to automatically include JWT tokens in all requests via localStorage
- Fixed React rendering error in toast notifications by properly handling JSX components
- Implemented automatic token storage and retrieval in login/logout flows
- Added descending order sorting for inventory items to show latest records first
- Fixed duplicate item code generation to auto-generate new codes when conflicts occur
- Enhanced error handling and authentication flow for better security

**June 21, 2025 - Complete Excel Import/Export System Implementation**
- Implemented comprehensive Excel functionality for all inventory modules (items, categories, customer categories, customers, suppliers)
- Added three-button system: Export to Excel, Download Template, and Import from Excel with proper authentication
- Created backend controllers for customers and suppliers with full Excel processing capabilities
- Enhanced ExcelImportExport component with template generation and support for all module types
- Integrated API services with proper JWT authentication for all Excel operations
- Added visual progress tracking, detailed error reporting, and success notifications
- Implemented automatic list refresh after successful imports with proper cache invalidation
- Removed duplicate modules and cleaned up unnecessary components while maintaining full functionality

**June 21, 2025 - Fixed Category Management Modal Issues and Cleaned Duplicate Code**
- Fixed CategoryManagement component to properly handle separate category and customer category modals
- Removed console debugging logs and restored clean button functionality
- Enhanced Excel import process with better database verification and logging
- Cleaned up duplicate code while preserving all existing functionality
- Ensured both Categories and Customer Categories buttons open their respective modals correctly
- Maintained all Excel import/export functionality with improved error tracking

**June 21, 2025 - Complete Company Management Module Implementation**
- Created comprehensive Company Management module with full CRUD functionality
- Implemented MongoDB schema with company fields: unitName, name, mobile, email, address, locationPin, city, state, country, gst, fssai, orderCutoffTime
- Added complete backend with routes, controllers, validation, and error handling
- Created modern React frontend with table view, filtering, and modal-based forms
- Implemented sectioned forms with shadcn/ui components: Company Info, Location, Legal Info, Timing
- Added detailed company view modal with organized information display
- Integrated permission-based access control for Super User and Unit Head roles
- Added seeded sample data with 8 diverse companies across different cities and units
- Enhanced sidebar navigation with Companies menu item and Building2 icon
- Implemented proper validation, error handling, and success notifications

**June 21, 2025 - Fixed QuickAddCategory API Integration and Enhanced Form UX**
- Fixed API endpoint routing issues in QuickAddCategory component by adding proper /api/ prefixes
- Resolved "Unexpected token DOCTYPE" JSON parsing error that was preventing category creation
- Enhanced error handling and response parsing to support different backend response formats
- Successfully integrated + icon buttons for quick category creation directly within inventory forms
- Implemented real-time category selection after successful creation with proper cache invalidation
- Added comprehensive logging and debugging for category creation operations
- Fixed Excel export headers across all modules to use proper binary file handling and quoted filenames

**June 21, 2025 - Simplified Excel Export System**
- Completely removed complex Excel generation system and replaced with simple, reliable approach
- Created simplified createSimpleExcel utility function with basic XLSX.write() implementation
- Removed all complex formatting, styling, and advanced options that were causing compatibility issues
- Streamlined all export controllers to use basic data mapping with essential fields only
- Simplified HTTP response handling using res.send() instead of complex header management
- Fixed duplicate components and removed unnecessary complexity from Excel generation
- Ensured all data shows properly in Excel files with clean, simple structure
- Added proper error handling and logging for debugging export issues
- Used timestamp-based filename generation for unique file naming

**June 21, 2025 - Client-Side Excel Export Implementation**
- Completely replaced server-side Excel generation with client-side solution using xlsx and file-saver libraries
- Created ClientExcelExporter utility class with proper XLSX.utils.json_to_sheet() and XLSX.write() methods
- Fixed config.exportFn error by implementing direct client-side export functions in handleExport
- Enhanced template generation with comprehensive sample data for all module types
- Implemented proper error handling and toast notifications for export operations
- Ensured Excel files use correct MIME type (application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)
- Added data fetching methods (getCategories, getCustomers, etc.) for real-time export functionality
- Removed problematic server-side Excel generation code that was causing format issues

**June 21, 2025 - Fixed Toast Error Handling for Validation Messages**
- Fixed API service to properly capture server error details with status codes and message content
- Enhanced error categorization to detect validation errors based on status 400 and error keywords
- Updated inventory item creation/update mutations to display actual server validation messages
- Fixed company creation/update mutations to show proper GST duplicate and validation errors
- Replaced generic "connection problem" messages with actual server error descriptions
- Ensured all form validation errors now display meaningful feedback to users

**June 21, 2025 - Fixed QuickAddCategory Form Submission Issue**
- Fixed automatic form submission issue when creating categories inside inventory item forms
- Added proper event propagation prevention (e.preventDefault() and e.stopPropagation()) to all QuickAddCategory buttons and form elements
- Enhanced dialog content isolation to prevent parent form interactions
- Fixed subcategory Add/Remove buttons triggering parent form submission
- Ensured QuickAddCategory dialog operates independently without affecting main inventory form
- Maintained all existing functionality while preventing unwanted form submissions

**June 23, 2025 - Removed Excel Export/Template from Category Management Modal**
- Removed ExcelImportExport components from CategoryManagement modal header
- Simplified category management interface by removing export and template functionality
- Maintained all existing category CRUD operations and form functionality
- Category management now focuses purely on add, edit, delete operations

**June 23, 2025 - Fixed Excel Import/Export Functionality**
- Fixed Excel import API endpoint routing from `/items/import` to `/inventory/items/import`
- Enhanced import controller with proper success/failure response structure and comprehensive logging
- Fixed API service Content-Type headers for file uploads to prevent multipart boundary issues
- Added missing import methods for customers and suppliers in API service
- Enhanced import result handling with proper success validation and error display
- Fixed query invalidation to refresh both items list and inventory stats after successful import
- Added comprehensive error logging and debugging for import operations

**June 23, 2025 - Enhanced Excel Import Field Mapping and Validation**
- Fixed "type" field requirement error by adding comprehensive field mapping with multiple fallback column names
- Enhanced import validation to handle missing required fields with proper defaults (Type: 'Product', Importance: 'Normal')
- Added duplicate code auto-generation to prevent import failures from existing codes
- Improved Excel template to include all required fields with proper sample data
- Enhanced field mapping to support various Excel column naming conventions
- Added better error handling and validation messages for import operations
- Fixed "trim is not a function" error by adding proper null/undefined safety checks for all string fields

**June 23, 2025 - Fixed Category Update Error Handling**
- Enhanced category update mutation with better error logging and response handling
- Added comprehensive error categorization for 501 and other server errors
- Improved form submission error handling with try-catch blocks
- Added detailed console logging for debugging category update issues
- Fixed misleading "501 Unexpected Error" messages by improving error detection

**June 23, 2025 - Enhanced Category Management with Subcategory Addition Feature**
- Added "Add Subcategory" functionality to existing categories in Category Management modal
- Implemented SubcategoryFormModal component with category selection dropdown
- Added green plus icon button for each category row to add subcategories directly
- Enhanced category management with ability to select existing category and add new subcategories
- Improved subcategory workflow showing existing subcategories before adding new ones
- Added proper validation for category selection and subcategory input requirements

**June 25, 2025 - Completed Role & Permission Management System with Fixed Form Data Handling**
- Fixed role selection dropdown with proper data binding and validation
- Enhanced form data capture with comprehensive frontend validation
- Implemented proper permissions structure formatting for backend storage
- Added visual form validation with disabled submit button for incomplete forms
- Fixed frontend-backend data flow for user creation and editing
- Enhanced error handling with smart toast notifications
- Completed comprehensive Role & Permission Management system consolidating all user functionality

**June 25, 2025 - Complete Sales Submodules Implementation with Dropdown Navigation**
- Fixed sidebar dropdown functionality for Sales, Dispatch, and Accounts modules
- Implemented all 5 Sales submodules with comprehensive CRUD functionality:
  - My Indent: Create, view, edit, delete indents with priority and status management
  - My Customers: Customer management with category classification and contact details
  - My Deliveries: Delivery scheduling and tracking with driver and vehicle assignment
  - My Invoices: Invoice creation, payment tracking, and detailed invoice views
  - My Ledger: Transaction and customer ledger with filtering and export capabilities
- Added proper routing for all Sales submodules in App.tsx
- Enhanced sidebar with working expand/collapse functionality for submodule navigation
- Implemented dummy JSON data for all modules with realistic business scenarios
- Added comprehensive filtering, search, and pagination capabilities to all modules
- Created modern UI with cards, tables, and modal dialogs for optimal user experience

**January 5, 2025 - Complete Sales Module Redesign with Modern Inventory UI Pattern**
- Completely redesigned all 5 Sales submodules (My Indent, My Customers, My Deliveries, My Invoices, My Ledger) to match modern inventory management design
- Implemented full-width layout with comprehensive table format data display following inventory component patterns
- Added modern gradient headers with unique color schemes for each submodule:
  - My Indent: Blue to Purple gradient with order creation functionality
  - My Customers: Green to Teal gradient with customer relationship management
  - My Deliveries: Blue to Purple gradient with delivery tracking and scheduling
  - My Invoices: Purple to Pink gradient with invoice generation and payment tracking
  - My Ledger: Indigo to Cyan gradient with transaction and balance management
- Enhanced all components with comprehensive stats cards showing key metrics and KPIs
- Implemented advanced filtering and search capabilities with multiple filter options
- Added full CRUD functionality with modern modal dialogs for create, edit, and view operations
- Integrated proper form validation, error handling, and success notifications
- Created comprehensive dummy data (10+ entries each) with realistic business scenarios
- Added responsive design with mobile-first approach and professional table layouts
- Implemented status badges, priority indicators, and transaction type classifications
- Enhanced user experience with dropdown menus, action buttons, and refresh functionality

**January 14, 2025 - Complete Sales Module Streamlining and Form Simplification**
- Completely simplified Sales Indent form to only essential fields: customer dropdown (searchable), order date (auto-current), total quantity, status, remarks
- Removed all complex fields like items array, pricing details, shipping addresses, payment terms, and approval workflows
- Updated Customer management form: made email and GST optional fields, removed credit limit and route fields, added geo location field
- Implemented role-based delivery access control: sales users cannot see Driver & Vehicle information (admin only)
- Enhanced My Ledger with searchable customer dropdown using Command/Popover components with autocomplete functionality
- Fixed all duplicate files and incomplete code implementations for clean, maintainable codebase
- Sales module now provides streamlined, focused user experience with essential functionality only

**January 14, 2025 - Refund & Return Module Implementation**
- Added new "Refund & Return" functionality to Sales module with comprehensive CRUD operations
- Implemented full-featured refund and return management system with customer, product, and invoice tracking
- Added proper permission integration with 'refundReturn' feature permissions for Sales users
- Created comprehensive form with customer selection, product selection, quantity, pricing, and reason tracking
- Added status management (pending, approved, completed, rejected) with proper badge indicators
- Integrated with existing permission system allowing Sales users to view, add, edit entries
- Added responsive design with stats cards showing total entries, pending, approved, and completed counts
- Enhanced sidebar with new "Refund & Return" submenu item under Sales module
- Implemented comprehensive filtering by status, type (refund/return), and search functionality
- Added proper routing and navigation integration throughout the application

**January 16, 2025 - Complete Form Field Streamlining and Dialog Enhancement**
- Removed status field from Add Customer forms for cleaner user workflow
- Removed priority and status fields from Schedule New Delivery forms
- Made email field optional in Create New Invoice forms (no longer required)
- Added DialogDescription to all dialog components to prevent warnings and improve accessibility
- Fixed input field focus issue in Create New Indent form with proper key props
- Enhanced all form state management to match removed fields
- Added default status handling: Pending for indents, Active for customers, Scheduled for deliveries, Pending for invoices
- Fixed DialogDescription import errors across all sales modules
- Streamlined forms now provide simpler, more focused user experience without unnecessary complexity

**January 16, 2025 - Complete Sales Module Input Focus Issue Resolution**
- Successfully resolved widespread input focus issues across all Sales modules by implementing isolated form components with local state management
- Fixed focus problem where users could only type one character before losing focus in all form fields
- Created separate CreateForm and EditForm components for MyIndent, MyCustomers, MyDeliveries, MyInvoices, and MyLedger
- Implemented isolated local state for create operations and maintained existing formData state for edit operations
- Removed category field from Customer forms as specifically requested by user
- Added proper DialogDescription imports and accessibility enhancements to all modal dialogs
- All forms now provide smooth typing experience without React re-rendering interference
- Enhanced form workflow with proper cancel handling and button state management

**Current Status**: Complete ERP system with streamlined Sales module including resolved input focus issues, new Refund & Return functionality with success toast notifications, fully functional Role & Permission Management system, working sidebar dropdown navigation, simplified forms with essential fields only, enhanced dialog accessibility, and comprehensive Production module. All features include proper JWT authentication, Excel import/export capabilities, category management with subcategory support, role-based access control, secure token-based authentication, and improved form field management throughout the application.

**January 16, 2025 - Complete Multiple Products Support for Refund & Return Module**
- Implemented comprehensive multiple products functionality identical to MyIndent module structure
- Created isolated CreateEntryForm component with local state management and independent dropdown states for each product row
- Added EditEntryForm component with full multiple products editing capability and proper dropdown state isolation  
- Enhanced product row management with Add/Remove functionality using + and - buttons
- Integrated automatic unit price population when selecting products from searchable dropdowns
- Added comprehensive form validation ensuring all required fields (customer, invoice, products with quantity/price/reason)
- Updated view modal to display multiple products with detailed information in organized cards
- Maintained backward compatibility for existing single-product entries while supporting new multi-product structure
- Fixed all dropdown state conflicts ensuring each product row operates independently without selection loss
- Added proper form state management with disabled submit buttons for incomplete forms and validation feedback
- Enhanced toast notifications for successful creation and updates with dynamic product count information

**January 16, 2025 - Enhanced Refund & Return Module with Toast Notifications**
- Added comprehensive toast notification system to Refund & Return module for all CRUD operations
- Implemented success toast for creating new refund/return entries with dynamic type and customer details
- Added update confirmation toast when editing existing entries
- Included delete confirmation toast with destructive styling for proper user feedback
- Enhanced user experience with clear action confirmations throughout the Refund & Return workflow

**January 15, 2025 - Complete Customers Management Module with Enhanced Features**
- Implemented comprehensive Customers page with full CRUD functionality based on permission system
- Added complete customer listing with 10 detailed dummy customer records including financial and order history data
- Created responsive design with mobile-first approach hiding columns progressively on smaller screens
- Removed export/import/template buttons as requested, focusing purely on customer management operations
- Implemented advanced filtering system with search by name/contact/email/phone, status filter (Active/Inactive/Suspended), and category filter (Standard/Premium)
- Added comprehensive stats dashboard showing Total Customers, Active Customers, Premium Customers, and Outstanding Amount
- Created detailed customer forms with validation for create/edit operations including company info, contact details, GST, category, credit limit, and status
- Implemented status update functionality allowing Super Admin to activate/deactivate customers directly from dropdown menu
- Added comprehensive customer detail view modal showing organized information in cards: Company Information, Contact Details, Financial Information, and Order History
- Enhanced permission-based access control ensuring only authorized users can view, add, edit, delete customers and update status
- Integrated proper toast notifications for all CRUD operations with success/error feedback
- Added visual status indicators with color-coded badges (Active-green, Inactive-gray, Suspended-red) and appropriate icons
- Created mobile-responsive table design with progressive column hiding and optimized action dropdown menus
- Implemented proper form validation and error handling throughout all customer operations

**January 15, 2025 - Removed Orders Module from Sidebar Navigation**
- Removed Orders menu item from sidebar navigation as requested
- Cleaned up unused ShoppingCart icon import in Sidebar component
- Streamlined navigation to focus on core manufacturing ERP modules

**January 14, 2025 - Fixed Refund & Return Route and My Indent Cleanup**
- Fixed missing `/sales/refund-return` route in App.jsx that was causing 404 errors
- Added proper import for RefundReturn component in routing configuration
- Completely removed all product entries functionality from My Indent page as requested
- Simplified My Indent to focus purely on indent management with essential fields only
- Maintained responsive design and all existing CRUD functionality for indents
- Removed tabs interface and all product-related code, forms, and state variables
- My Indent now has clean, single-purpose design without complex tabs or additional modules

**January 11, 2025 - Production Module UI Fixes and Responsive Design**
- Fixed Production dropdown in sidebar to work exactly like Sales module (dropdown only, no direct link)
- Enhanced responsive design for both My Production and Production History pages
- Improved mobile layout with stacked headers and full-width buttons
- Fixed image viewing functionality with clickable full-screen modal overlays
- Added progressive table column hiding on smaller screens (sm, md, lg, xl breakpoints)
- Fixed refresh button text display issue by wrapping in span element
- Enhanced form dialogs with responsive button layouts and proper mobile touch targets
- Tables now properly handle overflow with essential columns always visible on mobile

**January 11, 2025 - Complete Production Module Redesign with Collapsible Dropdown and Inline Form**
- Redesigned Production module with collapsible dropdown menu structure following accordion style
- Added submenu items: "My Production" (/production) and "Submission History" (/production/history)
- Created comprehensive inline production form (no "Add" button required) with:
  - Product dropdown selection from 10 dummy products
  - Date field (defaults to today)
  - Produced Quantity and Damage Quantity input fields
  - Image upload for damage with base64 preview and file size validation
  - Submit button saves data to localStorage as submission entries
- Implemented real-time summary dashboard showing:
  - Total Produced Qty (sum of all entries for selected date)
  - Total Damaged Qty (sum of damage entries)
  - Number of submissions for the day
  - Production efficiency percentage calculation
- Added Production History page (/production/history) with:
  - Complete table display of all production submissions from localStorage
  - Date range filtering (From Date & To Date inputs)
  - Product filtering dropdown with dynamic product list
  - Pagination system for large datasets (10 items per page)
  - View/Edit/Delete actions based on user permissions
  - Modal dialogs for viewing and editing submission details
  - Image preview functionality in both table and detail views
- Enhanced sidebar with collapsible dropdown functionality:
  - Production menu shows Factory icon when collapsed
  - Expands to show "My Production" and "Submission History" submenus
  - Proper role-based access control for Production role and Super User bypass
- Added comprehensive toast notification system for:
  - Successful form submissions with product details
  - File upload validation and error handling
  - Form validation messages for required fields
- Implemented localStorage-based data persistence for production submissions
- Created modern UI with Tailwind CSS following existing design patterns
- Added proper permission-based UI controls for edit/delete operations

**January 11, 2025 - Complete Production Module Implementation**
- Created comprehensive Production module accessible only to users with "Production" role
- Implemented role-based sidebar filtering to show "My Production" menu item only for Production role users
- Added protected route `/production` with role guard logic that redirects unauthorized users to access denied page
- Created ProductionPage.jsx with 4 main sections following modern ERP design patterns:
  - Today's Indents Table: Displays 10 dummy production orders with customer, product, quantity, deadline, priority, and status
  - Summary Panel: Shows key metrics (Total Produced, Pending Indents, In Progress, Completed) with color-coded cards
  - Submit Production Data: Modal form for daily production submissions with produced/damaged quantities and notes
  - Submission History: Table showing previous submissions with edit/delete functionality
- Enhanced ProtectedRoute component to support role-based access control with requiredRole parameter
- Integrated Factory icon for Production module to distinguish from other manufacturing components
- Added comprehensive dummy data for realistic production workflow testing
- Implemented responsive design with Tailwind CSS and ShadCN UI components
- Added proper error handling, form validation, and success notifications throughout the module

**January 8, 2025 - Complete Profile Management System with Navbar Avatar Display Fixed**
- Fixed critical issue where profile pictures were uploading successfully but not displaying in navbar avatar
- Enhanced `/api/auth/me` endpoint to include `fullName` and `profilePicture` fields in user response
- Added proper AvatarImage component to navbar with fallback to initials when no picture exists
- Implemented refreshUser method in AuthContext to update user data immediately after profile changes
- Enhanced profile picture upload workflow with instant navbar refresh and real-time UI updates
- Added static file serving for `/uploads` directory to properly serve profile images
- Completed comprehensive profile management including picture upload, personal details update, and password change
- Removed duplicate code and streamlined profile functionality across all components
- Profile system now provides seamless user experience with immediate visual feedback in navbar and profile page

**January 8, 2025 - Module-Based Sidebar Visibility Control**
- Implemented dynamic sidebar filtering based on module settings from Settings page
- When a module is disabled in Settings → Modules tab, it automatically disappears from sidebar navigation
- Enhanced module settings functionality to provide real-time UI control over which features are accessible
- Added proper integration between Settings module configuration and sidebar display logic
- System now respects both user permissions AND module enabled/disabled status for complete access control

**January 8, 2025 - Complete Permission-Based UI Implementation for Sales Module**
- Successfully implemented comprehensive permission-based UI controls across all 5 Sales submodules:
  - My Indent: Full permission integration with create, edit, view, delete controls
  - My Customers: Permission-aware action buttons and table column visibility
  - My Deliveries: Complete permission checking with conditional rendering
  - My Invoices: Permission-based Create Invoice button and action dropdown controls
  - My Ledger: Permission-integrated Add Entry functionality and table actions
- Created ActionButton component for consistent permission-aware UI controls throughout the application
- Enhanced useActionPermissions hook to provide standardized permission checking across modules
- Implemented early return access denied screens for users without view permissions
- Added conditional rendering for table headers and action columns based on user permissions
- Integrated permission checks for all dropdown menu items (View, Edit, Delete actions)
- Ensured complete UI consistency where users only see actions they have permissions to perform
- Fixed all table cell permission wrapping to hide entire Actions columns when no permissions exist
- Successfully tested permission system working with the existing Role & Permission Management interface

**June 25, 2025 - Critical Select Component Error Fixed**
- Fixed Radix UI Select.Item error where empty string values were not allowed
- Replaced all empty string SelectItem values with "none" placeholder values
- Updated form logic to properly handle "none" values as null in database operations
- Ensured proper unit field handling in both create and edit user forms
- Application now runs without Select component runtime errors

**June 25, 2025 - Simplified User Management Interface**
- Removed unit field completely from user creation and editing forms
- Updated user table to show role-based permissions instead of unit column
- Streamlined user management focusing on core functionality: username, email, role, permissions, status
- Enhanced permissions display to show module access based on new dynamic permission structure
- Cleaned interface removes unnecessary unit-based restrictions and focuses on role-based access control

**June 25, 2025 - Comprehensive Role & Permission Management System**
- Consolidated user management into Role & Permission Management page following user requirements
- Implemented advanced user creation form with detailed module-level permission configuration
- Added comprehensive permission matrix with feature-level controls (view, add, edit, delete, alter)
- Created modern dialog-based user creation and editing following the provided design patterns
- Enhanced permission structure matching the requested JSON format with role, unit, canAccessAllUnits, and modules
- Integrated visual permission toggles with Switch components for intuitive permission management
- Removed separate User Management page and consolidated all functionality into single comprehensive interface
- Added role-based default permission assignment with automatic module configuration
- Enhanced user overview cards with detailed permission display and inline edit/delete actions

**June 25, 2025 - Application Startup Issues Fixed**
- Fixed duplicate Companies import causing compilation errors in App.jsx
- Added missing React imports to all components using useState/useEffect hooks
- Resolved "useState is not defined" runtime errors across multiple components
- Added missing UNITS constant definition to UserManagement component
- Fixed React key prop warnings in component lists
- Application now starts successfully with all features working properly

**June 25, 2025 - Dynamic Role-Permission System Implementation**
- Implemented comprehensive dynamic role-permission system with module-level, submodule-level, and action-level permissions using JSON-based storage
- Updated User model schema to support detailed permission structure with modules, features, and action permissions (view, add, edit, delete, alter)
- Enhanced sidebar with expandable submodules based on user permissions and feature access control
- Created ActionButton component and useActionPermissions hook for frontend permission enforcement
- Added permission middleware for API routes to enforce action-level permissions on backend
- Implemented RolePermissionManagement page for admin users to configure user permissions
- Updated seed data with role-specific permission structures for all user types (Super User, Unit Head, Production, Packing, Dispatch, Accounts)
- Removed unit selection field requirement as requested and made permissions unit-agnostic
- Enhanced authentication system to return proper permission structure for dynamic UI rendering
- Created expandable sidebar structure with 10 main modules and their respective submodules and features

## User Preferences

```
Preferred communication style: Simple, everyday language.
```