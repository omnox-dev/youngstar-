# 🚩 Youngstar Mitra Mandal - Vargani & Ganesh Mandal Management Portal

A full-stack web application designed for **Youngstar Mitra Mandal** to manage Vargani (donation) collections, issue digital receipts, send instant notifications (Email & WhatsApp), verify donor receipts via QR code, and manage records via an Admin Dashboard.

---

## 🚀 Features

- 📜 **Digital Vargani Receipts**: Instantly generate clean digital receipts with receipt numbers, donor details, payment modes, and amounts in words.
- 📲 **WhatsApp & Email Integration**: Send receipt links directly via WhatsApp or automatically dispatch email receipts with PDF details via SMTP (Nodemailer).
- 🔍 **Receipt Verification**: QR code and online verification link system for public authenticity check (`/verify/:receiptNo`).
- 🛡️ **Admin Dashboard**: Secure authentication for Mandal administrators to view, search, filter, and export Vargani collection records.
- 🤝 **Public Transparency & Donor List**: Publicly display contribution wall with option for donor privacy controls (`public` vs `anonymous`).
- ⌨️ **On-Screen Marathi Keyboard**: Built-in virtual keyboard supporting Unicode Devanagari input for Marathi names and cities.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Simple Keyboard
- **Backend**: Node.js, Express.js, SQLite3 (`vargani.db`), Nodemailer, CORS, Dotenv
- **Database**: SQLite3

---

## 📁 Project Structure

```text
Youngstar/
├── backend/
│   ├── .env.example          # Environment variables template
│   ├── server.js             # Express API server & SQLite database handler
│   ├── vargani.db            # SQLite database file
│   └── package.json          # Backend dependencies & scripts
├── frontend/
│   ├── src/                  # React components & pages
│   ├── index.html            # Entry HTML file
│   ├── vite.config.js        # Vite config with /api proxy to localhost:5000
│   └── package.json          # Frontend dependencies & scripts
├── package.json              # Root project configurations & helper scripts
└── README.md                 # Project documentation
```

---

## 📋 Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (v16.x or higher recommended)
- **npm** (v8.x or higher)

---

## ⚙️ Environment Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Configure your environment variables inside `backend/.env`:

   ```env
   PORT=5000
   NODE_ENV=development

   # Admin Credentials
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your_secure_password

   # Nodemailer SMTP Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

---

## 💻 Running the Application

### 1️⃣ Install Dependencies

To install all dependencies for the root, backend, and frontend in one command:

```bash
npm run install:all
```

*Or install individually:*

```bash
# Backend dependencies
cd backend && npm install

# Frontend dependencies
cd frontend && npm install
```

---

### 2️⃣ Run Development Servers

You will need to start both the **Backend API Server** and the **Frontend Development Server**.

#### Start Backend Server (Port 5000)
```bash
npm run dev:backend
```
*Or manually:*
```bash
cd backend
npm run dev
```

#### Start Frontend Server (Port 3000)
Open a new terminal window/tab:
```bash
npm run dev:frontend
```
*Or manually:*
```bash
cd frontend
npm run dev
```

Once running, access the application in your browser:
- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/vargani` | Fetch all Vargani records |
| `POST` | `/api/vargani` | Create a new Vargani donation record |
| `POST` | `/api/admin/login` | Authenticate Admin user |
| `POST` | `/api/send-email-receipt` | Send email receipt via SMTP Nodemailer |

---

## 🏗️ Production Build

To create an optimized production build for the frontend:

```bash
cd frontend
npm run build
```

The compiled static assets will be output to `frontend/dist`.

---

## 📄 License

This project is maintained for **Youngstar Mitra Mandal**.
