import React, { useState, useEffect, useRef, useLayoutEffect, useMemo, useCallback } from 'react';
import { CALENDAR_CONSTANTS, MONTHS_TR, MONTHS_EN, DAYS_TR, DAYS_EN } from '../../utils/constants';
import { hexToRgb } from '../../utils/helpers';
import { ChevronLeft, ChevronRight, CalendarIcon, X } from './icons';


/* ==================================================================================
   CUSTOM HOOKS
   ================================================================================== */

const useCalendarLogic = (initialDate, selectionMode) => {
  const [currentDate] = useState(() => initialDate || new Date());
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedDay, setSelectedDay] = useState(currentDate.getDate());
  const [isMonthListVisible, setIsMonthListVisible] = useState(false);
  const [isYearListVisible, setIsYearListVisible] = useState(false);

  const endYear = new Date().getFullYear() + 5;
  const years = useMemo(() =>
    Array.from({ length: endYear - CALENDAR_CONSTANTS.START_YEAR + 1 }, (_, i) => endYear - i),
    [endYear]
  );

  // Day validation effect
  useEffect(() => {
    const daysInMonth = new Date(selectedYear, selectedMonthIndex + 1, 0).getDate();
    if (selectedDay > daysInMonth) setSelectedDay(daysInMonth);
  }, [selectedMonthIndex, selectedYear, selectedDay]);

  // Calendar data generation
  const calendarData = useMemo(() => {
    if (selectionMode === 'day') {
      const days = Array.from({ length: 31 }, (_, i) => ({ day: i + 1, currentMonth: true }));
      const totalSlots = 35;
      const remainingSlots = totalSlots - days.length;
      for (let i = 1; i <= remainingSlots; i++) days.push({ day: i, currentMonth: false });
      return days;
    }

    let firstDayOfWeek = new Date(selectedYear, selectedMonthIndex, 1).getDay();
    if (firstDayOfWeek === 0) firstDayOfWeek = 7;
    const startOffset = firstDayOfWeek - 1;
    const daysInCurrentMonth = new Date(selectedYear, selectedMonthIndex + 1, 0).getDate();
    const daysInPrevMonth = new Date(selectedYear, selectedMonthIndex, 0).getDate();

    const days = [];
    for (let i = 0; i < startOffset; i++) {
      days.push({ day: daysInPrevMonth - startOffset + 1 + i, currentMonth: false });
    }
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      days.push({ day: i, currentMonth: true });
    }

    const totalSlots = days.length > 35 ? 42 : 35;
    const remainingSlots = totalSlots - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      days.push({ day: i, currentMonth: false });
    }

    return days;
  }, [selectedYear, selectedMonthIndex, selectionMode]);

  const handleDayClick = useCallback((day) => {
    setSelectedDay(day);
  }, []);

  return {
    selectedMonthIndex,
    setSelectedMonthIndex,
    selectedYear,
    setSelectedYear,
    selectedDay,
    setSelectedDay,
    isMonthListVisible,
    setIsMonthListVisible,
    isYearListVisible,
    setIsYearListVisible,
    calendarData,
    years,
    handleDayClick
  };
};

/* ==================================================================================
   TURK-UI COMPONENTS (LIBRARY)
   ================================================================================== */

const Styles = React.memo(() => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    .turkui-no-scrollbar::-webkit-scrollbar { display: none; }
    .turkui-no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    @keyframes modalEnter {
        from { opacity: 0; transform: scale(0.95) translateY(5px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .animate-modal-enter {
        animation: modalEnter 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        will-change: transform, opacity;
        transform: translateZ(0);
    }

    @keyframes dropdownEnter {
        from { opacity: 0; transform: translate(-50%, -10px) scale(0.95); }
        to { opacity: 1; transform: translate(-50%, 0) scale(1); }
    }
    .animate-dropdown-enter {
        animation: dropdownEnter 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        will-change: transform, opacity;
        transform: translateZ(0);
    }
  `}</style>
));

const WheelPicker = React.memo(({
  items,
  selectedValue,
  onChange,
  onSelect,
  height = 150,
  active = true,
  fontSize = 12,
  itemHeight = 20,
  width = '100%'
}) => {
  const listRef = useRef(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollTimeout = useRef(null);
  const ignoreScroll = useRef(false);

  const ITEM_HEIGHT = itemHeight;
  const PADDING_Y = (height - ITEM_HEIGHT) / 2;
  const { RENDER_RANGE } = CALENDAR_CONSTANTS;

  // Use single list instead of extended items
  const [activeIndex, setActiveIndex] = useState(() => {
    const currentIndex = items.indexOf(selectedValue);
    return currentIndex === -1 ? 0 : currentIndex;
  });

  useLayoutEffect(() => {
    if (!listRef.current || !active) return;

    const currentIndex = items.indexOf(selectedValue);
    if (currentIndex === -1) return;

    const targetScroll = currentIndex * ITEM_HEIGHT;

    if (!isUserScrolling) {
      ignoreScroll.current = true;
      listRef.current.scrollTop = targetScroll;
      setActiveIndex(currentIndex);
      setTimeout(() => { ignoreScroll.current = false; }, 50);
    }
  }, [selectedValue, items, isUserScrolling, active, ITEM_HEIGHT]);

  const handleScroll = useCallback((e) => {
    const scrollTop = e.target.scrollTop;

    if (ignoreScroll.current) return;

    const rawIndex = Math.round(scrollTop / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(rawIndex, items.length - 1));
    
    if (clampedIndex !== activeIndex) setActiveIndex(clampedIndex);

    setIsUserScrolling(true);
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

    const newItem = items[clampedIndex];
    if (newItem && newItem !== selectedValue) onChange(newItem);

    scrollTimeout.current = setTimeout(() => {
      setIsUserScrolling(false);
      const exactScroll = clampedIndex * ITEM_HEIGHT;
      if (Math.abs(scrollTop - exactScroll) > 1) {
        listRef.current?.scrollTo({ top: exactScroll, behavior: 'smooth' });
      }
    }, CALENDAR_CONSTANTS.SCROLL_DEBOUNCE);
  }, [activeIndex, ITEM_HEIGHT, items, onChange, selectedValue]);

  const handleItemClick = useCallback((index, item) => {
    if (!listRef.current) return;
    const targetScroll = index * ITEM_HEIGHT;
    listRef.current.scrollTo({ top: targetScroll, behavior: 'smooth' });
    if (onSelect) {
      setTimeout(() => onSelect(item), 350);
    }
  }, [ITEM_HEIGHT, onSelect]);

  const highlightStyle = useMemo(() => ({
    top: '50%',
    transform: 'translateY(-50%)',
    height: `${ITEM_HEIGHT}px`,
    background: 'rgba(var(--text-rgb), 0.1)',
    borderTop: '1px solid rgba(var(--text-rgb), 0.2)',
    borderBottom: '1px solid rgba(var(--text-rgb), 0.2)',
    borderRadius: '4px',
    zIndex: 0
  }), [ITEM_HEIGHT]);

  const listStyle = useMemo(() => ({
    paddingTop: `${PADDING_Y}px`,
    paddingBottom: `${PADDING_Y}px`,
    perspective: '500px',
    perspectiveOrigin: 'center center'
  }), [PADDING_Y]);

  return (
    <div className="relative h-full overflow-hidden select-none group font-sans" style={{ width }}>
      <div className="absolute w-full left-0 pointer-events-none" style={highlightStyle} />
      <ul
        ref={listRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto turkui-no-scrollbar relative z-10"
        style={listStyle}
      >
        {items.map((item, index) => {
          if (Math.abs(index - activeIndex) > RENDER_RANGE) {
            return <li key={index} style={{ height: `${ITEM_HEIGHT}px` }} />;
          }

          const offset = index - activeIndex;
          const absOffset = Math.abs(offset);
          const isActive = item === selectedValue;

          const rotateX = offset * 25;
          const scale = Math.max(0.7, 1 - (absOffset * 0.08));
          const opacity = Math.max(0.1, 1 - (absOffset * 0.25));
          const currentFontSize = isActive ? fontSize : Math.max(8, fontSize * 0.85);

          return (
            <li
              key={index}
              className="flex items-center justify-center cursor-pointer transition-colors duration-100 ease-linear origin-center"
              style={{
                height: `${ITEM_HEIGHT}px`,
                color: isActive ? 'rgb(var(--primary-rgb))' : 'rgb(var(--text-rgb))',
                fontSize: `${currentFontSize}px`,
                fontWeight: isActive ? 700 : 400,
                transform: `rotateX(${rotateX}deg) scale(${scale})`,
                opacity,
                backfaceVisibility: 'hidden',
                WebkitFontSmoothing: 'antialiased'
              }}
              onClick={() => handleItemClick(index, item)}
            >
              {item}
            </li>
          );
        })}
      </ul>
    </div>
  );
});

WheelPicker.displayName = 'WheelPicker';

/* ==================================================================================
   SHARED RENDER LOGIC FOR MODAL & DROPDOWN
   ================================================================================== */

const SharedCalendarContent = React.memo(({
  selectedMonthIndex, selectedYear, selectedDay,
  setSelectedMonthIndex, setSelectedYear, setSelectedDay, handleDayClick,
  isMonthListVisible, setIsMonthListVisible, isYearListVisible, setIsYearListVisible,
  calendarData, years,
  onClose, contentBgStyle, sidePanelStyle,
  selectionMode, isCompact, onDateChange,
  MONTHS, DAYS
}) => {
  // Sync local state to parent live
  useEffect(() => {
    const daysCount = selectionMode === 'day' ? 31 : new Date(selectedYear, selectedMonthIndex + 1, 0).getDate();
    const validDay = Math.min(selectedDay, daysCount);

    if (validDay !== selectedDay) {
      setSelectedDay(validDay);
    }

    const newDate = new Date(selectedYear, selectedMonthIndex, validDay);
    const now = new Date();
    newDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());

    onDateChange?.(newDate);
  }, [selectedYear, selectedMonthIndex, selectedDay, onDateChange, setSelectedDay, selectionMode]);

  const showDay = selectionMode === 'full' || selectionMode.includes('day');
  const showMonth = selectionMode === 'full' || selectionMode.includes('month');
  const showYear = selectionMode === 'full' || selectionMode.includes('year');

  const pickerFontSize = isCompact ? 14 : 12;
  const pickerItemHeight = isCompact ? 24 : 20;
  const isSidePanelOpen = isMonthListVisible || isYearListVisible;

  const handleMonthChange = useCallback((val) => {
    setSelectedMonthIndex(MONTHS.indexOf(val));
  }, [setSelectedMonthIndex, MONTHS]);

  const handleYearChange = useCallback((val) => {
    setSelectedYear(val);
  }, [setSelectedYear]);

  const toggleMonthList = useCallback(() => {
    setIsMonthListVisible(prev => !prev);
  }, [setIsMonthListVisible]);

  const toggleYearList = useCallback(() => {
    setIsYearListVisible(prev => !prev);
  }, [setIsYearListVisible]);

  const closeMonthList = useCallback(() => setIsMonthListVisible(false), [setIsMonthListVisible]);
  const closeYearList = useCallback(() => setIsYearListVisible(false), [setIsYearListVisible]);

  // NO DAY MODE (PICKER ONLY)
  if (!showDay) {
    return (
      <div className="w-[160px] h-[180px] p-2.5 relative z-20 rounded-xl border border-white/10 shadow-xl overflow-hidden flex items-center justify-center gap-1" style={contentBgStyle}>
        <button onClick={onClose} className="absolute top-1.5 right-1.5 transition-colors z-50 hover:opacity-70" style={{ color: 'rgba(var(--text-rgb), 0.3)' }}>
          <X size={10} />
        </button>

        {showMonth && (
          <WheelPicker
            items={MONTHS}
            selectedValue={MONTHS[selectedMonthIndex]}
            onChange={handleMonthChange}
            height={160}
            fontSize={13}
            width={showYear ? '50%' : '100%'}
          />
        )}

        {showMonth && showYear && <div className="w-px h-32 bg-white/10 shrink-0" />}

        {showYear && (
          <WheelPicker
            items={years}
            selectedValue={selectedYear}
            onChange={handleYearChange}
            height={160}
            fontSize={13}
            width={showMonth ? '50%' : '100%'}
          />
        )}
      </div>
    );
  }

  // DAY GRID MODE
  return (
    <>
      {/* MONTH PICKER (LEFT PANEL) */}
      {showMonth && (
        <div className={`absolute transition-all duration-300 ease-out z-30 ${isCompact ? `inset-0 w-full h-full flex flex-col ${isMonthListVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}` : `top-0 right-full mr-2 h-full w-[65px] ${isMonthListVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}`}`}>
          <div className={`rounded-xl border border-white/20 shadow-xl overflow-hidden ${isCompact ? 'w-full h-full' : 'w-[65px] h-[180px]'}`} style={sidePanelStyle}>
            <WheelPicker
              items={MONTHS}
              selectedValue={MONTHS[selectedMonthIndex]}
              onChange={handleMonthChange}
              onSelect={closeMonthList}
              height={CALENDAR_CONSTANTS.CALENDAR_HEIGHT}
              active={isMonthListVisible}
              fontSize={pickerFontSize}
              itemHeight={pickerItemHeight}
            />
          </div>
        </div>
      )}

      {/* CALENDAR GRID (CENTER PANEL) */}
      <div className={`w-[160px] h-[180px] p-2.5 flex flex-col justify-between relative z-20 rounded-xl border border-white/10 shadow-xl transition-opacity duration-300 ${(isCompact && isSidePanelOpen) ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} style={contentBgStyle}>
        <button onClick={onClose} className="absolute top-1.5 right-1.5 transition-colors z-50 hover:opacity-70" style={{ color: 'rgba(var(--text-rgb), 0.3)' }}>
          <X size={10} />
        </button>

        {/* HEADER (Month/Year) */}
        {(showMonth || showYear) && (
          <div className="flex justify-between items-end px-0.5 mb-1 mt-0.5">
            {/* MONTH HEADER */}
            <div className="flex items-center gap-1 select-none">
              {showMonth && (
                <div onClick={toggleMonthList} className="group flex items-center gap-1 cursor-pointer">
                  <div className={`p-0.5 rounded-full border transition-all duration-300 ${!isMonthListVisible ? 'rotate-180' : ''}`} style={{ borderColor: 'rgba(var(--text-rgb), 0.1)', backgroundColor: 'rgba(var(--text-rgb), 0.05)', color: 'rgba(var(--text-rgb), 0.5)' }}>
                    <ChevronRight size={8} strokeWidth={2.5} />
                  </div>
                  <span className="text-[13px] font-bold tracking-tight transition-opacity group-hover:opacity-80" style={{ color: 'rgb(var(--text-rgb))' }}>
                    {MONTHS[selectedMonthIndex]}
                  </span>
                </div>
              )}
            </div>

            {/* YEAR HEADER */}
            <div className="flex items-center gap-1 select-none">
              {showYear && (
                <div onClick={toggleYearList} className="group flex items-center gap-1 cursor-pointer">
                  <span className="text-[11px] font-medium transition-colors group-hover:opacity-90" style={{ color: 'rgba(var(--text-rgb), 0.6)' }}>
                    {selectedYear}
                  </span>
                  <div className={`p-0.5 rounded-full border transition-all duration-300 ${!isYearListVisible ? 'rotate-180' : ''}`} style={{ borderColor: 'rgba(var(--text-rgb), 0.1)', backgroundColor: 'rgba(var(--text-rgb), 0.05)', color: 'rgba(var(--text-rgb), 0.5)' }}>
                    <ChevronLeft size={8} strokeWidth={2.5} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-7 mb-1 border-b pb-1" style={{ borderColor: 'rgba(var(--text-rgb), 0.1)' }}>
          {DAYS.map((day, i) => (
            <div key={day} className="text-center text-[7px] font-bold uppercase tracking-wide rounded-sm" style={{ color: i >= 5 ? 'rgba(var(--text-rgb), 0.4)' : 'rgba(var(--text-rgb), 0.3)' }}>
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5 flex-1 content-center">
          {calendarData.map((d, index) => {
            const isSelected = d.currentMonth && d.day === selectedDay;
            const isWeekend = (index % 7 === 5) || (index % 7 === 6);

            if (!d.currentMonth && selectionMode === 'day') {
              return <div key={index} className="h-4 w-full" />;
            }

            if (!d.currentMonth) {
              return (
                <div key={index} className="h-4 w-full flex items-center justify-center text-[8px] select-none" style={{ color: 'rgba(var(--text-rgb), 0.2)' }}>
                  {d.day}
                </div>
              );
            }

            return (
              <button
                key={index}
                onClick={() => handleDayClick(d.day)}
                className={`h-4 w-full mx-auto rounded flex items-center justify-center text-[9px] font-medium transition-all duration-150 ${isSelected ? 'scale-110 font-bold shadow-sm' : 'hover:opacity-80'}`}
                style={{
                  backgroundColor: isSelected ? 'rgb(var(--primary-rgb))' : 'transparent',
                  color: isSelected ? '#ffffff' : (isWeekend ? 'rgba(var(--text-rgb), 0.6)' : 'rgba(var(--text-rgb), 0.9)'),
                  boxShadow: isSelected ? '0 2px 5px rgba(0,0,0,0.2)' : 'none'
                }}
              >
                {d.day}
              </button>
            );
          })}
        </div>
      </div>

      {/* YEAR PICKER (RIGHT PANEL) */}
      {showYear && (
        <div className={`absolute transition-all duration-300 ease-out z-30 ${isCompact ? `inset-0 w-full h-full flex flex-col ${isYearListVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}` : `top-0 left-full ml-2 h-full w-[65px] ${isYearListVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}`}>
          <div className={`rounded-xl border border-white/20 shadow-xl overflow-hidden ${isCompact ? 'w-full h-full' : 'w-[65px] h-[180px]'}`} style={sidePanelStyle}>
            <WheelPicker
              items={years}
              selectedValue={selectedYear}
              onChange={handleYearChange}
              onSelect={closeYearList}
              height={CALENDAR_CONSTANTS.CALENDAR_HEIGHT}
              active={isYearListVisible}
              fontSize={pickerFontSize}
              itemHeight={pickerItemHeight}
            />
          </div>
        </div>
      )}
    </>
  );
});

SharedCalendarContent.displayName = 'SharedCalendarContent';

/* ==================================================================================
   MODAL & DROPDOWN CALENDAR COMPONENTS
   ================================================================================== */

const ModalCalendar = React.memo(({ initialDate, onDateSelect, onDateChange, onClose, backgroundColor, opacity = 0.95, selectionMode = 'full', locale = 'tr', MONTHS, DAYS }) => {
  const {
    selectedMonthIndex, setSelectedMonthIndex,
    selectedYear, setSelectedYear,
    selectedDay, setSelectedDay,
    isMonthListVisible, setIsMonthListVisible,
    isYearListVisible, setIsYearListVisible,
    calendarData, years, handleDayClick
  } = useCalendarLogic(initialDate, selectionMode);

  const [scale, setScale] = useState(1);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      
      
      // Calculate scale first (before compact check)
      let targetW;
      // Improved scaling logic to prevent clipping
      if (w < 640) targetW = w * 0.85; // Use more width on mobile
      else if (w < 1024) targetW = w * 0.45;
      else if (w < 1536) targetW = w * 0.3;
      else targetW = w * 0.2;
      
      // Ensure it doesn't exceed viewport height
      const maxH = window.innerHeight * 0.8;
      const scaleByWidth = targetW / CALENDAR_CONSTANTS.BASE_WIDTH;
      const scaleByHeight = maxH / CALENDAR_CONSTANTS.CALENDAR_HEIGHT;
      const scaleValue = Math.min(scaleByWidth, scaleByHeight, 1.2); // Cap at 1.2x for quality
      
      // Calculate if we need compact mode based on actual scaled dimensions
      // Full layout: month picker (65px * scale) + margin (8px * scale) + calendar (160px * scale) + margin (8px * scale) + year picker (65px * scale)
      // Plus overlay padding (96px on large screens, 64px on small) to ensure pickers aren't clipped
      const PICKER_WIDTH = 65;
      const MARGIN = 8;
      const CALENDAR_BASE = CALENDAR_CONSTANTS.BASE_WIDTH;
      const overlayPadding = w >= 768 ? 96 : 64; // p-12 = 48px * 2 = 96px, p-8 = 32px * 2 = 64px
      
      const scaledPickerWidth = PICKER_WIDTH * scaleValue;
      const scaledMargin = MARGIN * scaleValue;
      const scaledCalendarWidth = CALENDAR_BASE * scaleValue;
      const totalScaledWidth = (scaledPickerWidth + scaledMargin) * 2 + scaledCalendarWidth;
      const needsCompact = (totalScaledWidth + overlayPadding) > w;
      
      
      
      
      
      setIsCompact(needsCompact);
      setScale(scaleValue);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const contentBgStyle = useMemo(() =>
    backgroundColor === 'transparent'
      ? { background: `rgba(23, 23, 23, ${opacity})`, backdropFilter: 'blur(24px)', border: '1px solid rgba(var(--text-rgb),0.1)' }
      : { background: `rgba(var(--bg-rgb), ${opacity})`, backdropFilter: 'blur(20px)' },
    [backgroundColor, opacity]
  );

  const sidePanelStyle = useMemo(() =>
    backgroundColor === 'transparent'
      ? { background: `rgba(23, 23, 23, ${Math.min(1, opacity + 0.05)})`, backdropFilter: 'blur(24px)' }
      : { background: `rgba(var(--bg-rgb), ${Math.min(1, opacity + 0.05)})` },
    [backgroundColor, opacity]
  );

  const wrappedHandleDayClick = useCallback((day) => {
    handleDayClick(day);
    if (onDateSelect) onDateSelect(new Date(selectedYear, selectedMonthIndex, day));
  }, [handleDayClick, onDateSelect, selectedYear, selectedMonthIndex]);

  return (
    <div
      className="relative font-sans flex items-stretch justify-center transition-transform duration-200 ease-out origin-center overflow-visible"
      onClick={(e) => e.stopPropagation()}
      style={{ transform: `scale(${scale})` }}
    >
      <SharedCalendarContent
        selectedMonthIndex={selectedMonthIndex}
        selectedYear={selectedYear}
        selectedDay={selectedDay}
        setSelectedMonthIndex={setSelectedMonthIndex}
        setSelectedYear={setSelectedYear}
        setSelectedDay={setSelectedDay}
        handleDayClick={wrappedHandleDayClick}
        isMonthListVisible={isMonthListVisible}
        setIsMonthListVisible={setIsMonthListVisible}
        isYearListVisible={isYearListVisible}
        setIsYearListVisible={setIsYearListVisible}
        calendarData={calendarData}
        years={years}
        onClose={onClose}
        contentBgStyle={contentBgStyle}
        sidePanelStyle={sidePanelStyle}
        selectionMode={selectionMode}
        isCompact={isCompact}
        onDateChange={onDateChange}
        MONTHS={MONTHS}
        DAYS={DAYS}
      />
    </div>
  );
});

ModalCalendar.displayName = 'ModalCalendar';

const DropdownCalendar = React.memo(({ initialDate, onDateSelect, onDateChange, onClose, backgroundColor, containerWidth, opacity = 0.95, selectionMode = 'full', locale = 'tr', MONTHS, DAYS }) => {
  const {
    selectedMonthIndex, setSelectedMonthIndex,
    selectedYear, setSelectedYear,
    selectedDay, setSelectedDay,
    isMonthListVisible, setIsMonthListVisible,
    isYearListVisible, setIsYearListVisible,
    calendarData, years, handleDayClick
  } = useCalendarLogic(initialDate, selectionMode);

  const contentBgStyle = useMemo(() =>
    backgroundColor === 'transparent'
      ? { background: `rgba(23, 23, 23, ${opacity})`, backdropFilter: 'blur(24px)', border: '1px solid rgba(var(--text-rgb),0.1)' }
      : { background: `rgba(var(--bg-rgb), ${opacity})`, backdropFilter: 'blur(20px)' },
    [backgroundColor, opacity]
  );

  const sidePanelStyle = useMemo(() =>
    backgroundColor === 'transparent'
      ? { background: `rgba(23, 23, 23, ${Math.min(1, opacity + 0.05)})`, backdropFilter: 'blur(24px)' }
      : { background: `rgba(var(--bg-rgb), ${Math.min(1, opacity + 0.05)})` },
    [backgroundColor, opacity]
  );

  const { isCompact, scale } = useMemo(() => {
    const compact = containerWidth && containerWidth < CALENDAR_CONSTANTS.COMPACT_BREAKPOINT;
    const scaleValue = compact
      ? (containerWidth / CALENDAR_CONSTANTS.BASE_WIDTH)
      : (containerWidth / CALENDAR_CONSTANTS.FULL_LAYOUT_WIDTH);
    return { isCompact: compact, scale: scaleValue };
  }, [containerWidth]);

  const wrappedHandleDayClick = useCallback((day) => {
    handleDayClick(day);
    if (onDateSelect) onDateSelect(new Date(selectedYear, selectedMonthIndex, day));
  }, [handleDayClick, onDateSelect, selectedYear, selectedMonthIndex]);

  return (
    <div
      className="relative font-sans"
      onClick={(e) => e.stopPropagation()}
      style={{
        width: `${CALENDAR_CONSTANTS.BASE_WIDTH * scale}px`,
        height: `${CALENDAR_CONSTANTS.BASE_HEIGHT * scale}px`
      }}
    >
      <div
        className="flex items-stretch justify-center absolute top-0 left-0"
        style={{
          width: `${CALENDAR_CONSTANTS.BASE_WIDTH}px`,
          height: `${CALENDAR_CONSTANTS.BASE_HEIGHT}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left'
        }}
      >
        <SharedCalendarContent
          selectedMonthIndex={selectedMonthIndex}
          selectedYear={selectedYear}
          selectedDay={selectedDay}
          setSelectedMonthIndex={setSelectedMonthIndex}
          setSelectedYear={setSelectedYear}
          setSelectedDay={setSelectedDay}
          handleDayClick={wrappedHandleDayClick}
          isMonthListVisible={isMonthListVisible}
          setIsMonthListVisible={setIsMonthListVisible}
          isYearListVisible={isYearListVisible}
          setIsYearListVisible={setIsYearListVisible}
          calendarData={calendarData}
          years={years}
          onClose={onClose}
          contentBgStyle={contentBgStyle}
          sidePanelStyle={sidePanelStyle}
          selectionMode={selectionMode}
          isCompact={isCompact}
          onDateChange={onDateChange}
          MONTHS={MONTHS}
          DAYS={DAYS}
        />
      </div>
    </div>
  );
});

DropdownCalendar.displayName = 'DropdownCalendar';

/* ==================================================================================
   MAIN CALENDAR COMPONENT (EXPORTED)
   ================================================================================== */

const Calendar = React.memo(({
  value,
  onChange,
  placeholder,
  className = "",
  color = "#0d9488",
  backgroundColor,
  textColor = "#ffffff",
  variant = "modal",
  opacity = 0.95,
  displayFormat = "dd MMMM yyyy",
  outputFormat = "dd/MM/yyyy",
  outputFormatType,
  selectionMode = "full",
  locale = "tr",
  style
}) => {
  // Locale-based defaults
  const defaultPlaceholder = locale === "en" ? "Select Date" : "Tarih Seçiniz";
  const finalPlaceholder = placeholder !== undefined ? placeholder : defaultPlaceholder;
  
  // Locale-based month and day arrays
  const MONTHS = locale === "en" ? MONTHS_EN : MONTHS_TR;
  const DAYS = locale === "en" ? DAYS_EN : DAYS_TR;
  const [isOpen, setIsOpen] = useState(false);
  const [internalDate, setInternalDate] = useState(value || new Date());

  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
      const observer = new ResizeObserver(entries => {
        for (let entry of entries) {
          if (entry.borderBoxSize && entry.borderBoxSize.length > 0) {
            setContainerWidth(entry.borderBoxSize[0].inlineSize);
          } else {
            setContainerWidth(entry.contentRect.width);
          }
        }
      });
      observer.observe(containerRef.current);
      return () => {
        window.removeEventListener('resize', checkMobile);
        observer.disconnect();
      };
    }
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const effectiveVariant = useMemo(() =>
    variant === 'adaptive' ? (isMobile ? 'modal' : 'dropdown') : variant,
    [variant, isMobile]
  );

  const cssVars = useMemo(() => ({
    '--primary-rgb': hexToRgb(color),
    '--bg-rgb': backgroundColor && backgroundColor !== 'transparent' ? hexToRgb(backgroundColor) : hexToRgb(color),
    '--text-rgb': hexToRgb(textColor)
  }), [color, backgroundColor, textColor]);

  const containerStyle = useMemo(() =>
    backgroundColor === 'transparent'
      ? { background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(var(--text-rgb), 0.1)' }
      : { background: 'rgba(var(--bg-rgb), 0.9)', backdropFilter: 'blur(10px)' },
    [backgroundColor]
  );

  useEffect(() => {
    if (value) setInternalDate(value);
  }, [value]);

  const formatDate = useCallback((date, formatStr) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) return finalPlaceholder;
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    const monthsFull = MONTHS;
    const zeroPad = (n) => n.toString().padStart(2, '0');

    const tokens = {
      'yyyy': year,
      'MMMM': monthsFull[month],
      'MM': zeroPad(month + 1),
      'dd': zeroPad(day),
      'HH': zeroPad(hour),
      'mm': zeroPad(minute),
      'ss': zeroPad(second)
    };

    return formatStr.replace(/yyyy|MMMM|MM|dd|HH|mm|ss/g, (match) => tokens[match]);
  }, [finalPlaceholder, MONTHS]);

  const formatOutput = useCallback((date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) return null;
    
    const formatType = outputFormatType || 'custom';
    
    if (formatType === 'timestamp') {
      return date.getTime();
    } else if (formatType === 'date') {
      return date;
    } else if (formatType === 'datetime') {
      return date.toISOString();
    } else if (formatType === 'date-only') {
      return date.toISOString().split('T')[0];
    } else if (formatType === 'locale') {
      return date.toLocaleString();
    } else if (formatType === 'locale-date') {
      return date.toLocaleDateString();
    } else {
      // custom - use formatDate with outputFormat
      return formatDate(date, outputFormat);
    }
  }, [outputFormatType, outputFormat, formatDate]);

  const handleDateChange = useCallback((date) => {
    setInternalDate(date);
    if (onChange) {
      const output = formatOutput(date);
      onChange(date, output);
    }
  }, [onChange, formatOutput]);

  const handleDateSelect = useCallback((date) => {
    setInternalDate(date);
    if (onChange) {
      const output = formatOutput(date);
      onChange(date, output);
    }
    setTimeout(() => setIsOpen(false), CALENDAR_CONSTANTS.DATE_SELECT_DELAY);
  }, [onChange, formatOutput]);

  const toggleOpen = useCallback(() => setIsOpen(prev => !prev), []);
  const closeCalendar = useCallback(() => setIsOpen(false), []);

  return (
    <div ref={containerRef} style={{ ...cssVars, ...style }} className={`relative inline-block ${className}`}>
      <div
        onClick={toggleOpen}
        className={`flex items-center gap-2 w-full p-2.5 rounded-lg cursor-pointer transition-all duration-300 group font-sans shadow-lg hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] hover:border-opacity-50 hover:scale-[1.01] border border-white/10`}
        style={containerStyle}
      >
        <div className="p-1 rounded transition-colors" style={{ backgroundColor: 'rgba(var(--text-rgb), 0.1)', color: 'rgb(var(--text-rgb))' }}>
          <CalendarIcon size={16} strokeWidth={2} />
        </div>

        <span className="text-sm font-medium tracking-wide select-none flex-1 truncate drop-shadow-sm" style={{ color: 'rgba(var(--text-rgb), 0.9)' }}>
          {formatDate(internalDate, displayFormat)}
        </span>

        <ChevronRight className={`transition-all group-hover:translate-x-0.5 ${isOpen ? 'rotate-90' : ''}`} size={14} style={{ color: 'rgba(var(--text-rgb), 0.4)' }} />
      </div>

      {isOpen && (
        <>
          {effectiveVariant === 'modal' ? (
            
            <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-md overflow-y-auto p-4 sm:p-8 md:p-12" onClick={closeCalendar}>
              <div className="animate-modal-enter drop-shadow-2xl my-auto" onClick={(e) => e.stopPropagation()}>
                <ModalCalendar
                  initialDate={internalDate}
                  onDateSelect={handleDateSelect}
                  onDateChange={handleDateChange}
                  onClose={closeCalendar}
                  backgroundColor={backgroundColor || (backgroundColor === undefined ? color : undefined)}
                  opacity={opacity}
                  selectionMode={selectionMode}
                  locale={locale}
                  MONTHS={MONTHS}
                  DAYS={DAYS}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="fixed inset-0 z-[9998] cursor-default" onClick={closeCalendar} />
              <div className="absolute top-full left-1/2 mt-2 z-[9999] animate-dropdown-enter" onClick={(e) => e.stopPropagation()}>
                <DropdownCalendar
                  initialDate={internalDate}
                  onDateSelect={handleDateSelect}
                  onDateChange={handleDateChange}
                  onClose={closeCalendar}
                  backgroundColor={backgroundColor || (backgroundColor === undefined ? color : undefined)}
                  containerWidth={containerWidth}
                  opacity={opacity}
                  selectionMode={selectionMode}
                  locale={locale}
                  MONTHS={MONTHS}
                  DAYS={DAYS}
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
});

Calendar.displayName = 'Calendar';

/* ==================================================================================
   LOCALE WRAPPERS & EXPORTS
   ================================================================================== */

// Turkish Calendar (default)
export const CalendarTR = React.memo((props) => <Calendar {...props} locale="tr" />);
CalendarTR.displayName = 'CalendarTR';

// English Calendar
export const CalendarEN = React.memo((props) => <Calendar {...props} locale="en" />);
CalendarEN.displayName = 'CalendarEN';

// Default export (with locale support)
export { Calendar };
export default Calendar;