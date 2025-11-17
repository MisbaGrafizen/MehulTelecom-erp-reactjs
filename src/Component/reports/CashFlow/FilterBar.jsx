import { useState, useRef, useEffect } from 'react';
import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { ChevronDown, Settings } from 'lucide-react';

const FilterBar = ({ filters, setFilters }) => {
const [dropdownOpen, setDropdownOpen] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dateRangeOptions = [
    'This Month',
    'Last Month',
    'This Quarter',
    'Last Quarter',
    'This Year',
    'Last Year',
    'Custom Range',
  ];

  return (
    <div className="mb-4">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Date Range Dropdown */}
          <div className="relative" ref={dropdownRef}>

            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`w-full px-4 py-2   bg-white border rounded-[8px] font-medium transition-all duration-300 flex items-center justify-between group ${
                focusedField === 'period'
                  ? 'border-blue-500 shadow-md shadow-blue-200'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              onFocus={() => setFocusedField('period')}
              onBlur={() => setFocusedField(null)}
            >
              <span className="text-slate-900">{filters.dateRange || 'This Month'}</span>
              <ChevronDown
                size={18}
                className={`text-slate-500 transition-transform duration-300 ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl flex flex-col !z-[100] overflow-hidden">
                {dateRangeOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setFilters(prev => ({ ...prev, dateRange: option }));
                      setDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left  hover:bg-blue-50 transition-colors border-b border-slate-100 last:border-b-0 ${
                      filters.dateRange === option ? 'bg-blue-100 text-blue-900 font-semibold' : 'text-slate-900'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* From Date */}
          <div>
            {/* <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              From Date
            </label> */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={filters.fromDate}
                onChange={(value) => setFilters(prev => ({ ...prev, fromDate: value }))}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '0.75rem',
                        borderWidth: '2px',
                        borderColor: '#e2e8f0',
                        '&:hover': {
                          borderColor: '#cbd5e1',
                        },
                        '&.Mui-focused': {
                          borderColor: '#3b82f6',
                          boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                        },
                      },
                      '& input': {
                        fontWeight: '500',
                        color: '#0f172a',
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </div>

          {/* To Date */}
          <div>
            {/* <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              To Date
            </label> */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={filters.toDate}
                onChange={(value) => setFilters(prev => ({ ...prev, toDate: value }))}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '0.75rem',
                        borderWidth: '2px',
                        borderColor: '#e2e8f0',
                        '&:hover': {
                          borderColor: '#cbd5e1',
                        },
                        '&.Mui-focused': {
                          borderColor: '#3b82f6',
                          boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
                        },
                      },
                      '& input': {
                        fontWeight: '500',
                        color: '#0f172a',
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </div>

          {/* Advanced Filters Button */}
          {/* <div className="flex items-end">
            <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-300 transition-all duration-300 flex items-center justify-center gap-2 group">
              <Settings size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              <span>Filters</span>
            </button>
          </div> */}
        </div>

        {/* Applied Filter Badges */}
        {/* <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-200">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium border border-blue-200">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            0 Value Txns – Show
            <button className="hover:text-blue-900">✕</button>
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-medium border border-green-200">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            Opening/Closing Cash – Consider
            <button className="hover:text-green-900">✕</button>
          </span>
        </div> */}
      </div>
    </div>
  );
};

export default FilterBar;
