# 🚩 Youngstar Mitra Mandal - Vargani & Ganesh Mandal Management Portal

A full-stack, state-of-the-art web portal designed for **Youngstar Mitra Mandal (श्रीक्षेत्र देहूगाव, स्थापना १९७७ - ४९ वे वर्ष)** to manage Vargani (donation) collections, issue authentic digital receipts, send instant notifications (Email & WhatsApp), verify donor receipts via QR code, and administer festival operations through a secure Admin Dashboard.

---

## 🌟 Key Features & Architectural Enhancements

### 1. 🪔 Interactive Suvarna (Golden) Top Scrollbar
- **Divine Golden Progress Bar**: Sleek gradient (`#FFD700` ➔ `#FE932C` ➔ `#D14307`) pinned seamlessly at the top of the viewport.
- **Touch & Mouse Drag Interaction**: Users can touch and drag horizontally across the golden pearl handle to scroll the entire page vertically with instantaneous responsiveness.
- **Global Native Scrollbar Elimination**: Completely eliminated all default browser scrollbars across all browsers and devices while preserving silky-smooth mouse wheel, touch, and trackpad scrolling.

### 2. 📜 Complete Graphic Vargani Pavti (पावती) System
- **Full-Frame Devotional Certificate**: Designed with double-border sacred saffron styling, authentic Mandal emblem, establishment badge, and Om Ganapataye Namah banner.
- **Detailed 9-Point Verification Grid**: Displays receipt number, date, festival reason, numerical & Marathi text amounts, payment mode, masked contact, and 80-G tax exemption eligibility.
- **Verification QR Code & Digital Signatures**: Integrated QR verification seal and official signatures for Mandal Khajindar (*Kunal Birdawade*) and Executive Committee.
- **One-Click Distribution Suite**:
  - 💬 **WhatsApp**: Pre-formatted devotional message with donor name, amount, and direct verification link.
  - ✉️ **Nodemailer Email Receipt**: Automated dispatch with formatted receipt details via SMTP.
  - 🖨️ **Print to PDF**: Print-optimized stylesheet (`@media print`) rendering pure double-bordered certificate without navigation or action buttons.
  - ✨ **Demo Official Pavti**: Instant preview modal demonstrating an authentic ₹5,001 certified receipt.

### 3. 📝 Clean & Natural Vargani Registration Form
- **Natural Flow Layout**: Eliminated internal frame scrollbars and height restrictions; fields flow smoothly from top to bottom.
- **Integrated Marathi Keyboard**: Virtual Devanagari Unicode on-screen keyboard for typing Marathi names and cities.
- **Automatic Amount in Words**: Real-time conversion of rupee figures into Marathi text (e.g. ₹५,००१ ➔ 'पाच हजार एक रुपये फक्त').
- **Role-Based Payment Methods**: Public donors can contribute via Online UPI/QR, while Cash and Pay Later (शिल्लक) modes are restricted to authorized Mandal committee members.

### 4. 🏛️ Responsive Header, Shirsha Patti & Navigation
- **Devotional Shirsha Patti**: Centered top strip (`॥ श्री गणेशाय नमः ॥ • स्थापना वर्ष : १९७७ • ४९ वे वर्ष • यंगस्टार मित्र मंडळ`).
- **Context-Aware Branding**:
  - Public Lord Ganesha vector artwork (`/ganesha_logo.png`) exclusively highlighted on the Home Page and Home navbar.
  - Official high-resolution Mandal Crest (`/logo.png`) utilized across official receipts, certificate modals, and subpages.
- **Responsive Navigation Drawer**: Adaptive breakpoint transitions (`lg:hidden`) ensuring zero navigation item overflow on laptops, tablets, and smartphones.

### 5. 🛡️ Devotee Privacy & Security
- **Phone Number Masking**: Masked mobile numbers (`९८२२******`) on the public Wall of Honor to protect devotee privacy.
- **Donor Privacy Modes**: Support for Public, Anonymous (गुप्त दान), and Memorial (स्मरणार्थ देणगी) contributions.
- **Secure Admin Authentication**: Protected routes with token-based access and verification workflows.
- **Instant Top-Scroll**: Automatic instant scroll to top on page and tab transitions.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Simple Keyboard, HTML5 Canvas QR APIs
- **Backend**: Node.js, Express.js, SQLite3 (`vargani.db`), Nodemailer, CORS, Dotenv
- **Styling**: Tailored Devotional HSL Palette (Saffron `#D14307`, Turmeric `#FE932C`, Gold `#FFD700`, Maroon `#800000`)

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
│   ├── public/
│   │   ├── ganesha_logo.png  # Home page devotional Ganesha artwork
│   │   ├── logo.png          # Official Mandal emblem
│   │   └── favicon.png       # Web app favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── CustomScrollbarManager.jsx  # Interactive touch Suvarna scrollbar
│   │   │   ├── MandalPavtiModal.jsx        # Certified Mandal Pavti modal
│   │   │   ├── Navbar.jsx                  # Responsive header & drawer
│   │   │   ├── Footer.jsx                  # Devotional footer
│   │   │   └── VarganiPustak.jsx           # Receipt book browser
│   │   ├── pages/
│   │   │   ├── Home.jsx                    # Hero, tribute & festival overview
│   │   │   ├── VarganiPage.jsx             # Donation form & printable Pavti
│   │   │   ├── SchedulePage.jsx            # 10-day Utsav schedule
│   │   │   ├── GalleryPage.jsx             # Photo gallery
│   │   │   └── AdminDashboard.jsx          # Admin records & verification
│   │   ├── index.css         # Global typography & print media styles
│   │   └── App.jsx           # Routing & global settings
│   ├── index.html            # Entry HTML file
│   ├── vite.config.js        # Vite config with /api proxy to localhost:5000
│   └── package.json          # Frontend dependencies & scripts
├── package.json              # Root project configurations & helper scripts
└── README.md                 # Project documentation
```

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

To install all dependencies for root, backend, and frontend:
```bash
npm run install:all
```

*Or individually:*
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

---

### 2️⃣ Run Development Servers

Start both servers concurrently or in separate terminal windows:

#### Start Backend Server (Port 5000)
```bash
npm run dev:backend
```

#### Start Frontend Server (Port 3000)
```bash
npm run dev:frontend
```

Access in your browser:
- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/vargani` | Fetch all Vargani records & stats |
| `POST` | `/api/vargani` | Create a new Vargani donation record |
| `POST` | `/api/admin/login` | Authenticate Admin user |
| `POST` | `/api/send-email-receipt` | Send email receipt via Nodemailer |
| `GET` | `/api/settings` | Get dynamic festival year & edition settings |

---

## 🏗️ Production Build

```bash
cd frontend
npm run build
```
Static assets will be compiled to `frontend/dist`.

---

## 👥 Credits & Design Leadership

- **Design & Architectural Decisions**: Developed and iteratively crafted with over 3 hours of dedicated UI/UX engineering, layout structuring, responsive engineering, and devotional aesthetics.
- **Client & Mandal Collaboration**: Youngstar Mitra Mandal, Dehugaon (Content, typography requirements, and official credentials).
