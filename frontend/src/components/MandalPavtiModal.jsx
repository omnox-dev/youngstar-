import React from 'react';

export default function MandalPavtiModal({ isOpen, onClose, record }) {
  if (!isOpen || !record) return null;

  const receiptNo = record.receiptNo || 'YMM-2026-0001';

  // RESTRICTION: Block printing or viewing official pavti if record is not approved
  const isApproved = !record.status || record.status === 'VERIFIED';
  if (!isApproved) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in no-print">
        <div className="bg-white rounded-3xl max-w-md w-full border-2 border-amber-400 shadow-2xl p-6 text-center relative overflow-hidden">
          <div className="h-2.5 bg-gradient-to-r from-amber-500 via-[#d14307] to-amber-600 absolute top-0 left-0 right-0"></div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-bold flex items-center justify-center transition"
          >
            ✕
          </button>

          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3 shadow-inner ring-4 ring-amber-50 mt-2">
            <span className="material-symbols-outlined text-3xl">lock</span>
          </div>

          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 bg-amber-100 px-3 py-0.5 rounded-full mb-2 inline-block border border-amber-300">
            मंजुरी प्रलंबित (Approval Pending)
          </span>

          <h3 className="font-headline font-bold text-xl text-[#281714] mb-2">
            अधिकृत मंडळ पावती लॉक आहे
          </h3>

          <div className="bg-[#fff8f6] border border-[#ffe9e5] rounded-2xl p-4 text-xs text-[#5a4139] leading-relaxed mb-5 text-center">
            <p className="mb-2">
              पावती क्र. <b className="text-[#a93200] font-mono">{receiptNo}</b> अद्याप मुख्य प्रशासक / खजिनदारांकडून मंजूर (Approved/Verified) झालेली नाही.
            </p>
            {record.status === 'PENDING_VERIFICATION' && (
              <p className="font-bold text-amber-900 bg-amber-100/70 p-2 rounded-xl border border-amber-300">
                ⏳ ऑनलाईन पेमेंट तपासणी पूर्ण होताच ही अधिकृत पावती खुली होईल.
              </p>
            )}
            {record.status === 'PENDING' && (
              <p className="font-bold text-amber-900 bg-amber-100/70 p-2 rounded-xl border border-amber-300">
                🔒 रक्कम पूर्ण भरणा केल्यानंतर ही अधिकृत पावती खुली होईल.
              </p>
            )}
            {record.status === 'REJECTED' && (
              <p className="font-bold text-red-900 bg-red-100/70 p-2 rounded-xl border border-red-300">
                ✕ ही नोंद अमान्य (Rejected) करण्यात आलेली आहे.
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full bg-[#d14307] hover:bg-[#a93200] text-white py-2.5 rounded-xl font-bold text-xs shadow-md transition"
          >
            बंद करा
          </button>
        </div>
      </div>
    );
  }

  const dateStr = record.date || new Date().toLocaleDateString('mr-IN');
  const donorName = record.donorName || 'श्री. जॉन डो (John Doe)';
  const amount = (record.amount !== undefined && record.amount !== null && record.amount !== 0) ? record.amount : 5001;
  const amountWords = record.amountWords || (amount === 5001 ? 'पाच हजार एक रुपये फक्त' : `${amount} रुपये फक्त`);
  const khajindarName = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_KHAJINDAR_NAME) || record?.khajindarName || 'कुणाल बिरदवडे';

  const toMarathiDigits = (num) => {
    if (num === null || num === undefined) return '';
    const marathiDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return num.toString().replace(/\d/g, d => marathiDigits[d]);
  };
  const fYear = parseInt(record.festivalYear) || 2026;
  const eYear = parseInt(record.establishmentYear) || 1977;
  const editionNo = Math.max(1, fYear - eYear);
  const editionNoMarathi = toMarathiDigits(editionNo);

  // Anti-Tamper Verification Base URL & Badge from ENV (falls back to window.location.origin)
  const baseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_APP_URL)
    || (typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://youngstarpune.in');
  const badgeText = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ANTI_TAMPER_BADGE) || '✓ Verified Pavti';

  // Dynamic Anti-Tamper Verification QR Payload
  const verifyUrl = `${baseUrl}/verify?id=${encodeURIComponent(receiptNo)}&amt=${encodeURIComponent(amount)}`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyUrl)}`;

  const handlePrint = () => {
    const printWin = window.open('', '_blank', 'width=950,height=750');
    if (!printWin) {
      window.print();
      return;
    }

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>यंगस्टार मित्र मंडळ - अधिकृत पावती ${receiptNo}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 8mm;
            }
            html, body {
              margin: 0;
              padding: 0;
              background-color: #ffffff;
              width: 100%;
              height: 100%;
              overflow: hidden;
              font-family: 'Noto Sans Devanagari', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
            .page-container {
              width: 100%;
              max-width: 190mm;
              margin: 0 auto;
              padding: 0;
              box-sizing: border-box;
            }
            .pavti-card {
              position: relative;
              width: 100%;
              border-radius: 8px;
              overflow: hidden;
              border: 1px solid #fde68a;
              background: #ffffff;
            }
            .pavti-card img.bg-template {
              width: 100%;
              height: auto;
              display: block;
            }
            .overlay-text {
              position: absolute;
              font-weight: 700;
              color: #111827;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .text-red {
              color: #7f1d1d;
              font-family: Georgia, serif;
              font-weight: 800;
            }
            .text-white-bold {
              color: #df2020ff;
              font-family: Georgia, serif;
              font-weight: 800;
              text-align: center;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          </style>
        </head>
        <body>
          <div class="page-container">
            <div class="pavti-card">
              <img src="/mandal_pavti_template.jpg" class="bg-template" alt="Mandal Pavti Template" />
              
              <!-- TOP STUB OVERLAYS -->
              <div class="overlay-text text-red" style="top: 10%; left: 38%; font-size: 13px;">${receiptNo}</div>
              <div class="overlay-text" style="top: 9.7%; left: 74%; font-size: 13px;">${dateStr}</div>
              <div class="overlay-text" style="top: 12.5%; left: 40%; width: 48%; font-size: 14px;">${donorName}</div>
              <div class="overlay-text" style="top: 15.8%; left: 56%; width: 37%; font-size: 13px;">${amountWords}</div>
              <div class="overlay-text text-white-bold" style="top: 19.4%; left: 48.5%; width: 11.5%; font-size: 15px;">${amount}/-</div>
              <div class="overlay-text" style="top: 18.0%; left: 76%; width: 21%; text-align: center;">
                <span style="font-size: 10px; color: #7f1d1d; font-weight: 800; display: block;">${khajindarName}</span>
                <span style="font-size: 8px; color: #5a4139; font-weight: 700; display: block;">(खजिनदार)</span>
              </div>

              <!-- MAIN PAVTI OVERLAYS -->
              <!-- Dynamic Edition / Years Star Badge Overlay -->
              <div class="overlay-text text-red" style="top: 29.8%; left: 89.2%; width: 6%; text-align: center; font-size: 14px; font-weight: 800;">${editionNoMarathi}</div>
              <div class="overlay-text text-red" style="top: 82.2%; left: 10%; font-size: 15px;">${receiptNo}</div>
              <div class="overlay-text" style="top: 81.5%; left: 83.5%; font-size: 14px;">${dateStr}</div>
              <div class="overlay-text" style="top: 85%; left: 12%; width: 54%; font-size: 17px;">${donorName}</div>
              <div class="overlay-text" style="top: 88.8%; left: 30%; width: 38%; font-size: 15px;">${amountWords}</div>
              <div class="overlay-text text-white-bold" style="top: 85.0%; left: 80.5%; width: 15.5%; font-size: 18px;">${amount}/-</div>
              <div class="overlay-text" style="top: 89.6%; left: 76%; width: 21%; text-align: center;">
                <span style="font-size: 11px; color: #7f1d1d; font-weight: 800; display: block;">${khajindarName}</span>
                <span style="font-size: 9px; color: #5a4139; font-weight: 700; display: block;">(खजिनदार)</span>
              </div>

              <!-- QR CODE OVERLAY -->
              <div style="position: absolute; top: 88.5%; left: 71.5%; width: 8.5%; height: 9.5%;">
                <img src="${qrApiUrl}" style="width: 100%; height: 100%; object-fit: contain;" />
              </div>
            </div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 250);
            };
          </script>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">

      {/* Modal Wrapper */}
      <div className="bg-white w-full max-w-[760px] rounded-2xl shadow-2xl overflow-hidden relative flex flex-col my-auto border-2 border-[#ca8a04]">

        {/* Top Action Bar (No Print) */}
        <div className="no-print bg-[#402b28] text-white px-4 py-3 flex items-center justify-between border-b border-[#fe932c]/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#fe932c] text-xl">verified</span>
            <span className="font-headline text-sm sm:text-base font-bold text-[#ffdcc3]">
              अधिकृत मंडळ पावती (Anti-Tamper Digital Receipt)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-[#d14307] hover:bg-[#a93200] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition"
            >
              <span className="material-symbols-outlined text-base">print</span>
              <span>प्रिंट / PDF डाऊनलोड</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Pavti Container with Image Overlay */}
        <div id="printable-pavti" className="printable-section p-2 sm:p-4 overflow-x-auto bg-amber-50">

          <div className="relative w-full max-w-[720px] mx-auto overflow-hidden rounded-xl shadow-lg border border-amber-300 bg-white">

            {/* Template Background Image */}
            <img
              src="/mandal_pavti_template.jpg"
              alt="Mandal Pavti Template"
              className="w-full h-auto block"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/mandal_pavti_template.jpg';
              }}
            />

            {/* ================= TOP SLIP OVERLAYS (STUB) ================= */}
            <div
              className="absolute font-serif font-extrabold text-[#7f1d1d] text-[10px] sm:text-sm"
              style={{ top: '10%', left: '38%' }}
            >
              {receiptNo}
            </div>

            <div
              className="absolute font-sans font-bold text-gray-900 text-[10px] sm:text-sm"
              style={{ top: '9.7%', left: '74%' }}
            >
              {dateStr}
            </div>

            <div
              className="absolute font-sans font-bold text-gray-900 text-[11px] sm:text-base truncate"
              style={{ top: '12.5%', left: '40%', width: '48%' }}
            >
              {donorName}
            </div>

            <div
              className="absolute font-sans font-bold text-gray-900 text-[10px] sm:text-sm truncate"
              style={{ top: '15.8%', left: '56%', width: '37%' }}
            >
              {amountWords}
            </div>

            <div
              className="absolute font-serif font-extrabold text-[#df2020ff] text-xs sm:text-base text-center"
              style={{ top: '19.4%', left: '48.5%', width: '11.5%' }}
            >
              {amount}/-
            </div>

            {/* Top Slip Khajindar Overlay */}
            <div
              className="absolute text-center leading-tight"
              style={{ top: '18.0%', left: '76%', width: '21%' }}
            >
              <span className="font-bold text-[#7f1d1d] text-[9px] sm:text-[10px] block">
                {khajindarName}
              </span>
              <span className="text-[7px] sm:text-[8px] text-[#5a4139] font-bold block">
                (खजिनदार)
              </span>
            </div>

            {/* ================= BOTTOM SLIP OVERLAYS (MAIN DONOR PAVTI) ================= */}
            {/* Dynamic Edition / Years Star Badge Overlay */}
            <div 
              className="absolute text-center font-extrabold text-[#7f1d1d] text-xs sm:text-base font-serif"
              style={{ top: '29.8%', left: '89.2%', width: '6%' }}
            >
              {editionNoMarathi}
            </div>

            <div
              className="absolute font-serif font-extrabold text-[#7f1d1d] text-[11px] sm:text-base"
              style={{ top: '82.2%', left: '10%' }}
            >
              {receiptNo}
            </div>

            <div
              className="absolute font-sans font-bold text-gray-900 text-[11px] sm:text-sm"
              style={{ top: '81.5%', left: '83.5%' }}
            >
              {dateStr}
            </div>

            <div
              className="absolute font-sans font-bold text-gray-900 text-xs sm:text-lg truncate"
              style={{ top: '85%', left: '12%', width: '54%' }}
            >
              {donorName}
            </div>

            <div
              className="absolute font-sans font-bold text-gray-900 text-[11px] sm:text-base truncate"
              style={{ top: '88.8%', left: '30%', width: '38%' }}
            >
              {amountWords}
            </div>

            <div
              className="absolute font-serif font-extrabold text-[#df2020ff] text-sm sm:text-xl text-center"
              style={{ top: '85.0%', left: '80.5%', width: '15.5%' }}
            >
              {amount}/-
            </div>

            {/* Bottom Main Slip Khajindar Overlay */}
            <div
              className="absolute text-center leading-tight"
              style={{ top: '89.6%', left: '76%', width: '21%' }}
            >
              <span className="font-bold text-[#7f1d1d] text-[10px] sm:text-xs block">
                {khajindarName}
              </span>
              <span className="text-[8px] sm:text-[9px] text-[#5a4139] font-bold block">
                (खजिनदार)
              </span>
            </div>

            {/* Anti-Tamper Security QR Code Box */}
            <div
              className="absolute bg-white p-1 border border-[#ca8a04] rounded-md shadow-md flex flex-col items-center justify-center"
              style={{ top: '88.8%', left: '4.8%' }}
            >
              <img
                src={qrApiUrl}
                alt="QR Code Verification"
                className="w-10 h-10 sm:w-14 sm:h-14 rounded"
              />
              <span className="text-[6px] sm:text-[8px] font-bold text-[#7f1d1d] uppercase tracking-tighter mt-0.5">
                {badgeText}
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
