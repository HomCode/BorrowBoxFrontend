# BorrowBox Frontend - Implementation Guide

## Project Overview
BorrowBox is a Campus Item Borrowing System with separate portals for Students and Organization Officers. The frontend is built with React, React Router, and TailwindCSS.

## Completed Features

### Authentication System
- **Login** (`/web/login`) - Email/password authentication with role-based redirects
- **Register** (`/web/register`) - Dual registration for Students and Officers with role selection
- **Profile Management** - View and edit user profile, upload photos, change password
- **Protected Routes** - Role-based access control using `ProtectedRoute` wrapper

### Student Portal
- **Dashboard** (`/web/student/dashboard`) - Browse available items with search and filtering
- **My Borrows** (`/web/student/borrows`) - View borrowed items with return functionality
  - Track borrow/due dates
  - Return items with condition reporting
  - View all active and completed borrows
- **Profile** (`/web/student/profile`) - Manage profile, change password, upload photo

### Officer Portal
- **Dashboard** (`/web/officer/dashboard`) - Overview statistics
  - Total items count
  - Active borrow count
  - Registered students count
  - Recent transactions list
- **Manage Items** (`/web/officer/items`) - Full inventory management
  - Add new items with category and quantity
  - Edit existing items
  - Delete items
  - View item details
  - Search and filter by category
- **Transactions** (`/web/officer/transactions`) - Track all borrowing activity
  - View all transactions with status
  - Filter by status (Active, Returned, Overdue, Damaged)
  - Filter by date range
  - Export transaction data to CSV
  - View detailed transaction information
- **Profile** (`/web/officer/profile`) - Manage profile, change password

## Project Structure

```
src/
├── components/
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   ├── Profile.jsx
│   ├── Register.jsx
│   └── web/
│       ├── auth/
│       │   ├── WebLogin.jsx
│       │   └── WebRegister.jsx
│       ├── student/
│       │   ├── WebStudentLayout.jsx
│       │   ├── WebStudentDashboard.jsx
│       │   └── WebStudentBorrows.jsx
│       └── officer/
│           ├── WebOfficerLayout.jsx
│           ├── WebOfficerDashboard.jsx
│           ├── WebOfficerItems.jsx
│           └── WebOfficerTransactions.jsx
├── api/
│   └── auth.js (API integration module)
├── App.jsx (Main routing)
├── index.js
└── index.css (TailwindCSS)
```

## Technology Stack
- **React** 18.2.0 - UI library
- **React Router** 6.30.3 - Client-side routing
- **TailwindCSS** 3.4.13 - Utility-first CSS framework
- **Lucide React** 0.577.0 - Icon library
- **Axios** 1.13.6 - HTTP client

## API Integration

The frontend connects to a backend API at `http://localhost:8080/api` (configurable via `REACT_APP_API_URL` environment variable).

### Endpoints Used
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `PUT /profile/password` - Update password
- `POST /profile/photo` - Upload profile photo
- `GET /profile/photo` - Get profile photo
- `DELETE /profile/photo` - Delete profile photo

## Environment Variables

Create a `.env` file in the project root:

```
REACT_APP_API_URL=http://localhost:8080/api
```

## Getting Started

### Installation
```bash
cd borrowboxfrontend
npm install
```

### Development Server
```bash
npm start
```
The app will open at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

## Key Features

### Authentication Flow
1. Users start at login page
2. Redirect to appropriate dashboard based on role
3. Protected routes prevent unauthorized access
4. Token stored in localStorage for persistence

### Sample Data
All pages currently use sample data for demonstration:
- Items: Laptop, Projector, Tool Kit
- Students and transactions for demonstration
- This will be replaced with API calls

### Styling
- Modern, clean design with consistent color scheme
- Blue (#2563EB) primary color
- Green (#10B981) for student portal
- Responsive design supporting mobile, tablet, and desktop
- Custom rounded corners and shadows for depth

### User Experience
- Loading spinners during data fetching
- Success/error messages for user actions
- Confirmation dialogs for destructive actions
- Dropdown menus for user profile options
- Active route highlighting in navigation
- Search and filter functionality

## Next Steps (Backend Integration)
1. Replace sample data with API calls
2. Implement real-time notifications for new borrows
3. Add pagination for large lists
4. Implement advanced search and filtering
5. Add item availability calendar
6. Email notifications for due date reminders

## Component Patterns

### State Management
- Local state with `useState` for form data
- Context API ready for global state if needed

### Form Validation
- Basic HTML5 validation
- Custom validation for specific fields
- Error messages displayed to users

### Error Handling
- Try-catch blocks in async functions
- User-friendly error messages
- API error response handling

## Testing Credentials (Sample)
When sample data is replaced with backend integration, use these test accounts:
- **Student**: email: student@example.com, password: password123
- **Officer**: email: officer@example.com, password: password123

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes
- All routes require authentication except `/web/login` and `/web/register`
- User role determines access to student or officer dashboard
- Profile photos are stored as BLOBs and converted to URLs
- Export functionality creates downloadable CSV files
- Responsive design adapts to all screen sizes
