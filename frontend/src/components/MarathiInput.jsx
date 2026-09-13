import React, { useState } from 'react';
import MarathiKeyboardModal from './MarathiKeyboardModal';

export default function MarathiInput({ 
  type = 'text', 
  name, 
  value = '', 
  onChange, 
  placeholder = '', 
  className = '', 
  required = false,
  label = '',
  disabled = false
}) {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const handleKeyboardValueChange = (newVal) => {
    onChange({
      target: {
        name,
        value: newVal
      }
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <div className="w-full flex flex-col gap-1 relative">
      {label && (
        <div className="flex items-center justify-between mb-0.5">
          <label className="block text-xs font-bold text-[#281714]">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <button 
            type="button"
            onClick={() => setIsKeyboardOpen(true)}
            className="text-[11px] font-bold text-[#d14307] hover:text-[#a93200] flex items-center gap-1 bg-[#ffe9e5] hover:bg-[#ffe2dd] px-2 py-0.5 rounded transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[14px]">keyboard</span>
            <span>⌨️ मराठी कीबोर्ड</span>
          </button>
        </div>
      )}

      <div className="relative flex items-center">
        <input 
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`${className} pr-24`}
        />
        <button 
          type="button"
          onClick={() => setIsKeyboardOpen(true)}
          title="मराठी कीबोर्ड उघडा"
          className="absolute right-2 text-xs font-bold px-2 py-1 bg-[#ffe9e5] text-[#d14307] hover:bg-[#d14307] hover:text-white rounded transition-colors flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">keyboard</span>
          <span>कीबोर्ड</span>
        </button>
      </div>

      <MarathiKeyboardModal 
        isOpen={isKeyboardOpen}
        onClose={() => setIsKeyboardOpen(false)}
        targetField={label || name}
        value={value}
        onChange={handleKeyboardValueChange}
      />
    </div>
  );
}
