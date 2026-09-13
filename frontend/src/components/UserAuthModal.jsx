import React, { useState } from 'react';

export default function UserAuthModal({ isOpen, onClose, userSession, setUserSession }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: formData.mobile, password: formData.password })
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('ymm_user_session', JSON.stringify(data.user));
        setUserSession(data.user);
        alert(data.message);
        onClose();
      } else {
        setMessage(data.message || 'अवैध मोबाईल किंवा पासवर्ड.');
      }
    } catch (err) {
      setMessage('सर्व्हर त्रुटी: नेटवर्क किंवा सर्व्हर तपासा.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        setMessage(data.message);
        setIsRegistering(false);
      } else {
        setMessage(data.message || 'नोंदणी अयशस्वी झाली.');
      }
    } catch (err) {
      setMessage('सर्व्हर त्रुटी: नोंदणी प्रक्रियेत अडचण आली.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#ffe9e5] p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#fe932c] via-[#d14307] to-[#800000]"></div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#5a4139] hover:text-[#a93200] text-xl font-bold"
        >
          ✕
        </button>

        <div className="text-center mb-5">
          <span className="inline-block bg-[#fe932c]/20 text-[#904d00] text-xs px-3 py-0.5 rounded-full font-bold mb-1">
            ॥ मानाचा गणपती ॥
          </span>
          <h2 className="font-headline text-xl font-bold text-[#a93200]">
            {isRegistering ? 'भाविक / सभासद नोंदणी' : 'सभासद लॉगिन'}
          </h2>
          <p className="text-xs text-[#5a4139]">
            {isRegistering ? 'ॲक्सेस मिळवण्यासाठी आपली माहिती भरा' : 'अधिकृत ॲक्सेस व शेरा (Remarks) पाहण्यासाठी लॉगिन करा'}
          </p>
        </div>

        {message && (
          <div className="bg-[#fff0ee] text-[#a93200] p-3 rounded-lg text-xs font-bold mb-4 text-center border border-[#ffe9e5]">
            {message}
          </div>
        )}

        {userSession ? (
          <div className="flex flex-col gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-[#d14307] text-white flex items-center justify-center text-2xl font-bold mx-auto shadow-md border-2 border-[#fe932c]">
              {userSession.name ? userSession.name.charAt(0) : 'भ'}
            </div>
            
            <div>
              <h3 className="font-headline text-lg font-bold text-[#281714]">{userSession.name}</h3>
              <p className="text-xs text-[#5a4139] font-mono mt-0.5">मोबाईल: {userSession.mobile}</p>
            </div>

            <div className={`p-4 rounded-xl border text-xs font-bold ${userSession.isApproved || userSession.status === 'APPROVED' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-amber-50 border-amber-300 text-amber-900'}`}>
              <div className="flex items-center justify-center gap-1.5 mb-1 text-sm">
                <span>{userSession.isApproved || userSession.status === 'APPROVED' ? '✓ ॲक्सेस मंजूर (Approved Member)' : '⏳ ॲक्सेस प्रलंबित (Pending Approval)'}</span>
              </div>
              <p className="font-normal text-[11px] mt-1">
                {userSession.isApproved || userSession.status === 'APPROVED' 
                  ? 'तुमचा ॲक्सेस स्वीकृत झाला आहे! आता तुम्हाला सर्व पावत्यांमधील शेरा (Remarks) व पूर्ण मोबाईल नंबर दृश्यमान आहेत.' 
                  : 'तुमची नोंदणी प्रशासकाकडे पाठवली आहे. प्रशासकांकडून मान्यता मिळताच तुम्हाला पूर्ण ॲक्सेस मिळेल.'}
              </p>
            </div>

            <button 
              onClick={() => {
                localStorage.removeItem('ymm_user_session');
                setUserSession(null);
                window.location.reload();
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-bold text-xs shadow-md transition-all mt-2"
            >
              लॉगआउट करा (Logout)
            </button>
          </div>
        ) : isRegistering ? (
          <form onSubmit={handleRegister} className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-bold text-[#281714] mb-1">पूर्ण नाव *</label>
              <input 
                type="text" name="name" required
                value={formData.name} onChange={handleChange}
                placeholder="उदा. सुरेश बाळकृष्ण कुलकर्णी"
                className="w-full px-3 py-2 rounded-lg bg-[#fff0ee] border text-xs text-[#281714]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#281714] mb-1">मोबाईल (WhatsApp) *</label>
              <input 
                type="tel" name="mobile" required
                value={formData.mobile} onChange={handleChange}
                placeholder="९८२२५५४४३३"
                className="w-full px-3 py-2 rounded-lg bg-[#fff0ee] border text-xs text-[#281714]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#281714] mb-1">पत्ता / पेठ</label>
              <input 
                type="text" name="address"
                value={formData.address} onChange={handleChange}
                placeholder="उदा. माळीनगर - देहुगाव, पुणे"
                className="w-full px-3 py-2 rounded-lg bg-[#fff0ee] border text-xs text-[#281714]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#281714] mb-1">पासवर्ड *</label>
              <input 
                type="password" name="password" required
                value={formData.password} onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg bg-[#fff0ee] border text-xs text-[#281714]"
              />
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-[#d14307] hover:bg-[#a93200] text-white py-2.5 rounded-xl font-bold text-xs shadow-md transition-all mt-2"
            >
              {loading ? 'नोंदणी होत आहे...' : 'प्रशासकाकडे ॲक्सेससाठी अर्ज करा'}
            </button>

            <p className="text-center text-xs text-[#5a4139] mt-2">
              आधीच नोंदणी केली आहे?{' '}
              <button 
                type="button" 
                onClick={() => setIsRegistering(false)}
                className="text-[#a93200] font-bold underline"
              >
                इथे लॉगिन करा
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-bold text-[#281714] mb-1">मोबाईल क्रमांक *</label>
              <input 
                type="tel" name="mobile" required
                value={formData.mobile} onChange={handleChange}
                placeholder="उदा. ९८२२५५४४३३"
                className="w-full px-3 py-2 rounded-lg bg-[#fff0ee] border text-xs text-[#281714]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#281714] mb-1">पासवर्ड *</label>
              <input 
                type="password" name="password" required
                value={formData.password} onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg bg-[#fff0ee] border text-xs text-[#281714]"
              />
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-[#00873a] hover:bg-[#006b2c] text-white py-2.5 rounded-xl font-bold text-xs shadow-md transition-all mt-2"
            >
              {loading ? 'पडताळणी होत आहे...' : 'सुरक्षित लॉगिन करा'}
            </button>

            <p className="text-center text-xs text-[#5a4139] mt-2">
              अजून खाते नाही?{' '}
              <button 
                type="button" 
                onClick={() => setIsRegistering(true)}
                className="text-[#a93200] font-bold underline"
              >
                इथे नोंदणी करा (Grant Access)
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
