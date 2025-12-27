import React, { useState, useEffect, useRef, useLayoutEffect, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';

// --- STYLES & ANIMATIONS (Component-specific styles) ---
const CalendarStyles = () => (
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
    }
  `}</style>
);

// --- INTERNAL COMPONENT: WHEEL PICKER ---
const WheelPicker = ({ items, selectedValue, onChange, onSelect, height = 150, active = true }) => {
  const listRef = useRef(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollTimeout = useRef(null);
  const ignoreScroll = useRef(false);

  const ITEM_HEIGHT = 20;
  const PADDING_Y = (height - ITEM_HEIGHT) / 2;
  const LOOP_MULTIPLIER = 40;

  const extendedItems = useMemo(() => {
    const arr = [];
    for (let i = 0; i < LOOP_MULTIPLIER; i++) {
      arr.push(...items);
    }
    return arr;
  }, [items]);

  const singleListHeight = items.length * ITEM_HEIGHT;

  useLayoutEffect(() => {
    if (listRef.current) {
      const currentIndex = items.indexOf(selectedValue);
      if (currentIndex === -1) return;

      const middleSet = Math.floor(LOOP_MULTIPLIER / 2);
      const targetIndex = (middleSet * items.length) + currentIndex;
      const targetScroll = targetIndex * ITEM_HEIGHT;

      if (!isUserScrolling) {
        ignoreScroll.current = true;
        listRef.current.scrollTop = targetScroll;
        setTimeout(() => { ignoreScroll.current = false; }, 50);
      }
    }
  }, [selectedValue, items, isUserScrolling, height, active]);

  const handleScroll = (e) => {
    if (ignoreScroll.current) return;

    const scrollTop = e.target.scrollTop;

    if (scrollTop < singleListHeight * 5) {
        listRef.current.scrollTop = scrollTop + (singleListHeight * 10);
        return;
    }
    if (scrollTop > (extendedItems.length * ITEM_HEIGHT) - (singleListHeight * 5)) {
        listRef.current.scrollTop = scrollTop - (singleListHeight * 10);
        return;
    }

    setIsUserScrolling(true);
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

    const rawIndex = Math.round(scrollTop / ITEM_HEIGHT);
    const realIndex = rawIndex % items.length;
    const newItem = items[realIndex];

    if (newItem && newItem !== selectedValue) {
      onChange(newItem);
    }

    scrollTimeout.current = setTimeout(() => {
      setIsUserScrolling(false);
      const exactScroll = rawIndex * ITEM_HEIGHT;
      if (Math.abs(scrollTop - exactScroll) > 1) {
         listRef.current.scrollTo({ top: exactScroll, behavior: 'smooth' });
      }
    }, 150);
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none group font-sans">
      <div
        className="absolute w-full left-0 z-10 pointer-events-none"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          height: `${ITEM_HEIGHT}px`,
          background: 'rgba(255, 255, 255, 0.15)',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '4px'
        }}
      />

      <ul
        ref={listRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto turkui-no-scrollbar relative z-0"
        style={{ paddingTop: `${PADDING_Y}px`, paddingBottom: `${PADDING_Y}px` }}
      >
        {extendedItems.map((item, index) => {
            const isActive = item === selectedValue;
            return (
                <li
                    key={`${index}`}
                    className={`
                        flex items-center justify-center cursor-pointer
                        transition-all duration-200 ease-out origin-center
                        ${isActive
                            ? 'text-white font-bold text-[12px] opacity-100 tracking-wide'
                            : 'text-white/50 text-[9px] opacity-60 scale-95'}
                    `}
                    style={{ height: `${ITEM_HEIGHT}px` }}
                    onClick={() => {
                        if (listRef.current) {
                            const targetScroll = index * ITEM_HEIGHT;
                            listRef.current.scrollTo({ top: targetScroll, behavior: 'smooth' });
                            if (onSelect) { setTimeout(() => onSelect(item), 350); }
                        }
                    }}
                >
                    {item}
                </li>
            );
        })}
      </ul>
    </div>
  );
};

// --- INTERNAL COMPONENT: CALENDAR CONTENT ---
const CalendarContent = ({ initialDate, onDateSelect, onClose }) => {
  const [currentDate] = useState(() => initialDate || new Date());

  const [selectedMonthIndex, setSelectedMonthIndex] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedDay, setSelectedDay] = useState(currentDate.getDate());

  const [isMonthListVisible, setIsMonthListVisible] = useState(false);
  const [isYearListVisible, setIsYearListVisible] = useState(false);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const startYear = 1940;
  const endYear = new Date().getFullYear() + 5;
  const years = useMemo(() =>
    Array.from({ length: endYear - startYear + 1 }, (_, i) => endYear - i),
  [endYear]);

  useEffect(() => {
    const daysInMonth = new Date(selectedYear, selectedMonthIndex + 1, 0).getDate();
    if (selectedDay > daysInMonth) {
      setSelectedDay(daysInMonth);
    }
  }, [selectedMonthIndex, selectedYear]);

  const calendarData = useMemo(() => {
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
  }, [selectedYear, selectedMonthIndex]);

  const handleDayClick = (day) => {
    setSelectedDay(day);
    if (onDateSelect) {
        const newDate = new Date(selectedYear, selectedMonthIndex, day);
        onDateSelect(newDate);
    }
  };

  const CALENDAR_HEIGHT = 180;

  return (
    <div
        className="flex items-stretch select-none relative font-sans"
        style={{ height: `${CALENDAR_HEIGHT}px` }}
        onClick={(e) => e.stopPropagation()}
    >
        {/* MONTH SELECTOR */}
        <div className={`
            virtualriddle-glass-panel-side absolute top-0 right-full mr-2 h-full flex flex-col overflow-hidden z-10
            transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] w-[65px]
            ${isMonthListVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-4 pointer-events-none'}
        `}>
          <div className="w-[65px] h-full bg-[#042f2e]/95 backdrop-blur-2xl rounded-xl border border-white/20 shadow-xl">
            <WheelPicker
                items={months}
                selectedValue={months[selectedMonthIndex]}
                onChange={(val) => setSelectedMonthIndex(months.indexOf(val))}
                onSelect={() => setIsMonthListVisible(false)}
                height={CALENDAR_HEIGHT}
                active={isMonthListVisible}
            />
          </div>
        </div>

        {/* CALENDAR GRID */}
        <div className="virtualriddle-glass-panel-main w-[160px] h-full p-2.5 flex flex-col justify-between z-20 relative bg-[#134e4a]/95 rounded-xl border border-white/10 shadow-xl backdrop-blur-xl">

          <button
            onClick={onClose}
            className="absolute top-1.5 right-1.5 text-white/30 hover:text-white transition-colors"
          >
            <X size={10} />
          </button>

          {/* Header */}
          <div className="flex justify-between items-end px-0.5 mb-1 mt-0.5">
            {/* Month Button */}
            <div
                onClick={() => setIsMonthListVisible(!isMonthListVisible)}
                className="group flex items-center gap-1 cursor-pointer select-none"
            >
              <div className={`
                    p-0.5 rounded-full border border-white/10 bg-white/5 text-white/50
                    group-hover:text-white group-hover:bg-white/10 group-hover:border-white/20
                    transition-all duration-300
                    ${!isMonthListVisible ? 'rotate-180 bg-white/10 text-white' : ''}
              `}>
                 <ChevronRight size={8} strokeWidth={2.5} />
              </div>
              <span className="text-[13px] text-white font-bold tracking-tight group-hover:opacity-80 transition-opacity">
                {months[selectedMonthIndex]}
              </span>
            </div>

            {/* Year Button */}
            <div
               onClick={() => setIsYearListVisible(!isYearListVisible)}
               className="group flex items-center gap-1 cursor-pointer select-none"
            >
              <span className="text-[11px] text-white/60 font-medium group-hover:text-white/90 transition-colors">
                {selectedYear}
              </span>
              <div className={`
                    p-0.5 rounded-full border border-white/10 bg-white/5 text-white/50
                    group-hover:text-white group-hover:bg-white/10 group-hover:border-white/20
                    transition-all duration-300
                    ${!isYearListVisible ? 'rotate-180 bg-white/10 text-white' : ''}
              `}>
                 <ChevronLeft size={8} strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 mb-1 border-b border-white/10 pb-1">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <div key={day} className={`text-center text-[7px] font-bold uppercase tracking-wide rounded-sm ${i >= 5 ? 'text-white/40' : 'text-white/30'}`}>
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-0.5 flex-1 content-center">
            {calendarData.map((d, index) => {
              const isSelected = d.currentMonth && d.day === selectedDay;
              const isWeekend = (index % 7 === 5) || (index % 7 === 6);

              if (!d.currentMonth) {
                  return (
                    <div key={index} className="h-4 w-4 flex items-center justify-center text-[8px] text-teal-200/20 select-none">
                        {d.day}
                    </div>
                  );
              }

              return (
                <button
                  key={index}
                  onClick={() => handleDayClick(d.day)}
                  className={`
                    h-4 w-4 mx-auto rounded flex items-center justify-center text-[9px] font-medium transition-all duration-150
                    ${isSelected
                        ? 'bg-white text-teal-950 shadow-sm shadow-white/20 scale-110 font-bold'
                        : 'hover:bg-white/10 text-white/90'
                    }
                    ${!isSelected && isWeekend ? 'text-white/60' : ''}
                  `}
                >
                  {d.day}
                </button>
              );
            })}
          </div>
        </div>

        {/* YEAR SELECTOR */}
        <div className={`
            virtualriddle-glass-panel-side absolute top-0 left-full ml-2 h-full flex flex-col overflow-hidden z-10
            transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] w-[50px]
            ${isYearListVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-4 pointer-events-none'}
        `}>
          <div className="w-[50px] h-full bg-[#042f2e]/95 backdrop-blur-2xl rounded-xl border border-white/20 shadow-xl">
            <WheelPicker
                items={years}
                selectedValue={selectedYear}
                onChange={(val) => setSelectedYear(val)}
                onSelect={() => setIsYearListVisible(false)}
                height={CALENDAR_HEIGHT}
                active={isYearListVisible}
            />
          </div>
        </div>
    </div>
  );
};

// --- MAIN COMPONENT: CALENDAR ---
const Calendar = ({ value, onChange, placeholder = "Select Date", className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalDate, setInternalDate] = useState(value || new Date());

  useEffect(() => {
      if (value) setInternalDate(value);
  }, [value]);

  const formatDate = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return placeholder;
    }
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handleDateSelect = useCallback((date) => {
    setInternalDate(date);
    if (onChange) onChange(date);
    setTimeout(() => setIsOpen(false), 200);
  }, [onChange]);

  return (
    <>
      <CalendarStyles />
      <div
        onClick={() => setIsOpen(true)}
        className={`
            flex items-center gap-2 w-full p-2.5 rounded-lg cursor-pointer transition-all duration-300 group font-sans
            bg-[rgb(19_78_74_/_0.9)] backdrop-blur-md border border-white/10 shadow-lg
            hover:shadow-[0_0_15px_rgba(45,212,191,0.3)] hover:border-white/30 hover:scale-[1.01]
            ${className}
        `}
      >
          <div className="p-1 bg-white/10 rounded text-white/90 group-hover:bg-white/20 transition-colors">
            <CalendarIcon size={16} strokeWidth={2} />
          </div>

          <span className="text-white/90 text-sm font-medium tracking-wide select-none flex-1 truncate drop-shadow-sm">
            {formatDate(internalDate)}
          </span>

          <ChevronRight className="text-white/40 group-hover:text-white/80 group-hover:translate-x-0.5 transition-all" size={14} />
      </div>

      {isOpen && (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#042f2e]/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
        >
            <div className="animate-modal-enter drop-shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <CalendarContent
                    initialDate={internalDate}
                    onDateSelect={handleDateSelect}
                    onClose={() => setIsOpen(false)}
                />
            </div>
        </div>
      )}
    </>
  );
};

export default Calendar;
