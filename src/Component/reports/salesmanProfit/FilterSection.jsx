'use client';

import { useState } from 'react';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const SALESMEN = ['Rajesh Kumar', 'Priya Singh', 'Amit Patel', 'Neha Gupta'];

export default function FilterSection({ onFilter, filters, setFilters, salesmanList }) {
// const [filters, setFilters] = useState({
//     fromDate: dayjs().subtract(30, 'days'),
//     toDate: dayjs(),
//     salesman: 'all',
//     search: '',
//   });

  const handleChange = (field, value) => {
    const updated = { ...filters, [field]: value };
    setFilters(updated);
    onFilter(updated);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-3 mb-3 border border-slate-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* From Date */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className=' border rounded-[8px]'>
    
            <DatePicker
              value={filters.fromDate}
              onChange={(date) => handleChange('fromDate', date)}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '0.75rem',
                      backgroundColor: '#ffffff',
                      '& fieldset': {
                        borderColor: '#e5e7eb',
                      },
                      '&:hover fieldset': {
                        borderColor: '#d1d5db',
                      },
                    },
                  },
                },
              }}
            />
          </div>

          {/* To Date */}
          <div  className=' border rounded-[8px]'>
            {/* <label className="block text-sm font-medium text-slate-700 mb-2">
              To Date
            </label> */}
            <DatePicker
              value={filters.toDate}
              onChange={(date) => handleChange('toDate', date)}
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '0.75rem',
                      backgroundColor: '#ffffff',
                      '& fieldset': {
                        borderColor: '#e5e7eb',
                      },
                      '&:hover fieldset': {
                        borderColor: '#d1d5db',
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </LocalizationProvider>

        {/* Salesman Dropdown */}
        <div>
          {/* <label className="block text-sm font-medium text-slate-700 mb-2">
            Salesman
          </label> */}
          <select
  value={filters.salesman}
  onChange={(e) => handleChange('salesman', e.target.value)}
  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none bg-white"
>
  <option value="all">All Salesmen</option>

  {salesmanList.map((s) => (
    <option key={s?._id} value={s?.name}>
      {s?.name}
    </option>
  ))}
</select>

        </div>

        {/* Search Bar */}
        <div>
          {/* <label className="block text-sm font-medium text-slate-700 mb-2">
            Search
          </label> */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search product, invoice, IMEI..."
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
