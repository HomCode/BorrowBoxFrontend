# 🚀 BorrowBox Frontend - Quick Start Guide

## Installation & Running the App

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Step 1: Install Dependencies
```bash
cd borrowboxfrontend
npm install
```

### Step 2: Configure Environment (Optional)
Create a `.env` file in the project root:
```env
REACT_APP_API_URL=http://localhost:8080/api
```

If not set, defaults to `http://localhost:8080/api`

### Step 3: Start Development Server
```bash
npm start
```

The app will open automatically at `http://localhost:3000`

---

## 📖 Using the Application

### Student Flow
1. **Register** → Select "STUDENT" role
   - Enter Full Name, Email, Student ID
   - Create a password
2. **Dashboard** → Browse available items
   - Search by name
   - Filter by category
   - View item availability
3. **My Borrows** → Manage borrowed items
   - See active borrows with due dates
   - Return items with condition report
   - Track return status
4. **Profile** → Manage account
   - View/edit profile information
   - Upload profile photo
   - Change password

### Officer Flow
1. **Register** → Select "OFFICER" role
   - Enter Full Name, Email, Organization ID
   - Create a password
2. **Dashboard** → View system statistics
   - Total items in inventory
   - Active borrows count
   - Registered students
   - Recent transactions
3. **Manage Items** → Control inventory
   - Add new items
   - Edit existing items
   - Delete items
   - Search and filter
4. **Transactions** → Track borrowing activity
   - View all transactions
   - Filter by status and date
   - Export to CSV
   - View transaction details
5. **Profile** → Manage account

---

## 🔓 Test Accounts (When Backend is Ready)

**Student Account:**
```
Email: student@example.com
Password: password123
```

**Officer Account:**
```
Email: officer@example.com
Password: password123
```

---

## 📦 Production Build

### Build for Production
```bash
npm run build
```

Creates optimized build in `build/` folder

### Deploy Build
```bash
npm install -g serve
serve -s build
```

---

## 🛠️ Common Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run build` | Create production build |
| `npm run test` | Run tests |
| `npm install` | Install dependencies |
| `npm install <package>` | Add new package |

---

## 📋 Features Checklist

- [x] User authentication (Login/Register)
- [x] Role-based access control
- [x] Student dashboard with item browsing
- [x] Student borrow management
- [x] Officer dashboard with statistics
- [x] Officer inventory management (CRUD)
- [x] Officer transaction tracking
- [x] Search and filtering
- [x] CSV export functionality
- [x] User profile management
- [x] Photo upload
- [x] Responsive design
- [x] Error handling
- [x] Loading states

---

## 📱 Browser Compatibility

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

---

## 🔄 API Integration

The frontend is ready to connect to a backend API. All components use the `/src/api/auth.js` module for API calls.

### Required Backend Endpoints

**Authentication:**
- `POST /auth/login`
- `POST /auth/register`

**Profile:**
- `GET /profile`
- `PUT /profile`
- `PUT /profile/password`
- `POST /profile/photo`
- `GET /profile/photo`
- `DELETE /profile/photo`

**Ready for Future Integration:**
- Items management endpoints
- Borrow/return endpoints
- Transaction history endpoints
- Search and filter endpoints

---

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 is in use:
```bash
npm start -- --port 3001
```

### Dependencies Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Backend Connection Error
- Check if backend is running at the configured URL
- Verify CORS is enabled on backend
- Check network connectivity

### Build Errors
```bash
npm run build
```
Check error messages and ensure all dependencies are installed.

---

## 📂 Project Structure Overview

```
borrowboxfrontend/
├── src/
│   ├── components/          # React components
│   ├── api/                 # API integration
│   ├── App.jsx              # Main app routing
│   ├── index.js             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static files
├── package.json             # Dependencies
├── tailwind.config.js       # Tailwind config
├── postcss.config.js        # PostCSS config
├── IMPLEMENTATION_GUIDE.md  # Detailed guide
├── COMPLETION_SUMMARY.md    # Feature summary
└── README.md                # Project README
```

---

## 💡 Tips & Tricks

1. **Hot Reload** - Changes are automatically reloaded in dev mode
2. **Console** - Check browser console for API errors and logs
3. **DevTools** - Use React DevTools browser extension
4. **Sample Data** - All pages have sample data for testing
5. **Search** - Use search boxes to filter items and transactions

---

## 📞 Need Help?

1. Check `IMPLEMENTATION_GUIDE.md` for detailed information
2. Review component files for implementation details
3. Check browser console for error messages
4. Verify backend API is running and accessible

---

## 🎉 You're All Set!

Your BorrowBox Frontend is ready to use. Start the development server and begin exploring the application!

```bash
npm start
```

**Happy coding!** 🚀
