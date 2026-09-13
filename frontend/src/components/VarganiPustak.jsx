import React, { useState } from 'react';
import MandalPavtiModal from './MandalPavtiModal';

export default function VarganiPustak({ records, festivalYear, editionText }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isMandalModalOpen, setIsMandalModalOpen] = useState(false);

  const displayRecords = records || [];

  if (displayRecords.length === 0) {
    return (
      <div className="bg-[#FFFDF9] p-8 rounded-3xl border-2 border-[#fe932c]/40 shadow-lg text-center my-6">
        <div className="w-16 h-16 rounded-full bg-[#ffe9e5] text-[#a93200] flex items-center justify-center font-bold text-2xl mx-auto mb-3">
          📖
        </div>
        <h3 className="font-headline text-xl font-bold text-[#a93200] mb-1">
          चित्रमय वर्गणी पुस्तक ({festivalYear})
        </h3>
        <p className="text-xs text-[#5a4139] font-bold">
          अद्याप कोणतीही वर्गणी पावती नोंदवलेली नाही. (Empty Slate)
        </p>
      </div>
    );
  }

  const currentRecord = displayRecords[currentPage % displayRecords.length];

  return (
    <div className="bg-gradient-to-br from-[#ffe9e5] to-[#fff0ee] p-6 sm:p-8 rounded-3xl border-2 border-[#fe932c]/40 shadow-xl relative overflow-hidden my-6">
      
      {/* Decorative Book Header Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-dashed border-[#d14307]/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#d14307] text-white flex items-center justify-center font-bold text-xl shadow-md border-2 border-[#fe932c]">
            📖
          </div>
          <div>
            <span className="text-xs text-[#d14307] font-bold block uppercase tracking-wider">॥ अधिकृत नोंदवही ॥</span>
            <h2 className="font-headline text-2xl font-bold text-[#281714]">चित्रमय वर्गणी पुस्तक (Vargani Pustak Ledger)</h2>
            <span className="text-xs text-[#5a4139] font-bold">सार्वजनिक गणेशोत्सव {festivalYear} • {editionText || '४९ वे वर्ष'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            className="px-3 py-1.5 rounded-lg bg-white border text-xs font-bold text-[#281714] disabled:opacity-40 hover:bg-[#ffe9e5]"
          >
            ← मागे
          </button>
          <span className="text-xs font-bold text-[#a93200] bg-white px-3 py-1.5 rounded-lg border border-[#ffe9e5]">
            पावती {currentPage + 1} / {displayRecords.length}
          </span>
          <button 
            disabled={currentPage >= displayRecords.length - 1}
            onClick={() => setCurrentPage(prev => Math.min(displayRecords.length - 1, prev + 1))}
            className="px-3 py-1.5 rounded-lg bg-white border text-xs font-bold text-[#281714] disabled:opacity-40 hover:bg-[#ffe9e5]"
          >
            पुढे →
          </button>
        </div>
      </div>

      {/* Realistic Physical Receipt Book Canvas */}
      <div id="printable-pustak" className="printable-section bg-[#FFFDF9] rounded-2xl border-4 border-[#d14307] shadow-2xl p-6 sm:p-8 relative">
        
        {/* Book Binding Stitch Left Side */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-[#802b05] rounded-l-md flex flex-col justify-around items-center py-4">
          <div className="w-2 h-2 rounded-full bg-[#fe932c]"></div>
          <div className="w-2 h-2 rounded-full bg-[#fe932c]"></div>
          <div className="w-2 h-2 rounded-full bg-[#fe932c]"></div>
        </div>

        <div className="pl-4">
          {/* Header of Receipt Stub */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[#e3bfb4]">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <img src="/logo.png" alt="Logo" className="h-16 w-auto rounded-lg shadow-sm object-contain bg-white/80 p-1 border border-[#d14307]/30"/>
              <div>
                <span className="bg-[#fe932c]/20 text-[#904d00] text-[10px] px-2 py-0.5 rounded-full font-bold">
                  ॥ मानाचा गणपती ॥
                </span>
                <h3 className="font-headline text-xl text-[#a93200] font-bold">यंगस्टार मित्र मंडळ</h3>
                <p className="text-[11px] text-[#5a4139]">माळीनगर - देहुगाव, ता. हवेली, जि. पुणे - ४१२१०९ • स्थापना १९७७</p>
              </div>
            </div>

            <div className="text-right bg-[#ffe9e5] p-3 rounded-xl border border-[#fe932c]">
              <span className="text-[10px] text-[#5a4139] block font-bold">पावती क्रमांक</span>
              <span className="font-headline text-lg font-bold text-[#d14307]">{currentRecord.receipt_no}</span>
            </div>
          </div>

          {/* Main Body Grid */}
          <div className="py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="bg-[#fff8f6] p-3 rounded-xl border border-[#ffe9e5]">
              <span className="text-[#5a4139] font-bold block text-[10px]">श्री / सौ / कुमारी:</span>
              <span className="font-bold text-sm text-[#281714]">{currentRecord.donor_name}</span>
            </div>
            
            <div className="bg-[#fff8f6] p-3 rounded-xl border border-[#ffe9e5]">
              <span className="text-[#5a4139] font-bold block text-[10px]">उत्सव देणगी प्रकार:</span>
              <span className="font-bold text-sm text-[#006b2c]">{currentRecord.category}</span>
            </div>

            <div className="bg-[#fff8f6] p-3 rounded-xl border border-[#ffe9e5]">
              <span className="text-[#5a4139] font-bold block text-[10px]">वर्गणी रक्कम:</span>
              <span className="font-bold text-base text-[#d14307]">₹ {currentRecord.amount?.toLocaleString('mr-IN')}/-</span>
            </div>

            <div className="bg-[#fff8f6] p-3 rounded-xl border border-[#ffe9e5] sm:col-span-2">
              <span className="text-[#5a4139] font-bold block text-[10px]">रक्कम अक्षरी:</span>
              <span className="font-bold text-xs text-[#281714]">{currentRecord.amount_words}</span>
            </div>

            <div className="bg-[#fff8f6] p-3 rounded-xl border border-[#ffe9e5]">
              <span className="text-[#5a4139] font-bold block text-[10px]">भरणा मोड:</span>
              <span className={`font-bold text-xs ${currentRecord.payment_mode === 'Pay Later' ? 'text-amber-600' : 'text-[#006b2c]'}`}>
                {currentRecord.payment_mode}
              </span>
            </div>

            {currentRecord.remarks && (
              <div className="bg-[#fff0ee] p-3 rounded-xl border border-[#d14307]/30 sm:col-span-3">
                <span className="text-[#a93200] font-bold block text-[10px]">शेरा / खास टिप्पणी (Remarks):</span>
                <span className="font-semibold text-xs text-[#281714]">{currentRecord.remarks}</span>
              </div>
            )}
          </div>

          {/* Stamp & Footer Watermark */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#e3bfb4]">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#a93200] flex items-center justify-center text-[9px] font-bold text-[#a93200] text-center p-1 transform -rotate-12">
                स्वीकृत ठप्पा <br/>YMM {festivalYear}
              </div>
              <div>
                <span className="text-[10px] text-[#5a4139] font-bold block">डिजिटल पडताळणीकृत पावती पुस्तक</span>
                
                {/* Lock / Unlock Mandal Pavti Button */}
                {currentRecord.payment_mode === 'Pay Later' || currentRecord.payment_status === 'PENDING' ? (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 inline-block mt-0.5">
                    🔒 देणगी बाकी - मंडळ पावती लॉक आहे
                  </span>
                ) : (
                  <button 
                    onClick={() => setIsMandalModalOpen(true)}
                    className="text-[11px] font-bold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 px-2.5 py-1 rounded-md shadow-sm border border-amber-400 inline-flex items-center gap-1 mt-0.5"
                  >
                    <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
                    <span>✨ अधिकृत मंडळ पावती (Mandal Pavti)</span>
                  </button>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-[#a93200] block">राहुल शिंदे</span>
              <span className="text-[10px] text-[#5a4139]">खजिनदार, यंगस्टार मित्र मंडळ</span>
            </div>
          </div>

          <MandalPavtiModal 
            isOpen={isMandalModalOpen} 
            onClose={() => setIsMandalModalOpen(false)} 
            record={{
              receiptNo: currentRecord.receipt_no || currentRecord.receiptNo,
              donorName: currentRecord.donor_name || currentRecord.donorName,
              amount: currentRecord.amount,
              amountWords: currentRecord.amount_words || currentRecord.amountWords,
              date: currentRecord.date || currentRecord.created_at
            }} 
          />
        </div>

      </div>
    </div>
  );
}

