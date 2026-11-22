import React from 'react';
import {
  AL, AM, AR, AT, AU, AZ, BA, BE, BF, BG, BR, BW, CA, CH, CN, CU, CZ,
  DE, DK, EG, ES, FI, FR, GB, GE, GH, GR, HR, HU, ID, IE, IL, IN, IQ,
  IR, IT, JP, KH, KP, KR, KZ, LY, MK, MN, MX, NL, NO, PK, PL, PS, PT,
  RO, RS, RU, SA, SE, SG, SY, TH, TR, TZ, UA, US, UZ, VA, VN, ZA,
} from 'country-flag-icons/react/3x2';

type FlagComponent = React.ComponentType<{ className?: string; title?: string }>;

const ISO_FLAG_MAP: Record<string, FlagComponent> = {
  AL, AM, AR, AT, AU, AZ, BA, BE, BF, BG, BR, BW, CA, CH, CN, CU, CZ,
  DE, DK, EG, ES, FI, FR, GB, GE, GH, GR, HR, HU, ID, IE, IL, IN, IQ,
  IR, IT, JP, KH, KP, KR, KZ, LY, MK, MN, MX, NL, NO, PK, PL, PS, PT,
  RO, RS, RU, SA, SE, SG, SY, TH, TR, TZ, UA, US, UZ, VA, VN, ZA,
};

const CATEGORY_TO_ISO: Record<string, string> = {
  usa: 'US',
  uk: 'GB',
  germany: 'DE',
  france: 'FR',
  russia: 'RU',
  china: 'CN',
  japan: 'JP',
  india: 'IN',
  italy: 'IT',
  spain: 'ES',
  ukraine: 'UA',
  brazil: 'BR',
  turkey: 'TR',
  poland: 'PL',
  belgium: 'BE',
  netherlands: 'NL',
  cuba: 'CU',
  vietnam: 'VN',
  'north-korea': 'KP',
  cambodia: 'KH',
  yugoslavia: 'RS',
  mongolia: 'MN',
  egypt: 'EG',
  iraq: 'IQ',
  iran: 'IR',
  syria: 'SY',
  'saudi-arabia': 'SA',
  palestine: 'PS',
  israel: 'IL',
  libya: 'LY',
  'burkina-faso': 'BF',
  ghana: 'GH',
  tanzania: 'TZ',
  'south-africa': 'ZA',
  botswana: 'BW',
  azerbaijan: 'AZ',
  armenia: 'AM',
  georgia: 'GE',
  greece: 'GR',
  serbia: 'RS',
  bosnia: 'BA',
  croatia: 'HR',
  bulgaria: 'BG',
  romania: 'RO',
  albania: 'AL',
  'north-macedonia': 'MK',
};

function emojiToIso(emoji?: string): string | null {
  if (!emoji) return null;
  const chars = Array.from(emoji.trim());
  if (chars.length !== 2) return null;
  const cp0 = chars[0].codePointAt(0) || 0;
  const cp1 = chars[1].codePointAt(0) || 0;
  if (cp0 >= 0x1f1e6 && cp0 <= 0x1f1ff && cp1 >= 0x1f1e6 && cp1 <= 0x1f1ff) {
    return (
      String.fromCharCode(65 + (cp0 - 0x1f1e6)) +
      String.fromCharCode(65 + (cp1 - 0x1f1e6))
    );
  }
  return null;
}

function normalizeCountryCode(code?: string): string | null {
  if (!code) return null;
  const upper = code.toUpperCase();
  if (upper === 'UK') return 'GB';
  if (upper === 'YU') return 'RS';
  if (upper === 'TR-HIST') return 'TR';
  if (upper === 'SU') return 'RU';
  if (ISO_FLAG_MAP[upper]) return upper;
  return null;
}

export type FlagSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZE_CLASSES: Record<FlagSize, string> = {
  xs: 'w-4 h-[11px]',
  sm: 'w-5 h-[13.5px]',
  md: 'w-6 h-4',
  lg: 'w-8 h-[22px]',
  xl: 'w-11 h-[30px]',
};

interface FlagIconProps {
  flag?: string;
  countryCode?: string;
  category?: string;
  size?: FlagSize;
  className?: string;
  title?: string;
}

export const FlagIcon: React.FC<FlagIconProps> = ({
  flag,
  countryCode,
  category,
  size = 'sm',
  className = '',
  title,
}) => {
  const sizeClass = SIZE_CLASSES[size];
  const frameClass = `inline-flex items-center justify-center shrink-0 rounded-[3px] overflow-hidden ring-1 ring-white/15 shadow-sm select-none ${sizeClass} ${className}`;

  // Historical / Cultural Non-ISO SVG Banners
  if (flag === '☭' || (countryCode === 'SU' && flag !== '🇷🇺')) {
    return (
      <span className={frameClass} title={title || 'Soviet Union (USSR)'} aria-hidden="true">
        <svg viewBox="0 0 30 20" className="w-full h-full">
          <rect width="30" height="20" fill="#b91c1c" />
          <polygon points="6.5,2.2 7.1,4.0 9.0,4.0 7.5,5.1 8.1,6.9 6.5,5.8 4.9,6.9 5.5,5.1 4.0,4.0 5.9,4.0" fill="#facc15" />
          <path d="M5 12 C8 13, 10.5 10.5, 9 7.8 C10.2 9.8, 8.2 12, 5.5 11.4 Z" fill="#facc15" />
          <rect x="6.5" y="7.8" width="1.1" height="5.2" transform="rotate(-40 7 10)" fill="#facc15" />
        </svg>
      </span>
    );
  }

  if (flag === '🏛️' || category === 'ancient' || countryCode === 'GR-HIST') {
    return (
      <span className={frameClass} title={title || 'Ancient Rome & Greece'} aria-hidden="true">
        <svg viewBox="0 0 30 20" className="w-full h-full">
          <rect width="30" height="20" fill="#7f1d1d" />
          <rect y="0" width="30" height="2.2" fill="#eab308" />
          <rect y="17.8" width="30" height="2.2" fill="#eab308" />
          <path d="M9.5 14.5 C7.5 11.5, 8 7.5, 11 5.5 M20.5 14.5 C22.5 11.5, 22 7.5, 19 5.5" stroke="#facc15" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <rect x="11.5" y="7.5" width="7" height="1.2" fill="#fde047" />
          <rect x="12.2" y="8.8" width="1.2" height="5" fill="#fde047" />
          <rect x="14.4" y="8.8" width="1.2" height="5" fill="#fde047" />
          <rect x="16.6" y="8.8" width="1.2" height="5" fill="#fde047" />
          <rect x="11" y="13.8" width="8" height="1.3" fill="#fde047" />
        </svg>
      </span>
    );
  }

  if (
    flag === '☪️' ||
    category === 'islamic' ||
    ['SA-HIST', 'IQ-HIST', 'SY-HIST', 'EG-HIST', 'MA-HIST', 'ES-HIST'].includes(countryCode || '')
  ) {
    return (
      <span className={frameClass} title={title || 'Islamic History & Caliphates'} aria-hidden="true">
        <svg viewBox="0 0 30 20" className="w-full h-full">
          <rect width="30" height="20" fill="#065f46" />
          <circle cx="14" cy="10" r="5.2" fill="#fbbf24" />
          <circle cx="15.8" cy="10" r="4.2" fill="#065f46" />
          <polygon points="18.8,7.8 19.3,9.2 20.8,9.2 19.6,10.1 20.1,11.5 18.8,10.6 17.5,11.5 18.0,10.1 16.8,9.2 18.3,9.2" fill="#fbbf24" />
        </svg>
      </span>
    );
  }

  if (
    flag === '✝️' ||
    category === 'christianity' ||
    ['VA-HIST', 'CH-HIST'].includes(countryCode || '')
  ) {
    return (
      <span className={frameClass} title={title || 'Christian History'} aria-hidden="true">
        <svg viewBox="0 0 30 20" className="w-full h-full">
          <rect width="15" height="20" fill="#eab308" />
          <rect x="15" width="15" height="20" fill="#f5f5f4" />
          <rect x="21.4" y="4.5" width="2.2" height="11" rx="0.4" fill="#a16207" />
          <rect x="18.5" y="7.5" width="8" height="2.2" rx="0.4" fill="#a16207" />
        </svg>
      </span>
    );
  }

  if (flag === '🐺') {
    return (
      <span className={frameClass} title={title || 'Ancient Turkic Khaganate'} aria-hidden="true">
        <svg viewBox="0 0 30 20" className="w-full h-full">
          <rect width="30" height="20" fill="#0284c7" />
          <circle cx="15" cy="10" r="6" fill="none" stroke="#fde047" strokeWidth="1.2" opacity="0.85" />
          <polygon points="11,13 12.2,6.5 14.5,9 15.5,9 17.8,6.5 19,13 15,15.5" fill="#fef08a" />
        </svg>
      </span>
    );
  }

  if (flag === '🌐' || category === 'all') {
    return (
      <span className={frameClass} title={title || 'Global'} aria-hidden="true">
        <svg viewBox="0 0 30 20" className="w-full h-full">
          <rect width="30" height="20" fill="#0f172a" />
          <circle cx="15" cy="10" r="6.5" fill="#0284c7" stroke="#7dd3fc" strokeWidth="1" />
          <ellipse cx="15" cy="10" rx="3.2" ry="6.5" fill="none" stroke="#e0f2fe" strokeWidth="0.9" />
          <line x1="8.5" y1="10" x2="21.5" y2="10" stroke="#e0f2fe" strokeWidth="0.9" />
        </svg>
      </span>
    );
  }

  // Standard ISO 3166-1 alpha-2 Country Flags (renders crisp SVG on Windows, macOS, Linux, Mobile)
  const iso =
    emojiToIso(flag) ||
    normalizeCountryCode(countryCode) ||
    (category ? CATEGORY_TO_ISO[category] : null);

  if (iso && ISO_FLAG_MAP[iso]) {
    const SvgFlag = ISO_FLAG_MAP[iso];
    return (
      <span className={frameClass} title={title || iso} aria-hidden="true">
        <SvgFlag className="w-full h-full object-cover" />
      </span>
    );
  }

  // Fallback royal banner
  return (
    <span className={frameClass} title={title || 'Historical'} aria-hidden="true">
      <svg viewBox="0 0 30 20" className="w-full h-full">
        <rect width="30" height="20" fill="#1c1917" />
        <polygon points="8,14 9,7 12.5,10 15,6 17.5,10 21,7 22,14" fill="#f59e0b" />
      </svg>
    </span>
  );
};
