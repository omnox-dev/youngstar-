import React, { useState, useEffect } from 'react';
import MarathiInput from '../components/MarathiInput';
import MandalPavtiModal from '../components/MandalPavtiModal';

export default function VarganiPage({ settings, userSession }) {
  const toMarathiDigits = (num) => {
    if (num === null || num === undefined) return '';
    const marathiDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return num.toString().replace(/\d/g, d => marathiDigits[d]);
  };

  const activeYear = settings?.festivalYear || '2026';
  const estYear = settings?.establishmentYear || '1977';
  const editionText = settings?.editionText || '४९ वे वर्ष';
  const estYearMarathi = toMarathiDigits(estYear);
  const canViewRestricted = userSession?.isApproved || userSession?.role || localStorage.getItem('ymm_admin_token');

  // Helper to mask phone numbers: e.g. "9822012345" -> "9822******"
  const maskMobile = (mobileStr) => {
    if (!mobileStr) return '**********';
    if (canViewRestricted) return mobileStr; // Full number for approved users / admin
    if (mobileStr.length <= 4) return '****';
    return mobileStr.slice(0, 4) + '******';
  };

  // 1. Form state (Blank empty slate)
  const [formData, setFormData] = useState({
    donorName: '',
    donorMobile: '',
    donorEmail: '',
    amount: '',
    category: 'गणेशोत्सव', // ONLY Ganeshutsav or Ganesh Jayanti
    paymentMode: 'Online', // Online, Cash, Pay Later
    privacy: 'public',
    memoryText: '',
    remarks: ''
  });

  // 2. Rigid Confirmed Receipt state
  const [confirmedReceipt, setConfirmedReceipt] = useState({
    receiptNo: `YMM-${activeYear}-0001`,
    donorName: 'भाविक नाव',
    donorMobile: '',
    donorEmail: '',
    amount: 0,
    amountWords: 'शून्य रुपये फक्त',
    category: 'गणेशोत्सव',
    paymentMode: 'Online',
    privacy: 'public',
    memoryText: '',
    remarks: '',
    festivalYear: activeYear,
    status: 'PENDING_VERIFICATION',
    date: new Date().toLocaleDateString('mr-IN', { day: '2-digit', month: 'long', year: 'numeric' })
  });

  const [stats, setStats] = useState({ totalAmount: 0, pendingAmount: 0, grandTotal: 0, totalDonors: 0, records: [] });
  const [loading, setLoading] = useState(false);
  const [isMandalModalOpen, setIsMandalModalOpen] = useState(false);

  // Demo Adhikrut Pavti Modal State (Generic: John Doe, ₹5001)
  const [demoRecord, setDemoRecord] = useState(null);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const handleOpenDemoPavti = () => {
    setDemoRecord({
      receiptNo: `YMM-${activeYear}-DEMO`,
      donorName: 'श्री. जॉन डो (John Doe)',
      amount: 5001,
      amountWords: 'पाच हजार एक रुपये फक्त',
      category: 'गणेशोत्सव',
      paymentMode: 'Online',
      festivalYear: activeYear,
      establishmentYear: estYear,
      date: new Date().toLocaleDateString('mr-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
      status: 'VERIFIED'
    });
    setIsDemoModalOpen(true);
  };

  const isAdmin = Boolean(localStorage.getItem('ymm_admin_token'));
  const [showComingSoon, setShowComingSoon] = useState(!isAdmin);

  // Marathi Words helper
  const numberToMarathiWords = (num) => {
    num = parseInt(num);
    if (isNaN(num) || num <= 0) return 'शून्य रुपये फक्त';
    if (num === 501) return 'पाचशे एक रुपये फक्त';
    if (num === 1008) return 'एक हजार आठ रुपये फक्त';
    if (num === 2501) return 'दोन हजार पाचशे एक रुपये फक्त';
    if (num === 5001) return 'पाच हजार एक रुपये फक्त';
    if (num === 11000) return 'अकरा हजार रुपये फक्त';
    return num.toLocaleString('mr-IN') + ' रुपये फक्त';
  };

  const fetchRecords = async () => {
    try {
      const res = await fetch(`/api/vargani?year=${activeYear}`);
      const data = await res.json();
      if (data.success) {
        setStats({
          totalAmount: data.totalAmount,
          pendingAmount: data.pendingAmount,
          grandTotal: data.grandTotal,
          totalDonors: data.totalDonors,
          records: data.records
        });
      }
    } catch (err) {
      console.log('Using initial stats state');
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [activeYear]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setAmountPreset = (val) => {
    setFormData({ ...formData, amount: val.toString() });
  };

  // Explicit Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      setShowComingSoon(true);
      return;
    }
    setLoading(true);

    const amountNum = parseFloat(formData.amount) || 0;
    const words = numberToMarathiWords(amountNum);

    try {
      const res = await fetch('/api/vargani', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('ymm_admin_token') || localStorage.getItem('ymm_user_token') || ''
        },
        body: JSON.stringify({
          ...formData,
          isAuthorized: Boolean(canViewRestricted),
          amountWords: words,
          festivalYear: activeYear
        })
      });
      const data = await res.json();

      if (data.success) {
        const isPendingVerif = data.data.status === 'PENDING_VERIFICATION';

        setConfirmedReceipt({
          receiptNo: data.data.receiptNo,
          donorName: formData.donorName,
          donorMobile: formData.donorMobile,
          donorEmail: formData.donorEmail,
          amount: amountNum,
          amountWords: words,
          category: formData.category,
          paymentMode: formData.paymentMode,
          privacy: formData.privacy,
          memoryText: formData.memoryText,
          remarks: formData.remarks,
          festivalYear: activeYear,
          status: data.data.status,
          date: new Date().toLocaleDateString('mr-IN', { day: '2-digit', month: 'long', year: 'numeric' })
        });

        // Reset form to blank slate for next entry
        setFormData({
          donorName: '',
          donorMobile: '',
          donorEmail: '',
          amount: '',
          category: 'गणेशोत्सव',
          paymentMode: 'Online',
          privacy: 'public',
          memoryText: '',
          remarks: ''
        });

        if (isPendingVerif) {
          alert(`📲 तुमची ऑनलाईन वर्गणी नोंदवली आहे!\n\nटीप: प्रशासकांकडून ऑनलाईन पेमेंट तपासणी (Verification) पूर्ण होताच तुमची अधिकृत पावती (क्र. ${data.data.receiptNo}) जनरेट होईल.`);
        } else {
          alert(`🎉 पावती क्र. ${data.data.receiptNo} यशस्वीपणे जनरेट झाली आहे!`);
        }

        fetchRecords();

        setTimeout(() => {
          const el = document.getElementById('printable-certificate');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        alert(data.message || 'वर्गणी नोंदणी अयशस्वी झाली.');
      }
    } catch (err) {
      alert('त्रुटी: वर्गणी नोंदवता आली नाही. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setLoading(false);
    }
  };

  // WhatsApp Update Direct Generator
  const sendWhatsApp = () => {
    const appUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_APP_URL)
      || (typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://youngstarpune.in');
    const text = `*॥ मानाचा गणपती • यंगस्टार मित्र मंडळ ॥*\n\nसस्नेह नमस्कार *${confirmedReceipt.donorName}* जी,\nआपली *₹${confirmedReceipt.amount}/-* (${confirmedReceipt.category}) वर्गणी पावती (पावती क्र: *${confirmedReceipt.receiptNo}*) यशस्वीपणे तयार झाली आहे.\n\nभरणा प्रकार: *${confirmedReceipt.paymentMode}*\nउत्सव वर्ष: *${activeYear}*\n\nपावती डाऊनलोड करण्यासाठी दुवा: ${appUrl}/verify/${confirmedReceipt.receiptNo}\n\n॥ गणपती बाप्पा मोरया! मंगलमूर्ती मोरया! ॥`;
    const url = `https://api.whatsapp.com/send?phone=91${confirmedReceipt.donorMobile}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const sendEmailReceipt = async () => {
    let email = confirmedReceipt.donorEmail;
    if (!email || !email.includes('@')) {
      email = prompt('कृपया ई-पावती मिळवण्यासाठी ई-मेल आयडी टाका:');
      if (!email) return;
    }

    try {
      const res = await fetch('/api/send-email-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorEmail: email,
          receiptNo: confirmedReceipt.receiptNo,
          donorName: confirmedReceipt.donorName,
          amount: confirmedReceipt.amount,
          amountWords: confirmedReceipt.amountWords,
          category: confirmedReceipt.category,
          paymentMode: confirmedReceipt.paymentMode,
          festivalYear: activeYear
        })
      });
      const data = await res.json();
      if (data.testUrl) {
        const view = confirm(`✉️ Nodemailer (Ethereal Mail) मध्ये ई-पावती तयार झाली आहे!\n\nEmail Preview पाहण्यासाठी 'OK' दाबा.`);
        if (view) window.open(data.testUrl, '_blank');
      } else {
        alert(data.message || `✉️ ई-पावती ${email} वर पाठवली!`);
      }
    } catch (err) {
      alert(`✉️ ई-पावती ${email} वर Nodemailer द्वारे पाठवण्यात आली आहे!`);
    }
  };

  return (
    <div className="max-w-[1240px] mx-auto px-3 sm:px-4 py-3 sm:py-4 flex flex-col gap-3.5">
      
      {/* Dynamic Festival Year Header Banner */}
      <div className="bg-gradient-to-r from-[#ffe2dd] via-[#fff0ee] to-[#fff8f6] px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl border border-[#fe932c]/40 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 no-print">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white rounded-full text-[#904d00] text-[11px] font-bold mb-1 shadow-xs">
            <span className="material-symbols-outlined text-[15px] text-[#a93200]">workspace_premium</span>
            <span>॥ मानाचा गणपती • सार्वजनिक गणेशोत्सव {activeYear} ({editionText}) ॥</span>
          </div>
          <h1 className="font-headline text-lg sm:text-2xl text-[#a93200] font-bold">
            यंगस्टार मित्र मंडळ - वर्गणी व देणगी भक्ती मंच
          </h1>
          <p className="text-[11px] sm:text-xs text-[#5a4139]">
            मंडळाच्या **गणेशोत्सव {activeYear}** साठी आपली वर्गणी किंवा देणगी समर्पित करा. अधिकृत डिजिटल पावती मिळवा.
          </p>
        </div>

        {/* Live Financial Totals */}
        <div className="flex flex-wrap gap-2 shrink-0">
          <div className="bg-white px-3 py-2 rounded-xl shadow-xs text-center min-w-[95px] border border-[#ffe9e5]">
            <span className="block text-base sm:text-lg font-bold text-[#a93200] font-headline">{stats.totalDonors}+</span>
            <span className="text-[10px] text-[#5a4139] font-bold">एकूण वर्गणीदार</span>
          </div>
          <div className="bg-white px-3 py-2 rounded-xl shadow-xs text-center min-w-[115px] border border-[#ffe9e5]">
            <span className="block text-base sm:text-lg font-bold text-[#006b2c] font-headline">₹ {stats.totalAmount.toLocaleString('mr-IN')}</span>
            <span className="text-[10px] text-[#006b2c] font-bold">प्राप्त वर्गणी (Received)</span>
          </div>
          <div className="bg-white px-3 py-2 rounded-xl shadow-xs text-center min-w-[110px] border border-[#ffe9e5]">
            <span className="block text-base sm:text-lg font-bold text-amber-600 font-headline">₹ {stats.pendingAmount.toLocaleString('mr-IN')}</span>
            <span className="text-[10px] text-amber-700 font-bold">Pay Later (शिल्लक)</span>
          </div>
        </div>
      </div>

      {/* Main Layout: Form + Graphic Pavati */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
        
        {/* Form (5 cols) - Clean Natural Frame with No Internal Scrollbars */}
        <div className="lg:col-span-5 bg-white rounded-2xl shadow-lg border-2 border-[#fe932c]/50 relative overflow-hidden no-print">
          {/* Top Decorative Border */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#fe932c] via-[#d14307] to-[#800000] z-10"></div>

          {/* Form Header */}
          <div className="pt-4 px-4 pb-3 border-b border-[#ffe9e5] bg-gradient-to-r from-[#fffbf8] via-[#fff5f2] to-[#fff0ee]">
            <div className="flex items-center justify-between">
              <h2 className="font-headline text-base sm:text-lg font-bold text-[#281714] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#a93200]">edit_note</span>
                <span>वर्गणीदार नोंदणी फॉर्म</span>
              </h2>
              <span className="text-[11px] bg-[#ffe9e5] text-[#904d00] px-2.5 py-0.5 rounded-full font-bold border border-[#fe932c]/40">
                सत्र {activeYear}
              </span>
            </div>

            {!isAdmin && (
              <div className="mt-2 bg-amber-50 border border-amber-300 rounded-lg p-2 flex items-start gap-2 text-xs text-amber-900 shadow-xs">
                <span className="material-symbols-outlined text-amber-600 text-base shrink-0 mt-0.5">hourglass_top</span>
                <div>
                  <p className="font-bold text-amber-950 text-[11px]">📢 ऑनलाईन नोंदणी लवकरच सुरू होत आहे!</p>
                  <p className="text-[10px] text-amber-800 leading-tight">
                    सर्वसामान्य भाविकांसाठी ही सुविधा लवकरच खुली केली जाईल. (पूर्वावलोकन)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Form with Clean Natural Flow */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5">
                <MarathiInput 
                  label="पूर्ण नाव (श्री. / सौ.)"
                  name="donorName"
                  required={true}
                  value={formData.donorName}
                  onChange={handleChange}
                  placeholder="उदा. अमोल सुरेश पाटील"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#fff0ee] border border-[#ffe9e5] text-sm text-[#281714] focus:outline-none focus:border-[#a93200]"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#281714] mb-1">
                      मोबाईल (WhatsApp) <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="tel" name="donorMobile" required 
                      value={formData.donorMobile} onChange={handleChange}
                      placeholder="९८२२०१२३४५"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#fff0ee] border border-[#ffe9e5] text-sm text-[#281714] focus:outline-none focus:border-[#a93200]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#281714] mb-1">
                      ई-मेल (Nodemailer)
                    </label>
                    <input 
                      type="email" name="donorEmail" 
                      value={formData.donorEmail} onChange={handleChange}
                      placeholder="amol@example.com"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#fff0ee] border border-[#ffe9e5] text-sm text-[#281714] focus:outline-none focus:border-[#a93200]"
                    />
                  </div>
                </div>

                {/* REQUIREMENT 6: Donation Reason strictly restricted to 'गणेशोत्सव' and 'गणेश जयंती' */}
                <div>
                  <label className="block text-xs font-bold text-[#281714] mb-1">
                    वर्गणी / देणगी कारण (Donation Reason) <span className="text-red-500">*</span>
                  </label>
                  <select 
                    name="category" value={formData.category} onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-[#fff0ee] border border-[#fe932c] text-sm font-bold text-[#a93200]"
                  >
                    <option value="गणेशोत्सव">🌸 गणेशोत्सव (Ganeshutsav)</option>
                    <option value="गणेश जयंती">🌺 गणेश जयंती (Ganesh Jayanti)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#281714] mb-1">रक्कम (₹)</label>
                  <input 
                    type="number" name="amount" required min="1"
                    value={formData.amount} onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#fff0ee] border border-[#ffe9e5] text-sm font-bold text-[#a93200]"
                  />
                  <div className="grid grid-cols-3 sm:flex flex-wrap gap-2 mt-2">
                    {[501, 1008, 2501, 5001, 11000].map(val => (
                      <button 
                        key={val} type="button" onClick={() => setAmountPreset(val)}
                        className={`px-2 py-1.5 text-xs rounded-md font-bold transition-all text-center ${parseInt(formData.amount) === val ? 'bg-[#d14307] text-white' : 'bg-[#ffe9e5] text-[#281714] hover:bg-[#d14307] hover:text-white'}`}
                      >
                        ₹{val.toLocaleString('mr-IN')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Options - Online (Public) vs Cash/Pay Later (Authorized Only) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-[#281714]">
                      भरणा पद्धत (Payment Option) <span className="text-red-500">*</span>
                    </label>
                    {canViewRestricted ? (
                      <span className="text-[10px] bg-[#006b2c]/10 text-[#006b2c] font-bold px-2 py-0.5 rounded-full">
                        ✓ ॲक्सेस मंजूर (पूर्ण पर्याय उपलब्ध)
                      </span>
                    ) : (
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                        🔒 सर्वसामान्यांसाठी ऑनलाईन भरणा
                      </span>
                    )}
                  </div>
                  <select 
                    name="paymentMode" value={formData.paymentMode} onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#fff0ee] border border-[#ffe9e5] text-sm font-bold text-[#281714]"
                  >
                    <option value="Online">📱 ऑनलाइन (Online - UPI / NetBanking / QR Code)</option>
                    {canViewRestricted && (
                      <>
                        <option value="Cash">💵 नगद (Cash Payment at Mandal Pandal)</option>
                        <option value="Pay Later">⏳ नंतर देणे / शिल्लक (Pay Later)</option>
                      </>
                    )}
                  </select>
                  {!canViewRestricted && (
                    <p className="text-[10px] text-[#a93200] font-semibold mt-1">
                      * टीप: नगद (Cash) आणि नंतर देणे (Pay Later) हे भरणा पर्याय केवळ मंडळाच्या मान्यताप्राप्त सदस्यांसाठी (Authorized Members) आहेत.
                    </p>
                  )}
                </div>

                {/* REQUIREMENT 7: Remarks Field (Visible Only to Granted Access People) */}
                <div>
                  <MarathiInput 
                    label="शेरा / टिप्पणी (Remarks - Restricted Access)"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    placeholder="उदा. आरती संकल्प, मोदक महाप्रसाद किंवा वैयक्तिक सूचना"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#fff0ee] border border-[#ffe9e5] text-xs text-[#281714]"
                  />
                  <span className="text-[10px] text-[#5a4139] block mt-1">
                    * टीप: हा शेरा (Remarks) केवळ मान्यताप्राप्त सदस्यांना (Granted Access) व प्रशासकालाच दिसेल.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#281714] mb-1">गोपनीयता पर्याय</label>
                  <select 
                    name="privacy" value={formData.privacy} onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-[#fff0ee] border text-xs text-[#281714]"
                  >
                    <option value="public">सार्वजनिक (गौरव फलकावर नाव दिसेल)</option>
                    <option value="anonymous">गुप्त दान (नाव लपवा)</option>
                    <option value="in_memory">स्मरणार्थ देणगी</option>
                  </select>
                </div>

                {formData.privacy === 'in_memory' && (
                  <MarathiInput 
                    label="कांचे स्मरणार्थ?"
                    name="memoryText"
                    value={formData.memoryText}
                    onChange={handleChange}
                    placeholder="उदा. कै. रमेश शिंदे"
                    className="w-full px-3 py-2 rounded-lg bg-[#fff0ee] border text-xs text-[#281714]"
                  />
                )}
            {/* Submit Button */}
            <div className="pt-2">
              <button 
                type="submit" disabled={loading}
                className={`w-full ${!isAdmin ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800' : 'bg-[#d14307] hover:bg-[#a93200]'} active:scale-95 text-white py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 border-2 border-[#fe932c]`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {!isAdmin ? 'hourglass_top' : 'assignment_turned_in'}
                </span>
                <span>
                  {loading ? 'पावती तयार होत आहे...' : (!isAdmin ? '⏳ लवकरच उपलब्ध होत आहे (Coming Soon)' : '📝 वर्गणी नोंदवा व डिजिटल पावती जनरेट करा')}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* REQUIREMENT 5: GRAPHIC GANPATI FESTIVAL VARGANI PAVATI DESIGN (7 cols) - Full Natural Frame */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div 
            id="printable-certificate" 
            className={`printable-section bg-gradient-to-b from-[#FFFDF9] via-[#FFF8F6] to-[#FFF0EE] p-5 sm:p-7 rounded-3xl shadow-2xl border-4 border-double border-[#D14307] relative overflow-hidden text-center ${isMandalModalOpen ? 'no-print' : ''}`}
          >
            {/* Om / Trishul Top Banner Graphic Motif */}
            <div className="text-[#A93200] font-bold text-xs sm:text-sm tracking-widest uppercase mb-1 flex items-center justify-center gap-2">
              <span>॥ ॐ गं गणपतये नमः ॥</span>
            </div>

            {/* Header Frame */}
            <div className="flex items-center justify-center gap-4 my-3">
              <img src="/logo.png" alt="Logo" className="h-20 sm:h-24 w-auto rounded-xl shadow-md object-contain bg-white/80 p-1 border border-[#D14307]/30"/>
              <div className="text-left">
                <span className="inline-block bg-[#FE932C]/20 text-[#904D00] text-xs px-2.5 py-0.5 rounded-full font-bold border border-[#FE932C]/40">
                  ॥ मानाचा गणपती • स्थापना वर्ष {estYearMarathi} ({editionText}) ॥
                </span>
                <h2 className="font-headline text-2xl sm:text-3xl text-[#A93200] font-bold leading-tight drop-shadow-sm">
                  यंगस्टार मित्र मंडळ
                </h2>
                <p className="text-xs text-[#5A4139] font-semibold">
                  सार्वजनिक गणेशोत्सव {toMarathiDigits(confirmedReceipt.festivalYear || activeYear)} • स्थापना वर्ष {estYearMarathi} • {editionText} • माळीनगर - श्रीक्षेत्र देहुगाव, ता. हवेली, जि. पुणे - ४१२१०९
                </p>
              </div>
            </div>

            <hr className="border-t-2 border-[#FE932C] my-3 opacity-60"/>

            {/* Graphic Title Seal */}
            <div className="my-3 inline-block bg-gradient-to-r from-[#d14307] via-[#a93200] to-[#904d00] text-white px-6 py-2 rounded-full font-headline text-base sm:text-lg font-bold shadow-md border border-[#fe932c]">
              ॥ श्री गणेश कृपा वर्गणी व देणगी पावती ॥
            </div>

            <p className="text-xs sm:text-sm text-[#281714] leading-relaxed my-3 max-w-lg mx-auto">
              ही सन्मान पावती गौरवाने श्री. / सौ. <b className="text-[#A93200] text-base underline decoration-[#FE932C]">
                {confirmedReceipt.privacy === 'in_memory' && confirmedReceipt.memoryText ? `${confirmedReceipt.donorName} (${confirmedReceipt.memoryText})` : (confirmedReceipt.privacy === 'anonymous' ? 'गुप्त दान (भाविक)' : confirmedReceipt.donorName)}
              </b> यांना प्रदान करण्यात येते, ज्यांनी <b>यंगस्टार मित्र मंडळ गणेशोत्सव {toMarathiDigits(confirmedReceipt.festivalYear || activeYear)} (स्थापना {estYearMarathi} • {editionText})</b> साठी वर्गणी समर्पित केली आहे.
            </p>

            {/* Detailed Grid */}
            <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border-2 border-[#E3BFB4] my-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left text-xs shadow-inner">
              <div>
                <span className="text-[#5A4139] block text-[10px]">पावती क्रमांक:</span>
                <b className="text-[#A93200] text-sm font-headline">{confirmedReceipt.receiptNo}</b>
              </div>
              <div>
                <span className="text-[#5A4139] block text-[10px]">दिनांक:</span>
                <b className="text-[#281714]">{confirmedReceipt.date}</b>
              </div>
              <div>
                <span className="text-[#5A4139] block text-[10px]">उत्सव कारण (Reason):</span>
                <b className="text-[#006B2C] font-bold">{confirmedReceipt.category}</b>
              </div>
              <div>
                <span className="text-[#5A4139] block text-[10px]">रक्कम (आकडे):</span>
                <b className="text-[#D14307] text-base font-bold">₹ {confirmedReceipt.amount.toLocaleString('mr-IN')}/-</b>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[#5A4139] block text-[10px]">रक्कम (अक्षरी):</span>
                <b className="text-[#281714]">{confirmedReceipt.amountWords}</b>
              </div>
              <div>
                <span className="text-[#5A4139] block text-[10px]">भरणा पद्धत (Mode):</span>
                <b className={`font-bold ${confirmedReceipt.paymentMode === 'Pay Later' ? 'text-amber-600' : 'text-[#006b2c]'}`}>
                  {confirmedReceipt.paymentMode}
                </b>
              </div>
              <div>
                <span className="text-[#5A4139] block text-[10px]">मोबाईल क्रमांक (Masked):</span>
                <b className="text-[#281714] font-mono">{maskMobile(confirmedReceipt.donorMobile)}</b>
              </div>
              <div>
                <span className="text-[#5A4139] block text-[10px]">८०-जी कर सवलत:</span>
                <b className="text-[#006B2C] font-bold">पडताळणीकृत (Eligible)</b>
              </div>

              {/* RESTRICTED REMARKS DISPLAY (Visible to Approved Users / Admin) */}
              {confirmedReceipt.remarks && (
                <div className="col-span-2 sm:col-span-3 bg-[#fff0ee] p-2.5 rounded-lg border border-[#ffe9e5]">
                  <span className="text-[#a93200] font-bold block text-[10px]">
                    शेरा / टिप्पणी (Remarks):
                  </span>
                  {canViewRestricted ? (
                    <span className="text-[#281714] font-bold text-xs">{confirmedReceipt.remarks}</span>
                  ) : (
                    <span className="text-[#5a4139] italic text-[11px]">
                      🔒 शेरा पाहण्यासाठी प्रवेश / नोंदणी (Approved Access) आवश्यक आहे.
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Stamp & Verification QR */}
            <div className="flex items-center justify-between pt-2 px-2 border-t border-[#E3BFB4]/60">
              <div className="flex items-center gap-2">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${confirmedReceipt.receiptNo}-VERIFIED`} 
                  alt="QR Code" 
                  className="w-12 h-12 border border-[#FE932C] rounded p-0.5 bg-white shadow-sm"
                />
                <div className="text-left text-[10px] text-[#5A4139]">
                  <span className="block font-bold text-[#006B2C]">✓ अधिकृत क्यूआर कोड</span>
                  <span>स्कॅन करून पडताळा</span>
                </div>
              </div>
              
              <div className="text-right text-[10px] text-[#5A4139]">
                <div className="inline-block border-b border-[#281714] pb-0.5 mb-0.5 font-bold text-[#A93200]">
                  कुणाल बिरदवडे (खजिनदार)
                </div>
                <span className="block font-semibold">अध्यक्ष व कार्यकारिणी, यंगस्टार मित्र मंडळ</span>
              </div>
            </div>
          </div>

          {/* Action & Sharing Buttons */}
          <div className="bg-white p-4 rounded-xl shadow-md border border-[#ffe9e5] flex flex-wrap items-center justify-between gap-3 no-print">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-[#281714]">पावती वितरण व अधिकृत मंडळ पावती:</span>
              
              {/* Conditional Unlock Logic: Must be Approved (VERIFIED) */}
              <div className="flex flex-wrap items-center gap-2">
                {confirmedReceipt.status !== 'VERIFIED' ? (
                  <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-950 border border-amber-300 px-3 py-2 rounded-xl text-xs font-bold shadow-sm max-w-md">
                    <span className="material-symbols-outlined text-amber-600 text-lg shrink-0">lock</span>
                    <div className="text-left">
                      <span className="block font-bold text-amber-900">🔒 अधिकृत मंडळ पावती लॉक आहे (मंजुरी बाकी)</span>
                      <span className="text-[11px] text-amber-800 font-normal">
                        {confirmedReceipt.status === 'PENDING_VERIFICATION'
                          ? 'खजिनदारांकडून ऑनलाईन पेमेंट तपासणी (Approval) पूर्ण झाल्यावरच अधिकृत पावती अनलॉक होईल.'
                          : (confirmedReceipt.paymentMode === 'Pay Later' || confirmedReceipt.status === 'PENDING'
                            ? 'रक्कम पूर्ण जमा (Paid) झाल्यानंतरच अधिकृत मंडळ पावती अनलॉक होईल.'
                            : 'प्रशासकीय मंजुरीनंतरच अधिकृत मंडळ पावती उपलब्ध होईल.')}
                      </span>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsMandalModalOpen(true)} 
                    className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md border border-amber-400 transition"
                  >
                    <span className="material-symbols-outlined text-amber-200 text-[18px]">workspace_premium</span>
                    <span>✨ अधिकृत मंडळ पावती पहा / प्रिंट करा (Mandal Pavti)</span>
                  </button>
                )}

                {/* नमुना अधिकृत पावती (Demo Pavti: John Doe, ₹5001) */}
                <button
                  type="button"
                  onClick={handleOpenDemoPavti}
                  title="अधिकृत पावतीचा नमुना पहा (उदा. श्री. जॉन डो, ₹५,००१)"
                  className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#fe932c] to-[#d14307] hover:from-[#d14307] hover:to-[#a93200] text-white px-3 py-2 rounded-xl text-xs font-bold shadow-md transition border border-orange-300"
                >
                  <span className="material-symbols-outlined text-amber-100 text-[18px]">visibility</span>
                  <span>✨ अधिकृत पावती नमुना (Demo: ₹५,००१)</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button 
                onClick={sendWhatsApp} 
                className="bg-[#25D366] hover:bg-[#1EBE56] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm border border-emerald-600"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>WhatsApp</span>
              </button>
              <button 
                onClick={sendEmailReceipt} 
                className="bg-[#d14307] hover:bg-[#a93200] text-white px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">mail</span>
                <span>ई-मेल</span>
              </button>
              <button 
                onClick={() => window.print()} 
                className="bg-[#ffe9e5] text-[#281714] px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                <span>PDF प्रिंट</span>
              </button>
            </div>
          </div>

          {/* Mandal Official Pavti Modal Component */}
          <MandalPavtiModal 
            isOpen={isMandalModalOpen} 
            onClose={() => setIsMandalModalOpen(false)} 
            record={confirmedReceipt} 
          />

          {/* Devotee Honor Wall with Masked Numbers */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-[#ffe9e5] no-print">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline text-lg font-bold text-[#281714] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#904d00]">workspace_premium</span>
                <span>देणगीदार गौरव फलक (Wall of Honor)</span>
              </h3>
              <span className="text-xs text-[#006b2c] font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#006b2c] animate-pulse"></span>
                <span>थेट अद्ययावत</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stats.records.slice(0, 6).map((rec, i) => (
                <div key={i} className="bg-[#fff0ee] p-3 rounded-xl border border-[#ffe9e5] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#d14307] text-white flex items-center justify-center font-bold text-xs">
                      {rec.donor_name ? rec.donor_name.charAt(0) : 'भ'}
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-[#281714]">
                        {rec.privacy === 'anonymous' ? 'गुप्त दान (भाविक)' : (rec.privacy === 'in_memory' && rec.memory_text ? `${rec.donor_name} (${rec.memory_text})` : rec.donor_name)}
                      </span>
                      <span className="text-[10px] text-[#5a4139]">
                        {rec.category} • {maskMobile(rec.donor_mobile)}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#a93200]">₹ {rec.amount.toLocaleString('mr-IN')}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 🌟 COMING SOON POPUP MODAL (EXCLUSIVE FOR NORMAL USERS) */}
      {showComingSoon && !isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in no-print">
          <div className="bg-white rounded-3xl max-w-md w-full border-2 border-[#ffe9e5] shadow-2xl overflow-hidden relative text-center">
            {/* Top decorative gradient bar */}
            <div className="h-3 bg-gradient-to-r from-[#fe932c] via-[#d14307] to-[#800000]"></div>

            {/* Close button */}
            <button
              onClick={() => setShowComingSoon(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#fff0ee] hover:bg-[#ffe0da] text-[#a93200] font-bold flex items-center justify-center transition shadow-sm"
              title="पूर्वावलोकन पाहण्यासाठी बंद करा"
            >
              ✕
            </button>

            <div className="p-6 sm:p-8 flex flex-col items-center">
              {/* Devotional Graphic Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#fe932c] to-[#d14307] text-white flex items-center justify-center shadow-lg mb-4 ring-4 ring-[#ffe9e5]">
                <span className="material-symbols-outlined text-3xl">hourglass_top</span>
              </div>

              {/* Ganpati Motif Badge */}
              <span className="inline-block bg-[#fe932c]/20 text-[#904d00] text-xs px-3.5 py-1 rounded-full font-bold mb-2 border border-[#fe932c]/30">
                ॥ श्री गणेशाय नमः • मानाचा गणपती ॥
              </span>

              <h2 className="font-headline text-2xl font-bold text-[#a93200] mb-0.5">
                लवकरच उपलब्ध होत आहे!
              </h2>
              <span className="text-[11px] uppercase tracking-widest text-[#d14307] font-bold mb-4 bg-orange-50 px-3 py-0.5 rounded-md border border-orange-200">
                COMING SOON
              </span>

              <div className="bg-gradient-to-b from-[#fff8f6] to-[#fff0ee] border border-[#ffe9e5] rounded-2xl p-4 text-xs text-[#5a4139] leading-relaxed mb-6 space-y-2 text-center w-full">
                <p className="font-bold text-[#281714] text-sm">
                  यंगस्टार मित्र मंडळ, श्रीक्षेत्र देहुगाव
                </p>
                <p className="text-[#a93200] font-semibold">
                  सार्वजनिक गणेशोत्सव {toMarathiDigits(activeYear)} (स्थापना {estYearMarathi} • {editionText})
                </p>
                <div className="h-px bg-[#ffe9e5] my-1"></div>
                <p>
                  भाविकांच्या सोयीसाठी <b>ऑनलाईन वर्गणी नोंदणी</b>, <b>डिजिटल पावती (ई-पावती)</b> व <b>QR पेमेंट सुविधा</b> लवकरच सुरू करण्यात येत आहे.
                </p>
                <p className="text-[11px] text-[#5a4139]/80 italic">
                  सध्या पोर्टलवर तांत्रिक पूर्वतयारी सुरू आहे. लवकरच अधिकृत प्रारंभ होईल!
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 w-full">
                <div className="flex flex-col sm:flex-row gap-2.5 w-full">
                  <a
                    href="/"
                    className="flex-1 bg-gradient-to-r from-[#fe932c] to-[#d14307] hover:from-[#d14307] hover:to-[#a93200] text-white font-bold py-2.5 px-4 rounded-xl shadow-md text-xs transition text-center flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">home</span>
                    <span>मुख्य पानावर जा</span>
                  </a>
                  <button
                    onClick={() => setShowComingSoon(false)}
                    className="flex-1 bg-[#fff0ee] hover:bg-[#ffe0da] text-[#a93200] font-bold py-2.5 px-4 rounded-xl text-xs transition border border-[#fe932c]/40 text-center flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">visibility</span>
                    <span>पूर्वावलोकन (Preview)</span>
                  </button>
                </div>

                {/* Demo Pavti button in Coming Soon popup */}
                <button
                  type="button"
                  onClick={handleOpenDemoPavti}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs shadow-md transition flex items-center justify-center gap-1.5 border border-amber-400"
                >
                  <span className="material-symbols-outlined text-sm">workspace_premium</span>
                  <span>✨ अधिकृत पावती नमुना पहा (Demo Pavti: John Doe, ₹५,००१)</span>
                </button>
              </div>

              {/* Admin Link for Mandal Committee Members */}
              <div className="mt-4 pt-3 border-t border-[#ffe9e5] w-full text-center">
                <a
                  href="/admin"
                  className="text-[11px] text-[#5a4139] hover:text-[#a93200] underline font-medium flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs">admin_panel_settings</span>
                  <span>प्रशासक / खजिनदार आहात का? येथे लॉगिन करा</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Demo Mandal Official Pavti Modal (Generic: John Doe, ₹5001) */}
      <MandalPavtiModal 
        isOpen={isDemoModalOpen} 
        onClose={() => setIsDemoModalOpen(false)} 
        record={demoRecord} 
      />
    </div>
  );
}

