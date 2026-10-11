import React, { useState } from 'react';
import MandalPavtiModal from './MandalPavtiModal';

function toMarathiDigits(num) {
  if (num === null || num === undefined) return '';
  const marathiDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return num.toString().replace(/\d/g, d => marathiDigits[d]);
}

export default function VarganiPustak({ records, festivalYear, editionText, onClose }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState('book'); // 'book' or 'table'
  const [searchFilter, setSearchFilter] = useState('');
  const [isMandalModalOpen, setIsMandalModalOpen] = useState(false);

  const fYear = festivalYear || '२०२६';
  const eText = editionText || '४९ वे वर्ष';

  // केवळ मंजूर व पूर्ण भरणा झालेल्या (Verified & Complete) पावत्याच वर्गणी पुस्तकात दिसतील
  const displayRecords = (records || []).filter(r => 
    r.status === 'VERIFIED' && 
    r.payment_mode !== 'Pay Later' && 
    (parseFloat(r.amount) || 0) > 0
  );

  const filteredRecords = displayRecords.filter(r => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    const name = (r.donor_name || r.donorName || '').toLowerCase();
    const no = (r.receipt_no || r.receiptNo || '').toLowerCase();
    return name.includes(q) || no.includes(q);
  });

  const totalVerifiedAmount = displayRecords.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);

  // Fallback demo sample if no verified records exist yet
  const sampleFallback = {
    receipt_no: `YMM-${fYear}-०००१`,
    donor_name: 'श्री. जॉन डो (John Doe)',
    donor_mobile: '9822012345',
    category: 'गणेशोत्सव',
    amount: 5001,
    amount_words: 'पाच हजार एक रुपये फक्त',
    payment_mode: 'Online',
    remarks: 'आरती संकल्प व मोदक महाप्रसाद',
    created_at: new Date().toLocaleDateString('mr-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
    status: 'VERIFIED'
  };

  const recordsToUse = displayRecords.length > 0 ? displayRecords : [sampleFallback];
  const safeCurrentIndex = Math.min(currentPage, recordsToUse.length - 1);
  const currentRecord = recordsToUse[safeCurrentIndex] || sampleFallback;

  const currentReceiptNo = currentRecord.receipt_no || currentRecord.receiptNo || `YMM-${fYear}-०००१`;
  const currentDonorName = currentRecord.donor_name || currentRecord.donorName || 'श्री. जॉन डो';
  const currentAmount = parseFloat(currentRecord.amount) || 0;
  const currentAmountWords = currentRecord.amount_words || currentRecord.amountWords || `${currentAmount} रुपये फक्त`;
  const currentCategory = currentRecord.category || 'गणेशोत्सव';
  const currentPaymentMode = currentRecord.payment_mode || currentRecord.paymentMode || 'Online';
  const currentRemarks = currentRecord.remarks || '';
  const currentDate = currentRecord.date || currentRecord.created_at || new Date().toLocaleDateString('mr-IN');

  const maskMobile = (mobile) => {
    if (!mobile) return '**********';
    if (mobile.length <= 4) return '****';
    return mobile.slice(0, 4) + '******';
  };

  const handlePrintPustak = () => {
    window.print();
  };

  return (
    <div className="w-full bg-gradient-to-br from-[#2a140e] via-[#3d1c13] to-[#200e0a] p-4 sm:p-7 rounded-3xl border-4 border-[#fe932c]/70 shadow-2xl relative overflow-hidden my-6 text-[#281714]">
      
      {/* Decorative Gold Corner Filigree */}
      <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-300 pointer-events-none rounded-tl-lg opacity-80"></div>
      <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-300 pointer-events-none rounded-tr-lg opacity-80"></div>
      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-300 pointer-events-none rounded-bl-lg opacity-80"></div>
      <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-300 pointer-events-none rounded-br-lg opacity-80"></div>

      {/* ================= 1. FULL FRAME BOOK HEADER BAR ================= */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 pb-4 mb-5 border-b-2 border-amber-400/30 text-white">
        
        {/* Mandal Emblem & Pustak Identity */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#d14307] to-[#fe932c] text-white flex items-center justify-center font-bold text-2xl shadow-lg border-2 border-amber-300 shrink-0">
            📖
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-widest uppercase bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 rounded-full font-bold">
                ॥ अधिकृत पावती पुस्तक • फुल फ्रेम ॥
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full font-bold">
                ✓ १००% पडताळणीकृत (Verified)
              </span>
            </div>
            <h2 className="font-headline text-xl sm:text-2xl font-bold text-amber-100 mt-0.5">
              यंगस्टार मित्र मंडळ - अधिकृत पावती पुस्तक (Vargani Pustak)
            </h2>
            <p className="text-xs text-amber-200/80">
              सार्वजनिक गणेशोत्सव {fYear} • {eText} • माळीनगर, श्रीक्षेत्र देहुगाव • एकूण जमा: ₹ {totalVerifiedAmount.toLocaleString('mr-IN')} ({recordsToUse.length} पावत्या)
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex flex-wrap items-center justify-end gap-2 w-full lg:w-auto">
          
          {/* View Toggle */}
          <div className="bg-black/40 p-1 rounded-xl border border-amber-400/30 flex items-center gap-1">
            <button
              onClick={() => setViewMode('book')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${viewMode === 'book' ? 'bg-[#d14307] text-white shadow-sm border border-amber-400' : 'text-amber-200 hover:text-white'}`}
            >
              <span className="material-symbols-outlined text-[16px]">menu_book</span>
              <span>पुस्तक रूप (Book)</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${viewMode === 'table' ? 'bg-[#d14307] text-white shadow-sm border border-amber-400' : 'text-amber-200 hover:text-white'}`}
            >
              <span className="material-symbols-outlined text-[16px]">table_chart</span>
              <span>नोंदवही तक्ता (Ledger)</span>
            </button>
          </div>

          {/* Page Jump Selector in Book Mode */}
          {viewMode === 'book' && (
            <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-xl border border-amber-400/30">
              <button 
                disabled={safeCurrentIndex === 0}
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs font-bold disabled:opacity-30 disabled:pointer-events-none transition"
                title="मागील पावती"
              >
                ◀
              </button>
              <select
                value={safeCurrentIndex}
                onChange={(e) => setCurrentPage(parseInt(e.target.value))}
                className="bg-transparent text-amber-200 text-xs font-bold py-1 px-1.5 focus:outline-none cursor-pointer max-w-[140px] truncate"
              >
                {recordsToUse.map((r, idx) => (
                  <option key={idx} value={idx} className="bg-[#2a140e] text-white">
                    {r.receipt_no || r.receiptNo || `पावती ${idx + 1}`} - {r.donor_name || r.donorName || ''}
                  </option>
                ))}
              </select>
              <button 
                disabled={safeCurrentIndex >= recordsToUse.length - 1}
                onClick={() => setCurrentPage(prev => Math.min(recordsToUse.length - 1, prev + 1))}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs font-bold disabled:opacity-30 disabled:pointer-events-none transition"
                title="पुढील पावती"
              >
                ▶
              </button>
            </div>
          )}

          {/* Print Button */}
          <button
            onClick={handlePrintPustak}
            className="bg-amber-500 hover:bg-amber-600 text-[#281714] px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 border border-amber-300"
            title="पावती पुस्तक प्रिंट करा"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>प्रिंट</span>
          </button>

          {/* Optional Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-red-600 text-white flex items-center justify-center font-bold text-sm transition"
              title="पुस्तक बंद करा"
            >
              ✕
            </button>
          )}

        </div>
      </div>

      {/* ================= 2. MAIN FULL-FRAME RECEIPT BOOK BODY ================= */}
      {viewMode === 'book' ? (
        <div id="printable-pustak" className="printable-section bg-[#FAF6EE] rounded-2xl border-4 border-[#8B2500] shadow-2xl relative overflow-hidden">
          
          {/* Realistic Book Outer Canvas with Spine, Counterfoil Stub & Main Receipt */}
          <div className="flex flex-col lg:flex-row min-h-[480px]">
            
            {/* 📚 BOOK SPINE BINDING (Left Leather Edge) */}
            <div className="lg:w-10 bg-gradient-to-r from-[#3e1308] via-[#5c1d0c] to-[#431409] border-r-2 border-[#8B2500] flex lg:flex-col items-center justify-around py-3 px-2 shrink-0 shadow-inner">
              <div className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-200 shadow-sm ring-2 ring-black/40"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-200 shadow-sm ring-2 ring-black/40"></div>
              <div className="hidden lg:block w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-200 shadow-sm ring-2 ring-black/40"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-200 shadow-sm ring-2 ring-black/40"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-200 shadow-sm ring-2 ring-black/40"></div>
            </div>

            {/* 📑 LEFT PART: OFFICE COUNTERFOIL (पावती खुंट / मंडळ नोंद प्रत) */}
            <div className="lg:w-[32%] bg-[#FFFDF8] p-4 sm:p-5 border-b-2 lg:border-b-0 lg:border-r-2 border-dashed border-[#8B2500]/60 flex flex-col justify-between relative">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#e5d5c5]">
                  <span className="text-[10px] font-bold text-[#8B2500] uppercase tracking-wider bg-orange-100 px-2 py-0.5 rounded border border-orange-200">
                    ॥ पावती खुंट (Office Stub) ॥
                  </span>
                  <span className="text-[11px] font-bold text-gray-700 font-mono">
                    {currentReceiptNo}
                  </span>
                </div>

                <div className="mt-3 space-y-2.5 text-xs">
                  <div>
                    <span className="text-[10px] text-gray-500 block">दिनांक:</span>
                    <span className="font-bold text-gray-800">{currentDate}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-500 block">श्री. / सौ. (देणगीदार):</span>
                    <span className="font-bold text-gray-900 text-sm leading-tight block">{currentDonorName}</span>
                    <span className="text-[10px] text-gray-500 block font-mono mt-0.5">मोबाईल: {maskMobile(currentRecord.donor_mobile || currentRecord.donorMobile)}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-500 block">उत्सव प्रकार / कारण:</span>
                    <span className="font-bold text-[#006b2c]">{currentCategory}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-500 block">रक्कम (₹ आकडे):</span>
                    <span className="font-headline font-bold text-[#8B2500] text-base">₹ {currentAmount.toLocaleString('mr-IN')}/-</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-500 block">रक्कम अक्षरी:</span>
                    <span className="font-semibold text-gray-800 text-[11px] leading-tight block">{currentAmountWords}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-500 block">भरणा पद्धत (Mode):</span>
                    <span className="font-bold text-xs text-[#006b2c]">{currentPaymentMode}</span>
                  </div>

                  {currentRemarks && (
                    <div className="bg-amber-50 p-2 rounded border border-amber-200">
                      <span className="text-[10px] text-amber-900 font-bold block">शेरा (Remarks):</span>
                      <span className="text-[11px] text-amber-950 font-semibold">{currentRemarks}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Counterfoil Bottom Sign */}
              <div className="pt-3 border-t border-[#e5d5c5] mt-4 flex items-center justify-between text-[10px] text-gray-600">
                <span className="font-bold text-[#006b2c]">✓ मंडळ दप्तर प्रत</span>
                <span className="font-bold text-gray-800">स्वाक्षरी / शिक्का</span>
              </div>
            </div>

            {/* ✂ PERFORATED TEAR-OFF LINE (मध्यभागी फाडण्याची रेषा) */}
            <div className="hidden lg:flex w-6 flex-col items-center justify-around bg-[#F3ECE0] border-r border-[#8B2500]/40 text-[#8B2500] select-none py-4">
              <span className="text-xs font-mono font-bold">✂</span>
              <span className="text-[9px] font-bold tracking-widest uppercase rotate-90 whitespace-nowrap text-gray-500 my-auto">
                इथून फाडावे (Tear Line)
              </span>
              <span className="text-xs font-mono font-bold">✂</span>
            </div>

            {/* 📜 RIGHT PART: MAIN OFFICIAL PAVATI (मुख्य अधिकृत पावती - भाविक प्रत) */}
            <div className="flex-1 bg-gradient-to-b from-[#FFFDF9] via-[#FFFBF6] to-[#FFF7EE] p-5 sm:p-7 flex flex-col justify-between relative overflow-hidden">
              
              {/* Subtle Ganesh Watermark Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none">
                <img src="/logo.png" alt="" className="w-80 h-80 object-contain" />
              </div>

              <div>
                {/* Devotional Top Slogan */}
                <div className="text-center pb-2 border-b-2 border-[#8B2500]/30">
                  <span className="text-xs font-bold text-[#8B2500] tracking-widest uppercase">
                    ॥ ॐ गं गणपतये नमः • मानाचा गणपती ॥
                  </span>
                  
                  {/* Mandal Header */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-2">
                    <div className="flex items-center gap-3 text-center sm:text-left">
                      <img 
                        src="/logo.png" 
                        alt="Logo" 
                        className="h-14 sm:h-16 w-auto rounded-xl shadow-xs object-contain bg-white p-1 border border-amber-300"
                      />
                      <div>
                        <span className="inline-block bg-amber-100 text-[#8B2500] text-[10px] px-2.5 py-0.5 rounded-full font-bold border border-amber-300">
                          स्थापना वर्ष १९७७ • {eText}
                        </span>
                        <h3 className="font-headline text-2xl sm:text-3xl text-[#8B2500] font-bold leading-tight">
                          यंगस्टार मित्र मंडळ
                        </h3>
                        <p className="text-[11px] text-gray-600 font-medium">
                          सार्वजनिक गणेशोत्सव {fYear} • माळीनगर, श्रीक्षेत्र देहुगाव, ता. हवेली, जि. पुणे - ४१२१०९
                        </p>
                      </div>
                    </div>

                    {/* Receipt Number Badge */}
                    <div className="bg-[#FFF0E6] border-2 border-[#8B2500] p-2.5 rounded-xl text-center min-w-[140px] shadow-xs">
                      <span className="text-[10px] text-gray-600 font-bold block uppercase tracking-wider">पावती क्रमांक</span>
                      <span className="font-headline text-lg font-bold text-[#8B2500] font-mono">{currentReceiptNo}</span>
                      <span className="text-[10px] text-gray-600 block mt-0.5 font-semibold">दि: {currentDate}</span>
                    </div>
                  </div>
                </div>

                {/* Ribbon Title */}
                <div className="text-center my-3">
                  <span className="inline-block bg-gradient-to-r from-[#8B2500] via-[#c43c08] to-[#8B2500] text-white px-5 py-1 rounded-full font-headline text-xs sm:text-sm font-bold shadow-sm border border-amber-300">
                    ॥ श्री गणेश कृपा अधिकृत देणगी व वर्गणी पावती ॥
                  </span>
                </div>

                {/* Respectful Donor Body Sentence */}
                <div className="bg-white/80 backdrop-blur-xs p-3.5 sm:p-4 rounded-xl border border-[#e5d5c5] shadow-xs text-xs sm:text-sm text-gray-800 leading-relaxed my-2">
                  <p>
                    ही अधिकृत पावती सस्नेह गौरवाने श्री. / सौ. <b className="text-[#8B2500] text-base underline decoration-amber-400">{currentDonorName}</b> यांना प्रदान करण्यात येते, ज्यांनी मंडळाच्या <b>सार्वजनिक गणेशोत्सव {fYear} ({eText})</b> साठी <b>{currentCategory}</b> अंतर्गत वर्गणी समर्पित केली आहे.
                  </p>
                </div>

                {/* Detailed Information Table Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-[#e5d5c5]">
                    <span className="text-[10px] text-gray-500 block">वर्गणी रक्कम (आकडे):</span>
                    <span className="font-headline text-base font-bold text-[#8B2500]">₹ {currentAmount.toLocaleString('mr-IN')}/-</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-[#e5d5c5] col-span-2">
                    <span className="text-[10px] text-gray-500 block">रक्कम (अक्षरी):</span>
                    <span className="font-bold text-gray-900">{currentAmountWords}</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-[#e5d5c5]">
                    <span className="text-[10px] text-gray-500 block">भरणा पद्धत:</span>
                    <span className="font-bold text-[#006b2c]">{currentPaymentMode}</span>
                  </div>
                </div>

                {currentRemarks && (
                  <div className="bg-[#FFF8F0] p-2 rounded-lg border border-amber-200 text-xs mb-2">
                    <span className="text-[10px] text-[#8B2500] font-bold block">शेरा / टिप्पणी (Remarks):</span>
                    <span className="text-gray-800 font-semibold">{currentRemarks}</span>
                  </div>
                )}
              </div>

              {/* Bottom Official Seals, QR & Signatures */}
              <div className="pt-3 border-t-2 border-[#8B2500]/20 flex flex-col sm:flex-row items-center justify-between gap-3 mt-3">
                
                {/* Anti Tamper QR & Verified Tag */}
                <div className="flex items-center gap-2.5">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=65x65&data=${encodeURIComponent(currentReceiptNo + '-VERIFIED-' + currentAmount)}`}
                    alt="Verify QR"
                    className="w-12 h-12 rounded border border-amber-400 p-0.5 bg-white shadow-xs"
                  />
                  <div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                      ✓ अधिकृत पडताळणीकृत पावती
                    </span>
                    <p className="text-[10px] text-gray-500 mt-0.5">स्कॅन करून ऑनलाईन पडताळा</p>
                  </div>
                </div>

                {/* Mandal Modal Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsMandalModalOpen(true)}
                  className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 border border-amber-400 no-print"
                >
                  <span className="material-symbols-outlined text-[16px] text-amber-200">workspace_premium</span>
                  <span>✨ अधिकृत मंडळ पावती (Digital Copy)</span>
                </button>

                {/* Authority Sign & Stamp */}
                <div className="text-right text-xs">
                  <div className="border-b border-gray-900 pb-0.5 mb-0.5">
                    <span className="font-bold text-[#8B2500]">कुणाल बिरदवडे (खजिनदार)</span>
                  </div>
                  <span className="text-[10px] text-gray-600 font-semibold block">अध्यक्ष व कार्यकारिणी, यंगस्टार मित्र मंडळ</span>
                </div>

              </div>

            </div>

          </div>

        </div>
      ) : (
        /* ================= 3. FULL LEDGER TABLE VIEW (संपूर्ण नोंदवही तक्ता) ================= */
        <div className="bg-white rounded-2xl border-2 border-amber-400/40 shadow-xl p-4 sm:p-6 overflow-hidden">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-200">
            <div>
              <h3 className="font-headline text-lg font-bold text-[#8B2500]">
                संपूर्ण वर्गणी नोंदवही तक्ता (Full Verified Ledger)
              </h3>
              <p className="text-xs text-gray-500">
                केवळ पडताळणी पूर्ण झालेल्या अधिकृत पावत्यांची यादी ({filteredRecords.length} नोंदी)
              </p>
            </div>

            <div className="w-full sm:w-72">
              <input
                type="text"
                placeholder="पावती क्र. किंवा नाव शोधा..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-100 border border-gray-300 text-xs focus:outline-none focus:border-[#8B2500]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFF0E6] text-[#8B2500] font-bold border-b border-amber-300">
                <tr>
                  <th className="py-2.5 px-3">पावती क्र.</th>
                  <th className="py-2.5 px-3">दिनांक</th>
                  <th className="py-2.5 px-3">देणगीदाराचे नाव</th>
                  <th className="py-2.5 px-3">रक्कम (₹)</th>
                  <th className="py-2.5 px-3">कारण</th>
                  <th className="py-2.5 px-3">भरणा मोड</th>
                  <th className="py-2.5 px-3 text-center">कृती</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRecords.map((r, idx) => (
                  <tr key={idx} className="hover:bg-amber-50/60 transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#8B2500]">
                      {r.receipt_no || r.receiptNo}
                    </td>
                    <td className="py-2.5 px-3 text-gray-600">
                      {r.date || r.created_at || '-'}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-gray-900">
                      {r.donor_name || r.donorName}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-[#8B2500]">
                      ₹ {parseFloat(r.amount).toLocaleString('mr-IN')}/-
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[#006b2c]">
                      {r.category}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200">
                        {r.payment_mode || r.paymentMode}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => {
                          const realIdx = recordsToUse.findIndex(x => (x.receipt_no || x.receiptNo) === (r.receipt_no || r.receiptNo));
                          if (realIdx >= 0) setCurrentPage(realIdx);
                          setViewMode('book');
                        }}
                        className="bg-[#8B2500] hover:bg-[#a93200] text-white px-2.5 py-1 rounded-md text-[11px] font-bold transition shadow-xs"
                      >
                        📖 पावती पहा
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* Mandal Official Pavti Modal Popup */}
      <MandalPavtiModal 
        isOpen={isMandalModalOpen} 
        onClose={() => setIsMandalModalOpen(false)} 
        record={{
          receiptNo: currentReceiptNo,
          donorName: currentDonorName,
          amount: currentAmount,
          amountWords: currentAmountWords,
          date: currentDate,
          status: 'VERIFIED',
          paymentMode: currentPaymentMode
        }} 
      />

    </div>
  );
}
