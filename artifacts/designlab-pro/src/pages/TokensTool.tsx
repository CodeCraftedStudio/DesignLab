import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Braces, Copy, Check, Download, ChevronRight } from 'lucide-react';
import { useDesignStore } from '@/store/useDesignStore';

type ExportFormat = 'css' | 'tailwind' | 'json' | 'js' | 'scss';

const SPACING_SCALE = [0, 1, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96];
const FONT_SIZES = { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem', '5xl': '3rem', '6xl': '3.75rem' };
const FONT_WEIGHTS = { light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800 };
const RADII = { none: '0px', sm: '2px', DEFAULT: '4px', md: '6px', lg: '8px', xl: '12px', '2xl': '16px', '3xl': '24px', full: '9999px' };
const SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
};
const TRANSITIONS = { fast: '150ms ease', base: '200ms ease', slow: '300ms ease', slower: '500ms ease' };
const BREAKPOINTS = { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px' };

function hex2hsl(hex: string) {
  let r = parseInt(hex.slice(1,3),16)/255, g = parseInt(hex.slice(3,5),16)/255, b = parseInt(hex.slice(5,7),16)/255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h=0, s=0, l=(max+min)/2;
  if(max!==min){const d=max-min;s=l>0.5?d/(2-max-min):d/(max+min);switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;case b:h=(r-g)/d+4;break;}h/=6;}
  return `${Math.round(h*360)} ${Math.round(s*100)}% ${Math.round(l*100)}%`;
}

export default function TokensTool() {
  const { colorRoles } = useDesignStore();
  const [format, setFormat] = useState<ExportFormat>('css');
  const [activeSection, setActiveSection] = useState<string>('colors');
  const [copied, setCopied] = useState(false);

  const generateCSS = () => `/* DesignLab Pro — Design Tokens */
:root {
  /* Colors */
  --color-primary: ${colorRoles.primary};
  --color-background: ${colorRoles.background};
  --color-surface: ${colorRoles.surface};
  --color-text: ${colorRoles.text};
  --color-border: ${colorRoles.border};

  /* Spacing */
${SPACING_SCALE.map(s => `  --spacing-${s}: ${s === 0 ? '0px' : `${s * 4}px`};`).join('\n')}

  /* Typography */
${Object.entries(FONT_SIZES).map(([k, v]) => `  --font-size-${k}: ${v};`).join('\n')}
${Object.entries(FONT_WEIGHTS).map(([k, v]) => `  --font-weight-${k}: ${v};`).join('\n')}

  /* Border Radius */
${Object.entries(RADII).map(([k, v]) => `  --radius-${k === 'DEFAULT' ? 'default' : k}: ${v};`).join('\n')}

  /* Shadows */
${Object.entries(SHADOWS).map(([k, v]) => `  --shadow-${k === 'DEFAULT' ? 'default' : k}: ${v};`).join('\n')}

  /* Transitions */
${Object.entries(TRANSITIONS).map(([k, v]) => `  --transition-${k}: ${v};`).join('\n')}

  /* Breakpoints */
${Object.entries(BREAKPOINTS).map(([k, v]) => `  --breakpoint-${k}: ${v};`).join('\n')}
}`;

  const generateSCSS = () => `// DesignLab Pro — Design Tokens (SCSS)

// Colors
$color-primary: ${colorRoles.primary};
$color-background: ${colorRoles.background};
$color-surface: ${colorRoles.surface};
$color-text: ${colorRoles.text};
$color-border: ${colorRoles.border};

// Spacing
$spacing: (${SPACING_SCALE.map(s => `\n  ${s === 0 ? '0' : s}: ${s === 0 ? '0px' : `${s * 4}px`}`).join(',')}\n);

// Typography sizes
$font-sizes: (${Object.entries(FONT_SIZES).map(([k, v]) => `\n  '${k}': ${v}`).join(',')}\n);

// Border Radius
$radii: (${Object.entries(RADII).map(([k, v]) => `\n  '${k}': ${v}`).join(',')}\n);`;

  const generateTailwind = () => `// tailwind.config.js — DesignLab Pro Tokens
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '${colorRoles.primary}',
        background: '${colorRoles.background}',
        surface: '${colorRoles.surface}',
        'app-text': '${colorRoles.text}',
        'app-border': '${colorRoles.border}',
      },
      borderRadius: {
${Object.entries(RADII).map(([k, v]) => `        '${k}': '${v}',`).join('\n')}
      },
      spacing: {
${SPACING_SCALE.slice(1, 10).map(s => `        '${s}': '${s * 4}px',`).join('\n')}
      },
      boxShadow: {
${Object.entries(SHADOWS).map(([k, v]) => `        '${k}': '${v}',`).join('\n')}
      },
    },
  },
}`;

  const generateJSON = () => JSON.stringify({
    colors: {
      primary: { value: colorRoles.primary, type: 'color' },
      background: { value: colorRoles.background, type: 'color' },
      surface: { value: colorRoles.surface, type: 'color' },
      text: { value: colorRoles.text, type: 'color' },
      border: { value: colorRoles.border, type: 'color' },
    },
    spacing: Object.fromEntries(SPACING_SCALE.map(s => [s, { value: s === 0 ? '0px' : `${s * 4}px`, type: 'spacing' }])),
    typography: {
      fontSize: Object.fromEntries(Object.entries(FONT_SIZES).map(([k, v]) => [k, { value: v, type: 'fontSize' }])),
      fontWeight: Object.fromEntries(Object.entries(FONT_WEIGHTS).map(([k, v]) => [k, { value: v, type: 'fontWeight' }])),
    },
    borderRadius: Object.fromEntries(Object.entries(RADII).map(([k, v]) => [k, { value: v, type: 'borderRadius' }])),
    boxShadow: Object.fromEntries(Object.entries(SHADOWS).map(([k, v]) => [k, { value: v, type: 'boxShadow' }])),
  }, null, 2);

  const generateJS = () => `// tokens.js — DesignLab Pro Design Tokens
export const tokens = {
  colors: {
    primary: '${colorRoles.primary}',
    background: '${colorRoles.background}',
    surface: '${colorRoles.surface}',
    text: '${colorRoles.text}',
    border: '${colorRoles.border}',
  },
  spacing: {${SPACING_SCALE.map(s => `\n    ${s}: '${s === 0 ? '0px' : `${s * 4}px`}'`).join(',')}\n  },
  fontSize: {${Object.entries(FONT_SIZES).map(([k, v]) => `\n    ${k}: '${v}'`).join(',')}\n  },
  fontWeight: {${Object.entries(FONT_WEIGHTS).map(([k, v]) => `\n    ${k}: ${v}`).join(',')}\n  },
  borderRadius: {${Object.entries(RADII).map(([k, v]) => `\n    ${k}: '${v}'`).join(',')}\n  },
  boxShadow: {${Object.entries(SHADOWS).map(([k, v]) => `\n    ${k}: '${v}'`).join(',')}\n  },
};`;

  const outputMap: Record<ExportFormat, () => string> = {
    css: generateCSS,
    scss: generateSCSS,
    tailwind: generateTailwind,
    json: generateJSON,
    js: generateJS,
  };

  const output = outputMap[format]();

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const download = () => {
    const ext = format === 'tailwind' ? 'js' : format === 'json' ? 'json' : format;
    const blob = new Blob([output], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `tokens.${ext}`;
    a.click();
  };

  const SECTIONS = [
    { id: 'colors', label: 'Colors', count: 5 },
    { id: 'spacing', label: 'Spacing', count: SPACING_SCALE.length },
    { id: 'typography', label: 'Typography', count: Object.keys(FONT_SIZES).length + Object.keys(FONT_WEIGHTS).length },
    { id: 'radius', label: 'Radius', count: Object.keys(RADII).length },
    { id: 'shadows', label: 'Shadows', count: Object.keys(SHADOWS).length },
    { id: 'transitions', label: 'Transitions', count: Object.keys(TRANSITIONS).length },
    { id: 'breakpoints', label: 'Breakpoints', count: Object.keys(BREAKPOINTS).length },
  ];

  const Sidebar = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <Braces size={16} className="text-primary" />
          <h2 className="font-display font-bold">Token Explorer</h2>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted-foreground">Export Format</label>
          <div className="grid grid-cols-5 gap-1">
            {(['css', 'scss', 'json', 'js', 'tailwind'] as ExportFormat[]).map(f => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`py-1.5 text-xs rounded border transition-colors font-mono ${format === f ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:border-primary/50'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2">
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`w-full flex items-center justify-between p-3 rounded-lg text-sm transition-colors mb-1 ${activeSection === s.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-secondary text-foreground'}`}
          >
            <span>{s.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{s.count}</span>
              <ChevronRight size={14} className="text-muted-foreground" />
            </div>
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-border flex gap-2">
        <button onClick={copy} className="flex-1 py-2 bg-secondary text-foreground rounded text-sm font-medium flex justify-center items-center gap-2 hover:bg-secondary/80">
          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy'}
        </button>
        <button onClick={download} className="flex-1 py-2 bg-primary text-primary-foreground rounded text-sm font-medium flex justify-center items-center gap-2 hover:opacity-90">
          <Download size={14} /> Export
        </button>
      </div>
    </div>
  );

  return (
    <Layout sidebar={Sidebar}>
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-auto p-8">
            <div className="max-w-3xl mx-auto space-y-8">

              {activeSection === 'colors' && (
                <section className="space-y-4">
                  <h2 className="text-xl font-display font-bold">Color Tokens</h2>
                  <div className="grid grid-cols-1 gap-3">
                    {Object.entries(colorRoles).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-4 p-4 bg-background border border-border rounded-xl">
                        <div className="w-12 h-12 rounded-lg shadow-inner shrink-0" style={{ backgroundColor: value }} />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold capitalize">{key}</div>
                          <div className="text-sm text-muted-foreground font-mono">{value}</div>
                        </div>
                        <div className="text-xs text-muted-foreground font-mono hidden md:block">{hex2hsl(value)}</div>
                        <div className="text-xs font-mono text-muted-foreground">--color-{key}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {activeSection === 'spacing' && (
                <section className="space-y-4">
                  <h2 className="text-xl font-display font-bold">Spacing Tokens</h2>
                  <div className="space-y-2">
                    {SPACING_SCALE.map(s => (
                      <div key={s} className="flex items-center gap-4 py-2 border-b border-border/50">
                        <span className="w-16 font-mono text-sm text-muted-foreground shrink-0">{s}</span>
                        <div className="h-4 bg-primary/40 rounded shrink-0 transition-all" style={{ width: `${Math.min(s * 4, 300)}px`, minWidth: s === 0 ? '2px' : undefined }} />
                        <span className="font-mono text-sm">{s === 0 ? '0px' : `${s * 4}px`}</span>
                        <span className="font-mono text-xs text-muted-foreground">{s === 0 ? '0rem' : `${(s * 4 / 16).toFixed(3)}rem`}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {activeSection === 'typography' && (
                <section className="space-y-6">
                  <h2 className="text-xl font-display font-bold">Typography Tokens</h2>
                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Font Sizes</h3>
                    {Object.entries(FONT_SIZES).map(([key, val]) => (
                      <div key={key} className="flex items-baseline gap-4 py-3 border-b border-border/50">
                        <span className="w-16 font-mono text-xs text-muted-foreground">{key}</span>
                        <span style={{ fontSize: val, lineHeight: 1.2 }} className="font-bold">The quick brown fox</span>
                        <span className="font-mono text-xs text-muted-foreground ml-auto">{val}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Font Weights</h3>
                    {Object.entries(FONT_WEIGHTS).map(([key, val]) => (
                      <div key={key} className="flex items-center gap-4 py-3 border-b border-border/50">
                        <span className="w-24 font-mono text-xs text-muted-foreground">{key}</span>
                        <span style={{ fontWeight: val }} className="text-lg">Design System</span>
                        <span className="font-mono text-xs text-muted-foreground ml-auto">{val}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {activeSection === 'radius' && (
                <section className="space-y-4">
                  <h2 className="text-xl font-display font-bold">Border Radius Tokens</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(RADII).map(([key, val]) => (
                      <div key={key} className="p-4 bg-background border border-border rounded-xl flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-primary/20 border-2 border-primary" style={{ borderRadius: val }} />
                        <div className="text-center">
                          <div className="font-bold text-sm">{key}</div>
                          <div className="text-xs text-muted-foreground font-mono">{val}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {activeSection === 'shadows' && (
                <section className="space-y-4">
                  <h2 className="text-xl font-display font-bold">Shadow Tokens</h2>
                  <div className="grid grid-cols-2 gap-6">
                    {Object.entries(SHADOWS).map(([key, val]) => (
                      <div key={key} className="p-6 bg-background rounded-xl flex flex-col items-center gap-3" style={{ boxShadow: val }}>
                        <div className="font-bold">{key}</div>
                        <div className="text-xs text-muted-foreground font-mono text-center break-all">{val}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {activeSection === 'transitions' && (
                <section className="space-y-4">
                  <h2 className="text-xl font-display font-bold">Transition Tokens</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(TRANSITIONS).map(([key, val]) => (
                      <div key={key} className="p-5 bg-background border border-border rounded-xl space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-bold">{key}</span>
                          <span className="font-mono text-xs text-muted-foreground">{val}</span>
                        </div>
                        <div
                          className="h-3 bg-primary rounded-full w-8 hover:w-full cursor-pointer"
                          style={{ transition: `width ${val}` }}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {activeSection === 'breakpoints' && (
                <section className="space-y-4">
                  <h2 className="text-xl font-display font-bold">Breakpoint Tokens</h2>
                  <div className="space-y-3">
                    {Object.entries(BREAKPOINTS).map(([key, val]) => (
                      <div key={key} className="flex items-center gap-4 p-4 bg-background border border-border rounded-xl">
                        <span className="w-12 font-mono font-bold text-primary">{key}</span>
                        <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(parseInt(val) / 1536) * 100}%` }} />
                        </div>
                        <span className="font-mono text-sm">{val}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>

          <div className="w-96 shrink-0 border-l border-border bg-[#0d0d14] flex flex-col overflow-hidden">
            <div className="h-10 bg-[#16161f] border-b border-[#1e1e2e] flex items-center px-4 gap-3">
              <span className="text-xs font-mono text-[#6366f1] font-bold">tokens.{format === 'tailwind' ? 'js' : format}</span>
              <div className="ml-auto flex gap-2">
                <button onClick={copy} className="text-muted-foreground hover:text-white p-1">
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>
            <pre className="flex-1 overflow-auto p-4 text-[#e2e2f0] font-mono text-xs leading-relaxed whitespace-pre-wrap">
              {output}
            </pre>
          </div>
        </div>
      </div>
    </Layout>
  );
}
