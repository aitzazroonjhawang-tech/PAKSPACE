import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';

export const UNIVERSITIES_LIST = [
  // Islamabad
  "National University of Sciences and Technology (NUST)",
  "FAST National University of Computer and Emerging Sciences (FAST-NUCES) – Islamabad Campus",
  "Quaid-i-Azam University (QAU)",
  "COMSATS University Islamabad",
  "Pakistan Institute of Engineering and Applied Sciences (PIEAS)",
  "Air University",
  "Bahria University",
  "International Islamic University Islamabad (IIUI)",
  "National University of Modern Languages (NUML)",
  "Federal Urdu University (Islamabad)",
  "Capital University of Science and Technology (CUST)",
  "Foundation University Islamabad",
  "Shifa Tameer-e-Millat University",
  "Riphah International University",
  "IQRA National University",

  // Punjab
  "Lahore University of Management Sciences (LUMS)",
  "Government College University Lahore (GCU Lahore)",
  "University of the Punjab",
  "University of Engineering and Technology Lahore (UET Lahore)",
  "Information Technology University (ITU)",
  "Forman Christian College (FCCU)",
  "National College of Arts (NCA)",
  "King Edward Medical University",
  "University of Health Sciences (UHS)",
  "University of Central Punjab (UCP)",
  "University of Management and Technology (UMT)",
  "Superior University",
  "University of Lahore (UOL)",
  "Minhaj University Lahore",
  "Lahore Leads University",
  "University of Agriculture Faisalabad",
  "Government College University Faisalabad",
  "NFC Institute Faisalabad",
  "Bahauddin Zakariya University",
  "Muhammad Nawaz Sharif University of Engineering and Technology",
  "The Women University Multan",
  "The Islamia University of Bahawalpur",
  "Cholistan University of Veterinary and Animal Sciences",
  "Fatima Jinnah Women University",
  "Pir Mehr Ali Shah Arid Agriculture University",
  "University of Sargodha",
  "University of Gujrat",
  "Government College Women University Sialkot",
  "University of Okara",
  "Emerson University Multan",
  "Khwaja Fareed University of Engineering and Information Technology",

  // Sindh
  "Aga Khan University",
  "Institute of Business Administration Karachi (IBA Karachi)",
  "University of Karachi",
  "NED University of Engineering and Technology",
  "Dow University of Health Sciences",
  "Habib University",
  "Mehran University of Engineering and Technology",
  "Sukkur IBA University",
  "SZABIST",
  "DHA Suffa University",
  "Indus University",
  "Sir Syed University",
  "Hamdard University",
  "Jinnah Sindh Medical University",
  "Benazir Bhutto Shaheed University Lyari",
  "University of Sindh",
  "Liaquat University of Medical and Health Sciences",
  "Shah Abdul Latif University",
  "Peoples University of Medical and Health Sciences",
  "Shaheed Benazir Bhutto University Shaheed Benazirabad",

  // Khyber Pakhtunkhwa
  "University of Peshawar",
  "GIKI",
  "University of Engineering and Technology Peshawar",
  "Khyber Medical University",
  "Institute of Management Sciences (IMSciences)",
  "Abdul Wali Khan University",
  "University of Malakand",
  "Hazara University",
  "University of Swabi",
  "Women University Mardan",
  "University of Science and Technology Bannu",
  "Kohat University of Science and Technology",
  "Islamia College University",
  "University of Haripur",
  "Shaheed Benazir photto University Sheringal", // matches the user's Shaheed Benazir Bhutto University Sheringal
  "Shaheed Benazir Bhutto University Sheringal",
  "Agriculture University Peshawar",

  // Balochistan
  "University of Balochistan",
  "BUITEMS",
  "Lasbela University of Agriculture, Water and Marine Sciences (LUAWMS)",
  "University of Turbat",
  "University of Gwadar",
  "Sardar Bahadur Khan Women's University",
  "Balochistan University of Engineering and Technology Khuzdar",
  "University of Loralai",
  "University of Zhob",

  // Gilgit-Baltistan
  "Karakoram International University",

  // Azad Jammu & Kashmir
  "University of Azad Jammu and Kashmir",
  "Mirpur University of Science and Technology",
  "Women University of Azad Jammu & Kashmir Bagh"
];

// Special option
const OTHER_OPTION = "Other (My university isn't listed)";

interface UniversityDropdownProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  placeholder?: string;
}

export default function UniversityDropdown({ value, onChange, id, placeholder = "Search or select your university..." }: UniversityDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [customUniversity, setCustomUniversity] = useState("");
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize state based on value
  useEffect(() => {
    if (value) {
      if (UNIVERSITIES_LIST.includes(value)) {
        setIsOtherSelected(false);
      } else {
        setIsOtherSelected(true);
        setCustomUniversity(value);
      }
    } else {
      setIsOtherSelected(false);
      setCustomUniversity("");
    }
  }, [value]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = UNIVERSITIES_LIST.filter(univ => 
    univ.toLowerCase().includes(search.toLowerCase())
  );

  const options = [...filtered, OTHER_OPTION];

  // Adjust active index within limits
  useEffect(() => {
    if (activeIndex >= options.length) {
      setActiveIndex(options.length - 1);
    }
  }, [options.length, activeIndex]);

  const handleSelect = (option: string) => {
    if (option === OTHER_OPTION) {
      setIsOtherSelected(true);
      onChange(""); // initially empty, to be filled by custom input
    } else {
      setIsOtherSelected(false);
      onChange(option);
    }
    setSearch("");
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % options.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + options.length) % options.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < options.length) {
          handleSelect(options[activeIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        break;
      default:
        break;
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && dropdownRef.current) {
      const activeEl = dropdownRef.current.querySelector(`[data-index="${activeIndex}"]`) as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex]);

  const displayLabel = isOtherSelected 
    ? `Other: ${customUniversity || "Enter Name Below..."}`
    : (value || placeholder);

  return (
    <div ref={containerRef} className="space-y-3 w-full text-left relative" id={id}>
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) {
              setTimeout(() => searchInputRef.current?.focus(), 50);
            }
          }}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-3 border border-[var(--border-color)] rounded-xl bg-[var(--bg-app)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]/50 focus:border-[var(--brand-blue)] text-xs text-[var(--text-primary)] flex items-center justify-between cursor-pointer transition-all"
        >
          <span className={value || isOtherSelected ? "text-[var(--text-primary)] font-medium" : "text-gray-400 font-mono"}>
            {displayLabel}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in max-h-72 flex flex-col">
            {/* Search Input Box */}
            <div className="p-2 border-b border-[var(--border-color)] flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-500 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Type to search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-none outline-none text-xs text-[var(--text-primary)] py-1 focus:ring-0"
              />
              {search && (
                <button type="button" onClick={() => setSearch("")}>
                  <X className="w-3.5 h-3.5 text-gray-500 hover:text-red-500" />
                </button>
              )}
            </div>

            {/* List of Universities */}
            <div ref={dropdownRef} className="overflow-y-auto flex-1 py-1 max-h-48">
              {options.length === 0 ? (
                <div className="px-4 py-3 text-xs text-gray-400 italic">No university found</div>
              ) : (
                options.map((univ, index) => {
                  const isSelected = (univ === OTHER_OPTION && isOtherSelected) || (univ === value && !isOtherSelected);
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={univ}
                      type="button"
                      data-index={index}
                      onClick={() => handleSelect(univ)}
                      className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between transition-colors ${
                        isActive 
                          ? 'bg-[var(--brand-blue)] text-white' 
                          : isSelected 
                            ? 'bg-[var(--brand-blue)]/10 text-[var(--brand-blue)] font-semibold' 
                            : 'hover:bg-[var(--bg-app)] text-[var(--text-primary)]'
                      }`}
                    >
                      <span>{univ}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {isOtherSelected && (
        <div className="space-y-1 animate-fade-in text-left">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-blue)] font-mono">
            Enter your university name
          </label>
          <input
            type="text"
            required
            placeholder="E.g. University of Punjab, Gujranwala Campus"
            value={customUniversity}
            onChange={(e) => {
              setCustomUniversity(e.target.value);
              onChange(e.target.value);
            }}
            className="w-full px-4 py-3 border border-[var(--border-color)] rounded-xl bg-[var(--bg-app)] focus:outline-none focus:border-[var(--brand-blue)] text-xs placeholder:text-gray-500 text-[var(--text-primary)] focus:bg-[var(--bg-surface)] transition-all"
          />
        </div>
      )}
    </div>
  );
}
