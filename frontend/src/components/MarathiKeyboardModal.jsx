import React, { useState, useEffect } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

export default function MarathiKeyboardModal({ isOpen, onClose, targetField = 'मराठी मजकूर', value = '', onChange }) {
  const [layoutName, setLayoutName] = useState('default');
  const [inputVal, setInputVal] = useState(value || '');

  useEffect(() => {
    setInputVal(value || '');
  }, [value, isOpen]);

  if (!isOpen) return null;

  // Complete Marathi Devanagari Layouts
  const marathiLayout = {
    // 1. Default: Swar + Vyanjan + Essential Matras
    default: [
      "अ आ इ ई उ ऊ ऋ ए ऐ ओ औ अं अः ॲ ऑ",
      "क ख ग घ ङ च छ ज झ ञ",
      "ट ठ ड ढ ण त थ द ध न",
      "प फ ब भ म य र ल व श",
      "ष स ह ळ क्ष ज्ञ त्र श्र ० १ २",
      "३ ४ ५ ६ ७ ८ ९ {bksp} {space}"
    ],
    // 2. Matras & Signs: Kana, Velanti, Ukar, Ekara, Anusvar, Visarga, Halant, Avagraha
    matras: [
      "ा ि ी ु ू ृ े ै ो ौ ॅ ॉ",
      "ं ः ् ऽ ॐ ॥ । , . - ( )",
      "क ख ग घ ङ च छ ज झ ञ",
      "ट ठ ड ढ ण त थ द ध न",
      "प फ ब भ म य र ल व श",
      "ष स ह ळ क्ष ज्ञ {bksp} {space}"
    ],
    // 3. Numbers & Symbols
    numbers: [
      "० १ २ ३ ४ ५ ६ ७ ८ ९",
      "0 1 2 3 4 5 6 7 8 9",
      "+ - * / = % @ # $ &",
      "॥ । , . ? ! : ; ' \"",
      "{bksp} {space}"
    ]
  };

  const quickMatras = [
    { label: 'ा (काना)', char: 'ा' },
    { label: 'ि (वेलांटी १)', char: 'ि' },
    { label: 'ी (वेलांटी २)', char: 'ी' },
    { label: 'ु (उकार १)', char: 'ु' },
    { label: 'ू (उकार २)', char: 'ू' },
    { label: 'े (मात्रा १)', char: 'े' },
    { label: 'ै (मात्रा २)', char: 'ै' },
    { label: 'ो (काना-मात्रा)', char: 'ो' },
    { label: 'ौ (काना-२ मात्रा)', char: 'ौ' },
    { label: 'ं (अनुस्वार)', char: 'ं' },
    { label: 'ः (विसर्ग)', char: 'ः' },
    { label: '् (जोडअक्षर/हलांत)', char: '्' },
    { label: 'ॅ (ऑ-१)', char: 'ॅ' },
    { label: 'ॉ (ऑ-२)', char: 'ॉ' },
    { label: 'ऽ (अवग्रह)', char: 'ऽ' },
    { label: 'ृ (ऋ-मात्रा)', char: 'ृ' }
  ];

  const handleKeyPress = (button) => {
    let newVal = inputVal;
    if (button === "{bksp}") {
      newVal = inputVal.slice(0, -1);
    } else if (button === "{space}") {
      newVal = inputVal + " ";
    } else {
      newVal = inputVal + button;
    }

    setInputVal(newVal);
    onChange(newVal);
  };

  const handleAppendChar = (char) => {
    const newVal = inputVal + char;
    setInputVal(newVal);
    onChange(newVal);
  };

  const handleClear = (e) => {
    e.preventDefault();
    setInputVal('');
    onChange('');
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-2 sm:p-4 no-print"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-[#ffe9e5] overflow-hidden flex flex-col max-h-[95vh] animate-fadeIn">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#d14307] to-[#a93200] text-white p-3.5 sm:p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px]">keyboard</span>
            <div>
              <h3 className="font-headline text-sm sm:text-base font-bold">अधिकृत मराठी कीबोर्ड (Devanagari Keypad)</h3>
              <p className="text-[11px] text-white/80">इनपुट क्षेत्र: <b className="text-[#fe932c]">{targetField}</b></p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-3 sm:p-4 flex flex-col gap-3 overflow-y-auto">
          
          {/* Live Output Box */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[#281714]">मराठी मजकूर (Output)</label>
              <span className="text-[11px] text-[#00873a] font-bold">✓ मराठी टंकलेखन सक्रिय</span>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={inputVal} 
                onChange={(e) => {
                  setInputVal(e.target.value);
                  onChange(e.target.value);
                }}
                onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                className="w-full p-3 bg-[#fff0ee] border-2 border-[#d14307] rounded-xl font-bold text-base sm:text-lg text-[#281714] focus:outline-none"
                placeholder="खालील कीबोर्ड वापरून टाईप करा..."
              />
              <button 
                type="button"
                onClick={handleClear}
                className="bg-gray-200 hover:bg-red-500 hover:text-white px-3 py-3 rounded-xl text-xs font-bold shrink-0 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Quick Matras & Anusvar Toolbar */}
          <div className="bg-[#ffe9e5]/60 p-2 rounded-xl border border-[#fe932c]/30">
            <span className="block text-[11px] font-bold text-[#904d00] mb-1.5">
              ✨ जलद मात्रा, काना, अनुस्वार व जोडशब्द पट्टी (Quick Matras & Diacritics):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickMatras.map((m, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAppendChar(m.char)}
                  className="bg-white hover:bg-[#d14307] hover:text-white text-[#281714] border border-[#fe932c]/40 font-bold px-2.5 py-1 rounded-lg text-xs sm:text-sm shadow-xs transition-all active:scale-95 flex items-center justify-center min-w-[34px]"
                  title={m.label}
                >
                  {m.char}
                </button>
              ))}
            </div>
          </div>

          {/* Keypad Layout Tabs & Switcher */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#281714]">अक्षरपट प्रकार chọn करा:</span>
              <div className="flex gap-1 bg-[#fff0ee] p-1 rounded-lg border border-[#ffe9e5]">
                <button 
                  type="button"
                  onClick={() => setLayoutName('default')}
                  className={`text-xs px-2.5 py-1 rounded-md font-bold transition-all ${layoutName === 'default' ? 'bg-[#d14307] text-white shadow-xs' : 'text-[#5a4139] hover:bg-white'}`}
                >
                  स्वर व व्यंजन
                </button>
                <button 
                  type="button"
                  onClick={() => setLayoutName('matras')}
                  className={`text-xs px-2.5 py-1 rounded-md font-bold transition-all ${layoutName === 'matras' ? 'bg-[#d14307] text-white shadow-xs' : 'text-[#5a4139] hover:bg-white'}`}
                >
                  मात्रा व अनुस्वार
                </button>
                <button 
                  type="button"
                  onClick={() => setLayoutName('numbers')}
                  className={`text-xs px-2.5 py-1 rounded-md font-bold transition-all ${layoutName === 'numbers' ? 'bg-[#d14307] text-white shadow-xs' : 'text-[#5a4139] hover:bg-white'}`}
                >
                  अंक व चिन्हे
                </button>
              </div>
            </div>

            {/* Simple Keyboard Component */}
            <div className="marathi-keyboard-container rounded-xl overflow-hidden border border-[#ffe9e5] p-2 bg-[#fff8f6] shadow-inner">
              <Keyboard
                layoutName={layoutName}
                layout={marathiLayout}
                onKeyPress={handleKeyPress}
                display={{
                  "{bksp}": "⌫ मिटवा",
                  "{space}": "स्पेस (Space)"
                }}
              />
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-[#fff0ee] p-3 px-4 flex items-center justify-between border-t border-[#ffe9e5]">
          <span className="text-xs text-[#5a4139] font-medium">✓ संपूर्ण देवनागरी मात्रा व अनुस्वार समाविष्ट</span>
          <button 
            type="button"
            onClick={onClose}
            className="bg-[#00873a] hover:bg-[#006b2c] text-white px-6 py-2 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
          >
            पूर्ण झाले (Done)
          </button>
        </div>

      </div>
    </div>
  );
}

