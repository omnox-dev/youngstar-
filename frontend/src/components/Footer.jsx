import React from 'react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="w-full bg-[#fff0ee] text-[#281714] no-print border-t border-[#ffe9e5]">
      <div className="bg-[#ffe9e5] py-3 px-4 text-center">
        <p className="font-headline text-sm sm:text-base text-[#904d00] font-semibold tracking-wide">
          ॥ वक्रतुंड महाकाय सूर्यकोटि समप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥
        </p>
      </div>

      <div className="max-w-[1140px] mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto rounded-md object-contain" />
            <span className="font-headline text-lg text-[#a93200] font-bold">यंगस्टार मित्र मंडळ</span>
          </div>
          <p className="text-xs text-[#5a4139] leading-relaxed">
            माळीनगर - देहुगाव, ता. हवेली, जि. पुणे - ४१२१०९<br/>
            नोंदणी क्र.: महा/पुणे/१२३४/१९९४<br/>
            स्थापना: वर्ष १९७७
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold text-[#281714]">महत्त्वाचे दुवे</span>
          <ul className="flex flex-col gap-1 text-xs text-[#5a4139]">
            <li><button onClick={() => setActiveTab('home')} className="hover:text-[#a93200]">मुख्यपृष्ठ व आरती वेळा</button></li>
            <li><button onClick={() => setActiveTab('schedule')} className="hover:text-[#a93200]">१०-दिवसीय कार्यक्रम पत्रिका</button></li>
            <li><button onClick={() => setActiveTab('vargani')} className="hover:text-[#a93200]">अन्नदान महाप्रसाद देणगी</button></li>
            <li><button onClick={() => setActiveTab('vargani')} className="hover:text-[#a93200]">विशेष आरती संकल्प बुकिंग</button></li>
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold text-[#281714]">पावती प्रमाणपत्र सेवा</span>
          <ul className="flex flex-col gap-1 text-xs text-[#5a4139]">
            <li><button onClick={() => setActiveTab('vargani')} className="hover:text-[#a93200]">डिजिटल ई-पावती जनरेटर</button></li>
            <li><button onClick={() => setActiveTab('vargani')} className="hover:text-[#a93200]">८०-जी कर सवलत प्रमाणपत्र</button></li>
            <li><button onClick={() => setActiveTab('vargani')} className="hover:text-[#a93200]">WhatsApp & Nodemailer पावती</button></li>
            <li><button onClick={() => setActiveTab('admin')} className="hover:text-[#a93200]">खजिनदार नियंत्रण कक्ष</button></li>
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold text-[#281714]">संपर्क व मदत केंद्र</span>
          <p className="text-xs text-[#5a4139]">
            मंडप कार्यालय: +९१ २० २५६७ ४३२१<br/>
            ईमेल: contact@youngstarpune.in<br/>
            वेळ: सकाळी ६:०० ते रात्री ११:००
          </p>
          <div className="mt-1 p-2 rounded-lg bg-[#ffe9e5] flex items-center gap-2 text-xs font-semibold text-[#006b2c]">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>अधिकृत धर्मादाय नोंदणीकृत ट्रस्ट</span>
          </div>
        </div>
      </div>

      <div className="bg-[#ffe2dd] py-3 px-4">
        <div className="max-w-[1140px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#5a4139]">
          <p>© २०२६ <b>यंगस्टार मित्र मंडळ</b>, माळीनगर - देहुगाव, पुणे. सर्व हक्क राखीव.</p>
          <p className="text-[#a93200] font-bold">॥ मानाचा गणपती • सांस्कृतिक महोत्सव २०२६ ॥</p>
        </div>
      </div>
    </footer>
  );
}
