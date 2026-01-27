'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

const COUNTRY_CODES = [
  { code: '+33', flag: '🇫🇷', label: 'France' },
  { code: '+972', flag: '🇮🇱', label: 'Israel' },
  { code: '+1', flag: '🇺🇸', label: 'USA / Canada' },
  { code: '+44', flag: '🇬🇧', label: 'UK' },
  { code: '+32', flag: '🇧🇪', label: 'Belgique' },
  { code: '+41', flag: '🇨🇭', label: 'Suisse' },
  { code: '+352', flag: '🇱🇺', label: 'Luxembourg' },
  { code: '+212', flag: '🇲🇦', label: 'Maroc' },
  { code: '+216', flag: '🇹🇳', label: 'Tunisie' },
  { code: '+34', flag: '🇪🇸', label: 'Espagne' },
  { code: '+39', flag: '🇮🇹', label: 'Italie' },
  { code: '+49', flag: '🇩🇪', label: 'Allemagne' },
  { code: '+351', flag: '🇵🇹', label: 'Portugal' },
  { code: '+357', flag: '🇨🇾', label: 'Chypre' },
  { code: '+61', flag: '🇦🇺', label: 'Australie' },
  { code: '+55', flag: '🇧🇷', label: 'Brésil' },
  { code: '+54', flag: '🇦🇷', label: 'Argentine' },
  { code: '+52', flag: '🇲🇽', label: 'Mexique' },
  { code: '+27', flag: '🇿🇦', label: 'Afrique du Sud' },
];

interface PhoneInputProps {
  value: string;
  onChange: (fullPhone: string) => void;
  required?: boolean;
  className?: string;
  dir?: 'ltr' | 'rtl';
  label?: string;
}

export function PhoneInput({ value, onChange, required, className, dir, label }: PhoneInputProps) {
  // Parse initial value to extract country code if present
  const parseValue = (val: string) => {
    for (const country of COUNTRY_CODES) {
      if (val.startsWith(country.code)) {
        return { countryCode: country.code, number: val.slice(country.code.length).trim() };
      }
    }
    return { countryCode: '+33', number: val };
  };

  const parsed = parseValue(value);
  const [countryCode, setCountryCode] = useState(parsed.countryCode);
  const [phoneNumber, setPhoneNumber] = useState(parsed.number);

  const handleCountryChange = (newCode: string) => {
    setCountryCode(newCode);
    onChange(`${newCode} ${phoneNumber}`);
  };

  const handleNumberChange = (newNumber: string) => {
    setPhoneNumber(newNumber);
    onChange(`${countryCode} ${newNumber}`);
  };

  const selectedCountry = COUNTRY_CODES.find(c => c.code === countryCode);

  return (
    <div>
      {label && (
        <label className={cn("text-sm font-medium leading-none mb-2 block", dir === 'rtl' && 'text-right')}>
          {label}
        </label>
      )}
      <div className={cn("flex gap-0", dir === 'rtl' && 'flex-row-reverse')}>
        <select
          value={countryCode}
          onChange={(e) => handleCountryChange(e.target.value)}
          className={cn(
            "px-2 py-2 text-sm border border-gray-300 rounded-l-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent appearance-none cursor-pointer shrink-0",
            dir === 'rtl' && 'rounded-l-none rounded-r-md border-l-0 border-r',
            className
          )}
          style={{ width: '90px' }}
        >
          {COUNTRY_CODES.map((country) => (
            <option key={country.code} value={country.code}>
              {country.flag} {country.code}
            </option>
          ))}
        </select>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => handleNumberChange(e.target.value)}
          required={required}
          placeholder={selectedCountry?.code === '+33' ? '6 12 34 56 78' : ''}
          className={cn(
            "flex-1 px-3 py-2 text-sm border border-gray-300 rounded-r-md border-l-0 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent",
            dir === 'rtl' && 'rounded-r-none rounded-l-md border-r-0 border-l text-right',
            className
          )}
        />
      </div>
    </div>
  );
}
