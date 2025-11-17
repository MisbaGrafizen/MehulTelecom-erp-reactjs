import React from 'react'

'use client';

export function AgeBadge({ ageDays }) {
  let bgColor = 'bg-green-50';
  let textColor = 'text-green-700';
  let borderColor = 'border-green-200';

  if (ageDays > 60) {
    bgColor = 'bg-red-50';
    textColor = 'text-red-700';
    borderColor = 'border-red-200';
  } else if (ageDays > 30) {
    bgColor = 'bg-orange-50';
    textColor = 'text-orange-700';
    borderColor = 'border-orange-200';
  } else if (ageDays > 20) {
    bgColor = 'bg-yellow-50';
    textColor = 'text-yellow-700';
    borderColor = 'border-yellow-200';
  }

  return (
    <span className={`px-3 py-1.5 rounded-full text-sm font-bold border ${bgColor} ${textColor} ${borderColor}`}>
      {ageDays} days
    </span>
  );
}
