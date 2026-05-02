# ⚡ BorrowBox Quick Reference Guide

**Fast lookup for developers during development and deployment**

---

## 🚀 Quick Start (5 Minutes)

### 1. Frontend Setup
```bash
cd borrowboxfrontend
npm install
npm start
# Frontend at http://localhost:3000
```

### 2. Backend Setup
```bash
cd BorrowBoxBackend
mvn clean install
mvn spring-boot:run
# Backend at http://localhost:8080/api
```

### 3. Test
```bash
# Login with:
Email: student@test.com OR officer@test.com
Password: password123
```

---

## 📁 Important File Locations

### Frontend
| What | Path |
|------|------|
| Main App | `borrowboxfrontend/src/App.jsx` |
| Components | `borrowboxfrontend/src/components/` |
| API Methods | `borrowboxfrontend/src/api/auth.js` |
| Config | `borrowboxfrontend/.env` |
| Styling | `borrowboxfrontend/tailwind.config.js` |
| Docs | `borrowboxfrontend/README.md` |

### Backend
| What | Path |
|------|------|
| Models | `BorrowBoxBackend/src/main/java/.../model/` |
| Controllers | `BorrowBoxBackend/src/main/java/.../controller/` |
| Services | `BorrowBoxBackend/src/main/java/.../service/` |
| Repositories | `BorrowBoxBackend/src/main/java/.../repository/` |
| DTOs | `BorrowBoxBackend/src/main/java/.../dto/` |
| Config | `BorrowBoxBackend/src/main/resources/application.properties` |
| Build | `BorrowBoxBackend/pom.xml` |

---

## 🔗 API Endpoints at a Glance

### Base URL
```
Local: http://localhost:8080/api
Production: https://borrowbox-backend-xxx.onrender.com/api
```

### Key Endpoints
```
POST   /auth/login              Login user
POST   /auth/register           Register user
GET    /items                   List all items
POST   /items/create            Create item
GET    /items/search/{term}     Search items
POST   /borrows/borrow          Borrow item
POST   /borrows/{id}/return     Return item
GET    /borrows/student         My borrows
GET    /transactions            All transactions
GET    /transactions/status/{s} Filter transactions
```

---

## 🔐 Authentication

### Get Token
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@test.com","password":"password123"}'
```

### Use Token
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:8080/api/borrows/student
```

### In Frontend
```javascript
// Token automatically added in authAxios()
const response = await authAxios().get('/api/borrows/student');
```

---

## 🗄️ Database Connection

### Supabase
```
Host: aws-1-ap-northeast-1.pooler.supabase.com
Port: 6543
Database: postgres
User: postgres.ylrnszuezskmdcbwtdcs
Password: UelOQuAXW8d3Tk0R
```

### Test Connection
```bash
psql -h aws-1-ap-northeast-1.pooler.supabase.com -U postgres.ylrnszuezskmdcbwtdcs -d postgres
```

### Check Tables
```sql
-- In Supabase dashboard or psql
\dt  -- List all tables
SELECT * FROM items;
SELECT * FROM borrows;
SELECT * FROM transactions;
```

---

## 🛠️ Common Development Tasks

### Add New API Endpoint

**1. Create DTO (if needed)**
```java
// src/main/java/.../dto/MyDTO.java
public class MyDTO {
  private String field;
  // getters/setters
}
```

**2. Add Repository Query**
```java
// In XyzRepository.java
@Query("SELECT x FROM Entity x WHERE x.field = :field")
List<Entity> findByField(@Param("field") String field);
```

**3. Add Service Method**
```java
// In XyzService.java
public List<MyDTO> getByField(String field) {
  List<Entity> entities = repository.findByField(field);
  return entities.stream().map(this::convertToDTO).collect(toList());
}
```

**4. Add Controller Endpoint**
```java
// In XyzController.java
@GetMapping("/field/{field}")
public ResponseEntity<?> getByField(@PathVariable String field) {
  return ResponseEntity.ok(new ApiResponse(true, "Success", 
    service.getByField(field)));
}
```

**5. Update Frontend API**
```javascript
// In src/api/auth.js
export const getByField = async (field) => {
  const response = await axios.get(`${API_URL}/field/${field}`);
  return response.data;
};
```

### Fix CORS Error
Edit `WebConfig.java`:
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("http://localhost:3000", "https://your-frontend.vercel.app")
            .allowedMethods("*")
            .allowCredentials(true);
    }
}
```

### Update Database URL
Edit `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://new-host:5432/database?sslmode=require
spring.datasource.username=new_user
spring.datasource.password=new_password
```

---

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Cannot connect to database" | Check Supabase connection, verify URL/credentials |
| "CORS error" | Add frontend URL to CORS config in WebConfig.java |
| "JWT token invalid" | Check JWT_SECRET matches, verify token not expired |
| "Build fails: Java not found" | Install Java 17+, add to PATH |
| "npm install fails" | Delete node_modules, run `npm install` again |
| "Port 8080 already in use" | Kill process: `lsof -i :8080` then `kill -9 PID` |
| "API returns 404" | Verify endpoint exists, check base URL |
| "500 Internal Server Error" | Check backend logs for exception |

---

## 📦 Dependencies & Versions

### Frontend
```
React: 18.2.0
React Router: 6.30.3
Axios: 1.13.6
TailwindCSS: 3.4.13
ESLint: 8+
```

### Backend
```
Spring Boot: 3.1.5
Java: 17+
PostgreSQL Driver: 42.6.0
JWT: 0.11.5
jBCrypt: 0.4
Maven: 3.8+
```

---

## 🚀 Deployment Checklist

### Before Deploying

**Backend**
- [ ] Run `mvn clean package` locally
- [ ] Verify no errors in build
- [ ] Test locally with production database
- [ ] Set environment variables in platform
- [ ] Commit to GitHub

**Frontend**
- [ ] Run `npm run build` locally
- [ ] Verify no errors in build
- [ ] Update REACT_APP_API_URL to production backend
- [ ] Test with production API
- [ ] Commit to GitHub

### Deploy Commands

**Render.com**
```bash
git push origin main
# Render auto-deploys (5-10 min)
```

**Vercel**
```bash
git push origin main
# Vercel auto-deploys (2-3 min)
```

---

## 📊 Debugging

### Frontend Debugging
```javascript
// Check API URL
console.log(process.env.REACT_APP_API_URL);

// Check token
console.log(localStorage.getItem('token'));

// Check current user
console.log(localStorage.getItem('user'));

// Test API call
fetch('http://localhost:8080/api/items')
  .then(r => r.json())
  .then(d => console.log(d));
```

### Backend Debugging
```bash
# Check logs
tail -f nohup.out

# Test endpoint
curl http://localhost:8080/api/items

# Check database
SELECT COUNT(*) FROM items;

# Monitor SQL queries (in application.properties)
spring.jpa.show-sql=true
logging.level.org.hibernate.SQL=DEBUG
```

---

## 📱 Feature Matrix

| Feature | Student | Officer |
|---------|---------|---------|
| Login/Register | ✅ | ✅ |
| Browse Items | ✅ | ✅ |
| Search Items | ✅ | ✅ |
| Borrow Items | ✅ | - |
| Return Items | ✅ | - |
| Create Items | - | ✅ |
| Edit Items | - | ✅ |
| Delete Items | - | ✅ |
| View Borrows | ✅ | - |
| View Transactions | - | ✅ |
| Filter Transactions | - | ✅ |
| View Profile | ✅ | ✅ |

---

## 🔐 Security Checklist

- [ ] Passwords hashed (jBCrypt)
- [ ] Tokens use JWT
- [ ] Environment variables set
- [ ] CORS configured
- [ ] No hardcoded secrets
- [ ] SQL injection protected
- [ ] HTTPS enabled (production)
- [ ] Rate limiting considered

---

## 📚 Documentation Links

| Doc | Link | Purpose |
|-----|------|---------|
| Project Overview | PROJECT_SUBMISSION_README.md | Main doc |
| Setup Guide | QUICK_START.md | 5-minute setup |
| Tech Details | IMPLEMENTATION_GUIDE.md | Deep dive |
| Testing | INTEGRATION_TESTING.md | Test guide |
| Deployment | DEPLOYMENT_GUIDE.md | Deploy help |
| Backend Info | BACKEND_README.md | Backend details |
| Checklist | SUBMISSION_CHECKLIST.md | Final check |

---

## 🎯 Environment Variables

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8080/api
```

### Backend (application.properties)
```properties
spring.datasource.url=jdbc:postgresql://host:6543/db?sslmode=require
spring.datasource.username=user
spring.datasource.password=password
jwt.secret=your_secret_key
```

---

## 💾 Git Workflow

### Commit Changes
```bash
git add .
git commit -m "feat: add new feature"
git push origin main
```

### Branch (if team develops)
```bash
git checkout -b feature/new-feature
# ... make changes ...
git push origin feature/new-feature
# Create Pull Request on GitHub
```

---

## ⚙️ Build & Run

### Frontend
```bash
# Development
npm start              # http://localhost:3000

# Production build
npm run build         # Creates /build folder

# Test build locally
npm install -g serve
serve -s build        # Serves build folder
```

### Backend
```bash
# Development
mvn spring-boot:run   # http://localhost:8080

# Production build
mvn clean package     # Creates JAR file

# Run JAR
java -jar target/BorrowBoxBackend-0.0.1-SNAPSHOT.jar
```

---

## 📞 Quick Contacts

**Spring Boot**: https://spring.io/  
**React**: https://react.dev/  
**PostgreSQL**: https://www.postgresql.org/  
**Supabase**: https://supabase.com/  
**JWT**: https://jwt.io/  
**Render**: https://render.com/  
**Vercel**: https://vercel.com/  

---

## ✅ Before Submitting

- [ ] All features working
- [ ] No console errors
- [ ] No security warnings
- [ ] Documentation complete
- [ ] Video recorded
- [ ] GitHub repos public
- [ ] README files present
- [ ] Environment variables documented

---

**Keep this guide handy during development!** 🚀

**Project Status**: ✅ COMPLETE AND DEPLOYMENT READY
