import React, { useState } from 'react';
import { romanToDevanagari, romanWordToDevanagari } from '../utils/transliteration';
import MarathiKeyboardModal from './MarathiKeyboardModal';

/**
 * Smart Search Input with Dual-Script Support (English & Marathi):
 * - Live Transliteration (English ➔ Marathi) toggle
 * - 1-Click "मराठीत बदला" quick converter badge
 * - Virtual Marathi Keyboard modal integration
 * - Instant clear (✕) button
 * - Explanatory hint for users searching Marathi records using English names
 */
export default function MarathiSearchInput({
  value = '',
  onChange,
  placeholder = 'नाव / मोबाईल / शेरा शोधा (उदा. sachin, pawar, biradwade)...',
  className = '',
  showInfoTip = true,
  dark = false,
  autoFocus = false
}) {
  const [liveTranslit, setLiveTranslit] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // Check if current search string has English letters
  const hasEnglish = /[a-zA-Z]/.test(value);
  const convertedPreview = hasEnglish ? romanToDevanagari(value) : '';

  // Handle standard input change
  const handleInputChange = (e) => {
    const val = e.target.value;
    onChange(val);
  };

  // Live transliteration on key down (e.g. when spacebar is pressed)
  const handleKeyDown = (e) => {
    if (liveTranslit && (e.key === ' ' || e.key === 'Enter')) {
      const parts = value.split(/(\s+)/);
      const convertedParts = parts.map(chunk => /^\s+$/.test(chunk) ? chunk : romanWordToDevanagari(chunk));
      const newVal = convertedParts.join('');
      if (newVal !== value) {
        onChange(newVal + (e.key === ' ' ? ' ' : ''));
        if (e.key === ' ') e.preventDefault();
      }
    }
  };

  // Convert the whole string to Marathi now
  const handleConvertNow = () => {
    if (convertedPreview) {
      onChange(convertedPreview);
    }
  };

  // Clear query
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="relative flex items-center">
        {/* Search Icon */}
        <span className={`material-symbols-outlined absolute left-3 text-[18px] pointer-events-none ${dark ? 'text-amber-200/50' : 'text-[#a93200]/50'}`}>
          search
        </span>

        {/* The Search Input */}
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          placeholder={placeholder}
          className={`w-full pl-9 pr-24 py-2 rounded-xl text-xs transition-all outline-none ${
            dark
              ? 'bg-black/30 border border-amber-500/30 text-amber-100 placeholder-amber-200/40 focus:border-amber-400 focus:ring-1 focus:ring-amber-400'
              : 'bg-white border border-[#d14307]/30 text-[#281714] placeholder-[#5a4139]/60 focus:border-[#d14307] focus:ring-1 focus:ring-[#d14307]'
          } ${className}`}
        />

        {/* Right Action Icons: Live Translit Toggle, Keyboard, Clear */}
        <div className="absolute right-2 flex items-center gap-1">
          {/* 1-Click Clear Button */}
          {value && (
            <button
              type="button"
              onClick={handleClear}
              title="शोध साफ करा"
              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition ${
                dark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-700'
              }`}
            >
              ✕
            </button>
          )}

          {/* Live Transliteration Mode Toggle */}
          <button
            type="button"
            onClick={() => setLiveTranslit(prev => !prev)}
            title={liveTranslit ? 'लाईव्ह मराठी टाईपिंग चालू आहे (बंद करण्यासाठी क्लिक करा)' : 'लाईव्ह मराठी टाईपिंग चालू करा (इंग्रजी शब्दांनंतर स्पेस देताच मराठी होईल)'}
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5 border transition ${
              liveTranslit
                ? 'bg-[#00873a] text-white border-emerald-600 shadow-xs'
                : (dark ? 'bg-white/10 text-amber-200 border-white/20 hover:bg-white/20' : 'bg-[#ffe9e5] text-[#a93200] border-[#d14307]/30 hover:bg-[#ffe0da]')
            }`}
          >
            <span className="text-[11px]">{liveTranslit ? '🚩' : '🔤'}</span>
            <span className="hidden sm:inline">{liveTranslit ? 'मराठी' : 'EN➔MR'}</span>
          </button>

          {/* Virtual Keyboard Modal Trigger */}
          <button
            type="button"
            onClick={() => setIsKeyboardOpen(true)}
            title="मराठी कीबोर्ड उघडा"
            className={`p-1 rounded text-xs transition ${
              dark ? 'text-amber-200 hover:bg-white/10' : 'text-[#a93200] hover:bg-[#ffe9e5]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] block">keyboard</span>
          </button>
        </div>
      </div>

      {/* Dynamic 1-Click "मराठीत बदला" Suggestion Badge if user typed in English */}
      {hasEnglish && convertedPreview && convertedPreview !== value && (
        <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] animate-fadeIn">
          <button
            type="button"
            onClick={handleConvertNow}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold border transition ${
              dark 
                ? 'bg-amber-950/70 border-amber-400/40 text-amber-200 hover:bg-amber-900' 
                : 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100 shadow-xs'
            }`}
            title="शोधातील इंग्रजी अक्षरांचे मराठीमध्ये रूपांतर करण्यासाठी क्लिक करा"
          >
            <span>✨ मराठीत बदला:</span>
            <span className="underline decoration-amber-500 font-extrabold font-headline">"{convertedPreview}"</span>
            <span className="text-[10px] opacity-80">(क्लिक करा)</span>
          </button>

          {showInfoTip && (
            <span className={`text-[10px] italic ${dark ? 'text-amber-200/60' : 'text-[#5a4139]'}`}>
              ✓ इंग्रजीत टाईप केले तरीही मराठी नोंदी शोधल्या जातात.
            </span>
          )}
        </div>
      )}

      {/* Keyboard Modal */}
      <MarathiKeyboardModal
        isOpen={isKeyboardOpen}
        onClose={() => setIsKeyboardOpen(false)}
        targetField="शोध बार (Search Lookup)"
        value={value}
        onChange={(newVal) => onChange(newVal)}
      />
    </div>
  );
}
