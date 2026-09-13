require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// Initialize SQLite Database
const dbPath = path.join(__dirname, 'vargani.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err);
  } else {
    console.log('Connected to SQLite database: backend/vargani.db');
  }
});

// Create tables if not exist
db.serialize(() => {
  // System Settings Table
  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  // Seed default settings
  db.get("SELECT COUNT(*) as count FROM settings", (err, row) => {
    if (row && row.count === 0) {
      db.run("INSERT INTO settings (key, value) VALUES ('festival_year', '2026')");
      db.run("INSERT INTO settings (key, value) VALUES ('establishment_year', '1977')");
      db.run("INSERT INTO settings (key, value) VALUES ('mandal_name', 'यंगस्टार मित्र मंडळ')");
    } else {
      // Ensure establishment_year is updated to 1977
      db.run("UPDATE settings SET value = '1977' WHERE key = 'establishment_year'");
    }
  });

  // User Registrations Table (Access Control)
  db.run(`
    CREATE TABLE IF NOT EXISTS user_registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      mobile TEXT UNIQUE NOT NULL,
      email TEXT,
      address TEXT,
      password TEXT NOT NULL,
      status TEXT DEFAULT 'PENDING',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Vargani Records Table
  db.run(`
    CREATE TABLE IF NOT EXISTS vargani_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      receipt_no TEXT UNIQUE,
      donor_name TEXT NOT NULL,
      donor_mobile TEXT NOT NULL,
      donor_email TEXT,
      donor_city TEXT,
      donor_pan TEXT,
      amount REAL NOT NULL,
      amount_words TEXT,
      category TEXT NOT NULL DEFAULT 'गणेशोत्सव',
      payment_mode TEXT NOT NULL DEFAULT 'Online',
      privacy TEXT DEFAULT 'public',
      memory_text TEXT,
      remarks TEXT,
      transaction_ref TEXT,
      festival_year TEXT DEFAULT '2026',
      status TEXT DEFAULT 'VERIFIED',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Ensure missing columns exist in existing SQLite database
  const columnsToAdd = [
    { name: 'donor_email', type: 'TEXT' },
    { name: 'donor_city', type: 'TEXT' },
    { name: 'donor_pan', type: 'TEXT' },
    { name: 'amount_words', type: 'TEXT' },
    { name: 'category', type: "TEXT DEFAULT 'गणेशोत्सव'" },
    { name: 'payment_mode', type: "TEXT DEFAULT 'Online'" },
    { name: 'privacy', type: "TEXT DEFAULT 'public'" },
    { name: 'memory_text', type: 'TEXT' },
    { name: 'remarks', type: 'TEXT' },
    { name: 'transaction_ref', type: 'TEXT' },
    { name: 'festival_year', type: "TEXT DEFAULT '2026'" },
    { name: 'status', type: "TEXT DEFAULT 'VERIFIED'" }
  ];

  columnsToAdd.forEach(col => {
    db.run(`ALTER TABLE vargani_records ADD COLUMN ${col.name} ${col.type}`, () => {
      // Column already exists or added successfully
    });
  });

  // Admin Users Table
  db.run(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL
    )
  `);

  // Event Chart Table
  db.run(`
    CREATE TABLE IF NOT EXISTS event_chart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_date TEXT NOT NULL,
      event_time TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      photo_url TEXT,
      festival_year TEXT DEFAULT '2026',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Photo Gallery Table
  db.run(`
    CREATE TABLE IF NOT EXISTS photo_gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      photo_url TEXT NOT NULL,
      festival_year TEXT DEFAULT '2026',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed initial admin user using ENV variables
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'youngstar2026';
  db.get("SELECT COUNT(*) as count FROM admin_users", (err, row) => {
    if (row && row.count === 0) {
      db.run(
        "INSERT INTO admin_users (username, password, name, role) VALUES (?, ?, ?, ?)",
        [adminUser, adminPass, 'राहुल शिंदे', 'खजिनदार / व्यवस्थापक']
      );
    }
  });
});

// Configure Nodemailer Transporter
let isRealSMTP = false;
let mailTransporter = null;

if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  isRealSMTP = true;
  mailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE !== 'false',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
} else {
  nodemailer.createTestAccount((err, account) => {
    if (!err && account) {
      mailTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: account.user,
          pass: account.pass
        }
      });
    }
  });
}

// Helper: Send Certificate Email
async function sendCertificateEmail(record) {
  if (!mailTransporter) return { success: false, message: 'Mailer initializing' };

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 4px double #d14307; padding: 25px; background: #fff8f6; border-radius: 12px; text-align: center;">
      <h1 style="color: #a93200; margin-bottom: 5px;">॥ मानाचा गणपती ॥</h1>
      <h2 style="color: #904d00; font-size: 24px; margin-top: 0;">यंगस्टार मित्र मंडळ</h2>
      <p style="color: #5a4139; font-weight: bold;">सार्वजनिक गणेशोत्सव ${record.festivalYear || '२०२६'} • माळीनगर - देहुगाव, ता. हवेली, जि. पुणे - ४१२१०९</p>
      <hr style="border: 0; border-top: 2px solid #fe932c; margin: 15px 0;">
      <h3 style="color: #006b2c; font-size: 18px;">॥ श्री गणेश कृपा वर्गणी व सेवा समर्पण प्रमाणपत्र ॥</h3>
      <p style="text-align: left;">सस्नेह नमस्कार <b>${record.donorName}</b> जी,</p>
      <p style="text-align: left;">यंगस्टार मित्र मंडळ सार्वजनिक गणेशोत्सव ${record.festivalYear || '२०२६'} साठी आपली <b>₹ ${record.amount}/-</b> (${record.category}) ची वर्गणी स्वीकृत झाली आहे.</p>
      <div style="background: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #e3bfb4; text-align: left; margin: 15px 0;">
        <p style="margin: 5px 0;"><b>पावती क्रमांक:</b> ${record.receiptNo}</p>
        <p style="margin: 5px 0;"><b>भाविक नाव:</b> ${record.donorName}</p>
        <p style="margin: 5px 0;"><b>उत्सव प्रकार:</b> ${record.category}</p>
        <p style="margin: 5px 0;"><b>रक्कम:</b> ₹ ${record.amount}/- (${record.amountWords})</p>
        <p style="margin: 5px 0;"><b>भरणा पर्याय:</b> ${record.paymentMode}</p>
        <p style="margin: 5px 0;"><b>दिनांक:</b> ${record.date || new Date().toLocaleDateString('mr-IN')}</p>
      </div>
      <p style="color: #a93200; font-weight: bold; font-size: 16px;">
        ॥ गणपती बाप्पा मोरया! मंगलमूर्ती मोरया! ॥
      </p>
    </div>
  `;

  try {
    const info = await mailTransporter.sendMail({
      from: isRealSMTP ? `"यंगस्टार मित्र मंडळ" <${process.env.SMTP_USER}>` : '"यंगस्टार मित्र मंडळ" <no-reply@youngstarpune.in>',
      to: record.donorEmail,
      subject: `डिजिटल वर्गणी पावती प्रमाणपत्र (${record.receiptNo}) - यंगस्टार मित्र मंडळ`,
      html: htmlContent
    });
    let testUrl = !isRealSMTP ? nodemailer.getTestMessageUrl(info) : null;
    return { success: true, messageId: info.messageId, testUrl, isRealSMTP };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// Helper: Convert English digits to Marathi Devanagari digits
function toMarathiDigits(num) {
  if (num === null || num === undefined) return '';
  const marathiDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return num.toString().replace(/\d/g, d => marathiDigits[d]);
}

function calculateEditionText(festivalYear, estYear) {
  const fYear = parseInt(festivalYear) || 2026;
  const eYear = parseInt(estYear) || 1977;
  const editionNo = Math.max(1, fYear - eYear); // Years completed formula: 2026 - 1977 = 49
  const marathiNum = toMarathiDigits(editionNo);
  
  let suffix = 'वे वर्ष';
  if (editionNo % 10 === 1 && editionNo !== 11) suffix = 'ले वर्ष';
  else if ((editionNo % 10 === 2 || editionNo % 10 === 3) && ![12, 13].includes(editionNo)) suffix = 'रे वर्ष';
  else if (editionNo % 10 === 4 && editionNo !== 14) suffix = 'थे वर्ष';

  return `${marathiNum} ${suffix}`;
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Settings API (Active Year & Establishment Year)
app.get('/api/settings', (req, res) => {
  db.all("SELECT * FROM settings", [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    const settingsObj = {};
    rows.forEach(r => settingsObj[r.key] = r.value);
    
    const festivalYear = settingsObj.festival_year || '2026';
    const estYear = settingsObj.establishment_year || '1977';
    const fYearNum = parseInt(festivalYear) || 2026;
    const eYearNum = parseInt(estYear) || 1977;
    const editionNo = Math.max(1, fYearNum - eYearNum); // 2026 - 1977 = 49
    const editionText = calculateEditionText(festivalYear, estYear);

    res.json({
      success: true,
      festivalYear: festivalYear,
      establishmentYear: estYear,
      mandalName: settingsObj.mandal_name || 'यंगस्टार मित्र मंडळ',
      editionNo: editionNo,
      editionText: editionText // e.g. "४९ वे वर्ष"
    });
  });
});

app.post('/api/admin/settings', (req, res) => {
  const { festivalYear, establishmentYear } = req.body;
  if (!festivalYear) return res.status(400).json({ success: false, message: 'वर्ष आवश्यक आहे.' });

  db.serialize(() => {
    db.run("INSERT OR REPLACE INTO settings (key, value) VALUES ('festival_year', ?)", [festivalYear.toString()]);
    if (establishmentYear) {
      db.run("INSERT OR REPLACE INTO settings (key, value) VALUES ('establishment_year', ?)", [establishmentYear.toString()]);
    }
    const eYear = establishmentYear || '1977';
    const newEditionText = calculateEditionText(festivalYear, eYear);
    res.json({ 
      success: true, 
      message: `उत्सव वर्ष ${festivalYear} (स्थापना ${eYear} $\\rightarrow$ ${newEditionText}) यशस्वीपणे अपडेट झाले!` 
    });
  });
});

// 2. User Authentication & Registration Routes
app.post('/api/user/register', (req, res) => {
  const { name, mobile, email, address, password } = req.body;
  if (!name || !mobile || !password) {
    return res.status(400).json({ success: false, message: 'नाव, मोबाईल व पासवर्ड आवश्यक आहेत.' });
  }

  const query = `INSERT INTO user_registrations (name, mobile, email, address, password, status) VALUES (?, ?, ?, ?, ?, 'PENDING')`;
  db.run(query, [name, mobile, email || '', address || '', password], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ success: false, message: 'हा मोबाईल क्रमांक आधीच नोंदणीकृत आहे.' });
      }
      return res.status(500).json({ success: false, message: 'नोंदणी त्रुटी' });
    }
    res.json({
      success: true,
      message: 'तुमची नोंदणी यशस्वी झाली आहे! प्रशासकांकडून मान्यता (Approval) मिळताच तुम्हाला पूर्ण ॲक्सेस मिळेल.'
    });
  });
});

app.post('/api/user/login', (req, res) => {
  const { mobile, password } = req.body;
  if (!mobile || !password) {
    return res.status(400).json({ success: false, message: 'मोबाईल व पासवर्ड आवश्यक आहेत.' });
  }

  db.get("SELECT * FROM user_registrations WHERE mobile = ? AND password = ?", [mobile, password], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ success: false, message: 'अवैध मोबाईल किंवा पासवर्ड.' });
    }

    const token = 'USER-TOKEN-' + Date.now();
    res.json({
      success: true,
      message: 'लॉगिन यशस्वी झाले!',
      token,
      user: {
        id: user.id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        status: user.status,
        isApproved: user.status === 'APPROVED'
      }
    });
  });
});

app.get('/api/admin/users', (req, res) => {
  db.all("SELECT id, name, mobile, email, address, status, created_at FROM user_registrations ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    res.json({ success: true, users: rows });
  });
});

app.put('/api/admin/users/:id/status', (req, res) => {
  const { status } = req.body;
  const userId = req.params.id;
  if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
    return res.status(400).json({ success: false, message: 'अवैध स्टेटस.' });
  }

  db.run("UPDATE user_registrations SET status = ? WHERE id = ?", [status, userId], function(err) {
    if (err) return res.status(500).json({ success: false, message: 'Update failed' });
    res.json({ success: true, message: `युझर ॲक्सेस ${status === 'APPROVED' ? 'स्वीकृत' : status} करण्यात आला आहे!` });
  });
});

// 3. Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'युझरनेम व पासवर्ड आवश्यक आहेत.' });
  }

  db.get("SELECT * FROM admin_users WHERE username = ? AND password = ?", [username, password], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ success: false, message: 'अवैध युझरनेम किंवा पासवर्ड!' });
    }

    const token = 'YMM-TOKEN-' + Date.now();
    return res.json({
      success: true,
      message: 'लॉगिन यशस्वी झाले!',
      token,
      user: {
        username: user.username,
        name: user.name,
        role: user.role
      }
    });
  });
});

// 4. Vargani API with Filters & Financial Totals
app.get('/api/vargani', (req, res) => {
  const { year, paymentMode, category, search } = req.query;

  let query = "SELECT * FROM vargani_records WHERE 1=1";
  const params = [];

  if (year) {
    query += " AND festival_year = ?";
    params.push(year);
  }

  if (paymentMode && paymentMode !== 'ALL') {
    query += " AND payment_mode = ?";
    params.push(paymentMode);
  }

  if (category && category !== 'ALL') {
    query += " AND category = ?";
    params.push(category);
  }

  if (search) {
    query += " AND (donor_name LIKE ? OR receipt_no LIKE ? OR donor_mobile LIKE ? OR remarks LIKE ?)";
    const s = `%${search}%`;
    params.push(s, s, s, s);
  }

  query += " ORDER BY id DESC";

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Vargani DB Query Error:', err);
      return res.status(500).json({ success: false, message: 'Database error', details: err.message });
    }

    // Calculate Financial Summary
    // Online & Cash are Received Amount
    // Pay Later is Pending Amount
    let totalReceivedAmount = 0;
    let pendingAmount = 0;

    (rows || []).forEach(r => {
      const amt = parseFloat(r.amount) || 0;
      if (r.payment_mode === 'Pay Later' || r.status === 'PENDING') {
        pendingAmount += amt;
      } else {
        totalReceivedAmount += amt;
      }
    });

    const grandTotal = totalReceivedAmount + pendingAmount;

    res.json({
      success: true,
      totalAmount: totalReceivedAmount, // Received (Online + Cash)
      pendingAmount: pendingAmount,     // Pending (Pay Later)
      grandTotal: grandTotal,           // Overall Total
      totalDonors: rows.length,
      records: rows
    });
  });
});

app.post('/api/vargani', (req, res) => {
  const { donorName, donorMobile, donorEmail, donorCity, donorPan, amount, amountWords, category, paymentMode, privacy, memoryText, remarks, festivalYear } = req.body;
  if (!donorName || !donorMobile || !amount) {
    return res.status(400).json({ success: false, message: 'नाव, मोबाईल आणि रक्कम आवश्यक आहे.' });
  }

  // Restrict categories strictly to 'गणेशोत्सव' or 'गणेश जयंती'
  const validCategory = (category === 'गणेश जयंती') ? 'गणेश जयंती' : 'गणेशोत्सव';
  const activeYear = festivalYear || '2026';
  const validPaymentMode = ['Online', 'Cash', 'Pay Later'].includes(paymentMode) ? paymentMode : 'Online';

  const receiptNo = `YMM-${activeYear}-${Math.floor(1000 + Math.random() * 9000)}`;
  const query = `
    INSERT INTO vargani_records 
    (receipt_no, donor_name, donor_mobile, donor_email, donor_city, donor_pan, amount, amount_words, category, payment_mode, privacy, memory_text, remarks, festival_year, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const recordStatus = (validPaymentMode === 'Pay Later') ? 'PENDING' : 'VERIFIED';

  db.run(query, [
    receiptNo, donorName, donorMobile, donorEmail || '', donorCity || 'माळीनगर, देहुगाव', donorPan || '',
    parseFloat(amount), amountWords || `${amount} रुपये फक्त`, validCategory,
    validPaymentMode, privacy || 'public', memoryText || '', remarks || '', activeYear, recordStatus
  ], function(err) {
    if (err) return res.status(500).json({ success: false, message: 'डेटाबेस एरर' });
    
    const record = {
      id: this.lastID, receiptNo, donorName, donorMobile, donorEmail,
      amount: parseFloat(amount), amountWords, category: validCategory, paymentMode: validPaymentMode,
      remarks, festivalYear: activeYear, status: recordStatus,
      date: new Date().toLocaleDateString('mr-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    };

    if (donorEmail && donorEmail.includes('@')) {
      sendCertificateEmail(record);
    }

    res.json({ success: true, message: 'वर्गणी नोंदणी यशस्वी झाली!', data: record });
  });
});

// 5. Event Chart API
app.get('/api/events', (req, res) => {
  const { year } = req.query;
  const activeYear = year || '2026';
  db.all("SELECT * FROM event_chart WHERE festival_year = ? ORDER BY id ASC", [activeYear], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    res.json({ success: true, events: rows });
  });
});

app.post('/api/admin/events', (req, res) => {
  const { eventDate, eventTime, title, description, photoUrl, festivalYear } = req.body;
  if (!eventDate || !title) {
    return res.status(400).json({ success: false, message: 'तारीख व शीर्षक आवश्यक आहे.' });
  }

  const query = `INSERT INTO event_chart (event_date, event_time, title, description, photo_url, festival_year) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(query, [eventDate, eventTime || '', title, description || '', photoUrl || '/pandal_hero.jpg', festivalYear || '2026'], function(err) {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    res.json({ success: true, message: 'कार्यक्रम यशस्वीपणे जोडला गेला!' });
  });
});

app.delete('/api/admin/events/:id', (req, res) => {
  db.run("DELETE FROM event_chart WHERE id = ?", [req.params.id], function(err) {
    if (err) return res.status(500).json({ success: false, message: 'Delete error' });
    res.json({ success: true, message: 'कार्यक्रम हटवला गेला.' });
  });
});

app.post('/api/admin/events/send-reminders', (req, res) => {
  const { eventId, eventTitle, eventDate } = req.body;
  db.all("SELECT donor_name, donor_mobile, donor_email FROM vargani_records UNION SELECT name as donor_name, mobile as donor_mobile, email as donor_email FROM user_registrations", [], (err, rows) => {
    const totalReminders = rows ? rows.length : 0;
    res.json({
      success: true,
      message: `🎉 '${eventTitle || 'गणेशोत्सव कार्यक्रम'}' चे स्मरणपत्र ${totalReminders} भाविकांना पाठवले गेले (WhatsApp & Nodemailer Notifications Activated)!`
    });
  });
});

// 6. Photo Gallery API
app.get('/api/gallery', (req, res) => {
  const { year } = req.query;
  const activeYear = year || '2026';
  db.all("SELECT * FROM photo_gallery WHERE festival_year = ? ORDER BY id DESC", [activeYear], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    res.json({ success: true, gallery: rows });
  });
});

app.post('/api/admin/gallery', (req, res) => {
  const { title, description, photoUrl, festivalYear } = req.body;
  if (!title || !photoUrl) {
    return res.status(400).json({ success: false, message: 'शीर्षक व फोटो URL आवश्यक आहे.' });
  }

  const query = `INSERT INTO photo_gallery (title, description, photo_url, festival_year) VALUES (?, ?, ?, ?)`;
  db.run(query, [title, description || '', photoUrl, festivalYear || '2026'], function(err) {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    res.json({ success: true, message: 'फोटो गॅलरीत जोडला गेला!' });
  });
});

app.delete('/api/admin/gallery/:id', (req, res) => {
  db.run("DELETE FROM photo_gallery WHERE id = ?", [req.params.id], function(err) {
    if (err) return res.status(500).json({ success: false, message: 'Delete error' });
    res.json({ success: true, message: 'फोटो गॅलरीतून हटवला गेला.' });
  });
});

// 7. Email Receipt Sender Endpoint
app.post('/api/send-email-receipt', async (req, res) => {
  const { donorEmail, receiptNo, donorName, amount, amountWords, category, paymentMode, festivalYear } = req.body;
  if (!donorEmail) return res.status(400).json({ success: false, message: 'ई-मेल आवश्यक आहे.' });

  const mailResult = await sendCertificateEmail({
    donorEmail, receiptNo: receiptNo || 'YMM-2026-DEMO', donorName: donorName || 'भाविक',
    amount: amount || 1008, amountWords: amountWords || 'एक हजार आठ रुपये फक्त',
    category: category || 'गणेशोत्सव', paymentMode: paymentMode || 'Online', festivalYear: festivalYear || '2026'
  });

  if (mailResult.testUrl) {
    return res.json({ 
      success: true, 
      isTestAccount: true,
      testUrl: mailResult.testUrl,
      message: `Nodemailer (Ethereal Sandbox) मध्ये ई-पावती तयार झाली आहे.` 
    });
  }

  res.json({ success: true, message: `ई-पावती ${donorEmail} वर पाठवण्यात आली आहे!` });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Youngstar Express Backend API Running on http://localhost:${PORT}`);
  console.log(`====================================================`);
});

