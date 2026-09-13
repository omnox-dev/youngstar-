import React, { useState, useEffect, useRef } from 'react';
import VarganiPustak from '../components/VarganiPustak';

export default function Home({ setActiveTab, settings, userSession, onOpenAuth }) {
  const festivalYear = settings?.festivalYear || '२०२६';
  const editionText = settings?.editionText || '४९ वे वर्ष';

  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [varganiRecords, setVarganiRecords] = useState([]);
  const [showPustak, setShowPustak] = useState(false);

  // Hero section scroll & entrance animation state
  const heroRef = useRef(null);
  const [animateHeroText, setAnimateHeroText] = useState(false);
  const [isImageOnlyMode, setIsImageOnlyMode] = useState(false);

  useEffect(() => {
    fetchEvents();
    fetchGallery();
    fetchVargani();
  }, [festivalYear]);

  // Observer to trigger animation when Hero section enters viewport,
  // hide words when scrolled down, and re-animate when scrolled back up
  useEffect(() => {
    let timer = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // 1. User sees background image first
          // 2. After a short delay (400ms), animation of info comes in
          timer = setTimeout(() => {
            setAnimateHeroText(true);
          }, 400);
        } else {
          // When user scrolls down away from hero, words go away
          if (timer) clearTimeout(timer);
          setAnimateHeroText(false);
        }
      },
      {
        threshold: 0.25, // Triggers when 25% of hero is in viewport
      }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (timer) clearTimeout(timer);
      if (heroRef.current) observer.unobserve(heroRef.current);
    };
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`/api/events?year=${festivalYear}`);
      const data = await res.json();
      if (data.success) {
        setEvents(data.events || []);
      } else {
        setEvents([]);
      }
    } catch (e) {
      setEvents([]);
    }
  };

  const fetchGallery = async () => {
    try {
      const res = await fetch(`/api/gallery?year=${festivalYear}`);
      const data = await res.json();
      if (data.success) {
        setGallery(data.gallery || []);
      } else {
        setGallery([]);
      }
    } catch (e) {
      setGallery([]);
    }
  };

  const fetchVargani = async () => {
    try {
      const res = await fetch(`/api/vargani?year=${festivalYear}`);
      const data = await res.json();
      if (data.success) {
        setVarganiRecords(data.records || []);
      } else {
        setVarganiRecords([]);
      }
    } catch (e) {
      setVarganiRecords([]);
    }
  };

  // Determine whether hero text should be visible (scroll triggered & not hidden by image click)
  const showHeroText = animateHeroText && !isImageOnlyMode;

  return (
    <div className="flex flex-col w-full min-h-screen">
      
      {/* 1. Hero Section with Dynamic Edition, Scroll Animation & Click Image-Only Mode */}
      <section 
        ref={heroRef} 
        onClick={() => setIsImageOnlyMode(prev => !prev)}
        className="relative w-full overflow-hidden min-h-[540px] flex items-center justify-center pt-8 pb-16 cursor-pointer select-none group"
        title={isImageOnlyMode ? "क्लिक करून मजकूर पुन्हा दाखवा" : "क्लिक करून केवळ फोटो पाहा"}
      >
        {/* Hero Image */}
        <div 
          className={`absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 ${
            showHeroText ? 'scale-105' : 'scale-100'
          }`}
          style={{ backgroundImage: `url('/pandal_hero.jpg')` }}
        ></div>
        
        {/* Overlay Gradient (Lightens in Image-Only Mode for full clarity) */}
        <div 
          className={`absolute inset-0 z-10 transition-opacity duration-700 ${
            isImageOnlyMode 
              ? 'bg-black/20 opacity-40' 
              : 'bg-gradient-to-t from-black/90 via-black/60 to-black/40 opacity-100'
          }`}
        ></div>

        {/* Small floating tip when in image-only mode */}
        {isImageOnlyMode && (
          <div className="absolute top-6 right-6 z-30 bg-black/80 text-white text-xs px-4 py-2 rounded-full border border-[#fe932c]/60 backdrop-blur-md shadow-xl flex items-center gap-2 animate-bounce">
            <span className="material-symbols-outlined text-[16px] text-[#fe932c]">photo_camera</span>
            <span className="font-medium">केवळ फोटो व्ह्यू • मजकूर दाखवण्यासाठी कुठेही क्लिक करा</span>
          </div>
        )}

        <div className="relative z-20 max-w-[1140px] mx-auto px-4 text-center flex flex-col items-center">
          {/* Badge */}
          <div 
            style={{ transitionDelay: showHeroText ? '0ms' : '0ms' }}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-[#fe932c]/50 shadow-md mb-6 text-[#fe932c] transition-all duration-700 ease-out transform ${
              showHeroText 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 -translate-y-6 scale-95 pointer-events-none'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] text-[#fe932c]">workspace_premium</span>
            <span className="text-xs sm:text-sm font-bold">॥ मानाचा गणपती • {editionText} ॥</span>
            <span className="text-xs text-white/60">•</span>
            <span className="text-xs sm:text-sm text-white font-bold">॥ गणेशोत्सव {festivalYear} ॥</span>
          </div>

          {/* Title - Youngstar Mitra Mandal */}
          <h1 
            style={{ transitionDelay: showHeroText ? '150ms' : '0ms' }}
            className={`font-headline text-3xl sm:text-5xl text-white max-w-3xl font-bold tracking-tight mb-4 drop-shadow-lg leading-tight transition-all duration-700 ease-out transform ${
              showHeroText 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-10 scale-95 pointer-events-none'
            }`}
          >
            यंगस्टार मित्र मंडळ आपले मनःपूर्वक स्वागत करत आहे
          </h1>

          {/* Subheading */}
          <p 
            style={{ transitionDelay: showHeroText ? '300ms' : '0ms' }}
            className={`font-headline text-lg sm:text-2xl text-[#fe932c] font-bold mb-4 drop-shadow-md transition-all duration-700 ease-out transform ${
              showHeroText 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-10 scale-95 pointer-events-none'
            }`}
          >
            गणपती बाप्पा मोरया! मंगलमूर्ती मोरया!
          </p>

          {/* Description */}
          <p 
            style={{ transitionDelay: showHeroText ? '450ms' : '0ms' }}
            className={`text-sm sm:text-base text-white/90 font-medium max-w-2xl mx-auto mb-8 leading-relaxed drop-shadow transition-all duration-700 ease-out transform ${
              showHeroText 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-10 scale-95 pointer-events-none'
            }`}
          >
            माळीनगर - देहुगाव, ता. हवेली, जि. पुणे येथे अखंड भक्ती, परंपरा आणि सामाजिक बांधिलकीची {editionText} सोहळा. बाप्पाच्या दर्शनाचा व उत्सवाचा दिव्य आनंद घ्या.
          </p>

          {/* Quick Action options */}
          <div 
            style={{ transitionDelay: showHeroText ? '600ms' : '0ms' }}
            className={`flex flex-wrap items-center justify-center gap-4 transition-all duration-700 ease-out transform ${
              showHeroText 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-10 scale-95 pointer-events-none'
            }`}
          >
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab('vargani');
              }}
              className="bg-[#00873a] hover:bg-[#006b2c] text-white px-7 py-3 rounded-xl font-bold text-sm shadow-lg transition-all border-2 border-emerald-400"
            >
              🌸 वर्गणी / देणगी द्या
            </button>
            {userSession ? (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="bg-black/70 backdrop-blur-md px-6 py-2 rounded-xl border-2 border-[#fe932c] flex items-center gap-3 text-white shadow-lg"
              >
                <div className="w-8 h-8 rounded-full bg-[#d14307] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {userSession.name ? userSession.name.charAt(0) : 'भ'}
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-[#fe932c]">सस्नेह नमस्कार, {userSession.name}</span>
                  <span className={`text-[10px] font-bold ${userSession.isApproved || userSession.status === 'APPROVED' ? 'text-emerald-400' : 'text-amber-300'}`}>
                    {userSession.isApproved || userSession.status === 'APPROVED' ? '✓ ॲक्सेस मंजूर (Approved Member)' : '⏳ ॲक्सेस प्रलंबित (Pending Approval)'}
                  </span>
                </div>
              </div>
            ) : (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenAuth();
                }}
                className="bg-[#d14307] hover:bg-[#a93200] text-white px-7 py-3 rounded-xl font-bold text-sm shadow-lg transition-all border-2 border-[#fe932c]"
              >
                🔑 लॉगिन / सभासद नोंदणी
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. REQUIREMENT 11: 4 Main Options Strip on Homepage */}
      <section className="w-full bg-[#ffe9e5] py-8 border-y border-[#ffe2dd]">
        <div className="max-w-[1140px] mx-auto px-4">
          <div className="text-center mb-6">
            <span className="text-xs font-bold text-[#a93200] uppercase tracking-wider">॥ मुख्य पर्याय ॥</span>
            <h2 className="font-headline text-xl sm:text-2xl font-bold text-[#281714]">मंडळ सेवा व सुविधा केंद्र</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Option 1: Login / Register / Profile */}
            <div 
              onClick={onOpenAuth}
              className="bg-white p-5 rounded-2xl shadow-sm border border-[#ffe9e5] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#d14307] text-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">
                    {userSession ? 'account_circle' : 'vpn_key'}
                  </span>
                </div>
                <h3 className="font-headline text-base font-bold text-[#281714]">
                  {userSession ? `१) सभासद प्रोफाइल` : '१) लॉगिन व नोंदणी'}
                </h3>
                <p className="text-xs text-[#5a4139] mt-1">
                  {userSession ? `${userSession.name} • ${userSession.isApproved || userSession.status === 'APPROVED' ? '✓ ॲक्सेस मंजूर' : '⏳ ॲक्सेस प्रलंबित'}` : 'सुरक्षित ॲक्सेस, शेरा (Remarks) व पूर्ण पावत्या पाहण्यासाठी नोंदणी करा.'}
                </p>
              </div>
              <span className="text-xs font-bold text-[#a93200] mt-4 flex items-center gap-1 group-hover:underline">
                {userSession ? 'प्रोफाईल पहा / स्टेटस →' : 'लॉगिन / नोंदणी करा →'}
              </span>
            </div>

            {/* Option 2: Give Donations */}
            <div 
              onClick={() => setActiveTab('vargani')}
              className="bg-white p-5 rounded-2xl shadow-sm border border-[#ffe9e5] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#00873a] text-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">payments</span>
                </div>
                <h3 className="font-headline text-base font-bold text-[#281714]">२) वर्गणी देणगी द्या</h3>
                <p className="text-xs text-[#5a4139] mt-1">
                  गणेशोत्सव व गणेश जयंतीसाठी ऑनलाइन, नगद किंवा Pay Later पर्याय.
                </p>
              </div>
              <span className="text-xs font-bold text-[#006b2c] mt-4 flex items-center gap-1 group-hover:underline">
                वर्गणी जमा करा →
              </span>
            </div>

            {/* Option 3: Graphic Vargani Pustak */}
            <div 
              onClick={() => setShowPustak(!showPustak)}
              className="bg-white p-5 rounded-2xl shadow-sm border border-[#ffe9e5] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#fe932c] text-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">menu_book</span>
                </div>
                <h3 className="font-headline text-base font-bold text-[#281714]">३) वर्गणी पुस्तक (Ledger)</h3>
                <p className="text-xs text-[#5a4139] mt-1">
                  चित्रमय पावती पुस्तक व सर्व जमा पावत्यांचा लेजर स्टब पहा.
                </p>
              </div>
              <span className="text-xs font-bold text-[#904d00] mt-4 flex items-center gap-1 group-hover:underline">
                {showPustak ? 'पुस्तक बंद करा' : 'पावती पुस्तक उघडा →'}
              </span>
            </div>

            {/* Option 4: Events & Reminders */}
            <div 
              onClick={() => {
                const el = document.getElementById('event-chart-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white p-5 rounded-2xl shadow-sm border border-[#ffe9e5] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#402b28] text-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">event_note</span>
                </div>
                <h3 className="font-headline text-base font-bold text-[#281714]">४) कार्यक्रम व स्मरणपत्रे</h3>
                <p className="text-xs text-[#5a4139] mt-1">
                  उत्सवातील दैनंदिन धार्मिक कार्यक्रम, वेळ व रिमाइंडर अपडेट्स.
                </p>
              </div>
              <span className="text-xs font-bold text-[#402b28] mt-4 flex items-center gap-1 group-hover:underline">
                कार्यक्रम चार्ट पहा ↓
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Graphic Vargani Pustak Toggleable View */}
      {showPustak && (
        <section className="max-w-[1140px] mx-auto px-4 w-full">
          <VarganiPustak 
            records={varganiRecords} 
            festivalYear={festivalYear} 
            editionText={editionText} 
          />
        </section>
      )}

      {/* 3. REQUIREMENT 3: Event Chart BEFORE Gallery */}
      <section id="event-chart-section" className="w-full py-12 bg-[#fff8f6]">
        <div className="max-w-[1140px] mx-auto px-4 flex flex-col gap-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 pb-2 border-b border-[#ffe9e5]">
            <div>
              <span className="text-xs font-bold text-[#a93200] uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                <span>दैनंदिन उत्सव कार्यक्रम तक्ता (Event Chart)</span>
              </span>
              <h2 className="font-headline text-2xl font-bold text-[#281714] mt-1">
                गणेशोत्सव {festivalYear} कार्यक्रम तक्ता
              </h2>
            </div>
            <span className="text-xs text-[#5a4139] bg-[#ffe9e5] px-3 py-1 rounded-full font-bold">
              वेळ, तारीख व फोटोंसह थेट तक्ता
            </span>
          </div>

          {events.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-[#ffe9e5] text-center shadow-sm">
              <span className="material-symbols-outlined text-[#a93200] text-[36px] mb-2">event_busy</span>
              <h3 className="font-headline text-lg font-bold text-[#281714]">अद्याप कोणतेही कार्यक्रम जोडलेले नाहीत</h3>
              <p className="text-xs text-[#5a4139] mt-1">
                व्यवस्थापकांकडून नवीन दैनंदिन कार्यक्रम लवकरच जोडले जातील.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {events.map((ev, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-[#ffe9e5] shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group">
                  <div className="h-44 overflow-hidden relative">
                    <img src={ev.photo_url || '/pandal_hero.jpg'} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                    <div className="absolute top-3 left-3 bg-[#a93200] text-white text-[11px] px-2.5 py-1 rounded-full font-bold shadow-md">
                      {ev.event_date}
                    </div>
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-grow gap-2">
                    <h3 className="font-headline text-base font-bold text-[#281714]">{ev.title}</h3>
                    <p className="text-xs text-[#5a4139]">{ev.description}</p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-[#ffe9e5] text-xs">
                      <span className="flex items-center gap-1 font-bold text-[#d14307]">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        <span>{ev.event_time}</span>
                      </span>
                      <span className="text-[11px] text-[#006b2c] font-bold">माळीनगर, देहुगाव</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 4. REQUIREMENT 3: Gallery Section AT THE BOTTOM */}
      <section className="w-full py-12 bg-[#ffe9e5] border-t border-[#ffe2dd]">
        <div className="max-w-[1140px] mx-auto px-4 flex flex-col gap-6">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-[#a93200] uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">photo_library</span>
                <span>उत्सव स्मृती व फोटो गॅलरी (Bottom Gallery)</span>
              </span>
              <h2 className="font-headline text-2xl font-bold text-[#281714] mt-1">
                यंगस्टार उत्सव {festivalYear} फोटो गॅलरी
              </h2>
            </div>
            <span className="text-xs text-[#5a4139] font-medium">
              प्रशासकांद्वारे फोटोंची नियमित भर घालण्यात येते.
            </span>
          </div>

          {gallery.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-[#ffe9e5] text-center shadow-sm">
              <span className="material-symbols-outlined text-[#a93200] text-[36px] mb-2">no_photography</span>
              <h3 className="font-headline text-lg font-bold text-[#281714]">अद्याप कोणतेही फोटो जोडलेले नाहीत</h3>
              <p className="text-xs text-[#5a4139] mt-1">
                प्रशासक व्यवस्थापन दालनातून उत्सव फोटो जोडले जातील.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {gallery.map((g, idx) => (
                <div key={g.id || idx} className="bg-white rounded-2xl overflow-hidden shadow-md border border-[#ffe9e5] group flex flex-col">
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={g.photo_url || '/aarti.jpg'} 
                      alt={g.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                      <span className="text-[10px] text-[#d14307] font-bold uppercase tracking-wider">गणेशोत्सव फोटो</span>
                      <h3 className="font-headline text-base font-bold text-[#281714] mt-0.5">{g.title}</h3>
                      <p className="text-xs text-[#5a4139] mt-1">{g.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

    </div>
  );
}


