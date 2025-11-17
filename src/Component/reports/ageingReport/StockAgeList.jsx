'use client';

import { StockAgeRow } from './StockAgeRow';

export function StockAgeList({ data, onViewClick }) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-slate-900 m">Stock Lists</h3>
      {data.map((item) => (
        <StockAgeRow key={item.id} item={item} onViewClick={onViewClick} />
      ))}
    </div>
  );
}
