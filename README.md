# 🛡️ AdminHub — Contact Message Manager

A full-stack secure admin panel built with **React**, **Node.js (Express)**, and **MongoDB**.

---

## 📁 Project Structure

```
admin-panel/
├── backend/                  # Node.js + Express API
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── models/
│   │   ├── Admin.js          # Admin user schema
│   │   └── Message.js        # Contact message schema
│   ├── routes/
│   │   ├── auth.js           # POST /login, GET /me, POST /logout
│   │   └── messages.js       # CRUD for messages
│   ├── .env.example
│   ├── package.json
│   ├── seed.js               # Database seeder
│   └── server.js             # Express app entry
│
└── frontend/                 # React app
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── Header.js
        │   ├── MessageModal.js
        │   ├── MessageRow.js
        │   ├── ProtectedRoute.js
        │   ├── Sidebar.js
        │   └── StatCard.js
        ├── context/
        │   └── AuthContext.js
        ├── pages/
        │   ├── ContactPage.js
        │   ├── DashboardPage.js
        │   ├── LoginPage.js
        │   └── MessagesPage.js
        ├── services/
        │   └── api.js
        ├── App.js
        ├── index.css
        └── index.js
```

---

## ⚙️ Prerequisites

- **Node.js** v18+ 
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **npm** v8+

---

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/admin_panel
JWT_SECRET=your_super_secret_key_at_least_32_characters
JWT_EXPIRES_IN=24h
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

> **For MongoDB Atlas**, replace `MONGODB_URI` with your Atlas connection string.

### 3. Seed the Database

```bash
cd backend
npm run seed
```

This creates:
- Admin account: `admin@example.com` / `Admin@123` (superadmin)
- Manager account: `manager@example.com` / `Manager@123` (admin)
- 8 sample contact messages

### 4. Start the Application

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev        # development (nodemon)
# or
npm start          # production
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
```

### 5. Open in Browser

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api/health

---

## 🔑 Default Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | Admin@123 | superadmin |
| manager@example.com | Manager@123 | admin |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/login` | Public | Admin login |
| GET | `/api/auth/me` | Protected | Get current admin |
| POST | `/api/auth/logout` | Protected | Logout |

### Messages
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/messages` | Public | Submit contact form |
| GET | `/api/messages` | Protected | Get all messages (paginated + filterable) |
| GET | `/api/messages/stats` | Protected | Dashboard statistics |
| GET | `/api/messages/:id` | Protected | Get single message |
| PATCH | `/api/messages/:id/read` | Protected | Mark read/unread |
| DELETE | `/api/messages/:id` | Protected | Soft delete |
| DELETE | `/api/messages/:id/permanent` | Superadmin | Hard delete |

### Query Parameters for GET /api/messages
| Param | Values | Default |
|-------|--------|---------|
| `page` | number | 1 |
| `limit` | number | 10 |
| `search` | string | — |
| `filter` | all \| read \| unread | all |
| `sort` | newest \| oldest | newest |

---

## 🗄️ Database Schema

### Admin
```js
{
  username: String (unique, min 3 chars),
  email: String (unique, lowercase),
  password: String (bcrypt hashed, select: false),
  role: "admin" | "superadmin",
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Message
```js
{
  name: String,
  email: String,
  subject: String,
  message: String,
  isRead: Boolean (default: false),
  readAt: Date,
  deletedAt: Date (soft delete, default: null),
  createdAt: Date,
  updatedAt: Date
}
```

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure token-based auth with 24h expiry
- 🔒 **Password Hashing** — bcryptjs with salt rounds 12
- 🛡️ **Security** — Helmet, CORS, rate limiting (10 login attempts/15min)
- 📊 **Dashboard** — Live stats: total, unread, today, this week
- 📬 **Messages** — Full CRUD with search, filter, sort, pagination
- ✅ **Bulk Actions** — Select multiple messages for batch operations
- 📖 **Read/Unread** — Track which messages have been read
- 🗑️ **Soft Delete** — Messages marked deleted, not permanently removed
- 📱 **Responsive** — Works on mobile, tablet, and desktop
- 🎨 **Clean UI** — Light theme with Plus Jakarta Sans font

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 6 |
| Styling | CSS Variables, Custom CSS |
| HTTP Client | Axios |
| Backend | Node.js, Express 4 |
| Database | MongoDB, Mongoose |
| Auth | JWT (jsonwebtoken) |
| Security | bcryptjs, helmet, express-rate-limit |
| Validation | express-validator |

---

## 🔧 Production Deployment

1. Set `NODE_ENV=production` in backend `.env`
2. Set `MONGODB_URI` to your production MongoDB URI
3. Set a strong `JWT_SECRET` (32+ random characters)
4. Build frontend: `cd frontend && npm run build`
5. Serve the `build/` folder via Express or a CDN
6. Use PM2 or similar to manage the Node.js process

---

> Built with ❤️ using Node.js, MongoDB, and React
