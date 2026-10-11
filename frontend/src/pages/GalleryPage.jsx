import React, { useState, useEffect } from 'react';

function toMarathiDigits(num) {
  if (!num) return '';
  const marathiDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return num.toString().replace(/\d/g, d => marathiDigits[d]);
}

export default function GalleryPage({ setActiveTab, settings }) {
  const activeFestivalYear = settings?.festivalYear || '2026';
  const editionText = settings?.editionText || '४९ वे वर्ष';
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [galleryList, setGalleryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  const fallbackPhotos = [
    { id: 1, title: 'भव्य मंडप व श्रींचे विलोभनीय रूप', description: 'श्रीक्षेत्र देहुगाव येथील मानाच्या गणपतीचा नयनरम्य उत्सव देखावा.', photo_url: '/pandal_hero.jpg', festival_year: '2026' },
    { id: 2, title: 'सामूहिक संध्या महाआरती', description: 'शेकडो भाविकांच्या उपस्थितीत पार पडलेली भावपूर्ण संध्या आरती.', photo_url: '/aarti.jpg', festival_year: '2026' },
    { id: 3, title: 'मोदक महाप्रसाद सेवा', description: 'उत्सवातील महाप्रसाद वितरण व स्वयंसेवकांची अखंड सेवा.', photo_url: '/mahaprasad.jpg', festival_year: '2026' },
    { id: 4, title: '२०२५ भव्य विसर्जन मिरवणूक', description: 'मागील वर्षातील अविस्मरणीय ढोल-ताशा वादन व निरोप सोहळा.', photo_url: '/dhol_tasha.jpg', festival_year: '2025' },
    { id: 5, title: '२०२५ श्रींचे सुवर्ण अलंकार दर्शन', description: '२०२५ मधील गणेशोत्सवाचा दिव्य सुवर्ण शृंगार.', photo_url: '/pandal_hero.jpg', festival_year: '2025' },
    { id: 6, title: '२०२४ महाप्रसाद व रक्तदान सोहळा', description: 'सामाजिक बांधिलकी जपणारा २०२४ मधील आरोग्य उपक्रम.', photo_url: '/mahaprasad.jpg', festival_year: '2024' },
    { id: 7, title: '२०२४ पारंपरिक ढोल-ताशा पथक', description: 'तरुणाईचा उत्साह आणि पारंपरिक मराठी संस्कृतीचे दर्शन.', photo_url: '/dhol_tasha.jpg', festival_year: '2024' }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [selectedYear]);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const url = selectedYear === 'ALL' ? '/api/gallery' : `/api/gallery?year=${selectedYear}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.gallery && data.gallery.length > 0) {
        setGalleryList(data.gallery);
      } else {
        const filtered = selectedYear === 'ALL' 
          ? fallbackPhotos 
          : fallbackPhotos.filter(p => p.festival_year === selectedYear);
        setGalleryList(filtered);
      }
    } catch (e) {
      const filtered = selectedYear === 'ALL' 
        ? fallbackPhotos 
        : fallbackPhotos.filter(p => p.festival_year === selectedYear);
      setGalleryList(filtered);
    } finally {
      setLoading(false);
    }
  };

  // Group photos by year when "ALL" is selected
  const availableYears = ['ALL', '2026', '2025', '2024'];

  const displayedPhotos = selectedYear === 'ALL' 
    ? galleryList 
    : galleryList.filter(p => (p.festival_year || '2026') === selectedYear);

  return (
    <div className="max-w-[1140px] mx-auto px-4 py-8 flex flex-col gap-8 animate-fade-in">

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#ffe9e5] via-[#fff0ee] to-[#fff8f6] p-6 sm:p-8 rounded-3xl border border-[#fe932c]/30 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#fe932c] via-[#d14307] to-[#800000]"></div>
        
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-[#904d00] text-xs font-bold mb-3 shadow-xs border border-[#fe932c]/30">
            <span className="material-symbols-outlined text-[16px] text-[#a93200]">photo_library</span>
            <span>उत्सव स्मृती • वर्षनिहाय गॅलरी ({editionText})</span>
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl text-[#a93200] font-bold mb-2">
            यंगस्टार मित्र मंडळ - संपूर्ण उत्सव फोटो गॅलरी
          </h1>
          <p className="text-xs sm:text-sm text-[#5a4139] max-w-2xl leading-relaxed">
            माळीनगर - श्रीक्षेत्र देहुगाव येथील गणेशोत्सवाची पवित्र रूपे, भव्य देखावे, महाआरती, मोदक महाप्रसाद आणि विसर्जन मिरवणुकीची वर्षनिहाय (Year-wise) छायाचित्रे.
          </p>
        </div>

        {/* Year Filter Tabs */}
        <div className="flex flex-wrap gap-2 shrink-0 bg-white p-2 rounded-2xl border border-[#ffe9e5] shadow-xs">
          {availableYears.map(yr => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${selectedYear === yr ? 'bg-[#d14307] text-white shadow-md' : 'text-[#5a4139] hover:bg-[#ffe9e5] hover:text-[#a93200]'}`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {yr === 'ALL' ? 'collections' : 'calendar_today'}
              </span>
              <span>{yr === 'ALL' ? 'सर्व वर्षे (All)' : `${toMarathiDigits(yr)} साल`}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      {displayedPhotos.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#ffe9e5] text-center shadow-sm">
          <span className="material-symbols-outlined text-4xl text-[#fe932c] mb-2">image_not_supported</span>
          <h3 className="font-headline font-bold text-lg text-[#281714]">या वर्षातील फोटो उपलब्ध नाहीत</h3>
          <p className="text-xs text-[#5a4139] mt-1">कृपया दुसरा वर्ष निवडा किंवा सर्व वर्षे पहा.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPhotos.map((photo, idx) => (
            <div 
              key={photo.id || idx}
              onClick={() => setLightboxPhoto(photo)}
              className="bg-white rounded-2xl overflow-hidden shadow-md border border-[#ffe9e5] group cursor-pointer hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image Container with Year Badge and Hover Zoom */}
              <div className="h-56 overflow-hidden relative">
                <img 
                  src={photo.photo_url || photo.photoUrl || '/aarti.jpg'} 
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 left-3 bg-[#a93200]/90 backdrop-blur-sm text-white text-[11px] px-2.5 py-1 rounded-full font-bold shadow-md flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">calendar_month</span>
                  <span>{toMarathiDigits(photo.festival_year || '2026')}</span>
                </div>
                
                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white/90 text-[#a93200] font-bold text-xs px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                    <span>फोटो मोठा पहा</span>
                  </span>
                </div>
              </div>

              {/* Caption Content */}
              <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                  <span className="text-[10px] text-[#d14307] font-bold uppercase tracking-wider block mb-0.5">
                    ॥ गणेशोत्सव स्मृती • {toMarathiDigits(photo.festival_year || '2026')} ॥
                  </span>
                  <h3 className="font-headline font-bold text-base text-[#281714] leading-snug group-hover:text-[#a93200] transition-colors">
                    {photo.title}
                  </h3>
                  {photo.description && (
                    <p className="text-xs text-[#5a4139] mt-1.5 leading-relaxed line-clamp-2">
                      {photo.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-[#ffe9e5] flex items-center justify-between text-xs text-[#5a4139]">
                  <span className="text-[11px] text-[#006b2c] font-bold">माळीनगर, श्रीक्षेत्र देहुगाव</span>
                  <span className="material-symbols-outlined text-base text-neutral-400 group-hover:text-[#a93200] transition-colors">
                    fullscreen
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal for Full Screen Image Inspection */}
      {lightboxPhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setLightboxPhoto(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-3xl w-full border border-neutral-700 shadow-2xl overflow-hidden relative animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#a93200] via-[#d14307] to-[#fe932c] p-4 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase">
                  गणेशोत्सव {toMarathiDigits(lightboxPhoto.festival_year || '2026')}
                </span>
                <h3 className="font-headline font-bold text-base mt-1">{lightboxPhoto.title}</h3>
              </div>
              <button
                onClick={() => setLightboxPhoto(null)}
                className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white text-base font-bold transition"
              >
                ✕
              </button>
            </div>

            {/* Photo */}
            <div className="max-h-[65vh] overflow-hidden bg-neutral-900 flex items-center justify-center">
              <img 
                src={lightboxPhoto.photo_url || lightboxPhoto.photoUrl || '/aarti.jpg'} 
                alt={lightboxPhoto.title}
                className="max-h-[65vh] w-auto object-contain"
              />
            </div>

            {/* Description Footer */}
            <div className="p-4 bg-[#fff8f6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div>
                <p className="text-[#281714] font-medium">{lightboxPhoto.description || 'यंगस्टार मित्र मंडळ, श्रीक्षेत्र देहुगाव'}</p>
                <span className="text-[10px] text-[#5a4139] block mt-0.5">स्थळ: माळीनगर, श्रीक्षेत्र देहुगाव, ता. हवेली, जि. पुणे</span>
              </div>
              <a
                href={lightboxPhoto.photo_url || lightboxPhoto.photoUrl || '/aarti.jpg'}
                download
                target="_blank"
                rel="noreferrer"
                className="bg-[#00873a] hover:bg-[#006b2c] text-white px-3.5 py-1.5 rounded-lg font-bold shadow-sm flex items-center gap-1 shrink-0"
              >
                <span className="material-symbols-outlined text-[15px]">download</span>
                <span>फोटो डाऊनलोड करा</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Strip */}
      <div className="bg-white p-6 rounded-2xl border border-[#ffe9e5] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-headline font-bold text-base text-[#281714]">उत्सव कार्यक्रमांची वेळ व तारीख तपासायची आहे का?</h4>
          <p className="text-xs text-[#5a4139]">श्री गणरायाच्या प्रतिष्ठापनेपासून ते विसर्जन मिरवणुकीपर्यंतचा संपूर्ण कार्यक्रम तक्ता पहा.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('schedule')}
            className="bg-[#d14307] hover:bg-[#a93200] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">calendar_month</span>
            <span>कार्यक्रम तक्ता पहा →</span>
          </button>
          <button
            onClick={() => setActiveTab('home')}
            className="bg-[#fff0ee] hover:bg-[#ffe0da] text-[#a93200] px-4 py-2 rounded-xl text-xs font-bold transition"
          >
            मुख्यपृष्ठ
          </button>
        </div>
      </div>

    </div>
  );
}
