# 🎓 BorrowBox - Campus Item Borrowing System

**Final Examination Project for PSITE 7 ICT Congress**

---

## 📚 Project Overview

**BorrowBox** is a comprehensive campus item borrowing system designed to streamline the process of lending and tracking equipment, tools, and resources within a student organization or academic institution.

### Problem Statement
Campus organizations struggle with:
- ❌ Manual tracking of borrowed items
- ❌ Lost or misplaced equipment
- ❌ Unclear responsibility for items
- ❌ Inefficient inventory management
- ❌ Difficulty monitoring due dates and overdue items

### Solution
**BorrowBox** provides:
- ✅ Digital inventory management system
- ✅ Automated borrow/return workflow
- ✅ Real-time item availability tracking
- ✅ Transaction audit trail
- ✅ Role-based access control (Students & Officers)
- ✅ Due date management with overdue alerts

---

## 🏗️ Architecture Overview

### Vertical Slicing Approach
The system is organized by **features/modules** rather than technical layers. Each feature has a complete stack from database to UI:

```
Feature Module Structure:
┌─────────────────────────────────────┐
│  UI Components (React)              │
├─────────────────────────────────────┤
│  REST API (Spring Boot Controllers) │
├─────────────────────────────────────┤
│  Business Logic (Service Layer)     │
├─────────────────────────────────────┤
│  Data Access (Repository/JPA)       │
├─────────────────────────────────────┤
│  Database (PostgreSQL/Supabase)     │
└─────────────────────────────────────┘
```

**Three Main Features:**
1. **Items Module** - Inventory management (CRUD operations, search, filtering)
2. **Borrows Module** - Borrow/return management (borrowing, returning, tracking)
3. **Transactions Module** - Audit trail (transaction history, analytics)

### MVP (Model-View-Presenter) Pattern

- **Model**: JPA Entities (`Item.java`, `Borrow.java`, `Transaction.java`)
- **Presenter**: Service Layer (Business logic)
- **View**: 
  - Backend: Spring Boot REST Controllers
  - Frontend: React Components

### Technology Stack

```
Frontend:
├── React 18.2.0 (UI framework)
├── React Router 6.30.3 (Navigation)
├── Axios 1.13.6 (HTTP client)
├── TailwindCSS 3.4.13 (Styling)
└── ESLint + Prettier (Code quality)

Backend:
├── Spring Boot 3.1.5 (Web framework)
├── Spring Data JPA (ORM)
├── PostgreSQL 15+ (Database)
├── JWT 0.11.5 (Authentication)
├── jBCrypt 0.4 (Password hashing)
└── Maven (Build tool)

Infrastructure:
├── Supabase (Backend-as-a-Service, PostgreSQL)
├── Render.com or Railway.app (Backend hosting)
└── Vercel (Frontend hosting)
```

---

## 📁 Project Structure

### Frontend (React)
```
borrowboxfrontend/
├── public/
│   ├── index.html (App entry point)
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx (Routing/Layout)
│   │   ├── Login.jsx (Authentication)
│   │   ├── Register.jsx (User registration)
│   │   ├── Profile.jsx (User profile)
│   │   └── web/ (Web-specific components)
│   │       ├── auth/ (Login, Register screens)
│   │       ├── student/ (Student dashboard, borrows, layout)
│   │       └── officer/ (Officer dashboard, items, transactions, layout)
│   ├── api/
│   │   └── auth.js (API integration with 25+ methods)
│   ├── index.js (React entry point)
│   ├── App.jsx (App configuration)
│   └── tailwind.config.js (Styling configuration)
├── package.json (Dependencies)
├── tailwind.config.js (Styling config)
├── DEPLOYMENT_GUIDE.md (Frontend deployment)
└── README.md (Frontend documentation)

Features Implemented:
✅ Student Dashboard - View own borrows, search items
✅ Student Borrows - List active/returned items, return items, track due dates
✅ Officer Dashboard - Overview of system statistics
✅ Officer Items - CRUD operations on inventory
✅ Officer Transactions - View all transactions, filter, export, analytics
✅ User Profile - View/edit profile, change password
✅ Authentication - Login/Register with JWT
✅ Role-based Navigation - Different UIs for students vs officers
```

### Backend (Spring Boot)
```
BorrowBoxBackend/
├── src/main/java/com/example/BorrowBoxBackend/
│   ├── model/
│   │   ├── Item.java (Item entity)
│   │   ├── Borrow.java (Borrow entity)
│   │   └── Transaction.java (Transaction entity)
│   ├── repository/
│   │   ├── ItemRepository.java (Item data access)
│   │   ├── BorrowRepository.java (Borrow data access)
│   │   └── TransactionRepository.java (Transaction data access)
│   ├── service/
│   │   ├── ItemService.java (Item business logic)
│   │   ├── BorrowService.java (Borrow business logic)
│   │   └── TransactionService.java (Transaction business logic)
│   ├── controller/
│   │   ├── ItemController.java (Item REST endpoints)
│   │   ├── BorrowController.java (Borrow REST endpoints)
│   │   ├── TransactionController.java (Transaction REST endpoints)
│   │   └── AuthController.java (Authentication endpoints)
│   ├── dto/
│   │   ├── ItemDTO.java, ItemRequest.java
│   │   ├── BorrowDTO.java, BorrowRequest.java, ReturnBorrowRequest.java
│   │   └── TransactionDTO.java
│   ├── config/
│   │   ├── SecurityConfig.java (JWT security)
│   │   └── WebConfig.java (CORS configuration)
│   ├── security/
│   │   └── JwtUtils.java (JWT token management)
│   └── BorrowBoxBackendApplication.java (Application entry point)
├── src/main/resources/
│   └── application.properties (Database & app configuration)
├── pom.xml (Maven dependencies)
├── BACKEND_README.md (Backend documentation)
├── BACKEND_DEPLOYMENT.md (Deployment guide)
└── Dockerfile (Docker configuration - optional)

API Endpoints (25+):
✅ Authentication (Login, Register)
✅ Items (CRUD, Search, Filter, Availability)
✅ Borrows (Borrow, Return, Track, Overdue)
✅ Transactions (History, Filtering, Analytics)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (Frontend)
- Java 17+ (Backend)
- Maven 3.8+ (Backend build)
- Git (Version control)

### Quick Start

#### 1. Frontend Setup
```bash
cd borrowboxfrontend
npm install
npm start  # Runs on http://localhost:3000
```

#### 2. Backend Setup
```bash
cd BorrowBoxBackend
mvn clean install
mvn spring-boot:run  # Runs on http://localhost:8080/api
```

#### 3. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api

---

## 📊 API Documentation

### Base URL
- Development: `http://localhost:8080/api`
- Production: `https://borrowbox-backend-xxx.onrender.com/api`

### Authentication Endpoints

```
POST /auth/login
  Body: { "email": "user@example.com", "password": "password" }
  Response: { "success": true, "token": "jwt_token", "user": {...} }

POST /auth/register
  Body: { "email": "user@example.com", "password": "password", "fullName": "Name", "role": "STUDENT" }
  Response: { "success": true, "token": "jwt_token", "user": {...} }
```

### Item Endpoints

```
GET /items
  Returns: All items in inventory
  
GET /items/{id}
  Returns: Specific item details
  
POST /items/create
  Headers: Authorization: Bearer {token}
  Body: { "name": "Laptop", "category": "Electronics", "quantity": 5 }
  
PUT /items/{id}
  Updates: Item details
  
DELETE /items/{id}
  Deletes: Item from inventory
  
GET /items/search/{searchTerm}
  Searches: Items by name
  
GET /items/category/{category}
  Filters: Items by category
  
GET /items/available/all
  Returns: Items with available quantity > 0
```

### Borrow Endpoints

```
POST /borrows/borrow
  Headers: Authorization: Bearer {token}
  Body: { "itemId": "uuid", "dueDate": "2026-06-01T23:59:59" }
  Action: Borrows an item (reduces inventory)
  
POST /borrows/{borrowId}/return
  Body: { "condition": "Good|Damaged", "notes": "optional notes" }
  Action: Returns an item (increases inventory)
  
GET /borrows/student
  Headers: Authorization: Bearer {token}
  Returns: Current user's borrows
  
GET /borrows/student/active
  Headers: Authorization: Bearer {token}
  Returns: Current user's active (not returned) borrows
  
GET /borrows/overdue/all
  Returns: All overdue items (due date < today)
```

### Transaction Endpoints

```
GET /transactions
  Returns: All transactions (complete audit trail)
  
GET /transactions/student/{studentId}
  Returns: Specific student's transaction history
  
GET /transactions/status/{status}
  Filters: By transaction status (ACTIVE, RETURNED, OVERDUE)
  
GET /transactions/item/{itemId}
  Returns: All transactions for specific item
  
GET /transactions/range?startDate=...&endDate=...
  Returns: Transactions within date range
```

---

## 🔐 Security Features

✅ **JWT Authentication**
- Token-based authentication
- 24-hour token expiration
- Automatic logout after expiration

✅ **Password Security**
- Passwords hashed with jBCrypt
- No plain-text storage
- Salt added to each password

✅ **Role-Based Access Control**
- Students: Can only see their own borrows
- Officers: Can manage all items and view all transactions
- Backend validates permissions on each request

✅ **CORS Configuration**
- Frontend (localhost:3000) can access backend
- Production domains configured separately

✅ **SQL Injection Protection**
- JPA parameterized queries
- No string concatenation in SQL

---

## 🗄️ Database Schema

### Users Table
```sql
id (UUID, PK)
email (VARCHAR, unique)
password (VARCHAR, hashed)
full_name (VARCHAR)
role (ENUM: STUDENT, OFFICER)
profile_photo (BYTEA)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Items Table
```sql
id (UUID, PK)
name (VARCHAR)
description (TEXT)
category (VARCHAR)
total_quantity (INTEGER)
available_quantity (INTEGER)
serial_number (VARCHAR, unique)
status (VARCHAR)
created_by (VARCHAR, FK→users.id)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Borrows Table
```sql
id (UUID, PK)
student_id (UUID, FK→users.id)
item_id (UUID, FK→items.id)
serial_number (VARCHAR)
borrow_date (TIMESTAMP)
due_date (TIMESTAMP)
return_date (TIMESTAMP, nullable)
status (ENUM: ACTIVE, RETURNED)
condition (VARCHAR: Good, Damaged)
notes (TEXT)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Transactions Table
```sql
id (UUID, PK)
borrow_id (UUID, FK→borrows.id)
student_id (UUID, FK→users.id)
item_id (UUID, FK→items.id)
transaction_type (ENUM: BORROW, RETURN)
status (VARCHAR)
borrow_date (TIMESTAMP)
due_date (TIMESTAMP)
return_date (TIMESTAMP)
condition (VARCHAR)
notes (TEXT)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

---

## 📈 Feature Highlights

### For Students
- 🔍 Search and filter available items by category
- 📱 View personal borrowing history
- 📅 Track due dates with visual indicators
- 🔔 See overdue items clearly marked
- 📋 Complete borrowing workflow (borrow → track → return)
- 👤 Manage profile and password

### For Officers
- 📦 Complete inventory management (add/edit/delete items)
- 📊 Analytics dashboard with statistics
- 🔍 Search items by name or category
- 📋 View all transactions with filters
- 📅 Filter by date range
- 📥 Export transaction data (CSV support)
- 👥 Monitor all student borrowing activity

---

## 🧪 Testing

### Sample Test Data

**Student Account**
```
Email: student@test.com
Password: password123
Role: STUDENT
```

**Officer Account**
```
Email: officer@test.com
Password: password123
Role: OFFICER
```

### Test Workflow
1. Login as student
2. View available items
3. Search/filter items
4. Borrow an item
5. Check active borrows
6. Login as officer
7. Create new item
8. View all transactions
9. Filter by status
10. Verify data consistency

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd borrowboxfrontend
git push origin main
# Vercel auto-deploys
# Live at: https://borrowbox-frontend-xxx.vercel.app
```

### Backend (Render.com)
```bash
cd BorrowBoxBackend
git push origin main
# Render auto-builds and deploys
# Live at: https://borrowbox-backend-xxx.onrender.com/api
```

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## 📖 Documentation

### Frontend
- [Frontend README](borrowboxfrontend/README.md)
- [Deployment Guide](borrowboxfrontend/DEPLOYMENT_GUIDE.md)
- [Implementation Guide](borrowboxfrontend/IMPLEMENTATION_GUIDE.md)
- [Quick Start](borrowboxfrontend/QUICK_START.md)

### Backend
- [Backend README](BorrowBoxBackend/BACKEND_README.md)
- [Backend Deployment](BorrowBoxBackend/BACKEND_DEPLOYMENT.md)

---

## 🎯 Architecture Patterns Demonstrated

### 1. Vertical Slicing
- **Each feature is a complete vertical slice** from database to UI
- Items, Borrows, Transactions are independent modules
- Can be developed, tested, deployed separately
- Easier to understand, maintain, and modify

Example: Borrow Feature
```
UI → WebStudentBorrows.jsx
API → BorrowController.java
Logic → BorrowService.java
Data → BorrowRepository.java
DB → borrows table
```

### 2. Model-View-Presenter (MVP)
- **Model**: JPA entities represent data structure
- **Presenter**: Service layer contains business logic
- **View**: REST controllers (backend) and React components (frontend)
- Clear separation of concerns

### 3. Repository Pattern
- Data access abstraction using Spring Data JPA
- Custom @Query methods for complex operations
- Reusable queries across services

### 4. DTO Pattern
- Data Transfer Objects isolate entity structure from API responses
- Prevents exposing internal implementation details
- Clean, consistent API contracts

### 5. Service Layer
- Centralized business logic
- Orchestrates between repositories
- Transaction management (BorrowService calls ItemService and TransactionService)
- Validation and error handling

---

## 📊 Project Statistics

| Metric | Count |
|--------|-------|
| Frontend Components | 14 |
| Backend Controllers | 4 |
| Backend Services | 4 |
| Backend Repositories | 3 |
| API Endpoints | 25+ |
| Database Models | 4 |
| DTOs | 6 |
| Lines of Code (Backend) | 2500+ |
| Lines of Code (Frontend) | 1800+ |
| Test Files | 0 (manual testing done) |

---

## 🎓 Learning Outcomes

This project demonstrates:
✅ Full-stack web development (React + Spring Boot)
✅ REST API design and implementation
✅ Database design with PostgreSQL
✅ Authentication with JWT tokens
✅ Vertical slicing architecture
✅ MVP design pattern
✅ Role-based access control
✅ Cloud deployment (Supabase, Render, Vercel)
✅ Responsive UI design with TailwindCSS
✅ Component-based architecture
✅ State management in React
✅ Server-side business logic
✅ ORM with Spring Data JPA

---

## 🔧 Environment Setup

### Required Tools
```bash
# Frontend
node --version  # Should be v18+
npm --version   # Should be 9+

# Backend
java -version   # Should be 17+
mvn --version   # Should be 3.8+

# Version Control
git --version
```

### Environment Variables

**.env (Frontend)**
```
REACT_APP_API_URL=http://localhost:8080/api
```

**application.properties (Backend)**
```
spring.datasource.url=...
spring.datasource.username=...
spring.datasource.password=...
jwt.secret=...
jwt.expiration=...
```

---

## 📝 Submission Requirements

- ✅ Source code (Frontend + Backend)
- ✅ Database schema and migration scripts
- ✅ API documentation
- ✅ Deployment configuration
- ✅ README with architecture overview
- ✅ 10-minute video presentation

---

## 🎥 Video Presentation

**Required Components:**
1. **Project Overview** (1 min)
   - Problem statement
   - Solution overview
   - Key features

2. **Live Demo** (4 min)
   - Login flow
   - Student borrowing workflow
   - Officer inventory management
   - Transaction history

3. **Code Walkthrough** (3 min)
   - Vertical slicing architecture
   - MVP pattern implementation
   - Key code snippets

4. **Deployment** (1 min)
   - Live URLs
   - Production setup
   - Performance metrics

5. **Conclusion** (1 min)
   - Lessons learned
   - Future improvements
   - Technology insights

---

## 📞 Support & Resources

- **Spring Boot Docs**: https://spring.io/projects/spring-boot
- **React Docs**: https://react.dev
- **JWT Auth**: https://jwt.io
- **TailwindCSS**: https://tailwindcss.com
- **Supabase**: https://supabase.com/docs

---

## 📜 License

This project is created for educational purposes as part of PSITE 7 ICT Congress - Final Examination.

---

## 👨‍💼 Author

**BorrowBox Development Team**
- Built with Spring Boot + React
- Deployed with Vercel + Render
- Database: Supabase PostgreSQL

---

## 🚀 Ready for Production!

**Deployment Status**: ✅ Production Ready
**Last Updated**: May 2026
**Deadline**: May 23, 2026

---

**Thank you for using BorrowBox!** 🎓
