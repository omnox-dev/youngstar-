const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets & frontend pages
app.use(express.static(__dirname));

// Initialize SQLite Database
const dbPath = path.join(__dirname, 'vargani.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err);
  } else {
    console.log('Connected to SQLite database: vargani.db');
  }
});

// Create tables if not exist
db.serialize(() => {
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
      category TEXT NOT NULL,
      payment_mode TEXT NOT NULL,
      privacy TEXT DEFAULT 'public',
      memory_text TEXT,
      transaction_ref TEXT,
      status TEXT DEFAULT 'VERIFIED',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert initial seed data if table empty
  db.get("SELECT COUNT(*) as count FROM vargani_records", (err, row) => {
    if (row && row.count === 0) {
      const stmt = db.prepare(`
        INSERT INTO vargani_records 
        (receipt_no, donor_name, donor_mobile, donor_email, donor_city, amount, amount_words, category, payment_mode, privacy, memory_text, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run('YMM-2026-0101', 'अमोल सुरेश पाटील', '९८२२०१२३४५', 'amol.patil@example.com', 'सदाशिव पेठ, पुणे', 5001, 'पाच हजार एक रुपये फक्त', 'अन्नदान महाप्रсад', 'UPI / QR Code', 'public', '', 'VERIFIED');
      stmt.run('YMM-2026-0102', 'सौ. सुनीता देशपांडे', '९४२२०९८७६५', 'sunita.d@example.com', 'कोथरूड, पुणे', 2501, 'दोन हजार पाचशे एक रुपये फक्त', 'विशेष आरती संकल्प', 'NetBanking', 'public', '', 'VERIFIED');
      stmt.run('YMM-2026-0103', 'गुप्त दान (भाविक)', '९०००००००००', '', 'पुणे', 11000, 'अकरा हजार रुपये फक्त', 'सांस्कृतिक देणगी', 'Cash', 'anonymous', '', 'VERIFIED');
      stmt.run('YMM-2026-0104', 'विक्रम रमेश शिंदे', '९८९०११२२३३', 'vikram.shinde@example.com', 'नारायण पेठ, पुणे', 1008, 'एक हजार आठ रुपये फक्त', 'वार्षिक वर्गणी', 'UPI / QR Code', 'in_memory', 'कै. रमेश शिंदे यांच्या स्मरणार्थ', 'VERIFIED');
      stmt.finalize();
      console.log('Seeded initial Vargani records into SQLite database.');
    }
  });
});

// Configure Nodemailer Transporter (Ethereal test account fallback or SMTP config)
let mailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER || 'ethereal_user',
    pass: process.env.SMTP_PASS || 'ethereal_pass'
  }
});

// Generate Ethereal account if no custom SMTP configured for testing
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
    console.log('Nodemailer test mailer initialized:', account.user);
  }
});

// API: Record New Contribution / Vargani
app.post('/api/vargani', (req, res) => {
  const {
    donorName,
    donorMobile,
    donorEmail,
    donorCity,
    donorPan,
    amount,
    amountWords,
    category,
    paymentMode,
    privacy,
    memoryText,
    transactionRef
  } = req.body;

  if (!donorName || !donorMobile || !amount) {
    return res.status(400).json({ success: false, message: 'नाव, मोबाईल आणि रक्कम आवश्यक आहे.' });
  }

  const receiptNo = 'YMM-2026-' + Math.floor(1000 + Math.random() * 9000);

  const query = `
    INSERT INTO vargani_records 
    (receipt_no, donor_name, donor_mobile, donor_email, donor_city, donor_pan, amount, amount_words, category, payment_mode, privacy, memory_text, transaction_ref)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [
      receiptNo,
      donorName,
      donorMobile,
      donorEmail || '',
      donorCity || 'पुणे',
      donorPan || '',
      parseFloat(amount),
      amountWords || `${amount} रुपये फक्त`,
      category || 'वार्षिक वर्गणी',
      paymentMode || 'UPI / QR Code',
      privacy || 'public',
      memoryText || '',
      transactionRef || 'TXN' + Date.now()
    ],
    function (err) {
      if (err) {
        console.error('Error inserting vargani record:', err);
        return res.status(500).json({ success: false, message: 'डेटाबेस त्रुटी आली.' });
      }

      const newRecord = {
        id: this.lastID,
        receiptNo,
        donorName,
        donorMobile,
        donorEmail,
        donorCity: donorCity || 'पुणे',
        amount: parseFloat(amount),
        amountWords: amountWords || `${amount} रुपये फक्त`,
        category: category || 'वार्षिक वर्गणी',
        paymentMode: paymentMode || 'UPI / QR Code',
        date: new Date().toLocaleDateString('mr-IN', { day: '2-digit', month: 'long', year: 'numeric' })
      };

      // Dispatch Email if Email provided
      if (donorEmail && donorEmail.includes('@')) {
        sendCertificateEmail(newRecord);
      }

      return res.json({
        success: true,
        message: 'वर्गणी नोंदणी यशस्वी झाली!',
        data: newRecord
      });
    }
  );
});

// Helper: Send Certificate Email using Nodemailer
async function sendCertificateEmail(record) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 4px double #d14307; padding: 25px; background: #fff8f6; border-radius: 12px;">
      <div style="text-align: center;">
        <h1 style="color: #a93200; margin-bottom: 5px;">॥ मानाचा गणपती ॥</h1>
        <h2 style="color: #904d00; font-size: 24px; margin-top: 0;">यंगस्टार मित्र मंडळ</h2>
        <p style="color: #5a4139; font-weight: bold;">सार्वजनिक गणेशोत्सव २०२६ • सदाशिव पेठ, पुणे</p>
        <hr style="border: 0; border-top: 2px solid #fe932c; margin: 15px 0;">
      </div>
      <h3 style="color: #006b2c; text-align: center; font-size: 20px;">॥ श्री गणेश कृपा वर्गणी व सेवा समर्पण प्रमाणपत्र ॥</h3>
      <p>सस्नेह नमस्कार <b>${record.donorName}</b> जी,</p>
      <p>यंगस्टार मित्र मंडळ सार्वजनिक गणेशोत्सव २०२६ साठी आपली <b>₹ ${record.amount}/-</b> (${record.category}) ची वर्गणी / देणगी कृतज्ञतापूर्वक स्वीकारण्यात आली आहे.</p>
      <div style="background: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #e3bfb4; margin: 15px 0;">
        <p style="margin: 5px 0;"><b>पावती क्रमांक:</b> ${record.receiptNo}</p>
        <p style="margin: 5px 0;"><b>भाविक नाव:</b> ${record.donorName}</p>
        <p style="margin: 5px 0;"><b>सेवा प्रकार:</b> ${record.category}</p>
        <p style="margin: 5px 0;"><b>रक्कम:</b> ₹ ${record.amount}/- (${record.amountWords})</p>
        <p style="margin: 5px 0;"><b>दिनांक:</b> ${record.date}</p>
      </div>
      <p style="text-align: center; color: #a93200; font-weight: bold; font-size: 16px;">
        ॥ गणपती बाप्पा मोरया! मंगलमूर्ती मोरया! ॥
      </p>
      <p style="text-align: center; font-size: 12px; color: #8e7067;">
        यंगस्टार मित्र मंडळ, सदाशिव पेठ, पुणे • अधिकृत ई-पावती
      </p>
    </div>
  `;

  try {
    const info = await mailTransporter.sendMail({
      from: '"यंगस्टार मित्र मंडळ" <no-reply@youngstarpune.in>',
      to: record.donorEmail,
      subject: `डिजिटल वर्गणी पावती प्रमाण पत्र (${record.receiptNo}) - यंगस्टार मित्र मंडळ`,
      html: htmlContent
    });
    console.log('Nodemailer email sent successfully:', info.messageId);
    if (info.ethereal) {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
  } catch (err) {
    console.error('Nodemailer dispatch error:', err);
  }
}

// API Endpoint to manually trigger email sending
app.post('/api/send-email-receipt', (req, res) => {
  const { donorEmail, receiptNo, donorName, amount, amountWords, category, date } = req.body;
  if (!donorEmail) {
    return res.status(400).json({ success: false, message: 'ई-मेल आवश्यक आहे.' });
  }

  sendCertificateEmail({
    donorEmail,
    receiptNo: receiptNo || 'YMM-2026-DEMO',
    donorName: donorName || 'भाविक',
    amount: amount || 1008,
    amountWords: amountWords || 'एक हजार आठ रुपये फक्त',
    category: category || 'वार्षिक वर्गणी',
    date: date || new Date().toLocaleDateString('mr-IN')
  });

  return res.json({ success: true, message: `ई-पावती ${donorEmail} वर यशस्वीपणे पाठवली!` });
});

// API: Fetch All Vargani Records (Public Wall of Honor & Stats)
app.get('/api/vargani', (req, res) => {
  db.all("SELECT * FROM vargani_records ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'डेटाबेस एरर' });
    }
    
    // Calculate total raised amount and total donor count
    const totalAmount = rows.reduce((sum, row) => sum + row.amount, 0);
    const totalDonors = rows.length;

    res.json({
      success: true,
      totalAmount,
      totalDonors,
      records: rows
    });
  });
});

// API: Verify/Get Single Receipt
app.get('/api/vargani/:receipt_no', (req, res) => {
  const receiptNo = req.params.receipt_no;
  db.get("SELECT * FROM vargani_records WHERE receipt_no = ?", [receiptNo], (err, row) => {
    if (err || !row) {
      return res.status(404).json({ success: false, message: 'पावती सापडली नाही.' });
    }
    res.json({ success: true, record: row });
  });
});

// Serve main page on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '_1', 'code.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚩 Youngstar Mitra Mandal Server Running on http://localhost:${PORT}`);
  console.log(`====================================================`);
});
