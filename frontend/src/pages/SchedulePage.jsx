import React from 'react';

export default function SchedulePage({ setActiveTab, settings }) {
  const activeYear = settings?.festivalYear || '२०२६';
  const editionText = settings?.editionText || '४९ वे वर्ष';

  const events = [
    { day: `दिवस १ (१४ सप्टेंबर ${activeYear})`, title: "श्रींची प्रतिष्ठापना व भव्य मिरवणूक", time: "सकाळी ९:०० वा.", image: "/pandal_hero.jpg" },
    { day: `दिवस २ (१५ सप्टेंबर ${activeYear})`, title: "सामूहिक अथर्वशीर्ष पठण व महाआरती", time: "सायं ७:३० वा.", image: "/aarti.jpg" },
    { day: `दिवस ३ (१६ सप्टेंबर ${activeYear})`, title: "भव्य मोफत रक्तदान व जनआरोग्य शिबिर", time: "सकाळी ९ ते दुपारी २", image: "/pandal_hero.jpg" },
    { day: `दिवस ५ (१८ सप्टेंबर ${activeYear})`, title: "भव्य मोदक महाप्रसाद वितरण सोहळा", time: "दुपारी १२:०० ते ४:००", image: "/mahaprasad.jpg" },
    { day: `दिवस ७ (२० सप्टेंबर ${activeYear})`, title: "बालगोपाळांचे सांस्कृतिक कार्यक्रम व नाट्य", time: "सायंकाळी ६:३० वा.", image: "/aarti.jpg" },
    { day: `दिवस १० (२४ सप्टेंबर ${activeYear})`, title: "भव्य सांगता विसर्जन मिरवणूक (ढोल-ताशा)", time: "दुपारी ३:०० वाजता", image: "/dhol_tasha.jpg" }
  ];

  return (
    <div className="max-w-[1140px] mx-auto px-4 py-8 flex flex-col gap-8">
      <div className="bg-gradient-to-r from-[#ffe2dd] via-[#fff0ee] to-[#fff8f6] p-6 sm:p-8 rounded-2xl border border-[#fe932c]/30 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full text-[#904d00] text-xs font-bold mb-3 shadow-sm">
            <span className="material-symbols-outlined text-[16px] text-[#a93200]">calendar_month</span>
            <span>यंदाचा उत्सव: गणेशोत्सव {activeYear} ({editionText})</span>
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl text-[#a93200] font-bold mb-2">
            यंगस्टार मित्र मंडळ - दैनंदिन कार्यक्रम पत्रिका {activeYear}
          </h1>
          <p className="text-xs sm:text-sm text-[#5a4139] max-w-2xl">
            सर्व गणेशभक्तांना आग्रहाचे निमंत्रण! भक्तीमय वातावरणात पार पडणाऱ्या विविध धार्मिक व सांस्कृतिक उपक्रमांमध्ये सहभागी व्हा.
          </p>
        </div>
        <button onClick={() => setActiveTab('vargani')} className="bg-[#d14307] hover:bg-[#a93200] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shrink-0">
          आरती संकल्प व देणगी नोंदणी →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((item, index) => (
          <div key={index} className="bg-white rounded-2xl border border-[#ffe9e5] shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all">
            <div className="h-40 overflow-hidden relative">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
              <div className="absolute top-3 left-3 bg-[#a93200] text-white text-[11px] px-2.5 py-1 rounded-full font-bold shadow-md">
                {item.day}
              </div>
            </div>
            <div className="p-5 flex flex-col justify-between flex-grow gap-3">
              <h3 className="font-headline text-base font-bold text-[#281714]">{item.title}</h3>
              <div className="flex items-center justify-between pt-3 border-t border-[#ffe9e5] text-xs text-[#5a4139]">
                <span className="flex items-center gap-1 font-bold text-[#a93200]">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  <span>{item.time}</span>
                </span>
                <span>माळीनगर - देहुगाव मंडप</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

