import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Radius, Copy, Check } from 'lucide-react';

const PRESETS = [
  { name: 'None', value: 0 },
  { name: 'XS', value: 2 },
  { name: 'SM', value: 4 },
  { name: 'MD', value: 8 },
  { name: 'LG', value: 12 },
  { name: 'XL', value: 16 },
  { name: '2XL', value: 24 },
  { name: '3XL', value: 32 },
  { name: 'Full', value: 9999 },
];

const COMPONENTS = ['Card', 'Button', 'Input', 'Badge', 'Avatar', 'Modal'];

const BORDER_WIDTHS = [0, 1, 2, 4, 8];
const BORDER_STYLES = ['solid', 'dashed', 'dotted', 'double', 'groove'];

export default function BordersTool() {
  const [radius, setRadius] = useState(12);
  const [tl, setTl] = useState(12);
  const [tr, setTr] = useState(12);
  const [bl, setBl] = useState(12);
  const [br, setBr] = useState(12);
  const [linked, setLinked] = useState(true);
  const [borderWidth, setBorderWidth] = useState(2);
  const [borderStyle, setBorderStyle] = useState('solid');
  const [borderColor, setBorderColor] = useState('#6366f1');
  const [fillColor, setFillColor] = useState('#6366f1');
  const [activeComp, setActiveComp] = useState('Card');
  const [copied, setCopied] = useState(false);

  const setAll = (v: number) => {
    setRadius(v); setTl(v); setTr(v); setBl(v); setBr(v);
  };

  const borderRadiusValue = linked
    ? `${radius}px`
    : `${tl}px ${tr}px ${br}px ${bl}px`;

  const cssOutput = `.element {
  border-radius: ${borderRadiusValue};
  border: ${borderWidth}px ${borderStyle} ${borderColor};
}`;

  const tailwindRadius = linked
    ? radius === 0 ? 'rounded-none'
      : radius <= 2 ? 'rounded-sm'
      : radius <= 4 ? 'rounded'
      : radius <= 8 ? 'rounded-lg'
      : radius <= 12 ? 'rounded-xl'
      : radius <= 16 ? 'rounded-2xl'
      : radius <= 24 ? 'rounded-3xl'
      : 'rounded-full'
    : 'rounded-[custom]';

  const copy = () => {
    navigator.clipboard.writeText(cssOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const Sidebar = (
    <div className="flex flex-col gap-6 p-4 h-full overflow-y-auto">
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <Radius size={16} className="text-primary" />
        <h2 className="font-display font-bold">Border Studio</h2>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground">Corner Radius</label>
            <label className="flex items-center gap-2 text-xs cursor-pointer text-muted-foreground">
              <input type="checkbox" checked={linked} onChange={e => setLinked(e.target.checked)} className="accent-primary rounded" />
              Linked
            </label>
          </div>

          {linked ? (
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Radius</span><span>{radius}px</span>
              </div>
              <input type="range" min="0" max="64" value={radius} onChange={e => setAll(Number(e.target.value))} />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {[['TL', tl, setTl], ['TR', tr, setTr], ['BL', bl, setBl], ['BR', br, setBr]].map(([label, val, setter]: any) => (
                <div key={label} className="flex flex-col gap-1">
                  <label className="text-[10px] text-muted-foreground">{label} ({val}px)</label>
                  <input type="range" min="0" max="64" value={val} onChange={e => setter(Number(e.target.value))} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted-foreground">Presets</label>
          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map(p => (
              <button
                key={p.name}
                onClick={() => setAll(p.value)}
                className={`py-1.5 text-xs rounded border transition-colors ${(linked ? radius : tl) === p.value ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:border-primary/50'}`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-4">
          <label className="text-xs font-medium text-muted-foreground">Border Width</label>
          <div className="flex gap-2">
            {BORDER_WIDTHS.map(w => (
              <button
                key={w}
                onClick={() => setBorderWidth(w)}
                className={`flex-1 py-1.5 text-xs rounded border transition-colors ${borderWidth === w ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border'}`}
              >
                {w}px
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted-foreground">Border Style</label>
          <select
            value={borderStyle}
            onChange={e => setBorderStyle(e.target.value)}
            className="p-2 rounded bg-background border border-border text-sm outline-none capitalize"
          >
            {BORDER_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">Border Color</label>
            <div className="flex items-center gap-2 p-1.5 border border-border rounded bg-background">
              <input type="color" value={borderColor} onChange={e => setBorderColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none" />
              <span className="text-xs font-mono">{borderColor}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">Fill</label>
            <div className="flex items-center gap-2 p-1.5 border border-border rounded bg-background">
              <input type="color" value={fillColor} onChange={e => setFillColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none" />
              <span className="text-xs font-mono">{fillColor}</span>
            </div>
          </div>
        </div>

        <button
          onClick={copy}
          className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Copied!' : 'Copy CSS'}
        </button>
      </div>
    </div>
  );

  const previewRadius = linked ? radius : undefined;
  const borderRadiusStyle = linked
    ? `${radius}px`
    : `${tl}px ${tr}px ${br}px ${bl}px`;

  return (
    <Layout sidebar={Sidebar}>
      <div className="h-full flex flex-col overflow-auto bg-card p-8">
        <div className="max-w-4xl mx-auto w-full space-y-10">

          <div className="flex gap-3 flex-wrap">
            {COMPONENTS.map(c => (
              <button
                key={c}
                onClick={() => setActiveComp(c)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${activeComp === c ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:border-primary/50'}`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex gap-12 items-center justify-center flex-wrap py-10">
            {activeComp === 'Card' && (
              <div
                className="w-64 p-6 bg-background shadow-xl flex flex-col gap-3 transition-all duration-300"
                style={{ borderRadius: borderRadiusStyle, border: `${borderWidth}px ${borderStyle} ${borderColor}` }}
              >
                <div className="w-10 h-10 flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: fillColor, borderRadius: `${Math.round((linked ? radius : tl) * 0.6)}px` }}>✦</div>
                <h3 className="font-bold text-lg">Card Title</h3>
                <p className="text-sm text-muted-foreground">A surface for grouping related content and actions.</p>
                <button className="mt-2 py-2 text-sm font-medium text-white" style={{ backgroundColor: fillColor, borderRadius: `${Math.round((linked ? radius : br) * 0.6)}px` }}>Action</button>
              </div>
            )}
            {activeComp === 'Button' && (
              <div className="flex flex-col gap-4 items-center">
                <button className="px-8 py-3 text-white font-bold text-sm shadow-lg transition-all duration-300" style={{ backgroundColor: fillColor, borderRadius: borderRadiusStyle, border: `${borderWidth}px ${borderStyle} ${borderColor}` }}>
                  Primary Button
                </button>
                <button className="px-8 py-3 font-bold text-sm transition-all duration-300" style={{ borderRadius: borderRadiusStyle, border: `${borderWidth || 2}px ${borderStyle} ${borderColor}`, color: fillColor }}>
                  Outline Button
                </button>
              </div>
            )}
            {activeComp === 'Input' && (
              <div className="flex flex-col gap-3 w-72">
                <label className="text-sm font-medium">Email address</label>
                <input
                  type="text"
                  placeholder="name@example.com"
                  className="p-3 bg-background text-sm outline-none transition-all duration-300"
                  style={{ borderRadius: borderRadiusStyle, border: `${borderWidth || 1}px ${borderStyle} ${borderColor}` }}
                  onFocus={e => e.target.style.borderColor = fillColor}
                  onBlur={e => e.target.style.borderColor = borderColor}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  className="p-3 bg-background text-sm outline-none transition-all duration-300"
                  style={{ borderRadius: borderRadiusStyle, border: `${borderWidth || 1}px ${borderStyle} ${borderColor}` }}
                />
              </div>
            )}
            {activeComp === 'Badge' && (
              <div className="flex flex-wrap gap-3 justify-center">
                {['Default', 'Primary', 'Success', 'Warning', 'Danger'].map((b, i) => (
                  <span
                    key={b}
                    className="px-3 py-1 text-xs font-bold"
                    style={{
                      borderRadius: borderRadiusStyle,
                      border: `${borderWidth || 1}px ${borderStyle} ${borderColor}`,
                      backgroundColor: i === 0 ? 'transparent' : `${fillColor}${['','22','33','44','55'][i]}`,
                      color: i === 0 ? fillColor : fillColor
                    }}
                  >
                    {b}
                  </span>
                ))}
              </div>
            )}
            {activeComp === 'Avatar' && (
              <div className="flex gap-4 items-end">
                {[32, 40, 48, 64, 80].map(s => (
                  <div
                    key={s}
                    className="flex items-center justify-center text-white font-bold"
                    style={{
                      width: s, height: s,
                      backgroundColor: fillColor,
                      borderRadius: borderRadiusStyle,
                      border: `${borderWidth}px ${borderStyle} ${borderColor}`,
                      fontSize: s / 3
                    }}
                  >
                    {['A', 'B', 'C', 'D', 'E'][Math.floor(s / 16) - 2]}
                  </div>
                ))}
              </div>
            )}
            {activeComp === 'Modal' && (
              <div className="relative w-80 bg-background shadow-2xl p-6 space-y-4 transition-all duration-300"
                style={{ borderRadius: borderRadiusStyle, border: `${borderWidth || 1}px ${borderStyle} ${borderColor}` }}>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">Confirm Action</h3>
                  <button className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground" style={{ borderRadius: `${Math.round((linked ? radius : tr) * 0.5)}px` }}>✕</button>
                </div>
                <p className="text-sm text-muted-foreground">Are you sure you want to proceed? This action cannot be undone.</p>
                <div className="flex gap-3 pt-2">
                  <button className="flex-1 py-2 text-sm border border-border" style={{ borderRadius: `${Math.round((linked ? radius : bl) * 0.7)}px` }}>Cancel</button>
                  <button className="flex-1 py-2 text-sm font-bold text-white" style={{ backgroundColor: fillColor, borderRadius: `${Math.round((linked ? radius : br) * 0.7)}px` }}>Confirm</button>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 bg-[#16161f] border border-[#1e1e2e] rounded-xl p-6 shadow-xl">
              <h3 className="text-xs font-bold text-[#a5b4fc] uppercase tracking-wider mb-3">Generated CSS</h3>
              <pre className="text-[#e2e2f0] font-mono text-sm whitespace-pre-wrap">{cssOutput}</pre>
            </div>
            <div className="bg-[#16161f] border border-[#1e1e2e] rounded-xl p-6 shadow-xl">
              <h3 className="text-xs font-bold text-[#86efac] uppercase tracking-wider mb-3">Tailwind</h3>
              <code className="text-[#e2e2f0] font-mono text-sm">{tailwindRadius}</code>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg">Radius Scale</h3>
            <div className="grid grid-cols-3 gap-4">
              {PRESETS.filter(p => p.name !== 'None').map(p => (
                <button
                  key={p.name}
                  onClick={() => setAll(p.value)}
                  className="group p-5 bg-background border border-border rounded-xl flex flex-col items-center gap-3 hover:border-primary transition-colors"
                >
                  <div
                    className="w-14 h-14 bg-primary/20 border-2 border-primary transition-all"
                    style={{ borderRadius: `${Math.min(p.value, 32)}px` }}
                  />
                  <div className="text-center">
                    <div className="font-bold text-sm">{p.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{p.value === 9999 ? '50%' : `${p.value}px`}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
