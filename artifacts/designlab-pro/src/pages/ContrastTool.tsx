import React, { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { ShieldCheck, AlertTriangle, XCircle, CheckCircle2, RefreshCw, Plus, Trash2 } from 'lucide-react';
import { contrastRatio, wcagLevel } from '@/utils/colorMath';
import { useDesignStore } from '@/store/useDesignStore';

interface PairRow {
  id: string;
  fg: string;
  bg: string;
  label: string;
}

function WCAGBadge({ ratio }: { ratio: number }) {
  const level = wcagLevel(ratio);
  const config = {
    'AAA': { bg: 'bg-emerald-500', text: 'text-white', icon: <CheckCircle2 size={12} /> },
    'AA': { bg: 'bg-green-500', text: 'text-white', icon: <CheckCircle2 size={12} /> },
    'AA Large': { bg: 'bg-yellow-500', text: 'text-black', icon: <AlertTriangle size={12} /> },
    'Fail': { bg: 'bg-red-500', text: 'text-white', icon: <XCircle size={12} /> },
  }[level];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
      {config.icon} {level}
    </span>
  );
}

function RatioMeter({ ratio }: { ratio: number }) {
  const pct = Math.min((ratio / 21) * 100, 100);
  const color = ratio >= 7 ? '#10b981' : ratio >= 4.5 ? '#22c55e' : ratio >= 3 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-sm font-bold font-mono w-14 text-right" style={{ color }}>{ratio.toFixed(2)}:1</span>
    </div>
  );
}

const DEFAULT_PAIRS: PairRow[] = [
  { id: '1', fg: '#e2e2f0', bg: '#0a0a0f', label: 'Dark Mode Body' },
  { id: '2', fg: '#6366f1', bg: '#0a0a0f', label: 'Primary on Dark' },
  { id: '3', fg: '#ffffff', bg: '#6366f1', label: 'White on Primary' },
  { id: '4', fg: '#1a1a2e', bg: '#ffffff', label: 'Dark Text on White' },
  { id: '5', fg: '#6b7280', bg: '#ffffff', label: 'Muted on White' },
];

export default function ContrastTool() {
  const { colorRoles } = useDesignStore();
  const [pairs, setPairs] = useState<PairRow[]>(DEFAULT_PAIRS);
  const [previewFg, setPreviewFg] = useState('#e2e2f0');
  const [previewBg, setPreviewBg] = useState('#0a0a0f');
  const [fontSize, setFontSize] = useState(16);

  const previewRatio = useMemo(() => contrastRatio(previewFg, previewBg), [previewFg, previewBg]);
  const previewLevel = wcagLevel(previewRatio);

  const addPair = () => {
    setPairs([...pairs, { id: Math.random().toString(36).slice(2), fg: '#ffffff', bg: '#000000', label: 'New Pair' }]);
  };

  const removePair = (id: string) => setPairs(pairs.filter(p => p.id !== id));

  const updatePair = (id: string, field: keyof PairRow, value: string) => {
    setPairs(pairs.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const loadFromStore = () => {
    setPairs([
      { id: 'cr1', fg: colorRoles.text, bg: colorRoles.background, label: 'Text on Background' },
      { id: 'cr2', fg: colorRoles.primary, bg: colorRoles.background, label: 'Primary on Background' },
      { id: 'cr3', fg: '#ffffff', bg: colorRoles.primary, label: 'White on Primary' },
      { id: 'cr4', fg: colorRoles.text, bg: colorRoles.surface, label: 'Text on Surface' },
      { id: 'cr5', fg: colorRoles.primary, bg: colorRoles.surface, label: 'Primary on Surface' },
    ]);
    setPreviewFg(colorRoles.text);
    setPreviewBg(colorRoles.background);
  };

  const Sidebar = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck size={16} className="text-primary" />
          <h2 className="font-display font-bold">Contrast Checker</h2>
        </div>
        <button
          onClick={loadFromStore}
          className="w-full py-2 bg-secondary text-foreground rounded text-sm font-medium flex justify-center items-center gap-2 hover:bg-secondary/80"
        >
          <RefreshCw size={14} /> Load from Color Roles
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pairs</span>
          <button onClick={addPair} className="p-1 rounded bg-secondary hover:bg-secondary/80 text-muted-foreground">
            <Plus size={14} />
          </button>
        </div>

        {pairs.map(pair => {
          const ratio = contrastRatio(pair.fg, pair.bg);
          return (
            <div key={pair.id} className="p-3 bg-background border border-border rounded-xl space-y-2 group">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={pair.label}
                  onChange={e => updatePair(pair.id, 'label', e.target.value)}
                  className="text-xs font-medium bg-transparent border-none outline-none flex-1 truncate"
                />
                <button onClick={() => removePair(pair.id)} className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0">
                  <Trash2 size={12} />
                </button>
              </div>
              <div className="flex gap-2">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-[10px] text-muted-foreground">FG</label>
                  <div className="flex items-center gap-1.5 p-1 border border-border rounded bg-background">
                    <input type="color" value={pair.fg} onChange={e => updatePair(pair.id, 'fg', e.target.value)} className="w-5 h-5 rounded cursor-pointer border-none shrink-0" />
                    <span className="text-[10px] font-mono">{pair.fg}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-[10px] text-muted-foreground">BG</label>
                  <div className="flex items-center gap-1.5 p-1 border border-border rounded bg-background">
                    <input type="color" value={pair.bg} onChange={e => updatePair(pair.id, 'bg', e.target.value)} className="w-5 h-5 rounded cursor-pointer border-none shrink-0" />
                    <span className="text-[10px] font-mono">{pair.bg}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <RatioMeter ratio={ratio} />
                <div className="ml-3 shrink-0"><WCAGBadge ratio={ratio} /></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <Layout sidebar={Sidebar}>
      <div className="h-full overflow-auto bg-card">
        <div className="max-w-3xl mx-auto p-8 space-y-10">

          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold">Live Preview</h2>
            <div className="rounded-2xl overflow-hidden border border-border shadow-xl">
              <div className="p-8 space-y-4" style={{ backgroundColor: previewBg }}>
                <p style={{ color: previewFg, fontSize: `${fontSize}px`, lineHeight: 1.5 }}>
                  The quick brown fox jumps over the lazy dog. AaBbCcDdEeFfGg 0123456789
                </p>
                <p style={{ color: previewFg, fontSize: `${Math.round(fontSize * 0.75)}px`, lineHeight: 1.5, opacity: 0.8 }}>
                  Smaller supporting text — this simulates body copy at a reduced size to help you evaluate readability at different scales.
                </p>
                <div style={{ color: previewFg, fontSize: `${Math.round(fontSize * 1.5)}px`, fontWeight: 'bold' }}>
                  Large Heading
                </div>
              </div>

              <div className="flex items-stretch border-t border-border">
                <div className="flex-1 p-4 bg-background space-y-3">
                  <div className="flex gap-3 items-center">
                    <div className="flex flex-col gap-1 flex-1">
                      <label className="text-xs font-medium text-muted-foreground">Foreground</label>
                      <div className="flex items-center gap-2 p-2 border border-border rounded-lg bg-card">
                        <input type="color" value={previewFg} onChange={e => setPreviewFg(e.target.value)} className="w-7 h-7 rounded cursor-pointer border-none shrink-0" />
                        <span className="font-mono text-sm">{previewFg}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <label className="text-xs font-medium text-muted-foreground">Background</label>
                      <div className="flex items-center gap-2 p-2 border border-border rounded-lg bg-card">
                        <input type="color" value={previewBg} onChange={e => setPreviewBg(e.target.value)} className="w-7 h-7 rounded cursor-pointer border-none shrink-0" />
                        <span className="font-mono text-sm">{previewBg}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-muted-foreground flex justify-between">Font Size <span>{fontSize}px</span></label>
                    <input type="range" min="10" max="48" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} />
                  </div>
                </div>
                <div className="w-48 shrink-0 p-4 bg-background border-l border-border flex flex-col justify-center items-center gap-2">
                  <div className="text-3xl font-bold font-mono" style={{ color: previewRatio >= 4.5 ? '#10b981' : previewRatio >= 3 ? '#f59e0b' : '#ef4444' }}>
                    {previewRatio.toFixed(2)}:1
                  </div>
                  <WCAGBadge ratio={previewRatio} />
                  <div className="text-xs text-muted-foreground text-center">
                    {previewLevel === 'Fail' ? 'Fails all WCAG levels' :
                     previewLevel === 'AA Large' ? 'Pass for large text only (≥18pt bold or ≥24pt)' :
                     previewLevel === 'AA' ? 'Passes WCAG AA' :
                     'Passes WCAG AA and AAA'}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold">Batch Results</h2>
            <div className="rounded-xl overflow-hidden border border-border">
              <div className="grid grid-cols-[2fr_1fr_1fr_auto] text-xs font-bold text-muted-foreground uppercase tracking-wider px-4 py-3 bg-secondary border-b border-border gap-4">
                <span>Pair</span><span>Ratio</span><span>Level</span><span>Preview</span>
              </div>
              {pairs.map(pair => {
                const ratio = contrastRatio(pair.fg, pair.bg);
                return (
                  <div key={pair.id} className="grid grid-cols-[2fr_1fr_1fr_auto] items-center px-4 py-3 border-b border-border/50 last:border-none gap-4 hover:bg-secondary/30 transition-colors">
                    <div>
                      <div className="text-sm font-medium">{pair.label}</div>
                      <div className="text-xs text-muted-foreground font-mono">{pair.fg} / {pair.bg}</div>
                    </div>
                    <div className="font-mono font-bold text-sm">{ratio.toFixed(2)}:1</div>
                    <WCAGBadge ratio={ratio} />
                    <div
                      className="w-20 h-8 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm"
                      style={{ backgroundColor: pair.bg, color: pair.fg }}
                    >
                      Aa
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="grid grid-cols-3 gap-4">
            {[
              { level: 'AA', min: 4.5, description: 'Minimum for normal text', req: '≥ 4.5:1' },
              { level: 'AA Large', min: 3, description: 'Large text (18pt/14pt bold)', req: '≥ 3:1' },
              { level: 'AAA', min: 7, description: 'Enhanced for accessibility', req: '≥ 7:1' },
            ].map(s => {
              const passing = pairs.filter(p => contrastRatio(p.fg, p.bg) >= s.min).length;
              return (
                <div key={s.level} className="p-5 bg-background border border-border rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{s.level}</span>
                    <span className="font-mono text-xs text-muted-foreground">{s.req}</span>
                  </div>
                  <div className="text-2xl font-bold font-mono">
                    <span className={passing === pairs.length ? 'text-emerald-500' : passing > 0 ? 'text-yellow-500' : 'text-red-500'}>{passing}</span>
                    <span className="text-muted-foreground text-lg">/{pairs.length}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{s.description}</div>
                </div>
              );
            })}
          </section>
        </div>
      </div>
    </Layout>
  );
}
