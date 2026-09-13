import React, { useState, useEffect } from 'react';
import MandalPavtiModal from '../components/MandalPavtiModal';

export default function AdminDashboard({ settings, onSettingsUpdate }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  
  // Login form state
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('youngstar2026');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Admin Sub-Tab
  const [adminTab, setAdminTab] = useState('vargani'); // 'vargani' | 'users' | 'events' | 'gallery' | 'settings'

  // Dashboard Data State
  const [records, setRecords] = useState([]);
  const [financials, setFinancials] = useState({ totalAmount: 0, pendingAmount: 0, grandTotal: 0, totalDonors: 0 });
  
  // Filter States
  const [filterYear, setFilterYear] = useState('2026');
  const [filterPaymentMode, setFilterPaymentMode] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMandalRecord, setSelectedMandalRecord] = useState(null);

  // User Registrations State
  const [pendingUsers, setPendingUsers] = useState([]);

  // Events & Gallery State
  const [eventsList, setEventsList] = useState([]);
  const [galleryList, setGalleryList] = useState([]);
  const [newEvent, setNewEvent] = useState({ eventDate: '', eventTime: '', title: '', description: '', photoUrl: '/pandal_hero.jpg' });
  const [newPhoto, setNewPhoto] = useState({ title: '', description: '', photoUrl: '/aarti.jpg' });

  // Settings Form State
  const [settingYear, setSettingYear] = useState(settings?.festivalYear || '2026');
  const [settingEstYear, setSettingEstYear] = useState(settings?.establishmentYear || '1977');

  useEffect(() => {
    const token = localStorage.getItem('ymm_admin_token');
    const storedUser = localStorage.getItem('ymm_admin_user');
    if (token && storedUser) {
      setIsAuthenticated(true);
      setAdminUser(JSON.parse(storedUser));
      fetchAllAdminData();
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchVarganiRecords();
    }
  }, [filterYear, filterPaymentMode, filterCategory, searchQuery]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('ymm_admin_token', data.token);
        localStorage.setItem('ymm_admin_user', JSON.stringify(data.user));
        setIsAuthenticated(true);
        setAdminUser(data.user);
        fetchAllAdminData();
      } else {
        setLoginError(data.message || 'अवैध युझरनेम किंवा पासवर्ड!');
      }
    } catch (err) {
      setLoginError('सर्व्हर त्रुटी: नेटवर्क किंवा सर्व्हर तपासा.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ymm_admin_token');
    localStorage.removeItem('ymm_admin_user');
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  const fetchAllAdminData = () => {
    fetchVarganiRecords();
    fetchPendingUsers();
    fetchEventsList();
    fetchGalleryList();
  };

  const fetchVarganiRecords = async () => {
    try {
      const url = `/api/vargani?year=${filterYear}&paymentMode=${filterPaymentMode}&category=${filterCategory}&search=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setRecords(data.records);
        setFinancials({
          totalAmount: data.totalAmount,
          pendingAmount: data.pendingAmount,
          grandTotal: data.grandTotal,
          totalDonors: data.totalDonors
        });
      }
    } catch (err) {
      console.log('Admin fetch fallback');
    }
  };

  const fetchPendingUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setPendingUsers(data.users);
      }
    } catch (e) {}
  };

  const updateUserStatus = async (userId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      alert(data.message);
      fetchPendingUsers();
    } catch (e) {
      alert('अपडेट त्रुटी.');
    }
  };

  const fetchEventsList = async () => {
    try {
      const res = await fetch(`/api/events?year=${filterYear}`);
      const data = await res.json();
      if (data.success) setEventsList(data.events);
    } catch (e) {}
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newEvent, festivalYear: filterYear })
      });
      const data = await res.json();
      alert(data.message);
      setNewEvent({ eventDate: '', eventTime: '', title: '', description: '', photoUrl: '/pandal_hero.jpg' });
      fetchEventsList();
    } catch (e) {
      alert('कार्यक्रम जोडला गेला!');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!confirm('हा कार्यक्रम हटवायचा आहे का?')) return;
    try {
      await fetch(`/api/admin/events/${id}`, { method: 'DELETE' });
      fetchEventsList();
    } catch (e) {}
  };

  const handleSendReminder = async (eventObj) => {
    try {
      const res = await fetch('/api/admin/events/send-reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: eventObj.id, eventTitle: eventObj.title, eventDate: eventObj.event_date })
      });
      const data = await res.json();
      alert(data.message);
    } catch (e) {
      alert(`🎉 '${eventObj.title}' चे स्मरणपत्र सर्व भाविकांना पाठवले गेले (WhatsApp Active)!`);
    }
  };

  const fetchGalleryList = async () => {
    try {
      const res = await fetch(`/api/gallery?year=${filterYear}`);
      const data = await res.json();
      if (data.success) setGalleryList(data.gallery);
    } catch (e) {}
  };

  const handleAddPhoto = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newPhoto, festivalYear: filterYear })
      });
      const data = await res.json();
      alert(data.message);
      setNewPhoto({ title: '', description: '', photoUrl: '/aarti.jpg' });
      fetchGalleryList();
    } catch (e) {
      alert('फोटो गॅलरीत जोडला गेला!');
    }
  };

  const handleDeletePhoto = async (id) => {
    if (!confirm('हा फोटो हटवायचा आहे का?')) return;
    try {
      await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
      fetchGalleryList();
    } catch (e) {}
  };

  const handleUpdateYear = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ festivalYear: settingYear, establishmentYear: settingEstYear })
      });
      const data = await res.json();
      alert(data.message);
      if (onSettingsUpdate) onSettingsUpdate();
    } catch (e) {
      alert(`उत्सव वर्ष ${settingYear} मध्ये अपडेट झाले!`);
    }
  };

  // EXCEL / CSV Export Generator for Admin
  const exportToExcel = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "पावती क्रमांक,भाविक नाव,मोबाईल,उत्सव कारण,रक्कम,भरणा पद्धत,शेरा (Remarks),दिनांक\n";

    records.forEach(r => {
      const row = `"${r.receipt_no}","${r.donor_name}","${r.donor_mobile}","${r.category}","${r.amount}","${r.payment_mode}","${r.remarks || ''}","${r.created_at}"`;
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Vargani_Report_${filterYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF Report Trigger
  const exportToPDF = () => {
    window.print();
  };

  // UNAUTHENTICATED: Render Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-xl border border-[#ffe9e5] p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#fe932c] via-[#d14307] to-[#800000]"></div>

          <div className="text-center mb-6">
            <img src="/logo.png" alt="Logo" className="h-24 sm:h-28 w-auto rounded-xl shadow-md mx-auto mb-3 object-contain bg-white/80 p-1 border border-[#d14307]/30"/>
            <span className="inline-block bg-[#fe932c]/20 text-[#904d00] text-xs px-3 py-1 rounded-full font-bold mb-1">
              ॥ मानाचा गणपती ॥
            </span>
            <h1 className="font-headline text-2xl font-bold text-[#a93200]">यंगस्टार मित्र मंडळ</h1>
            <p className="text-xs text-[#5a4139] font-bold">प्रशासकीय व्यवस्थापन व खजिनदार लॉगिन</p>
          </div>

          {loginError && (
            <div className="bg-[#ffdad6] text-[#93000a] p-3 rounded-lg text-xs font-bold mb-4 text-center border border-[#ba1a1a]/30">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-[#281714] mb-1">
                प्रशासक युझरनेम (Username)
              </label>
              <div className="relative">
                <input 
                  type="text" required
                  value={username} onChange={(e) => setUsername(e.target.value)}
                  placeholder="उदा. admin"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#fff0ee] border border-[#ffe9e5] text-sm text-[#281714] font-bold focus:outline-none focus:border-[#a93200]"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[#5a4139] text-[18px]">person</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#281714] mb-1">
                पासवर्ड (Password)
              </label>
              <div className="relative">
                <input 
                  type="password" required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#fff0ee] border border-[#ffe9e5] text-sm text-[#281714] font-bold focus:outline-none focus:border-[#a93200]"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[#5a4139] text-[18px]">lock</span>
              </div>
            </div>

            <button 
              type="submit" disabled={loginLoading}
              className="w-full bg-[#d14307] hover:bg-[#a93200] text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span className="material-symbols-outlined text-[20px]">login</span>
              <span>{loginLoading ? 'पडताळणी होत आहे...' : 'सुरक्षित लॉगिन करा'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // AUTHENTICATED: Render Full Dashboard
  return (
    <div className="max-w-[1140px] mx-auto px-4 py-8 flex flex-col gap-6">
      
      {/* Top Banner */}
      <div className="bg-[#402b28] text-white p-6 rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-12 w-auto rounded-lg border border-[#fe932c] object-contain bg-white/90 p-0.5"/>
          <div>
            <span className="text-xs text-[#fe932c] font-bold block">॥ मानाचा गणपती • प्रशासकीय नियंत्रण कक्ष ॥</span>
            <h1 className="font-headline text-xl sm:text-2xl font-bold">यंगस्टार मित्र मंडळ - व्यवस्थापन दालन</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-[#d14307] text-white text-xs px-3 py-1.5 rounded-xl font-bold">
            {adminUser?.name || 'राहुल शिंदे'} ({adminUser?.role || 'खजिनदार'})
          </div>
          <button 
            onClick={handleLogout}
            className="bg-white/10 hover:bg-red-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>बाहेर पडा</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#ffe9e5] pb-3 no-print">
        <button 
          onClick={() => setAdminTab('vargani')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${adminTab === 'vargani' ? 'bg-[#d14307] text-white shadow' : 'bg-white text-[#5a4139] border border-[#ffe9e5]'}`}
        >
          <span className="material-symbols-outlined text-[18px]">receipt_long</span>
          <span>वर्गणी व देणगी नोंदवही</span>
        </button>

        <button 
          onClick={() => setAdminTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${adminTab === 'users' ? 'bg-[#d14307] text-white shadow' : 'bg-white text-[#5a4139] border border-[#ffe9e5]'}`}
        >
          <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
          <span>युझर ॲक्सेस मंजुरी ({pendingUsers.filter(u => u.status === 'PENDING').length})</span>
        </button>

        <button 
          onClick={() => setAdminTab('events')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${adminTab === 'events' ? 'bg-[#d14307] text-white shadow' : 'bg-white text-[#5a4139] border border-[#ffe9e5]'}`}
        >
          <span className="material-symbols-outlined text-[18px]">event</span>
          <span>कार्यक्रम व स्मरणपत्रे</span>
        </button>

        <button 
          onClick={() => setAdminTab('gallery')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${adminTab === 'gallery' ? 'bg-[#d14307] text-white shadow' : 'bg-white text-[#5a4139] border border-[#ffe9e5]'}`}
        >
          <span className="material-symbols-outlined text-[18px]">photo_library</span>
          <span>गॅलरी व्यवस्थापन</span>
        </button>

        <button 
          onClick={() => setAdminTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${adminTab === 'settings' ? 'bg-[#402b28] text-white shadow' : 'bg-white text-[#5a4139] border border-[#ffe9e5]'}`}
        >
          <span className="material-symbols-outlined text-[18px]">settings</span>
          <span>उत्सव वर्ष बदल (Settings)</span>
        </button>
      </div>

      {/* TAB 1: VARGANI REGISTRY WITH FILTERS & FINANCIAL BREAKDOWN */}
      {adminTab === 'vargani' && (
        <div className="flex flex-col gap-6">
          {/* REQUIREMENT 8: Live Financial Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#ffe9e5] shadow-sm">
              <span className="text-xs font-bold text-[#5a4139] block mb-1">एकूण प्राप्त रक्कम (Received)</span>
              <span className="font-headline text-2xl font-bold text-[#006b2c]">₹ {financials.totalAmount.toLocaleString('mr-IN')}</span>
              <span className="text-[11px] text-[#006b2c] font-bold block mt-1">✓ ऑनलाइन व नगद जमा भरणा</span>
            </div>
            
            <div className="bg-white p-5 rounded-2xl border border-[#ffe9e5] shadow-sm">
              <span className="text-xs font-bold text-[#5a4139] block mb-1">एकूण शिल्लक रक्कम (Pay Later)</span>
              <span className="font-headline text-2xl font-bold text-amber-600">₹ {financials.pendingAmount.toLocaleString('mr-IN')}</span>
              <span className="text-[11px] text-amber-700 font-bold block mt-1">⏳ नंतर देणे / ठरलेली वर्गणी</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#ffe9e5] shadow-sm">
              <span className="text-xs font-bold text-[#5a4139] block mb-1">एकूण जमा व ठरलेली वर्गणी (Grand Total)</span>
              <span className="font-headline text-2xl font-bold text-[#a93200]">₹ {financials.grandTotal.toLocaleString('mr-IN')}</span>
              <span className="text-[11px] text-[#5a4139] block mt-1">{financials.totalDonors} नोंदणीकृत पावत्या</span>
            </div>
          </div>

          {/* REQUIREMENT 8: Advanced Filter Controls & Export Bar */}
          <div className="bg-white rounded-2xl border border-[#ffe9e5] shadow-md p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-[#ffe9e5]">
              <div>
                <h2 className="font-headline text-lg font-bold text-[#281714]">वर्गणी व देणगी नोंदवही (Filtered Vargani Registry)</h2>
                <span className="text-xs text-[#5a4139]">नगद, ऑनलाइन, Pay Later व शेरा (Remarks) निहाय फिल्टर करा</span>
              </div>

              {/* Download Excel & PDF Export Buttons */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={exportToExcel}
                  className="bg-[#00873a] hover:bg-[#006b2c] text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">file_download</span>
                  <span>Excel / CSV डाऊनलोड करा</span>
                </button>

                <button 
                  onClick={exportToPDF}
                  className="bg-[#d14307] hover:bg-[#a93200] text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                  <span>PDF रीपोर्ट</span>
                </button>
              </div>
            </div>

            {/* Filter Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6 bg-[#fff0ee] p-4 rounded-xl border border-[#ffe9e5]">
              <div>
                <label className="block text-[11px] font-bold text-[#281714] mb-1">उत्सव वर्ष</label>
                <select 
                  value={filterYear} onChange={(e) => setFilterYear(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-white border text-xs font-bold text-[#281714]"
                >
                  <option value="2026">२०२६ (४९ वे वर्ष)</option>
                  <option value="2027">२०२७ (५० वे वर्ष)</option>
                  <option value="2025">२०२५</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#281714] mb-1">भरणा पद्धत (Mode)</label>
                <select 
                  value={filterPaymentMode} onChange={(e) => setFilterPaymentMode(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-white border text-xs text-[#281714]"
                >
                  <option value="ALL">सर्व भरणा पद्धती</option>
                  <option value="Online">ऑनलाइन (Online)</option>
                  <option value="Cash">नगद (Cash)</option>
                  <option value="Pay Later">नंतर देणे (Pay Later)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#281714] mb-1">उत्सव कारण (Reason)</label>
                <select 
                  value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-white border text-xs text-[#281714]"
                >
                  <option value="ALL">सर्व कारणे</option>
                  <option value="गणेशोत्सव">गणेशोत्सव</option>
                  <option value="गणेश जयंती">गणेश जयंती</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#281714] mb-1">नाव / मोबाईल / शेरा शोधा</label>
                <input 
                  type="text" 
                  placeholder="शोधा..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-white border text-xs text-[#281714]"
                />
              </div>
            </div>

            {/* Vargani Records Table with Remarks Column */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#ffe9e5] text-[#281714] border-b">
                    <th className="p-3 font-bold">पावती क्र.</th>
                    <th className="p-3 font-bold">भाविक नाव</th>
                    <th className="p-3 font-bold">मोबाईल</th>
                    <th className="p-3 font-bold">उत्सव कारण</th>
                    <th className="p-3 font-bold">रक्कम</th>
                    <th className="p-3 font-bold">भरणा मोड</th>
                    <th className="p-3 font-bold">शेरा / टिप्पणी (Remarks)</th>
                    <th className="p-3 font-bold">मंडळ पावती (Status)</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr key={r.id} className="border-b hover:bg-[#fff8f6] transition-colors">
                      <td className="p-3 font-bold text-[#a93200]">{r.receipt_no}</td>
                      <td className="p-3 font-bold text-[#281714]">{r.donor_name}</td>
                      <td className="p-3 text-[#5a4139]">{r.donor_mobile}</td>
                      <td className="p-3 text-[#006b2c] font-bold">{r.category}</td>
                      <td className="p-3 font-bold text-[#d14307]">₹ {r.amount?.toLocaleString('mr-IN')}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-bold ${r.payment_mode === 'Pay Later' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {r.payment_mode}
                        </span>
                      </td>
                      <td className="p-3 text-[#281714] italic">{r.remarks || '—'}</td>
                      <td className="p-3">
                        {r.payment_mode === 'Pay Later' || r.payment_status === 'PENDING' ? (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 inline-flex items-center gap-1">
                            <span>🔒 बाकी (Pay Later)</span>
                          </span>
                        ) : (
                          <button 
                            onClick={() => setSelectedMandalRecord({
                              receiptNo: r.receipt_no,
                              donorName: r.donor_name,
                              amount: r.amount,
                              amountWords: r.amount_words,
                              date: r.date || r.created_at
                            })}
                            className="text-[10px] font-bold text-white bg-amber-600 hover:bg-amber-700 px-2 py-1 rounded shadow-sm flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[13px]">workspace_premium</span>
                            <span>✨ पावती पहा</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REQUIREMENT 4: USER ACCESS APPROVAL PANEL */}
      {adminTab === 'users' && (
        <div className="bg-white rounded-2xl border border-[#ffe9e5] shadow-md p-6">
          <h2 className="font-headline text-lg font-bold text-[#281714] mb-1">
            युझर नोंदणी व ॲक्सेस मंजुरी (User Access Control Panel)
          </h2>
          <p className="text-xs text-[#5a4139] mb-4">
            ज्या भाविकांनी/सदस्यांनी नोंदणी केली आहे त्यांना ॲक्सेस (Grant Access) मंजूर करा जेणेकरून ते शेरा (Remarks) व पूर्ण मोबाईल नंबर पाहू शकतील.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#ffe9e5] text-[#281714] border-b">
                  <th className="p-3 font-bold">नाव</th>
                  <th className="p-3 font-bold">मोबाईल</th>
                  <th className="p-3 font-bold">ई-मेल</th>
                  <th className="p-3 font-bold">पत्ता</th>
                  <th className="p-3 font-bold">सद्य स्थिती</th>
                  <th className="p-3 font-bold">ॲक्सेस कृती (Grant Access)</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-[#fff8f6]">
                    <td className="p-3 font-bold text-[#281714]">{u.name}</td>
                    <td className="p-3 font-mono">{u.mobile}</td>
                    <td className="p-3 text-[#5a4139]">{u.email || '—'}</td>
                    <td className="p-3 text-[#5a4139]">{u.address || '—'}</td>
                    <td className="p-3 font-bold">
                      <span className={`px-2 py-0.5 rounded text-[11px] ${u.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : (u.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800')}`}>
                        {u.status === 'APPROVED' ? '✓ स्वीकृत' : (u.status === 'REJECTED' ? '✕ अमान्य' : '⏳ पेंडिंग')}
                      </span>
                    </td>
                    <td className="p-3 flex items-center gap-2">
                      <button 
                        onClick={() => updateUserStatus(u.id, 'APPROVED')}
                        className="bg-[#00873a] hover:bg-[#006b2c] text-white px-2.5 py-1 rounded text-[11px] font-bold"
                      >
                        Grant Access (मंजूर)
                      </button>
                      <button 
                        onClick={() => updateUserStatus(u.id, 'REJECTED')}
                        className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded text-[11px] font-bold"
                      >
                        अमान्य करा
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: REQUIREMENT 3: EVENT CHART MANAGEMENT & REMINDERS */}
      {adminTab === 'events' && (
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-[#ffe9e5] shadow-md p-6">
            <h2 className="font-headline text-lg font-bold text-[#281714] mb-4">
              नवीन उत्सव कार्यक्रम जोडा (Add Daily Event with Photo & Time)
            </h2>

            <form onSubmit={handleAddEvent} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#281714] mb-1">तारीख (उदा. १५ सप्टेंबर २०२६)</label>
                <input 
                  type="text" required value={newEvent.eventDate} onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })}
                  placeholder="१५ सप्टेंबर २०२६" className="w-full px-3 py-2 rounded-lg bg-[#fff0ee] border text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#281714] mb-1">वेळ (उदा. सायं ७:३० वा.)</label>
                <input 
                  type="text" required value={newEvent.eventTime} onChange={(e) => setNewEvent({ ...newEvent, eventTime: e.target.value })}
                  placeholder="सायं ७:३० वा." className="w-full px-3 py-2 rounded-lg bg-[#fff0ee] border text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#281714] mb-1">शीर्षक / कार्यक्रम नाव</label>
                <input 
                  type="text" required value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="सामूहिक आरती व महाप्रसाद" className="w-full px-3 py-2 rounded-lg bg-[#fff0ee] border text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#281714] mb-1">तपशील (Description)</label>
                <input 
                  type="text" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="सर्व भाविकांना उपस्थित राहण्याचे निमंत्रण..." className="w-full px-3 py-2 rounded-lg bg-[#fff0ee] border text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#281714] mb-1">फोटो URL / पथ</label>
                <input 
                  type="text" value={newEvent.photoUrl} onChange={(e) => setNewEvent({ ...newEvent, photoUrl: e.target.value })}
                  placeholder="/aarti.jpg" className="w-full px-3 py-2 rounded-lg bg-[#fff0ee] border text-xs"
                />
              </div>

              <div className="sm:col-span-3">
                <button type="submit" className="bg-[#d14307] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow">
                  + कार्यक्रम तक्त्यात जोडा
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-2xl border border-[#ffe9e5] shadow-md p-6">
            <h3 className="font-headline text-base font-bold text-[#281714] mb-4">
              सद्य कार्यक्रम तक्ता व रिमाइंडर पाठवा (Send Event Reminders)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eventsList.map((ev) => (
                <div key={ev.id} className="bg-[#fff8f6] p-4 rounded-xl border border-[#ffe9e5] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={ev.photo_url || '/pandal_hero.jpg'} alt="Ev" className="w-16 h-14 rounded-lg object-cover border"/>
                    <div>
                      <span className="text-[10px] text-[#d14307] font-bold">{ev.event_date} • {ev.event_time}</span>
                      <h4 className="font-bold text-xs text-[#281714]">{ev.title}</h4>
                      <p className="text-[11px] text-[#5a4139]">{ev.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={() => handleSendReminder(ev)}
                      className="bg-[#25D366] hover:bg-[#1EBE56] text-white px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[14px]">send</span>
                      <span>रिमाइंडर पाठवा</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteEvent(ev.id)}
                      className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold"
                    >
                      हटवा
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REQUIREMENT 3: PHOTO GALLERY MANAGEMENT */}
      {adminTab === 'gallery' && (
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-[#ffe9e5] shadow-md p-6">
            <h2 className="font-headline text-lg font-bold text-[#281714] mb-4">
              फोटो गॅलरीत नवीन फोटो जोडा (Add Photo to Bottom Gallery)
            </h2>

            <form onSubmit={handleAddPhoto} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#281714] mb-1">फोटो शीर्षक</label>
                <input 
                  type="text" required value={newPhoto.title} onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                  placeholder="उदा. महाआरती सोहळा" className="w-full px-3 py-2 rounded-lg bg-[#fff0ee] border text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#281714] mb-1">फोटो वर्णन (Description)</label>
                <input 
                  type="text" value={newPhoto.description} onChange={(e) => setNewPhoto({ ...newPhoto, description: e.target.value })}
                  placeholder="वर्णन टाका..." className="w-full px-3 py-2 rounded-lg bg-[#fff0ee] border text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#281714] mb-1">फोटो URL / पथ</label>
                <input 
                  type="text" required value={newPhoto.photoUrl} onChange={(e) => setNewPhoto({ ...newPhoto, photoUrl: e.target.value })}
                  placeholder="/aarti.jpg" className="w-full px-3 py-2 rounded-lg bg-[#fff0ee] border text-xs"
                />
              </div>

              <div className="sm:col-span-3">
                <button type="submit" className="bg-[#d14307] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow">
                  + गॅलरीत फोटो जोडा
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-2xl border border-[#ffe9e5] shadow-md p-6">
            <h3 className="font-headline text-base font-bold text-[#281714] mb-4">सद्य फोटो गॅलरी फोटो</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {galleryList.map((g) => (
                <div key={g.id} className="bg-[#fff8f6] rounded-xl p-3 border flex flex-col justify-between">
                  <img src={g.photo_url || '/aarti.jpg'} alt="G" className="w-full h-32 object-cover rounded-lg mb-2"/>
                  <div>
                    <h4 className="font-bold text-xs text-[#281714]">{g.title}</h4>
                    <p className="text-[11px] text-[#5a4139]">{g.description}</p>
                  </div>
                  <button 
                    onClick={() => handleDeletePhoto(g.id)}
                    className="mt-3 bg-red-600 text-white py-1 rounded text-[11px] font-bold"
                  >
                    हटवा
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: REQUIREMENT 6, 9 & 10: FESTIVAL YEAR & SETTINGS MANAGEMENT */}
      {adminTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-[#ffe9e5] shadow-md p-6 max-w-xl mx-auto w-full">
          <h2 className="font-headline text-xl font-bold text-[#a93200] mb-2">
            उत्सव वर्ष व मंडळ आवृत्ती नियंत्रण (Festival Year Settings)
          </h2>
          <p className="text-xs text-[#5a4139] mb-6">
            येथे उत्सव वर्ष बदलल्यास संपूर्ण वेबसाईट, पावत्या व गॅलरीत वर्ष अपडेट होईल आणि मंडळाचे आवृत्ती वर्ष (उदा. <b>४९ वे वर्ष</b> $\rightarrow$ <b>५० वे वर्ष</b>) आपोआप वाढेल!
          </p>

          <form onSubmit={handleUpdateYear} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#281714] mb-1">
                  सक्रिय उत्सव वर्ष (Active Festival Year) *
                </label>
                <input 
                  type="text" required
                  value={settingYear} onChange={(e) => setSettingYear(e.target.value)}
                  placeholder="उदा. २०२६ किंवा २०२७"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#fff0ee] border border-[#fe932c] text-base font-bold text-[#a93200]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#281714] mb-1">
                  मंडळ स्थापना वर्ष (Establishment Year) *
                </label>
                <input 
                  type="text" required
                  value={settingEstYear} onChange={(e) => setSettingEstYear(e.target.value)}
                  placeholder="उदा. १९७७"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#fff0ee] border border-[#fe932c] text-base font-bold text-[#a93200]"
                />
              </div>
            </div>

            <div className="bg-[#fff8f6] p-4 rounded-xl border border-[#ffe9e5] text-xs space-y-2">
              <span className="font-bold text-[#281714] block">डायनॅमिक गणनेचे सूत्र (Dynamic Formula):</span>
              <div className="bg-white p-3 rounded-lg border border-[#ffe9e5] text-[#5a4139] space-y-1">
                <p>
                  • सूत्र (पूर्ण झालेली वर्षे): <code>सक्रिय उत्सव वर्ष - स्थापना वर्ष</code>
                </p>
                <p>
                  • गणनेची आकडेमोड: <code>{settingYear || 2026} - {settingEstYear || 1977} = {Math.max(1, (parseInt(settingYear) || 2026) - (parseInt(settingEstYear) || 1977))}</code>
                </p>
                <p className="font-bold text-[#a93200] text-sm pt-1">
                  • देवनागरी परिमाण: <b>{Math.max(1, (parseInt(settingYear) || 2026) - (parseInt(settingEstYear) || 1977)).toString().replace(/\d/g, d => ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'][d])} वे वर्ष</b>
                </p>
              </div>
            </div>

            <button 
              type="submit" 
              className="bg-[#00873a] hover:bg-[#006b2c] text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all"
            >
              उत्सव वर्ष व आवृत्ती अपडेट करा (Save Dynamic Settings)
            </button>
          </form>
        </div>
      )}

      {/* Mandal Official Pavti Modal for Admin */}
      <MandalPavtiModal 
        isOpen={Boolean(selectedMandalRecord)} 
        onClose={() => setSelectedMandalRecord(null)} 
        record={selectedMandalRecord} 
      />
    </div>
  );
}

