# Test Credentials & Login Guide

## ✅ All Users Successfully Created

The database has been seeded with 8 test users. All accounts are **active** and ready to use.

---

## 🔑 Login Instructions

### **IMPORTANT**: Use `identifier` field, NOT `email`

The login endpoint expects:
```json
{
  "identifier": "admin@tickmate.com",  // Can be email OR username
  "password": "admin123"
}
```

❌ **Wrong** (will fail):
```json
{
  "email": "admin@tickmate.com",
  "password": "admin123"
}
```

---

## 👥 Test Accounts

### Admin Account

**Email/Username**: `admin@tickmate.com` OR `admin`  
**Password**: `admin123`  
**Role**: Admin  
**Skills**: System Administration, User Management, Security

**Login JSON**:
```json
{
  "identifier": "admin@tickmate.com",
  "password": "admin123"
}
```

---

### Moderator Accounts

#### 1. John (Full-Stack)
**Email/Username**: `john@tickmate.com` OR `john_mod`  
**Password**: `moderator123`  
**Skills**: React, Node.js, PostgreSQL, Authentication, API

**Login JSON**:
```json
{
  "identifier": "john@tickmate.com",
  "password": "moderator123"
}
```

#### 2. Sarah (Tech Lead)
**Email/Username**: `sarah@tickmate.com` OR `sarah_tech`  
**Password**: `moderator123`  
**Skills**: Performance, Database Optimization, Architecture, Security

**Login JSON**:
```json
{
  "identifier": "sarah_tech",
  "password": "moderator123"
}
```

#### 3. Mike (Frontend Dev)
**Email/Username**: `mike@tickmate.com` OR `mike_frontend`  
**Password**: `moderator123`  
**Skills**: React, CSS, UI/UX, Responsive Design, Tailwind CSS

**Login JSON**:
```json
{
  "identifier": "mike_frontend",
  "password": "moderator123"
}
```

#### 4. Alice (Backend Dev)
**Email/Username**: `alice@tickmate.com` OR `alice_backend`  
**Password**: `moderator123`  
**Skills**: Express, PostgreSQL, API, Async Jobs, Webhooks

**Login JSON**:
```json
{
  "identifier": "alice_backend",
  "password": "moderator123"
}
```

---

### Regular User Accounts

#### User 1
**Email/Username**: `user1@example.com` OR `user1`  
**Password**: `user123`  
**Skills**: None

**Login JSON**:
```json
{
  "identifier": "user1",
  "password": "user123"
}
```

#### User 2
**Email/Username**: `user2@example.com` OR `user2`  
**Password**: `user123`  

#### User 3
**Email/Username**: `user3@example.com` OR `user3`  
**Password**: `user123`  

---

## 🧪 Testing Login via API

### Using cURL:

**Admin Login**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "admin@tickmate.com",
    "password": "admin123"
  }'
```

**User Login with Username**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "user1",
    "password": "user123"
  }'
```

**Expected Success Response**:
```json
{
  "success": true,
  "message": "User logged in successfully"
}
```

The JWT token is set in an HttpOnly cookie automatically.

---

## 🔐 Admin Login Endpoint

### Regular User Login
**Endpoint**: `POST /api/auth/login`

### Admin Login  
**Endpoint**: `POST /api/admin/login`

Both use the same schema (identifier + password).

---

## ✅ Verification Commands

### Check if users exist:
```bash
PGPASSWORD=tickmate psql -h localhost -U tickmate -d tickmate \
  -c "SELECT id, username, email, role, is_active FROM users;"
```

### Check specific user:
```bash
PGPASSWORD=tickmate psql -h localhost -U tickmate -d tickmate \
  -c "SELECT * FROM users WHERE email = 'admin@tickmate.com';"
```

### Test login via API:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier": "admin", "password": "admin123"}'
```

---

## 📊 Database Status

All 8 users have been created with:
- ✅ Hashed passwords (Argon2)
- ✅ Active status (`is_active = true`)
- ✅ Assigned roles
- ✅ Skills (for moderators)
- ✅ Email addresses
- ✅ Unique usernames

---

## 🐛 Troubleshooting

### "Invalid credentials" error

**Check:**
1. ✅ Are you using `"identifier"` field (not `"email"`)?
2. ✅ Is the password correct?
   - Admin: `admin123`
   - Moderators: `moderator123`
   - Users: `user123`
3. ✅ Are you sending to the correct endpoint?
   - Regular users: `/api/auth/login`
   - Admins: `/api/admin/login` (or use regular endpoint)

### "Validation failed" error

**Cause**: Using wrong field name

❌ Wrong:
```json
{"email": "...", "password": "..."}
```

✅ Correct:
```json
{"identifier": "...", "password": "..."}
```

### User not found

**Verify user exists**:
```bash
PGPASSWORD=tickmate psql -h localhost -U tickmate -d tickmate \
  -c "SELECT email, username, role FROM users WHERE email = 'your-email@example.com';"
```

---

## 🎯 Quick Test

Copy and paste this command to verify everything works:

```bash
# Test admin login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier": "admin", "password": "admin123"}' | jq .

# Test user login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier": "user1", "password": "user123"}' | jq .
```

Both should return:
```json
{
  "success": true,
  "message": "User logged in successfully"
}
```

---

## 📝 Frontend Login Form

When building the login form, make sure to use:

```javascript
const loginData = {
  identifier: emailOrUsername,  // NOT "email"
  password: password
};

await axios.post('/api/auth/login', loginData);
```

---

## Status: ✅ ALL ACCOUNTS WORKING

All 8 test accounts have been verified and are ready to use. Just remember to use the `identifier` field instead of `email` when logging in!
