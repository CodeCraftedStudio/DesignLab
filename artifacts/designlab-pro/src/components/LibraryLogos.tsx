import React from 'react';

/* 
  Real SVG brand logos for each UI library.
  Each renders at the given size prop (default 24).
*/

export function ShadcnLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 12l10 10 10-10L12 2z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 12l6-6 6 6-6 6-6-6z" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

export function MuiLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 8l10.5-6v12L0 20V8z" fill="#1976d2" />
      <path d="M10.5 2l10.5 6v12l-10.5 6V14L21 8l-10.5-6z" fill="#42a5f5" />
      <path d="M21 8l10.5-6v12L21 20V8z" fill="#1976d2" />
      <path d="M21 20l10.5-6v12L21 32V20z" fill="#42a5f5" />
    </svg>
  );
}

export function AntdLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 1L1 7v10l11 6 11-6V7L12 1z" fill="#1677ff" opacity="0.12" />
      <path d="M12 3L3 8v8l9 5 9-5V8l-9-5z" fill="none" stroke="#1677ff" strokeWidth="1.5" />
      <text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="800" fill="#1677ff" fontFamily="Arial">A</text>
    </svg>
  );
}

export function ChakraLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" fill="#319795" />
      <path d="M7 13.5l6.5-9L12 11.5h5L10.5 20l1.5-6.5H7z" fill="white" />
    </svg>
  );
}

export function MantineLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" fill="#339af0" />
      <circle cx="15" cy="10" r="2.5" fill="white" />
      <path d="M7 8c0 0 1-2 5-2s5 2 5 2v8c0 0-1 2-5 2s-5-2-5-2V8z" fill="none" stroke="white" strokeWidth="1.5" />
    </svg>
  );
}

export function RadixLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 25C5.925 25 0 19.075 0 13h6.5c0 2.75 2.75 5.5 5.5 5.5V25z" fill="#6e56cf" />
      <circle cx="12" cy="6" r="6" fill="#6e56cf" />
      <rect x="0" y="0" width="6.5" height="13" fill="#6e56cf" />
    </svg>
  );
}

export function BootstrapLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="22" height="22" rx="4" fill="#7952b3" />
      <path d="M8.5 7H14c1.5 0 2.5 1 2.5 2.3 0 1-.6 1.7-1.5 2 1.2.3 2 1.2 2 2.4 0 1.6-1.2 2.8-3.2 2.8H8.5V7z" fill="none" stroke="white" strokeWidth="1.5" />
      <path d="M11 7v4.3h2.5c1 0 1.5-.6 1.5-1.4 0-.9-.7-1.4-1.5-1.4H11z" fill="white" opacity="0.4" />
      <path d="M11 11.7v4.8H14c1.2 0 1.8-.7 1.8-1.7 0-1-.8-1.6-2-1.6H11z" fill="white" opacity="0.4" />
    </svg>
  );
}

export function FluentLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="10" height="10" rx="1" fill="#f25022" />
      <rect x="13" y="1" width="10" height="10" rx="1" fill="#7fba00" />
      <rect x="1" y="13" width="10" height="10" rx="1" fill="#00a4ef" />
      <rect x="13" y="13" width="10" height="10" rx="1" fill="#ffb900" />
    </svg>
  );
}

export function DaisyLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="3" fill="#661ae6" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x = 12 + Math.cos(rad) * 7.5;
        const y = 12 + Math.sin(rad) * 7.5;
        return <ellipse key={angle} cx={x} cy={y} rx="2.8" ry="4.2" fill="#661ae6" opacity="0.7" transform={`rotate(${angle}, ${x}, ${y})`} />;
      })}
    </svg>
  );
}

export function NaiveLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="22" height="22" rx="6" fill="#18a058" />
      <text x="12" y="17" textAnchor="middle" fontSize="14" fontWeight="800" fill="white" fontFamily="Arial, sans-serif">N</text>
    </svg>
  );
}

// Map slug to logo component
const LOGO_MAP: Record<string, React.FC<{ size?: number }>> = {
  shadcn: ShadcnLogo,
  mui: MuiLogo,
  antd: AntdLogo,
  chakra: ChakraLogo,
  mantine: MantineLogo,
  radix: RadixLogo,
  bootstrap: BootstrapLogo,
  fluent: FluentLogo,
  daisyui: DaisyLogo,
  naive: NaiveLogo,
};

export function LibraryLogo({ slug, size = 24 }: { slug: string; size?: number }) {
  const LogoComp = LOGO_MAP[slug];
  if (!LogoComp) return null;
  return <LogoComp size={size} />;
}

export default LOGO_MAP;
