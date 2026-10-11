import React, { useState } from 'react';

function toMarathiDigits(num) {
  if (!num) return '';
  const marathiDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return num.toString().replace(/\d/g, d => marathiDigits[d]);
}

export default function Navbar({ activeTab, setActiveTab, settings, userSession, onOpenAuth }) {
  const festivalYear = toMarathiDigits(settings?.festivalYear || '2026');
  const editionText = settings?.editionText || '४९ वे वर्ष';
  const estYear = toMarathiDigits(settings?.establishmentYear || '1977');

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTributeModal, setShowTributeModal] = useState(false);
  const [showLogoModal, setShowLogoModal] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FFF8F6]/95 backdrop-blur-md shadow-md no-print border-b border-[#ffe9e5]">
        {/* Auspicious Top Banner Strip with Centered Details */}
        <div className="bg-gradient-to-r from-[#d14307] via-[#a93200] to-[#800000] text-white text-center py-1 px-2 sm:px-4">
          <div className="max-w-[1240px] mx-auto flex items-center justify-center text-[10px] sm:text-xs font-semibold">
            {/* Center Establishment Year & Dynamic Edition Count */}
            <p className="tracking-wider uppercase font-bold flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-center mx-auto">
              <span>॥ श्री गणेशाय नमः ॥</span>
              <span>•</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-white font-headline text-[9px] sm:text-xs">
                स्थापना वर्ष : {estYear} • {editionText}
              </span>
              <span>•</span>
              <span>यंगस्टार मित्र मंडळ</span>
            </p>
          </div>
        </div>

        {/* Main Navbar Container */}
        <div className="max-w-[1240px] mx-auto px-2 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between gap-1 sm:gap-3">

          {/* Left Side: Logo & Brand - uses ganesha_logo.png on Home page */}
          <button
            onClick={() => setActiveTab('home')}
            onDoubleClick={(e) => {
              e.stopPropagation();
              setShowLogoModal(true);
            }}
            className="flex items-center gap-1.5 sm:gap-2.5 text-left shrink-0 group/logo select-none"
            title="मुख्यपृष्ठावर जाण्यासाठी सिंगल-क्लिक करा • लोगो मोठा करून पाहण्यासाठी डबल-क्लिक करा"
          >
            <img
              alt="यंगस्टार मित्र मंडळ Logo"
              className="h-9 sm:h-12 md:h-14 w-auto rounded-lg object-contain drop-shadow-md shrink-0 transform group-hover/logo:scale-105 transition-transform duration-300"
              src={activeTab === 'home' ? '/ganesha_logo.png' : '/logo.png'}
            />
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs font-bold text-[#d14307] tracking-wider text-left mb-0.5">
                ॥ मानाचा गणपती ॥
              </span>
              <div className="flex items-center gap-1">
                <span className="font-headline text-xs sm:text-base md:text-lg lg:text-xl text-[#a93200] font-bold leading-tight">
                  यंगस्टार मित्र मंडळ
                </span>
                <span className="bg-[#fe932c]/20 text-[#904d00] text-[8px] sm:text-[9px] px-1.5 py-0.2 rounded-full font-bold shrink-0">
                  {editionText}
                </span>
              </div>
              <span className="hidden 2xl:block text-[11px] text-[#5a4139] font-medium">
                सार्वजनिक गणेशोत्सव {festivalYear} • श्रीक्षेत्र देहुगाव
              </span>
            </div>
          </button>

          {/* Middle of Header: Shreyas Dada Tribute Photo */}
          <div
            onClick={() => setShowTributeModal(true)}
            className="flex items-center gap-1 sm:gap-2 cursor-pointer group shrink-0 transition-transform hover:scale-105"
            title="श्रद्धांजली मेसेज पाहण्यासाठी क्लिक करा"
          >
            <img
              src="/Shreyas_dada.jpg"
              alt="कै. कु. श्रेयस अशोक परंडवाल"
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl object-cover object-top shadow-md shrink-0 border-2 border-[#d14307]"
            />
            <div className="hidden xl:flex flex-col text-left">
              <div className="flex items-center gap-1">
                <span className="text-[8px] bg-[#d14307] text-white px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                  स्मृतिगंध
                </span>
              </div>
              <span className="text-[10px] xl:text-[11px] font-bold text-[#281714] leading-tight drop-shadow-sm mt-0.5 group-hover:text-[#a93200] truncate max-w-[130px]">
                कै. कु. श्रेयस परंडवाल
              </span>
              <span className="text-[8px] text-[#5a4139] font-semibold">भावपूर्ण आदरांजली 🙏</span>
            </div>
          </div>

          {/* Desktop Navigation Links (>= lg screens) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-semibold transition-all ${activeTab === 'home' ? 'bg-[#d14307] text-white shadow-sm' : 'text-[#5a4139] hover:text-[#a93200] hover:bg-[#ffe9e5]'}`}
            >
              मुख्यपृष्ठ
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-2 py-1.5 xl:px-2.5 rounded-lg text-xs xl:text-sm font-semibold transition-all ${activeTab === 'schedule' ? 'bg-[#d14307] text-white shadow-sm' : 'text-[#5a4139] hover:text-[#a93200] hover:bg-[#ffe9e5]'}`}
            >
              कार्यक्रम तक्ता
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-2 py-1.5 xl:px-2.5 rounded-lg text-xs xl:text-sm font-semibold transition-all ${activeTab === 'gallery' ? 'bg-[#d14307] text-white shadow-sm' : 'text-[#5a4139] hover:text-[#a93200] hover:bg-[#ffe9e5]'}`}
            >
              उत्सव गॅलरी
            </button>

            <button
              onClick={() => setActiveTab('vargani')}
              className={`px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-semibold transition-all ${activeTab === 'vargani' ? 'bg-[#d14307] text-white shadow-sm' : 'text-[#5a4139] hover:text-[#a93200] hover:bg-[#ffe9e5]'}`}
            >
              वर्गणी देणगी द्या
            </button>

            {/* Logged in Devotee Profile Chip or Login Button */}
            {userSession ? (
              <div className="flex items-center gap-1.5 bg-[#fff0ee] p-1 pl-2 rounded-xl border border-[#fe932c] shadow-xs shrink-0">
                <div className="w-6 h-6 rounded-full bg-[#d14307] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {userSession.name ? userSession.name.charAt(0) : 'भ'}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-[#281714] text-[11px] leading-tight truncate max-w-[85px]">
                    {userSession.name}
                  </span>
                  <span className={`text-[8px] font-bold ${userSession.isApproved || userSession.status === 'APPROVED' ? 'text-[#006b2c]' : 'text-amber-700'}`}>
                    {userSession.isApproved || userSession.status === 'APPROVED' ? '✓ मंजूर' : '⏳ पेंडिंग'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem('ymm_user_session');
                    window.location.reload();
                  }}
                  title="बाहेर पडा (Logout)"
                  className="text-xs font-bold text-red-600 hover:bg-red-100 p-0.5 px-1 rounded transition-colors"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="bg-[#d14307] hover:bg-[#a93200] text-white px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-semibold transition-all flex items-center gap-1 shadow-sm shrink-0"
              >
                <span className="material-symbols-outlined text-[15px]">vpn_key</span>
                <span>लॉगिन</span>
              </button>
            )}

            {/* Vyavasthapak Button: Always fits perfectly */}
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-2.5 py-1.5 rounded-lg text-xs xl:text-sm font-semibold transition-all flex items-center gap-1 shrink-0 ${activeTab === 'admin' ? 'bg-[#402b28] text-white shadow-sm' : 'bg-stone-100 hover:bg-stone-200 text-[#402b28] border border-stone-300'}`}
              title="व्यवस्थापक / खजिनदार ॲक्सेस"
            >
              <span className="material-symbols-outlined text-[17px]">admin_panel_settings</span>
              <span>व्यवस्थापक</span>
            </button>
          </nav>

          {/* Mobile/Tablet Hamburger Menu Toggle Button (< lg screens) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-xl bg-[#d14307] hover:bg-[#a93200] text-white flex items-center justify-center shadow-md shrink-0 focus:outline-none transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-xl">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </header>

      {/* Mobile/Tablet Slide-Over Navigation Drawer (< lg screens) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[90] flex justify-end animate-fadeIn">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Drawer Panel */}
          <div className="relative w-4/5 max-w-xs bg-gradient-to-b from-[#FFFDF9] via-[#FFF8F6] to-[#FFE9E5] h-full shadow-2xl p-5 flex flex-col justify-between border-l-2 border-[#d14307] z-10 overflow-y-auto">
            <div>
              {/* Drawer Top Branding */}
              <div className="flex items-center justify-between border-b border-[#fe932c]/30 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                  <div className="text-left">
                    <span className="text-[9px] text-[#d14307] font-bold block leading-tight">॥ मानाचा गणपती ॥</span>
                    <span className="font-headline font-bold text-xs text-[#a93200]">यंगस्टार मित्र मंडळ</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-7 h-7 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>

              {/* User Profile Card */}
              {userSession ? (
                <div className="bg-white p-3 rounded-2xl border border-[#fe932c]/50 mb-4 shadow-sm flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#d14307] text-white font-bold flex items-center justify-center text-sm shrink-0">
                    {userSession.name ? userSession.name.charAt(0) : 'भ'}
                  </div>
                  <div className="flex flex-col text-left overflow-hidden">
                    <span className="font-bold text-[#281714] text-xs truncate">{userSession.name}</span>
                    <span className={`text-[9px] font-bold ${userSession.isApproved || userSession.status === 'APPROVED' ? 'text-[#006b2c]' : 'text-amber-700'}`}>
                      {userSession.isApproved || userSession.status === 'APPROVED' ? '✓ ॲक्सेस मंजूर' : '⏳ ॲक्सेस पेंडिंग'}
                    </span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full bg-[#d14307] hover:bg-[#a93200] text-white p-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 mb-4 shadow-sm"
                >
                  <span className="material-symbols-outlined text-base">vpn_key</span>
                  <span>लॉगिन / नोंदणी करा</span>
                </button>
              )}

              {/* Drawer Links */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setActiveTab('home');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full p-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-all ${activeTab === 'home' ? 'bg-[#d14307] text-white shadow-md' : 'bg-white text-[#281714] hover:bg-[#ffe9e5]'}`}
                >
                  <span className="material-symbols-outlined text-lg">home</span>
                  <span>मुख्यपृष्ठ (Home)</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('schedule');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full p-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-all ${activeTab === 'schedule' ? 'bg-[#d14307] text-white shadow-md' : 'bg-white text-[#281714] hover:bg-[#ffe9e5]'}`}
                >
                  <span className="material-symbols-outlined text-lg">calendar_month</span>
                  <span>कार्यक्रम तक्ता (Schedule)</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('gallery');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full p-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-all ${activeTab === 'gallery' ? 'bg-[#d14307] text-white shadow-md' : 'bg-white text-[#281714] hover:bg-[#ffe9e5]'}`}
                >
                  <span className="material-symbols-outlined text-lg">photo_library</span>
                  <span>उत्सव गॅलरी (Gallery)</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('vargani');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full p-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-all ${activeTab === 'vargani' ? 'bg-[#d14307] text-white shadow-md' : 'bg-white text-[#281714] hover:bg-[#ffe9e5]'}`}
                >
                  <span className="material-symbols-outlined text-lg">volunteer_activism</span>
                  <span>वर्गणी देणगी द्या (Vargani)</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('admin');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full p-3 rounded-xl text-xs font-bold flex items-center gap-3 transition-all ${activeTab === 'admin' ? 'bg-[#402b28] text-white shadow-md' : 'bg-white text-[#281714] hover:bg-[#ffe9e5]'}`}
                >
                  <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                  <span>व्यवस्थापक / खजिनदार (Admin)</span>
                </button>

                <button
                  onClick={() => {
                    setShowTributeModal(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full p-3 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-3"
                >
                  <span className="material-symbols-outlined text-lg text-[#d14307]">workspace_premium</span>
                  <span>स्मृतीगंध आदरांजली</span>
                </button>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-[#fe932c]/30 text-center">
              <p className="text-[10px] text-[#5a4139] font-bold">
                सार्वजनिक गणेशोत्सव {festivalYear} • श्रीक्षेत्र देहुगाव
              </p>
              {userSession && (
                <button
                  onClick={() => {
                    localStorage.removeItem('ymm_user_session');
                    window.location.reload();
                  }}
                  className="mt-2 text-xs font-bold text-red-600 bg-red-50 w-full py-1.5 rounded-lg border border-red-200"
                >
                  बाहेर पडा (Logout)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tribute Pop-Up Screen / Modal */}
      {showTributeModal && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
          onClick={() => setShowTributeModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-b from-[#FFFDF9] via-[#FFF8F6] to-[#FFE9E5] max-w-md sm:max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-3xl p-5 sm:p-7 shadow-2xl border-2 sm:border-4 border-[#d14307] text-center relative my-auto scrollbar-thin"
          >
            {/* Top Close Button */}
            <button
              onClick={() => setShowTributeModal(false)}
              className="absolute top-3.5 right-3.5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#d14307] text-white font-bold flex items-center justify-center shadow-md hover:bg-[#a93200] transition-colors"
            >
              ✕
            </button>

            {/* Auspicious Badge */}
            <div className="inline-block bg-[#d14307] text-white text-[11px] sm:text-xs px-3.5 py-1 rounded-full font-bold uppercase tracking-wider mb-3 shadow-md">
              ॥ भावपूर्ण आदरांजली • स्मृतिगंध ॥
            </div>

            {/* High-res Photo Frame (Cut-to-cut photo, no white inner padding) */}
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-2xl overflow-hidden border-2 border-[#d14307] shadow-2xl mx-auto mb-4">
              <img
                src="/Shreyas_dada.jpg"
                alt="कै. कु. श्रेयस अशोक परंडवाल"
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Name & Titles */}
            <h2 className="font-headline text-xl sm:text-2xl text-[#a93200] font-bold mb-3">
              कै. कु. श्रेयस अशोक परंडवाल
            </h2>

            {/* Tribute Message Card */}
            <div className="bg-white/90 p-3.5 sm:p-4 rounded-2xl border border-[#fe932c]/50 text-xs sm:text-sm text-[#281714] leading-relaxed font-medium mb-4 shadow-inner text-left">
              <p className="text-center font-bold text-[#d14307] mb-1.5 text-xs sm:text-sm">
                "आपल्या आठवणी सदैव आमच्या हृदयात अमर राहतील!"
              </p>
              <p className="text-[#5a4139] leading-relaxed text-[11px] sm:text-xs">
                अखंड भक्ती, जल्लोष, सामाजिक बांधिलकी आणि 'यंगस्टार मित्र मंडळ' च्या प्रत्येक गणेशोत्सवात व कार्यक्रमात सदैव हिरीरीने पुढे राहणारे आमचे लाडके श्रेयस दादा. तुमचे प्रेम, मार्गदर्शन व आठवणी मंडळाच्या प्रत्येक सभासदाच्या मनात कायम प्रेरणा देत राहतील.
              </p>
              <div className="mt-3 pt-2.5 border-t border-[#ffe9e5] text-center font-bold text-[#a93200] text-[11px] sm:text-xs">
                — नम्र अभिवादन: समस्त यंगस्टार मित्र मंडळ परिवार, माळीनगर - श्रीक्षेत्र देहुगाव —
              </div>
            </div>

            {/* Action Close Button */}
            <button
              onClick={() => setShowTributeModal(false)}
              className="bg-[#d14307] hover:bg-[#a93200] text-white px-7 py-2 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all border-2 border-[#fe932c]"
            >
              बंद करा (Close) ✕
            </button>
          </div>
        </div>
      )}

      {/* Logo Double-Click Lightbox Modal */}
      {showLogoModal && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowLogoModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-md sm:max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-[#d14307] text-center relative animate-scaleUp"
          >
            {/* Top Close Button */}
            <button
              onClick={() => setShowLogoModal(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#d14307] text-white font-bold flex items-center justify-center shadow-md hover:bg-[#a93200] transition-colors"
            >
              ✕
            </button>

            {/* Title Badge */}
            <div className="inline-block bg-[#fe932c]/20 text-[#904d00] text-xs px-3.5 py-1 rounded-full font-bold mb-4 border border-[#fe932c]/40">
              ॥ अधिकृत बोधचिन्ह (Official Logo) ॥
            </div>

            {/* High-res Logo Preview Container */}
            <div className="bg-gradient-to-b from-[#fff0ee] via-white to-[#fff0ee] p-4 sm:p-6 rounded-2xl border border-[#fe932c]/40 shadow-inner mb-4 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="यंगस्टार मित्र मंडळ Logo High Res"
                className="w-full h-auto max-h-72 object-contain drop-shadow-xl"
              />
            </div>

            <h3 className="font-headline text-xl sm:text-2xl font-bold text-[#a93200]">
              यंगस्टार मित्र मंडळ
            </h3>
            <p className="text-xs sm:text-sm text-[#5a4139] font-semibold mt-1">
              माळीनगर - श्रीक्षेत्र देहुगाव, ता. हवेली, जि. पुणे • स्थापना वर्ष १९७७
            </p>

            <button
              onClick={() => setShowLogoModal(false)}
              className="mt-6 bg-[#d14307] hover:bg-[#a93200] text-white px-8 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all border-2 border-[#fe932c]"
            >
              बंद करा (Close) ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}

