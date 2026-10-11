import React, { useState, useEffect } from 'react';

function toMarathiDigits(num) {
  if (!num) return '';
  const marathiDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return num.toString().replace(/\d/g, d => marathiDigits[d]);
}

export default function SchedulePage({ setActiveTab, settings }) {
  const activeFestivalYear = settings?.festivalYear || '2026';
  const editionText = settings?.editionText || '४९ वे वर्ष';
  const [selectedYear, setSelectedYear] = useState(activeFestivalYear);
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackEvents = [
    { event_date: `१४ सप्टेंबर ${selectedYear}`, event_time: "सकाळी ९:०० वा.", title: "श्रींची प्रतिष्ठापना व भव्य आगमन मिरवणूक", description: "वाजतगाजत पारंपरिक ढोल-ताशांच्या गजरात श्री गणरायाची भव्य प्रतिष्ठापना सोहळा.", photo_url: "/pandal_hero.jpg", festival_year: selectedYear },
    { event_date: `१५ सप्टेंबर ${selectedYear}`, event_time: "सायं ७:३० वा.", title: "सामूहिक अथर्वशीर्ष पठण व संध्या महाआरती", description: "महिला मंडळ व भाविकांच्या उपस्थितीत सामूहिक १०८ अथर्वशीर्ष आवर्तन व महाआरती.", photo_url: "/aarti.jpg", festival_year: selectedYear },
    { event_date: `१६ सप्टेंबर ${selectedYear}`, event_time: "सकाळी ९ ते २", title: "भव्य मोफत रक्तदान व आरोग्य तपासणी शिबिर", description: "सामाजिक बांधिलकीतून भव्य रक्तदान शिबिर व तज्ज्ञ डॉक्टरांकडून मोफत आरोग्य तपासणी.", photo_url: "/pandal_hero.jpg", festival_year: selectedYear },
    { event_date: `१८ सप्टेंबर ${selectedYear}`, event_time: "दुपारी १२ ते ४", title: "भव्य मोदक महाप्रसाद वितरण सोहळा", description: "श्रीक्षेत्र देहुगाव व माळीनगर परिसरातील हजारो भाविकांसाठी अन्नदान व महाप्रसाद.", photo_url: "/mahaprasad.jpg", festival_year: selectedYear },
    { event_date: `२० सप्टेंबर ${selectedYear}`, event_time: "सायं ६:३० वा.", title: "बालगोपाळांचे सांस्कृतिक कार्यक्रम व गुणगौरव", description: "स्थानिक कलाकारांचे भजन, गायन आणि विद्यार्थ्यांचा विशेष शैक्षणिक सत्कार सोहळा.", photo_url: "/aarti.jpg", festival_year: selectedYear },
    { event_date: `२४ सप्टेंबर ${selectedYear}`, event_time: "दुपारी ३:०० वा.", title: "भव्य सांगता विसर्जन मिरवणूक (ढोल-ताशा)", description: "गुलाल आणि भक्तीच्या रंगात बाप्पाला भावपूर्ण निरोप व विसर्जन मिरवणूक.", photo_url: "/dhol_tasha.jpg", festival_year: selectedYear }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [selectedYear]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/events?year=${selectedYear}`);
      const data = await res.json();
      if (data.success && data.events && data.events.length > 0) {
        setEventsList(data.events);
      } else {
        setEventsList(fallbackEvents);
      }
    } catch (e) {
      setEventsList(fallbackEvents);
    } finally {
      setLoading(false);
    }
  };

  // Google Calendar Integration
  const addToGoogleCalendar = (ev) => {
    const title = encodeURIComponent(`यंगस्टार मित्र मंडळ: ${ev.title}`);
    const details = encodeURIComponent(
      `यंगस्टार मित्र मंडळ, श्रीक्षेत्र देहुगाव\nकार्यक्रम: ${ev.title}\nवेळ: ${ev.event_time}\nतारीख: ${ev.event_date}\nमाहिती: ${ev.description || ''}\nस्थळ: माळीनगर, श्रीक्षेत्र देहुगाव, पुणे`
    );
    const location = encodeURIComponent('माळीनगर, श्रीक्षेत्र देहुगाव, ता. हवेली, जि. पुणे');
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(url, '_blank');
  };

  // iCal (.ics) Download Integration
  const downloadICS = (ev) => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Youngstar Mitra Mandal//Festival Calendar//MR',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `SUMMARY:यंगस्टार मित्र मंडळ: ${ev.title}`,
      `DESCRIPTION:${ev.description || ev.title} - वेळ: ${ev.event_time} - तारीख: ${ev.event_date}`,
      'LOCATION:माळीनगर, श्रीक्षेत्र देहुगाव, ता. हवेली, जि. पुणे',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${ev.title.slice(0, 20)}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // WhatsApp Reminder Share
  const shareEventWhatsApp = (ev) => {
    const text = encodeURIComponent(
      `*॥ यंगस्टार मित्र मंडळ, श्रीक्षेत्र देहुगाव ॥*\n\n` +
      `📌 *उत्सव कार्यक्रम निमंत्रण*\n` +
      `🌸 *कार्यक्रम:* ${ev.title}\n` +
      `📅 *तारीख:* ${ev.event_date}\n` +
      `⏰ *वेळ:* ${ev.event_time}\n` +
      `📍 *स्थळ:* माळीनगर, श्रीक्षेत्र देहुगाव, पुणे\n\n` +
      `📝 *तपशील:* ${ev.description || 'सर्व भाविकांनी उपस्थित राहून उत्सवाची शोभा वाढवावी.'}\n\n` +
      `गणपती बाप्पा मोरया! मंगलमूर्ती मोरया!`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-[1140px] mx-auto px-4 py-8 flex flex-col gap-8 animate-fade-in">
      
      {/* Page Hero Header */}
      <div className="bg-gradient-to-r from-[#ffe2dd] via-[#fff0ee] to-[#fff8f6] p-6 sm:p-8 rounded-3xl border border-[#fe932c]/30 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#fe932c] via-[#d14307] to-[#800000]"></div>
        
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-[#904d00] text-xs font-bold mb-3 shadow-xs border border-[#fe932c]/30">
            <span className="material-symbols-outlined text-[16px] text-[#a93200]">calendar_month</span>
            <span>यंदाचा उत्सव: गणेशोत्सव {toMarathiDigits(selectedYear)} ({editionText})</span>
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl text-[#a93200] font-bold mb-2">
            संपूर्ण उत्सव कार्यक्रम तक्ता (Festival Event Chart)
          </h1>
          <p className="text-xs sm:text-sm text-[#5a4139] max-w-2xl leading-relaxed">
            श्रीक्षेत्र देहुगाव येथील मानाच्या गणपती उत्सवातील सर्व धार्मिक विधी, महाआरती, मोदक महाप्रसाद आणि सांस्कृतिक कार्यक्रमांची सविस्तर माहिती. आपण कार्यक्रम थेट आपल्या मोबाईल कॅलेंडरमध्ये सेव्ह करू शकता!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto">
          {/* Year Filter Buttons */}
          <div className="bg-white p-1.5 rounded-xl border border-[#ffe9e5] shadow-xs flex items-center justify-center gap-1.5">
            {['2026', '2025', '2024'].map(yr => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${selectedYear === yr ? 'bg-[#d14307] text-white shadow-sm' : 'text-[#5a4139] hover:bg-[#ffe9e5]'}`}
              >
                {toMarathiDigits(yr)}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setActiveTab('vargani')} 
            className="bg-[#00873a] hover:bg-[#006b2c] text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition text-center flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">payments</span>
            <span>वर्गणी देणगी द्या →</span>
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventsList.map((item, index) => (
          <div 
            key={item.id || index} 
            className="bg-white rounded-2xl border border-[#ffe9e5] shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-lg transition-all"
          >
            {/* Event Photo with Date Overlay */}
            <div className="h-44 overflow-hidden relative">
              <img 
                src={item.photo_url || item.photoUrl || '/pandal_hero.jpg'} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#a93200] text-white text-[11px] px-3 py-1 rounded-full font-bold shadow-md flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">event</span>
                <span>{item.event_date}</span>
              </div>
            </div>

            {/* Event Details */}
            <div className="p-5 flex flex-col justify-between flex-grow gap-3">
              <div>
                <h3 className="font-headline text-base font-bold text-[#281714] leading-snug group-hover:text-[#a93200] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[#5a4139] mt-2 leading-relaxed">
                  {item.description || 'सर्व गणेशभक्तांना सस्नेह उपस्थितीचे आग्रहाचे निमंत्रण.'}
                </p>
              </div>

              <div className="pt-3 border-t border-[#ffe9e5] flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs text-[#5a4139]">
                  <span className="flex items-center gap-1 font-bold text-[#d14307]">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    <span>{item.event_time}</span>
                  </span>
                  <span className="text-[11px] text-[#006b2c] font-bold">माळीनगर, श्रीक्षेत्र देहुगाव</span>
                </div>

                {/* Calendar & Share Actions Bar */}
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  <button
                    onClick={() => addToGoogleCalendar(item)}
                    title="Google कॅलेंडरमध्ये जोडा"
                    className="bg-[#fff0ee] hover:bg-[#ffe0da] text-[#a93200] border border-[#d14307]/30 py-1.5 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition"
                  >
                    <span className="material-symbols-outlined text-[14px]">calendar_add_on</span>
                    <span>Google Cal</span>
                  </button>

                  <button
                    onClick={() => downloadICS(item)}
                    title="Apple / Outlook / Phone Calendar साठी .ics डाऊनलोड करा"
                    className="bg-[#fff0ee] hover:bg-[#ffe0da] text-[#5a4139] border border-[#d14307]/30 py-1.5 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition"
                  >
                    <span className="material-symbols-outlined text-[14px]">download</span>
                    <span>iCal / Phone</span>
                  </button>

                  <button
                    onClick={() => shareEventWhatsApp(item)}
                    title="WhatsApp वर स्मरणपत्र पाठवा"
                    className="bg-emerald-50 hover:bg-emerald-100 text-[#006b2c] border border-emerald-300 py-1.5 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition"
                  >
                    <span className="material-symbols-outlined text-[14px]">chat</span>
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation CTA */}
      <div className="bg-white p-6 rounded-2xl border border-[#ffe9e5] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-headline font-bold text-base text-[#281714]">उत्सवाच्या छायाचित्रांची झलक पाहायची आहे का?</h4>
          <p className="text-xs text-[#5a4139]">मागील वर्षांतील आणि चालू वर्षातील विलोभनीय छायाचित्रे पाहण्यासाठी उत्सव गॅलरी पहा.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('gallery')}
            className="bg-[#d14307] hover:bg-[#a93200] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">photo_library</span>
            <span>उत्सव गॅलरी पहा →</span>
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
