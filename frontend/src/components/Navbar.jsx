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

  const [showTributeModal, setShowTributeModal] = useState(false);
  const [showLogoModal, setShowLogoModal] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FFF8F6]/95 backdrop-blur-md shadow-md no-print border-b border-[#ffe9e5]">
        {/* Auspicious Top Banner Strip with Center Establishment Year */}
        <div className="bg-gradient-to-r from-[#d14307] via-[#a93200] to-[#800000] text-white text-center py-1 px-4">
          <div className="max-w-[1140px] mx-auto flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
            {/* Top Left Mini Notice */}
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-[#ffe9e5]">
              <span>॥ मानाचा गणपती ॥</span>
            </div>

            {/* Center Establishment Year & Dynamic Edition Count */}
            <p className="tracking-wider uppercase font-bold flex items-center justify-center gap-2 mx-auto text-xs sm:text-sm">
              <span>॥ श्री गणेशाय नमः ॥</span>
              <span>•</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-white font-headline">
                स्थापना वर्ष : {estYear} • {editionText}
              </span>
              <span>•</span>
              <span>यंगस्टार मित्र मंडळ</span>
            </p>
          </div>
        </div>

        {/* Main Navbar Container */}
        <div className="max-w-[1140px] mx-auto px-4 py-2 flex items-center justify-between gap-2 sm:gap-4">

          {/* Left Side: Logo & Brand (Single Click = Home, Double Click = Open Logo Lightbox) */}
          <button
            onClick={() => setActiveTab('home')}
            onDoubleClick={(e) => {
              e.stopPropagation();
              setShowLogoModal(true);
            }}
            className="flex items-center gap-2.5 text-left shrink-0 group/logo select-none"
            title="मुख्यपृष्ठावर जाण्यासाठी सिंगल-क्लिक करा • लोगो मोठा करून पाहण्यासाठी डबल-क्लिक करा"
          >
            <img
              alt="यंगस्टार मित्र मंडळ Logo"
              className="h-14 sm:h-16 w-auto rounded-lg object-contain drop-shadow-md shrink-0 transform group-hover/logo:scale-105 transition-transform duration-300"
              src="/logo.png"
            />
            <div className="hidden sm:flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-headline text-lg sm:text-xl text-[#a93200] font-bold">
                  यंगस्टार मित्र मंडळ
                </span>
                <span className="bg-[#fe932c]/20 text-[#904d00] text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {editionText}
                </span>
              </div>
              <span className="text-[11px] text-[#5a4139] font-medium">
                सार्वजनिक गणेशोत्सव {festivalYear} • देहुगाव (चित्र पाहण्यासाठी डबल-क्लिक करा)
              </span>
            </div>
          </button>

          {/* Middle of Header: Shreyas Dada Tribute Photo (Cut-to-cut image, no extra nested frames) */}
          <div
            onClick={() => setShowTributeModal(true)}
            className="flex items-center gap-2 cursor-pointer group shrink-0 transition-transform hover:scale-105"
            title="श्रद्धांजली मेसेज पाहण्यासाठी क्लिक करा"
          >
            <img
              src="/Shreyas_dada.jpg"
              alt="कै. श्रेयस (डिंग्या) बाळू परंदवळ"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover object-top shadow-xl shrink-0 border-2 border-[#d14307]"
            />
            <div className="hidden lg:flex flex-col text-left">
              <div className="flex items-center gap-1">
                <span className="text-[9px] bg-[#d14307] text-white px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                  स्मृतिगंध
                </span>
                <span className="text-[9px] text-[#006b2c] font-bold">
                  (👆 क्लिक करा)
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-[#281714] leading-tight drop-shadow-sm mt-0.5 group-hover:text-[#a93200]">
                कै. श्रेयस (डिंग्या) परंदवळ
              </span>
              <span className="text-[9px] text-[#5a4139] font-semibold">भावपूर्ण आदरांजली 🙏</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${activeTab === 'home' ? 'bg-[#d14307] text-white shadow-sm' : 'text-[#5a4139] hover:text-[#a93200] hover:bg-[#ffe9e5]'}`}
            >
              मुख्यपृष्ठ
            </button>

            <button
              onClick={() => setActiveTab('vargani')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${activeTab === 'vargani' ? 'bg-[#d14307] text-white shadow-sm' : 'text-[#5a4139] hover:text-[#a93200] hover:bg-[#ffe9e5]'}`}
            >
              वर्गणी देणगी द्या
            </button>

            {/* Logged in Devotee Profile Chip or Login Button */}
            {userSession ? (
              <div className="flex items-center gap-2 bg-[#fff0ee] p-1.5 pl-2.5 rounded-xl border border-[#fe932c] shadow-xs">
                <div className="w-7 h-7 rounded-full bg-[#d14307] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {userSession.name ? userSession.name.charAt(0) : 'भ'}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="font-bold text-[#281714] text-xs leading-tight truncate max-w-[110px]">
                    {userSession.name}
                  </span>
                  <span className={`text-[9px] font-bold ${userSession.isApproved || userSession.status === 'APPROVED' ? 'text-[#006b2c]' : 'text-amber-700'}`}>
                    {userSession.isApproved || userSession.status === 'APPROVED' ? '✓ ॲक्सेस मंजूर' : '⏳ ॲक्सेस पेंडिंग'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem('ymm_user_session');
                    window.location.reload();
                  }}
                  title="बाहेर पडा (Logout)"
                  className="text-xs font-bold text-red-600 hover:bg-red-100 p-1 px-1.5 rounded transition-colors"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="bg-[#d14307] hover:bg-[#a93200] text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">vpn_key</span>
                <span>लॉगिन / नोंदणी</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1 ${activeTab === 'admin' ? 'bg-[#402b28] text-white' : 'text-[#5a4139] hover:text-[#a93200]'}`}
            >
              <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
              <span className="hidden md:inline">व्यवस्थापक</span>
            </button>
          </nav>
        </div>
      </header>

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
                alt="कै. श्रेयस (डिंग्या) बाळू परंदवळ"
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Name & Titles */}
            <h2 className="font-headline text-xl sm:text-2xl text-[#a93200] font-bold mb-0.5">
              कै. श्रेयस बाळू परंदवळ
            </h2>
            <p className="text-xs sm:text-sm font-bold text-[#fe932c] mb-3">
              (उर्फ डिंग्या बाळू परंदवळ)
            </p>

            {/* Tribute Message Card */}
            <div className="bg-white/90 p-3.5 sm:p-4 rounded-2xl border border-[#fe932c]/50 text-xs sm:text-sm text-[#281714] leading-relaxed font-medium mb-4 shadow-inner text-left">
              <p className="text-center font-bold text-[#d14307] mb-1.5 text-xs sm:text-sm">
                "आपल्या आठवणी सदैव आमच्या हृदयात अमर राहतील!"
              </p>
              <p className="text-[#5a4139] leading-relaxed text-[11px] sm:text-xs">
                अखंड भक्ती, जल्लोष, सामाजिक बांधिलकी आणि 'यंगस्टार मित्र मंडळ' च्या प्रत्येक गणेशोत्सवात व कार्यक्रमात सदैव हिरीरीने पुढे राहणारे आमचे लाडके श्रेयस दादा. तुमचे प्रेम, मार्गदर्शन व आठवणी मंडळाच्या प्रत्येक सभासदाच्या मनात कायम प्रेरणा देत राहतील.
              </p>
              <div className="mt-3 pt-2.5 border-t border-[#ffe9e5] text-center font-bold text-[#a93200] text-[11px] sm:text-xs">
                — नम्र अभिवादन: समस्त यंगस्टार मित्र मंडळ परिवार, माळीनगर - देहुगाव —
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
              माळीनगर - देहुगाव, ता. हवेली, जि. पुणे • स्थापना वर्ष १९७७
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

