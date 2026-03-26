import React, { useState, useMemo } from 'react';
import { useDesignStore } from '@/store/useDesignStore';
import { toast } from '@/utils/toastStore';
import { Download, Copy, Check, X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
}

type ExportTab = 'css' | 'scss' | 'tailwind' | 'json' | 'figma' | 'brief';

function generateCSS(colors: Record<string, string>) {
  return `/* DesignLab Pro — Design Tokens */
:root {
  /* ── Color Roles ── */
  --color-primary: ${colors.primary};
  --color-background: ${colors.background};
  --color-surface: ${colors.surface};
  --color-text: ${colors.text};
  --color-border: ${colors.border};

  /* ── Spacing Scale ── */
  --space-1: 4px;   --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
  --space-5: 20px;  --space-6: 24px;  --space-8: 32px;  --space-10: 40px;
  --space-12: 48px; --space-16: 64px; --space-20: 80px; --space-24: 96px;

  /* ── Typography ── */
  --font-display: 'Syne', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --text-xs: 0.75rem;   --text-sm: 0.875rem;  --text-base: 1rem;
  --text-lg: 1.125rem;  --text-xl: 1.25rem;   --text-2xl: 1.5rem;
  --text-3xl: 1.875rem; --text-4xl: 2.25rem;  --text-5xl: 3rem;

  /* ── Border Radius ── */
  --radius-sm: 4px; --radius: 8px;    --radius-md: 12px;
  --radius-lg: 16px; --radius-xl: 24px; --radius-full: 9999px;

  /* ── Shadows ── */
  --shadow-sm: 0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04);
  --shadow-md: 0 4px 12px rgba(0,0,0,.08), 0 2px 6px rgba(0,0,0,.04);
  --shadow-lg: 0 16px 40px rgba(0,0,0,.12), 0 8px 16px rgba(0,0,0,.06);
  --shadow-xl: 0 32px 80px rgba(0,0,0,.15), 0 16px 32px rgba(0,0,0,.08);

  /* ── Transitions ── */
  --transition-fast: 150ms ease;
  --transition: 300ms ease;
  --transition-slow: 600ms ease;
}`;
}

function generateSCSS(colors: Record<string, string>) {
  return `// DesignLab Pro — Design Tokens (SCSS)

// ── Colors ──
$color-primary: ${colors.primary};
$color-background: ${colors.background};
$color-surface: ${colors.surface};
$color-text: ${colors.text};
$color-border: ${colors.border};

// ── Spacing ──
$spacer: 4px;
$spacing: (
  1: $spacer,    2: $spacer * 2,  3: $spacer * 3,
  4: $spacer * 4, 5: $spacer * 5,  6: $spacer * 6,
  8: $spacer * 8, 10: $spacer * 10, 12: $spacer * 12,
  16: $spacer * 16, 20: $spacer * 20, 24: $spacer * 24
);

// ── Typography ──
$font-display: 'Syne', system-ui, sans-serif;
$font-mono: 'JetBrains Mono', 'Fira Code', monospace;
$font-sizes: (
  xs: 0.75rem, sm: 0.875rem, base: 1rem,
  lg: 1.125rem, xl: 1.25rem, 2xl: 1.5rem,
  3xl: 1.875rem, 4xl: 2.25rem, 5xl: 3rem
);

// ── Border Radius ──
$radii: (sm: 4px, base: 8px, md: 12px, lg: 16px, xl: 24px, full: 9999px);

// ── Mixins ──
@mixin glass($blur: 16px, $opacity: 0.1) {
  background: rgba(255, 255, 255, $opacity);
  backdrop-filter: blur($blur);
  -webkit-backdrop-filter: blur($blur);
  border: 1px solid rgba(255, 255, 255, $opacity * 2);
}

@mixin glow($color: $color-primary, $intensity: 0.5) {
  box-shadow: 0 0 20px rgba($color, $intensity);
}`;
}

function generateTailwind(colors: Record<string, string>) {
  return `// tailwind.config.js — DesignLab Pro Tokens
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx,html}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '${colors.primary}',
          foreground: '#ffffff',
        },
        background: '${colors.background}',
        surface: '${colors.surface}',
        'app-text': '${colors.text}',
        'app-border': '${colors.border}',
      },
      fontFamily: {
        display: ['Syne', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        sm: '4px', DEFAULT: '8px', md: '12px',
        lg: '16px', xl: '24px', '2xl': '32px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0,0,0,.06)',
        md: '0 4px 12px rgba(0,0,0,.08)',
        lg: '0 16px 40px rgba(0,0,0,.12)',
        xl: '0 32px 80px rgba(0,0,0,.15)',
      },
      transitionDuration: { fast: '150ms', DEFAULT: '300ms', slow: '600ms' },
    },
  },
  plugins: [],
};`;
}

function generateJSON(colors: Record<string, string>) {
  return JSON.stringify({
    color: {
      primary: { value: colors.primary, type: 'color', description: 'Brand primary color' },
      background: { value: colors.background, type: 'color', description: 'Page background' },
      surface: { value: colors.surface, type: 'color', description: 'Surface/card background' },
      text: { value: colors.text, type: 'color', description: 'Primary text color' },
      border: { value: colors.border, type: 'color', description: 'Border color' },
    },
    spacing: Object.fromEntries([1,2,3,4,5,6,8,10,12,16,20,24].map(n => [n, { value: `${n * 4}px`, type: 'spacing' }])),
    fontSize: { xs: { value: '12px', type: 'fontSize' }, sm: { value: '14px', type: 'fontSize' }, base: { value: '16px', type: 'fontSize' }, lg: { value: '18px', type: 'fontSize' }, xl: { value: '20px', type: 'fontSize' }, '2xl': { value: '24px', type: 'fontSize' } },
    borderRadius: { sm: { value: '4px', type: 'borderRadius' }, DEFAULT: { value: '8px', type: 'borderRadius' }, md: { value: '12px', type: 'borderRadius' }, lg: { value: '16px', type: 'borderRadius' }, xl: { value: '24px', type: 'borderRadius' } },
  }, null, 2);
}

function generateFigma(colors: Record<string, string>) {
  return JSON.stringify({
    global: {
      color: {
        primary: { value: colors.primary, type: 'color' },
        background: { value: colors.background, type: 'color' },
        surface: { value: colors.surface, type: 'color' },
        text: { value: colors.text, type: 'color' },
        border: { value: colors.border, type: 'color' },
      },
      spacing: Object.fromEntries([4,8,12,16,20,24,32,40,48,64,80,96].map((v, i) => [`spacing-${i+1}`, { value: `${v}px`, type: 'spacing' }])),
      borderRadius: {
        sm: { value: '4px', type: 'borderRadius' },
        base: { value: '8px', type: 'borderRadius' },
        md: { value: '12px', type: 'borderRadius' },
        full: { value: '9999px', type: 'borderRadius' },
      },
    },
  }, null, 2);
}

function generateBrief(colors: Record<string, string>) {
  const now = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  return `# Design Brief — DesignLab Pro Export
Generated: ${now}

## Color System
| Role       | Value       |
|------------|-------------|
| Primary    | ${colors.primary} |
| Background | ${colors.background} |
| Surface    | ${colors.surface} |
| Text       | ${colors.text} |
| Border     | ${colors.border} |

## Typography
- Display font: Syne (weights: 400, 600, 700, 800)
- Mono font: JetBrains Mono (weights: 400, 600)
- Base size: 16px, Scale ratio: 1.25

## Spacing
Base unit: 4px. Scale: 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96px

## Border Radius
sm=4px | base=8px | md=12px | lg=16px | xl=24px | full=9999px

## Elevation / Shadows
- Level 1 (sm): cards on surface — 0 1px 3px rgba(0,0,0,.06)
- Level 2 (md): dropdowns, popovers — 0 4px 12px rgba(0,0,0,.08)
- Level 3 (lg): modals, sheets — 0 16px 40px rgba(0,0,0,.12)
- Level 4 (xl): overlays — 0 32px 80px rgba(0,0,0,.15)

## Motion
- Fast: 150ms ease (micro-interactions, hover states)
- Base: 300ms ease (transitions, accordions)
- Slow: 600ms ease (page transitions, large reveals)

## Design Principles
1. Consistent spacing using the 4px grid
2. Accessible contrast ratios (WCAG AA minimum)
3. System fonts with Google Fonts enhancement
4. Semantic color roles, never hardcoded values
5. Smooth motion at appropriate durations`;
}

function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ExportModal({ open, onClose }: Props) {
  const [tab, setTab] = useState<ExportTab>('css');
  const [copied, setCopied] = useState(false);
  const { colorRoles } = useDesignStore();

  const colors = colorRoles as unknown as Record<string, string>;

  const outputs: Record<ExportTab, { content: string; filename: string; label: string }> = useMemo(() => ({
    css: { content: generateCSS(colors), filename: 'tokens.css', label: 'CSS Variables' },
    scss: { content: generateSCSS(colors), filename: 'tokens.scss', label: 'SCSS Variables' },
    tailwind: { content: generateTailwind(colors), filename: 'tailwind.config.js', label: 'Tailwind Config' },
    json: { content: generateJSON(colors), filename: 'tokens.json', label: 'JSON Tokens' },
    figma: { content: generateFigma(colors), filename: 'figma-tokens.json', label: 'Figma Tokens' },
    brief: { content: generateBrief(colors), filename: 'design-brief.md', label: 'Design Brief' },
  }), [colors]);

  const current = outputs[tab];

  const copy = () => {
    navigator.clipboard.writeText(current.content);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 1800);
  };

  const download = () => {
    downloadFile(current.content, current.filename);
    toast.success(`Downloaded ${current.filename}`);
  };

  const downloadAll = async () => {
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      const tokens = zip.folder('tokens')!;
      tokens.file('tokens.css', generateCSS(colors));
      tokens.file('tokens.scss', generateSCSS(colors));
      tokens.file('tailwind.config.js', generateTailwind(colors));
      tokens.file('tokens.json', generateJSON(colors));
      tokens.file('figma-tokens.json', generateFigma(colors));
      tokens.file('design-brief.md', generateBrief(colors));
      zip.file('README.md', `# DesignLab Pro Export\n\nThis archive contains your design tokens in multiple formats.\n\n- \`tokens/tokens.css\` — CSS custom properties\n- \`tokens/tokens.scss\` — SCSS variables and mixins\n- \`tokens/tailwind.config.js\` — Tailwind CSS config\n- \`tokens/tokens.json\` — Design Tokens Community Group format\n- \`tokens/figma-tokens.json\` — Figma Tokens plugin format\n- \`tokens/design-brief.md\` — Human-readable design decisions\n`);
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'designlab-pro-tokens.zip';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('ZIP downloaded successfully!');
    } catch (e) {
      toast.error('ZIP export failed.');
    }
  };

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)',
          width: '100%', maxWidth: 800, maxHeight: '90vh',
          display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: 'var(--text)', margin: 0 }}>Export Design Tokens</h2>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>Download your tokens in any format</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={downloadAll} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
              backgroundColor: 'var(--accent)', color: '#fff', border: 'none',
              borderRadius: 'var(--radius)', cursor: 'pointer', fontWeight: 700, fontSize: 13
            }}>
              <Download size={14} /> Download ZIP
            </button>
            <button onClick={onClose} style={{
              width: 36, height: 36, borderRadius: 'var(--radius)', border: '1px solid var(--border)',
              background: 'var(--surface2)', color: 'var(--text-secondary)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <X size={16} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 2, padding: '12px 24px', borderBottom: '1px solid var(--border)', flexShrink: 0, overflowX: 'auto' }}>
          {(Object.keys(outputs) as ExportTab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '6px 14px', borderRadius: 'var(--radius-full)', border: 'none',
              background: tab === t ? 'var(--accent)' : 'transparent',
              color: tab === t ? '#fff' : 'var(--text-secondary)',
              cursor: 'pointer', fontSize: 13, fontWeight: tab === t ? 700 : 400,
              whiteSpace: 'nowrap', transition: 'all 150ms'
            }}>
              {outputs[t].label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '12px 24px', display: 'flex', justifyContent: 'flex-end', gap: 8, flexShrink: 0 }}>
            <button onClick={copy} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
              backgroundColor: copied ? 'rgba(34,197,94,0.1)' : 'var(--surface2)',
              border: `1px solid ${copied ? '#22c55e' : 'var(--border)'}`,
              borderRadius: 'var(--radius)', color: copied ? '#22c55e' : 'var(--text-secondary)',
              cursor: 'pointer', fontSize: 12, fontWeight: 600
            }}>
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy All'}
            </button>
            <button onClick={download} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
              backgroundColor: 'var(--surface2)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', color: 'var(--text-secondary)',
              cursor: 'pointer', fontSize: 12, fontWeight: 600
            }}>
              <Download size={12} /> {current.filename}
            </button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', margin: '0 24px 24px', backgroundColor: '#0d0d14', borderRadius: 'var(--radius-md)', border: '1px solid #1e1e2e' }}>
            <pre style={{ margin: 0, padding: 20, fontFamily: 'var(--font-mono)', fontSize: 12, color: '#a5b4fc', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {current.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
