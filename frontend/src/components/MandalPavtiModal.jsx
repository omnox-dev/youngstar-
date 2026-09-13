import React from 'react';

export default function MandalPavtiModal({ isOpen, onClose, record }) {
  if (!isOpen || !record) return null;

  const receiptNo = record.receiptNo || 'YMM-2026-0001';
  const dateStr = record.date || new Date().toLocaleDateString('mr-IN');
  const donorName = record.donorName || 'नाव उपलब्ध नाही';
  const amount = record.amount || 0;
  const amountWords = record.amountWords || `${amount} रुपये फक्त`;

  // QR Code Verification URL
  const verifyUrl = `https://youngstarpune.in/verify?id=${encodeURIComponent(receiptNo)}&amt=${encodeURIComponent(amount)}`;
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
              color: #ffffff;
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
              <div class="overlay-text text-red" style="top: 10.3%; left: 34%; font-size: 13px;">${receiptNo}</div>
              <div class="overlay-text" style="top: 10.3%; left: 74%; font-size: 13px;">${dateStr}</div>
              <div class="overlay-text" style="top: 13.0%; left: 36%; width: 48%; font-size: 14px;">${donorName}</div>
              <div class="overlay-text" style="top: 16.0%; left: 47%; width: 37%; font-size: 13px;">${amountWords}</div>
              <div class="overlay-text text-white-bold" style="top: 19.4%; left: 48.5%; width: 11.5%; font-size: 15px;">${amount}/-</div>

              <!-- MAIN PAVTI OVERLAYS -->
              <div class="overlay-text text-red" style="top: 82.2%; left: 10%; font-size: 15px;">${receiptNo}</div>
              <div class="overlay-text" style="top: 82.2%; left: 81%; font-size: 14px;">${dateStr}</div>
              <div class="overlay-text" style="top: 85.7%; left: 10%; width: 54%; font-size: 17px;">${donorName}</div>
              <div class="overlay-text" style="top: 89.2%; left: 24%; width: 38%; font-size: 15px;">${amountWords}</div>
              <div class="overlay-text text-white-bold" style="top: 85.0%; left: 80.5%; width: 15.5%; font-size: 18px;">${amount}/-</div>

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
              style={{ top: '10.3%', left: '34%' }}
            >
              {receiptNo}
            </div>

            <div 
              className="absolute font-sans font-bold text-gray-900 text-[10px] sm:text-sm" 
              style={{ top: '10.3%', left: '74%' }}
            >
              {dateStr}
            </div>

            <div 
              className="absolute font-sans font-bold text-gray-900 text-[11px] sm:text-base truncate" 
              style={{ top: '13.0%', left: '36%', width: '48%' }}
            >
              {donorName}
            </div>

            <div 
              className="absolute font-sans font-bold text-gray-900 text-[10px] sm:text-sm truncate" 
              style={{ top: '16.0%', left: '47%', width: '37%' }}
            >
              {amountWords}
            </div>

            <div 
              className="absolute font-serif font-extrabold text-white text-xs sm:text-base text-center" 
              style={{ top: '19.4%', left: '48.5%', width: '11.5%' }}
            >
              {amount}/-
            </div>

            {/* ================= BOTTOM SLIP OVERLAYS (MAIN DONOR PAVTI) ================= */}
            <div 
              className="absolute font-serif font-extrabold text-[#7f1d1d] text-[11px] sm:text-base" 
              style={{ top: '82.2%', left: '10%' }}
            >
              {receiptNo}
            </div>

            <div 
              className="absolute font-sans font-bold text-gray-900 text-[11px] sm:text-base" 
              style={{ top: '82.2%', left: '81%' }}
            >
              {dateStr}
            </div>

            <div 
              className="absolute font-sans font-bold text-gray-900 text-xs sm:text-lg truncate" 
              style={{ top: '85.7%', left: '10%', width: '54%' }}
            >
              {donorName}
            </div>

            <div 
              className="absolute font-sans font-bold text-gray-900 text-[11px] sm:text-base truncate" 
              style={{ top: '89.2%', left: '24%', width: '38%' }}
            >
              {amountWords}
            </div>

            <div 
              className="absolute font-serif font-extrabold text-white text-sm sm:text-xl text-center" 
              style={{ top: '85.0%', left: '80.5%', width: '15.5%' }}
            >
              {amount}/-
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
                ✓ Verified Pavti
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
