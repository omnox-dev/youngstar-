# 🛠️ Youngstar Backend API

Express + SQLite3 + Nodemailer API Server for **Youngstar Mitra Mandal**.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update `.env` with your admin credentials and SMTP server settings.

### 3. Start Development Server
```bash
npm run dev
```

The server will start at `http://localhost:5000`.

---

## 🔌 API Routes

- `GET /api/vargani` - Retrieve all donation records
- `POST /api/vargani` - Add a new donation record
- `POST /api/admin/login` - Admin login verification
- `POST /api/send-email-receipt` - Send receipt email via Nodemailer
