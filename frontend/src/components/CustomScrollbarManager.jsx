import React, { useState, useEffect, useRef } from 'react';

/**
 * Suvarna Touch-Enabled Interactive Top Scrollbar
 * - Fixed Suvarna (Golden-Saffron) festival aesthetic
 * - 100% interactive by touch, drag, and click across full screen width
 * - Default browser scrollbars removed globally
 */
export default function CustomScrollbarManager() {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const barRef = useRef(null);

  // Sync scroll percentage from window scroll (when not dragging)
  useEffect(() => {
    const handleScroll = () => {
      if (isDragging) return;
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const pct = Math.min(100, Math.max(0, (window.scrollY / totalScroll) * 100));
        setScrollPercentage(pct);
      } else {
        setScrollPercentage(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDragging]);

  // Translate horizontal position (0 -> window.innerWidth) to vertical page scroll
  const updateScrollFromClientX = (clientX) => {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (totalScroll <= 0) return;
    const width = window.innerWidth;
    const ratio = Math.min(1, Math.max(0, clientX / width));
    setScrollPercentage(ratio * 100);
    window.scrollTo({
      top: ratio * totalScroll,
      behavior: 'auto' // Instant responsive dragging
    });
  };

  // Touch Start Handler
  const handleTouchStart = (e) => {
    setIsDragging(true);
    if (e.touches && e.touches[0]) {
      updateScrollFromClientX(e.touches[0].clientX);
    }
  };

  // Mouse Down Handler
  const handleMouseDown = (e) => {
    setIsDragging(true);
    updateScrollFromClientX(e.clientX);
  };

  // Global listeners during touch/mouse drag
  useEffect(() => {
    if (!isDragging) return;

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        updateScrollFromClientX(e.touches[0].clientX);
      }
    };

    const handleMouseMove = (e) => {
      updateScrollFromClientX(e.clientX);
    };

    const handleDragEnd = () => {
      setIsDragging(false);
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleDragEnd);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleDragEnd);

    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleDragEnd);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging]);

  return (
    <div 
      ref={barRef}
      onTouchStart={handleTouchStart}
      onMouseDown={handleMouseDown}
      className="fixed top-0 left-0 right-0 h-4 sm:h-5 z-[9999] cursor-ew-resize select-none touch-none no-print flex items-start group"
      title="सुवर्ण स्क्रोलबार: स्क्रोल करण्यासाठी स्पर्श करा किंवा ड्रॅग करा (Touch or Drag to Scroll)"
    >
      {/* Background track (semi-transparent hit target) */}
      <div className="w-full h-1.5 sm:h-2 bg-amber-950/20 backdrop-blur-xs relative overflow-visible transition-all group-hover:h-2.5">
        
        {/* Suvarna (Gold-Saffron-Flame) Progress Fill */}
        <div 
          className="h-full bg-gradient-to-r from-[#ffd700] via-[#fe932c] to-[#d14307] shadow-[0_0_12px_rgba(255,215,0,0.85)] relative transition-all duration-75"
          style={{ width: `${scrollPercentage}%` }}
        >
          {/* Interactive Golden Pearl Bead Handle at the leading tip */}
          <div 
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-tr from-[#ffe066] to-[#ffd700] border-2 border-white shadow-lg ring-4 ring-amber-500/40 cursor-grab active:cursor-grabbing transition-transform ${
              isDragging ? 'scale-125 ring-amber-400' : 'group-hover:scale-110'
            }`}
          >
            {/* Center golden jewel dot */}
            <div className="w-1.5 h-1.5 rounded-full bg-[#d14307] absolute inset-0 m-auto"></div>
          </div>
        </div>

      </div>
    </div>
  );
}
