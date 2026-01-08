'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full">
        <thead className="bg-stone-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={cn(
                  'px-6 py-3 text-left text-xs font-medium text-stone-600 uppercase tracking-wider',
                  column.className
                )}
                style={{ fontFamily: 'var(--font-dm-sans)' }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-stone-200">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              className={cn(
                'hover:bg-stone-50 transition-colors',
                onRowClick && 'cursor-pointer'
              )}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={cn('px-6 py-4 whitespace-nowrap', column.className)}
                  style={{ fontFamily: 'var(--font-dm-sans)' }}
                >
                  {column.render
                    ? column.render(row)
                    : typeof column.key === 'string'
                    ? row[column.key]
                    : row[column.key as keyof T]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-12 text-stone-500" style={{ fontFamily: 'var(--font-dm-sans)' }}>
          Aucune donnée
        </div>
      )}
    </div>
  );
}

