# 🧪 BorrowBox Integration Testing Guide

**Complete End-to-End Testing Checklist**

---

## 📋 Pre-Testing Checklist

- [ ] Backend running locally on port 8080
- [ ] Frontend running locally on port 3000
- [ ] PostgreSQL/Supabase database accessible
- [ ] REACT_APP_API_URL set to `http://localhost:8080/api`
- [ ] Browser DevTools open for error checking

---

## 🧑‍🎓 Student User Testing

### Test Account
```
Email: student@test.com
Password: password123
Role: STUDENT
```

### Test Flow 1: Login & Dashboard
1. [ ] Navigate to http://localhost:3000
2. [ ] Click "Login for Students"
3. [ ] Enter student email and password
4. [ ] Successfully logged in → Redirected to Student Dashboard
5. [ ] Dashboard displays welcome message
6. [ ] Check browser console for API errors

**Expected Results:**
- ✅ Login successful
- ✅ JWT token stored in localStorage
- ✅ Dashboard loads without errors
- ✅ Navigation menu shows "My Borrows" and "Profile"

### Test Flow 2: Browse & Search Items
1. [ ] From dashboard, click "Browse Items" or search box
2. [ ] View list of all available items
3. [ ] Search for "Laptop"
4. [ ] Verify search results filtered correctly
5. [ ] Click on an item to see details

**Expected Results:**
- ✅ Items list loads (use API: GET /api/items)
- ✅ Search shows filtered results
- ✅ Item details display properly
- ✅ No console errors

### Test Flow 3: Borrow Item
1. [ ] Click "Borrow" button on an available item
2. [ ] Set due date to 7 days from today
3. [ ] Click "Confirm Borrow"
4. [ ] See success notification
5. [ ] Item quantity decreased in inventory

**Expected Results:**
- ✅ API call: POST /api/borrows/borrow
- ✅ Transaction created in database
- ✅ Item available_quantity reduced by 1
- ✅ Success message displayed
- ✅ Item no longer available for borrowing

**API Check:**
```bash
curl -X POST http://localhost:8080/api/borrows/borrow \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"itemId":"item-uuid","dueDate":"2026-06-01T23:59:59"}'
```

### Test Flow 4: View My Borrows
1. [ ] Click "My Borrows" in navigation
2. [ ] See list of active borrows
3. [ ] View: Item name, borrow date, due date, days remaining
4. [ ] See overdue items marked in red (if any)
5. [ ] Verify returned items shown separately

**Expected Results:**
- ✅ API call: GET /api/borrows/student
- ✅ Active borrows shown
- ✅ Returned borrows shown in separate section
- ✅ Due date formatting correct
- ✅ Overdue items highlighted

### Test Flow 5: Return Item
1. [ ] From "My Borrows", click "Return" on active item
2. [ ] Select condition: "Good" or "Damaged"
3. [ ] Add optional notes
4. [ ] Click "Return Item"
5. [ ] See success notification
6. [ ] Item moved to "Returned" section

**Expected Results:**
- ✅ API call: POST /api/borrows/{borrowId}/return
- ✅ Borrow status changed to RETURNED
- ✅ Transaction updated
- ✅ Item available_quantity increased by 1
- ✅ Return date recorded

### Test Flow 6: View Profile
1. [ ] Click "Profile" in navigation
2. [ ] See current user information
3. [ ] View: Email, Full Name, Role
4. [ ] Upload profile photo
5. [ ] Change password
6. [ ] Save changes

**Expected Results:**
- ✅ Profile data loads correctly
- ✅ Photo upload works
- ✅ Password change successful
- ✅ No console errors

### Test Flow 7: Logout
1. [ ] Click "Logout" button
2. [ ] Redirected to login page
3. [ ] Token removed from localStorage
4. [ ] Cannot access student pages without re-login

**Expected Results:**
- ✅ Token cleared from localStorage
- ✅ User state cleared
- ✅ Redirect to login page works
- ✅ Protected routes deny access

---

## 👮 Officer User Testing

### Test Account
```
Email: officer@test.com
Password: password123
Role: OFFICER
```

### Test Flow 1: Login & Dashboard
1. [ ] Navigate to http://localhost:3000
2. [ ] Click "Login for Officers"
3. [ ] Enter officer email and password
4. [ ] Successfully logged in → Officer Dashboard
5. [ ] Dashboard shows statistics and overview

**Expected Results:**
- ✅ Officer dashboard loads
- ✅ Shows item statistics
- ✅ Shows borrow statistics
- ✅ Different UI than student dashboard

### Test Flow 2: Create New Item
1. [ ] Click "Manage Items" or "Add Item"
2. [ ] Fill in form:
   - Name: "Test Laptop"
   - Description: "Testing inventory"
   - Category: "Electronics"
   - Quantity: 5
   - Serial: "SERIAL12345" (unique)
3. [ ] Click "Add Item"
4. [ ] See item in inventory list

**Expected Results:**
- ✅ API call: POST /api/items/create
- ✅ Item stored in database
- ✅ Item appears in inventory list
- ✅ Quantity set correctly

### Test Flow 3: Edit Item
1. [ ] Click "Edit" on the test item just created
2. [ ] Change quantity from 5 to 3
3. [ ] Update description
4. [ ] Click "Save"
5. [ ] Verify changes applied

**Expected Results:**
- ✅ API call: PUT /api/items/{itemId}
- ✅ Changes persisted
- ✅ List refreshes with new data
- ✅ Success notification shown

### Test Flow 4: Search & Filter Items
1. [ ] Use search box to find "Laptop"
2. [ ] Filter by category "Electronics"
3. [ ] See filtered results
4. [ ] Clear filters to show all items

**Expected Results:**
- ✅ Search works: GET /api/items/search/{term}
- ✅ Category filter works: GET /api/items/category/{category}
- ✅ Results update dynamically
- ✅ No errors in console

### Test Flow 5: Delete Item
1. [ ] Click "Delete" on test item
2. [ ] Confirm deletion
3. [ ] Item removed from list
4. [ ] Check database - item still exists but marked deleted (or actually deleted)

**Expected Results:**
- ✅ API call: DELETE /api/items/{itemId}
- ✅ Item removed from list
- ✅ No 404 errors

### Test Flow 6: View All Transactions
1. [ ] Click "Transactions" or "View History"
2. [ ] See all transactions in table
3. [ ] View: Item name, Student, Status, Date, Action
4. [ ] Transactions include BORROWs and RETURNs

**Expected Results:**
- ✅ API call: GET /api/transactions
- ✅ All transactions displayed
- ✅ Status badges show correctly
- ✅ Dates formatted properly

### Test Flow 7: Filter Transactions
1. [ ] Filter by Status: "ACTIVE"
2. [ ] See only active borrows
3. [ ] Filter by Status: "RETURNED"
4. [ ] See only returned items
5. [ ] Filter by Date Range: Last 7 days
6. [ ] Verify date filtering works

**Expected Results:**
- ✅ API call: GET /api/transactions/status/{status}
- ✅ API call: GET /api/transactions/range?startDate=...&endDate=...
- ✅ Filters apply correctly
- ✅ Results update dynamically

### Test Flow 8: Search in Transactions
1. [ ] In transactions, search for "Laptop"
2. [ ] See only Laptop transactions
3. [ ] Search for student name
4. [ ] See transactions for that student

**Expected Results:**
- ✅ Search filters transactions
- ✅ Results update correctly
- ✅ No console errors

### Test Flow 9: Export Data (if implemented)
1. [ ] Click "Export as CSV"
2. [ ] CSV file downloaded
3. [ ] Open file, verify data

**Expected Results:**
- ✅ CSV downloads successfully
- ✅ File contains transaction data
- ✅ Headers and rows correct

### Test Flow 10: View Student Borrows
1. [ ] If available, view all student borrows
2. [ ] See status of each borrow
3. [ ] Identify overdue items

**Expected Results:**
- ✅ All borrows displayed
- ✅ Overdue highlighted
- ✅ Status badges clear

---

## 🔧 API Testing (Using cURL or Postman)

### 1. Authentication Tests
```bash
# Test Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@test.com","password":"password123"}'

# Expected Response:
# {
#   "success": true,
#   "message": "Login successful",
#   "token": "eyJhbGciOiJIUzI1NiIs...",
#   "user": {...}
# }
```

### 2. Item Endpoints Test
```bash
# Get All Items
curl http://localhost:8080/api/items

# Get Specific Item
curl http://localhost:8080/api/items/{itemId}

# Search Items
curl http://localhost:8080/api/items/search/laptop

# Filter by Category
curl http://localhost:8080/api/items/category/Electronics

# Get Available Items
curl http://localhost:8080/api/items/available/all
```

### 3. Borrow Endpoints Test
```bash
# Get Student Borrows (requires token)
curl -H "Authorization: Bearer {token}" \
  http://localhost:8080/api/borrows/student

# Get Active Borrows Only
curl -H "Authorization: Bearer {token}" \
  http://localhost:8080/api/borrows/student/active

# Get Overdue Items
curl http://localhost:8080/api/borrows/overdue/all
```

### 4. Transaction Endpoints Test
```bash
# Get All Transactions
curl http://localhost:8080/api/transactions

# Filter by Status
curl http://localhost:8080/api/transactions/status/ACTIVE

# Filter by Date Range
curl "http://localhost:8080/api/transactions/range?startDate=2026-05-01&endDate=2026-05-31"

# Get Student Transactions
curl http://localhost:8080/api/transactions/student/{studentId}
```

---

## 🐛 Error Handling Tests

### Test 1: Invalid Login
1. [ ] Try login with wrong password
2. [ ] See error message: "Invalid credentials"
3. [ ] No token stored

**Expected:** 401 Unauthorized response

### Test 2: Borrow Unavailable Item
1. [ ] Create item with quantity 0
2. [ ] Try to borrow it
3. [ ] See error: "Item not available"

**Expected:** 400 Bad Request with appropriate message

### Test 3: Return Non-Existent Borrow
1. [ ] Try to return with invalid borrow ID
2. [ ] See error: "Borrow not found"

**Expected:** 404 Not Found response

### Test 4: Access Without Authentication
1. [ ] Try to access student borrows without token
2. [ ] See error or redirect to login

**Expected:** 401 Unauthorized or redirect

### Test 5: CORS Error
1. [ ] If frontend on different port/domain
2. [ ] Check browser console for CORS error
3. [ ] Verify backend has correct CORS configuration

**Expected:** No CORS errors if configured correctly

---

## 📊 Data Consistency Tests

### Test 1: Quantity Consistency
1. [ ] Create item with quantity 5
2. [ ] Note: `totalQuantity=5, availableQuantity=5`
3. [ ] Borrow 2 items
4. [ ] Check: `availableQuantity=3`
5. [ ] Return 1 item
6. [ ] Check: `availableQuantity=4`
7. [ ] Return another item
8. [ ] Check: `availableQuantity=5`

**Expected:** Quantities always consistent

### Test 2: Transaction Audit Trail
1. [ ] Borrow item
2. [ ] Check transaction created with status "BORROW"
3. [ ] Return item
4. [ ] Check transaction updated with status "RETURN"
5. [ ] Verify return date recorded

**Expected:** Complete audit trail maintained

### Test 3: Date Handling
1. [ ] Borrow item with due date in future
2. [ ] Check dates stored correctly
3. [ ] Return item
4. [ ] Verify return date is today
5. [ ] Test with due date in past (should create overdue)

**Expected:** All dates handled correctly

---

## ⚡ Performance Testing

### Test 1: Load All Items
1. [ ] Measure time to load items page
2. [ ] Should be < 2 seconds

**Expected:** Fast loading, no lag

### Test 2: Search Performance
1. [ ] Search with many items in database
2. [ ] Should return results in < 1 second

**Expected:** Quick search results

### Test 3: Large Transaction List
1. [ ] Load transactions page with 100+ transactions
2. [ ] Should not lag or freeze

**Expected:** Smooth scrolling, responsive UI

---

## ✅ Final Verification Checklist

### Frontend
- [ ] All pages load without errors
- [ ] All buttons are functional
- [ ] Forms validate correctly
- [ ] Error messages are user-friendly
- [ ] Navigation works (back/forward)
- [ ] Responsive design works
- [ ] No console errors
- [ ] No console warnings
- [ ] Images load correctly
- [ ] Styling is consistent

### Backend
- [ ] All endpoints respond correctly
- [ ] Error responses are meaningful
- [ ] Authentication works properly
- [ ] Authorization works (students see only their data)
- [ ] Database queries are efficient
- [ ] No SQL errors in logs
- [ ] CORS configured correctly
- [ ] No security warnings

### Database
- [ ] Tables created correctly
- [ ] Data persists after refresh
- [ ] Relationships maintained
- [ ] Constraints enforced
- [ ] Timestamps updated automatically
- [ ] Unique constraints work

### Integration
- [ ] Frontend and backend communicate correctly
- [ ] Data displayed matches database
- [ ] Changes in one place reflect everywhere
- [ ] No stale data issues
- [ ] Session management works

---

## 📝 Test Results Document

After running all tests, document:

```markdown
# Test Results Summary

**Date**: [Date]
**Tester**: [Name]
**Environment**: Local Development

## Frontend Testing
- [ ] All components render correctly
- [ ] User workflows complete successfully
- [ ] Error handling works

## Backend Testing
- [ ] All API endpoints functional
- [ ] Database operations successful
- [ ] Authentication/Authorization working

## Integration Testing
- [ ] Frontend-Backend communication successful
- [ ] Data consistency maintained
- [ ] Performance acceptable

## Issues Found
1. [Issue description]
2. [Resolution applied]

## Sign-Off
✅ Ready for Deployment
```

---

## 🚀 Pre-Deployment Testing

Before deploying to production:

1. [ ] All manual tests passed
2. [ ] No console errors
3. [ ] API response times acceptable
4. [ ] Database backups created
5. [ ] Environment variables set correctly
6. [ ] SSL/HTTPS enabled
7. [ ] Security headers configured
8. [ ] Rate limiting considered
9. [ ] Error monitoring set up
10. [ ] Monitoring/logging configured

---

**Ready for Testing!** 🧪
