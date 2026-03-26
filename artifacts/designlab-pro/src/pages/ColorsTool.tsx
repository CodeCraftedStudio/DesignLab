import React, { useState, useMemo, useRef, useCallback } from 'react';
import Layout from '@/components/Layout';
import { Palette, Layers, Contrast, Sparkles, Copy, Check, Home, LayoutDashboard, Lock, ArrowRight, Activity, Users, DollarSign, Shuffle, Undo2, Redo2, RotateCcw } from 'lucide-react';
import { useDesignStore } from '@/store/useDesignStore';
import { contrastRatio, wcagLevel, generateHarmony, generateTints, generateShades, hexToRgb, rgbToHsl, hslToRgb, rgbToHex } from '@/utils/colorMath';
import { buildLinearGradient, buildRadialGradient, buildConicGradient, PRESET_GRADIENTS } from '@/utils/gradientBuilder';
import { polylinePoints, donutSegments } from '@/utils/svgCharts';
import { toast } from '@/utils/toastStore';

// ━━━ PALETTE PRESETS ━━━
const PALETTES = [
  { name: 'Indigo Night', primary: '#6366f1', background: '#0a0a0f', surface: '#16161f', text: '#e2e2f0', border: '#1e1e2e' },
  { name: 'Rose Dawn', primary: '#f43f5e', background: '#fff1f2', surface: '#ffffff', text: '#111827', border: '#fecdd3' },
  { name: 'Emerald', primary: '#10b981', background: '#f0fdf4', surface: '#ffffff', text: '#14532d', border: '#bbf7d0' },
  { name: 'Ocean Dark', primary: '#0ea5e9', background: '#0c1a2e', surface: '#0f2644', text: '#e0f2fe', border: '#1e3a5f' },
  { name: 'Amber Warm', primary: '#f59e0b', background: '#fffbeb', surface: '#ffffff', text: '#78350f', border: '#fde68a' },
  { name: 'Purple Dusk', primary: '#a855f7', background: '#1a0533', surface: '#2d1052', text: '#f3e8ff', border: '#6b21a8' },
  { name: 'Slate Minimal', primary: '#334155', background: '#f8fafc', surface: '#ffffff', text: '#0f172a', border: '#e2e8f0' },
  { name: 'Cyber Green', primary: '#39ff14', background: '#050f05', surface: '#0a1f0a', text: '#ccffcc', border: '#1a3a1a' },
];

const DEFAULT_PALETTE = { primary: '#6366f1', background: '#0a0a0f', surface: '#16161f', text: '#e2e2f0', border: '#1e1e2e' };

type PaletteSnapshot = { primary: string; background: string; surface: string; text: string; border: string };

// ━━━ RANDOM PALETTE GENERATOR ━━━
function generateRandomPalette(): PaletteSnapshot {
  // Random base hue
  const baseH = Math.random() * 360;
  // Each role gets a different offset so they're all visually distinct
  const hPrimary = baseH;
  const hBg = (baseH + 120 + Math.random() * 60) % 360;
  const hSurface = (baseH + 200 + Math.random() * 40) % 360;
  const hText = (baseH + 30 + Math.random() * 30) % 360;
  const hBorder = (baseH + 270 + Math.random() * 50) % 360;

  const toHex = (h: number, s: number, l: number) => {
    const { r, g, b } = hslToRgb(h, s, l);
    return rgbToHex(r, g, b);
  };

  return {
    primary: toHex(hPrimary, 60 + Math.random() * 30, 45 + Math.random() * 20),    // vibrant mid
    background: toHex(hBg, 30 + Math.random() * 30, 10 + Math.random() * 20),     // dark-ish colorful
    surface: toHex(hSurface, 25 + Math.random() * 35, 18 + Math.random() * 25),     // slightly lighter colorful
    text: toHex(hText, 20 + Math.random() * 40, 75 + Math.random() * 20),     // light colorful
    border: toHex(hBorder, 30 + Math.random() * 40, 35 + Math.random() * 25),     // mid colorful
  };
}

// ━━━ COLOR ROLE PICKER ━━━
function ColorRoleRow({
  label, value, onChange
}: { label: string; value: string; onChange: (v: string) => void }) {
  const [copied, setCopied] = useState(false);
  const copyHex = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    toast.success(`Copied ${value}`);
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 12px', borderRadius: 10, border: '1px solid var(--border)',
      backgroundColor: 'var(--surface2)', gap: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Visible color swatch with native color picker */}
        <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0 }} title={`Click to change ${label}`}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, backgroundColor: value,
            border: '2px solid rgba(255,255,255,0.15)', boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            position: 'relative', overflow: 'hidden', flexShrink: 0
          }}>
            <input
              type="color"
              value={value}
              onInput={(e) => onChange((e.target as HTMLInputElement).value)}
              onChange={(e) => onChange(e.target.value)}
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                opacity: 0, cursor: 'pointer', padding: 0, border: 'none'
              }}
            />
          </div>
        </label>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', letterSpacing: '0.03em' }}>
          {value.toUpperCase()}
        </span>
        <button onClick={copyHex} style={{
          width: 24, height: 24, borderRadius: 6, border: '1px solid var(--border)',
          backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: copied ? '#22c55e' : 'var(--text-muted)'
        }}>
          {copied ? <Check size={11} /> : <Copy size={11} />}
        </button>
      </div>
    </div>
  );
}

export default function ColorsTool() {
  const { colorRoles, setColorRole, setAllColorRoles } = useDesignStore();
  const [activeTab, setActiveTab] = useState<'home' | 'dashboard' | 'auth'>('home');
  const [harmonyType, setHarmonyType] = useState<'complementary' | 'analogous' | 'triadic' | 'tetradic' | 'split' | 'monochromatic'>('complementary');
  const [gradientType, setGradientType] = useState<'linear' | 'radial' | 'conic'>('linear');
  const [gradientAngle, setGradientAngle] = useState(135);
  const [gradStops, setGradStops] = useState<string[]>([colorRoles.primary, '#d04ed6']);
  const [gradCopied, setGradCopied] = useState(false);
  const [randomCount, setRandomCount] = useState(0);

  // ━━━ UNDO / REDO HISTORY ━━━
  const historyRef = useRef<PaletteSnapshot[]>([{ ...colorRoles }]);
  const historyIndexRef = useRef(0);
  const [historyVersion, setHistoryVersion] = useState(0); // trigger re-render

  const currentSnapshot = (): PaletteSnapshot => ({
    primary: colorRoles.primary, background: colorRoles.background,
    surface: colorRoles.surface, text: colorRoles.text, border: colorRoles.border,
  });

  const applySnapshot = useCallback((snap: PaletteSnapshot) => {
    setAllColorRoles(snap);
  }, [setAllColorRoles]);

  const pushHistory = useCallback((snap: PaletteSnapshot) => {
    const h = historyRef.current;
    const idx = historyIndexRef.current;
    // Truncate forward history
    historyRef.current = h.slice(0, idx + 1);
    historyRef.current.push(snap);
    // Keep max 50 entries
    if (historyRef.current.length > 50) historyRef.current = historyRef.current.slice(-50);
    historyIndexRef.current = historyRef.current.length - 1;
    setHistoryVersion(v => v + 1);
  }, []);

  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;

  const undo = () => {
    if (!canUndo) return;
    historyIndexRef.current -= 1;
    applySnapshot(historyRef.current[historyIndexRef.current]);
    setHistoryVersion(v => v + 1);
    toast.success('⏪ Undo');
  };

  const redo = () => {
    if (!canRedo) return;
    historyIndexRef.current += 1;
    applySnapshot(historyRef.current[historyIndexRef.current]);
    setHistoryVersion(v => v + 1);
    toast.success('⏩ Redo');
  };

  const resetToDefault = () => {
    applySnapshot(DEFAULT_PALETTE);
    pushHistory({ ...DEFAULT_PALETTE });
    toast.success('🔄 Reset to default');
  };

  const applyPalette = (p: typeof PALETTES[0]) => {
    const snap = { primary: p.primary, background: p.background, surface: p.surface, text: p.text, border: p.border };
    applySnapshot(snap);
    pushHistory(snap);
    toast.success(`Applied "${p.name}" palette`);
  };

  // ━━━ RANDOMIZE ━━━
  const randomize = useCallback(() => {
    const p = generateRandomPalette();
    setAllColorRoles(p);
    pushHistory(p);
    setRandomCount(c => c + 1);
    toast.success(`🎲 Palette #${randomCount + 1} generated!`);
  }, [setAllColorRoles, pushHistory, randomCount]);

  const contrastBgText = contrastRatio(colorRoles.background, colorRoles.text);
  const contrastBgPrimary = contrastRatio(colorRoles.background, colorRoles.primary);
  const contrastPrimaryText = contrastRatio(colorRoles.primary, colorRoles.text);
  const harmonyColors = useMemo(() => generateHarmony(colorRoles.primary, harmonyType), [colorRoles.primary, harmonyType]);
  const tints = useMemo(() => generateTints(colorRoles.primary, 9), [colorRoles.primary]);
  const shades = useMemo(() => generateShades(colorRoles.primary, 9), [colorRoles.primary]);

  const gradientCSS = useMemo(() => {
    if (gradientType === 'linear') return buildLinearGradient(gradientAngle, gradStops);
    if (gradientType === 'radial') return buildRadialGradient('circle', '50%', '50%', 'farthest-corner', gradStops);
    return buildConicGradient(0, '50%', '50%', gradStops);
  }, [gradientType, gradientAngle, gradStops]);

  const randomizeGradient = () => {
    const count = Math.floor(Math.random() * 3) + 2;
    const stops: string[] = [];
    for (let i = 0; i < count; i++) {
      stops.push(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
    }
    setGradStops(stops);
    setGradientAngle(Math.floor(Math.random() * 360));
  };

  const copyGradientCSS = () => {
    navigator.clipboard.writeText(`background: ${gradientCSS};`);
    setGradCopied(true);
    toast.success('Gradient CSS copied!');
    setTimeout(() => setGradCopied(false), 1500);
  };

  const applyPresetGradient = (preset: typeof PRESET_GRADIENTS[0]) => {
    setGradStops([...preset.stops]);
    if (preset.type === 'linear') { setGradientType('linear'); setGradientAngle((preset as any).angle ?? 135); }
    else if (preset.type === 'radial') setGradientType('radial');
    else if (preset.type === 'conic') setGradientType('conic');
  };

  const addGradStop = () => {
    if (gradStops.length >= 6) return;
    setGradStops(prev => [...prev, `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`]);
  };
  const removeGradStop = (idx: number) => {
    if (gradStops.length <= 2) return;
    setGradStops(prev => prev.filter((_, i) => i !== idx));
  };

  const copyAllCSS = () => {
    const css = `:root {\n  --color-primary: ${colorRoles.primary};\n  --color-background: ${colorRoles.background};\n  --color-surface: ${colorRoles.surface};\n  --color-text: ${colorRoles.text};\n  --color-border: ${colorRoles.border};\n}`;
    navigator.clipboard.writeText(css);
    toast.success('CSS variables copied!');
  };

  // ━━━ SIDEBAR ━━━
  const Sidebar = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: '100%', overflowY: 'auto' }}>

      {/* Header with Randomize + Undo/Redo/Reset */}
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Palette size={16} style={{ color: 'var(--accent)' }} />
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>Color Roles</h2>
          </div>
          <button
            onClick={randomize}
            title="Generate random palette"
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
              background: 'var(--accent)', color: '#fff', border: 'none',
              borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700,
              transition: 'all 150ms'
            }}
          >
            <Shuffle size={12} />
            Randomize
          </button>
        </div>

        {/* Undo / Redo / Reset toolbar */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
          <button onClick={undo} disabled={!canUndo} title="Undo" style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            padding: '5px 0', borderRadius: 6, border: '1px solid var(--border)', cursor: canUndo ? 'pointer' : 'not-allowed',
            backgroundColor: 'var(--surface2)', color: canUndo ? 'var(--text)' : 'var(--text-muted)', fontSize: 11, fontWeight: 600,
            opacity: canUndo ? 1 : 0.4, transition: 'all 150ms'
          }}><Undo2 size={11} /> Undo</button>
          <button onClick={redo} disabled={!canRedo} title="Redo" style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            padding: '5px 0', borderRadius: 6, border: '1px solid var(--border)', cursor: canRedo ? 'pointer' : 'not-allowed',
            backgroundColor: 'var(--surface2)', color: canRedo ? 'var(--text)' : 'var(--text-muted)', fontSize: 11, fontWeight: 600,
            opacity: canRedo ? 1 : 0.4, transition: 'all 150ms'
          }}><Redo2 size={11} /> Redo</button>
          <button onClick={resetToDefault} title="Reset to default" style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            padding: '5px 0', borderRadius: 6, border: '1px solid var(--border)', cursor: 'pointer',
            backgroundColor: 'var(--surface2)', color: '#ef4444', fontSize: 11, fontWeight: 600, transition: 'all 150ms'
          }}><RotateCcw size={11} /> Reset</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { label: 'Primary', key: 'primary' as const },
            { label: 'Background', key: 'background' as const },
            { label: 'Surface', key: 'surface' as const },
            { label: 'Text', key: 'text' as const },
            { label: 'Border', key: 'border' as const },
          ].map(({ label, key }) => (
            <ColorRoleRow key={key} label={label} value={colorRoles[key]} onChange={(v) => { setColorRole(key, v); pushHistory({ ...colorRoles, [key]: v }); }} />
          ))}
        </div>

        <button onClick={copyAllCSS} style={{
          width: '100%', marginTop: 10, padding: '8px', borderRadius: 8, border: '1px solid var(--border)',
          background: 'var(--surface2)', color: 'var(--text-secondary)', cursor: 'pointer',
          fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
        }}>
          <Copy size={12} /> Copy as CSS Variables
        </button>
      </div>

      {/* Palette Presets */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Sparkles size={14} style={{ color: 'var(--accent)' }} />
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>Palette Presets</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {PALETTES.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPalette(p)}
              title={p.name}
              style={{
                padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)',
                backgroundColor: p.background, cursor: 'pointer', textAlign: 'left',
                display: 'flex', flexDirection: 'column', gap: 4
              }}
            >
              <div style={{ display: 'flex', gap: 3 }}>
                {[p.primary, p.surface, p.text, p.border].map((c, i) => (
                  <div key={i} style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: c, border: '1px solid rgba(255,255,255,0.1)' }} />
                ))}
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, color: p.text, opacity: 0.9, lineHeight: 1.2 }}>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* WCAG Contrast */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Contrast size={14} style={{ color: '#f59e0b' }} />
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>WCAG Contrast</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: 'Bg ↔ Text', ratio: contrastBgText, fg: colorRoles.text, bg: colorRoles.background },
            { label: 'Bg ↔ Primary', ratio: contrastBgPrimary, fg: colorRoles.primary, bg: colorRoles.background },
            { label: 'Primary ↔ Text', ratio: contrastPrimaryText, fg: colorRoles.text, bg: colorRoles.primary },
          ].map((item) => {
            const level = wcagLevel(item.ratio);
            const levelColor = level === 'AAA' ? '#22c55e' : level === 'AA' ? '#3b82f6' : level === 'AA Large' ? '#f59e0b' : '#ef4444';
            return (
              <div key={item.label} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--surface2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>{item.label}</span>
                  <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text)' }}>{item.ratio.toFixed(2)}:1</span>
                </div>
                <div style={{
                  padding: '4px 8px', borderRadius: 6, textAlign: 'center', fontSize: 11, fontWeight: 700,
                  backgroundColor: levelColor + '20', color: levelColor, border: `1px solid ${levelColor}40`
                }}>{level}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Color Harmony */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Layers size={14} style={{ color: 'var(--accent)' }} />
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>Color Harmony</h3>
        </div>
        <select value={harmonyType} onChange={(e) => setHarmonyType(e.target.value as any)}
          style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--surface2)', color: 'var(--text)', fontSize: 12, marginBottom: 10 }}>
          <option value="complementary">Complementary</option>
          <option value="analogous">Analogous</option>
          <option value="triadic">Triadic</option>
          <option value="tetradic">Tetradic</option>
          <option value="split">Split Complementary</option>
          <option value="monochromatic">Monochromatic</option>
        </select>
        <div style={{ display: 'flex', gap: 6, height: 40 }}>
          {harmonyColors.map((c, i) => (
            <div key={i} onClick={() => setColorRole('primary', c)} style={{
              flex: 1, borderRadius: 8, backgroundColor: c, cursor: 'pointer', border: '2px solid transparent',
              transition: 'transform 150ms'
            }} title={`Apply ${c}`} />
          ))}
        </div>
        <div style={{ marginTop: 10 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 6 }}>Tints & Shades</span>
          <div style={{ display: 'flex', gap: 2, height: 16 }}>
            {tints.map((c, i) => <div key={'t' + i} style={{ flex: 1, borderRadius: 3, backgroundColor: c }} />)}
            {shades.slice(1).map((c, i) => <div key={'s' + i} style={{ flex: 1, borderRadius: 3, backgroundColor: c }} />)}
          </div>
        </div>
      </div>

      {/* Gradient Generator */}
      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={14} style={{ color: 'var(--accent)' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>Gradient Generator</h3>
          </div>
          <button onClick={randomizeGradient} title="Random gradient" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 2 }}><Shuffle size={13} /></button>
        </div>

        {/* Gradient Presets */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, marginBottom: 10 }}>
          {PRESET_GRADIENTS.map(p => {
            const bg = p.type === 'linear' ? `linear-gradient(${(p as any).angle ?? 135}deg, ${p.stops.join(', ')})` : p.type === 'radial' ? `radial-gradient(circle, ${p.stops.join(', ')})` : `conic-gradient(${p.stops.join(', ')})`;
            return (
              <button key={p.name} onClick={() => applyPresetGradient(p)} title={p.name}
                style={{ height: 28, borderRadius: 6, border: '1px solid var(--border)', cursor: 'pointer', background: bg }} />
            );
          })}
        </div>

        {/* Type Selector */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
          {['linear', 'radial', 'conic'].map(t => (
            <button key={t} onClick={() => setGradientType(t as any)} style={{
              flex: 1, padding: '5px 0', borderRadius: 6, border: '1px solid var(--border)', cursor: 'pointer',
              fontSize: 11, fontWeight: 600, textTransform: 'capitalize',
              backgroundColor: gradientType === t ? 'var(--accent)' : 'var(--surface2)',
              color: gradientType === t ? '#fff' : 'var(--text-secondary)'
            }}>{t}</button>
          ))}
        </div>
        {gradientType === 'linear' && (
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              Angle <span>{gradientAngle}°</span>
            </label>
            <input type="range" min="0" max="360" value={gradientAngle} onChange={(e) => setGradientAngle(Number(e.target.value))} style={{ width: '100%' }} />
          </div>
        )}

        {/* Stops */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>Color Stops ({gradStops.length})</span>
            {gradStops.length < 6 && (
              <button onClick={addGradStop} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>+ Add</button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {gradStops.map((stop, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, position: 'relative' }}>
                <div style={{ position: 'relative', width: '100%', height: 32, borderRadius: 8, backgroundColor: stop, cursor: 'pointer', border: '1px solid var(--border)', overflow: 'hidden' }}>
                  <input type="color" value={stop}
                    onInput={(e) => { const v = (e.target as HTMLInputElement).value; setGradStops(prev => prev.map((s, j) => j === i ? v : s)); }}
                    onChange={(e) => setGradStops(prev => prev.map((s, j) => j === i ? e.target.value : s))}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                </div>
                {gradStops.length > 2 && (
                  <button onClick={() => removeGradStop(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 9, fontWeight: 700, textAlign: 'center', padding: 0 }}>✕</button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div style={{ height: 80, borderRadius: 12, border: '1px solid var(--border)', background: gradientCSS, marginBottom: 10, boxShadow: '0 4px 16px rgba(0,0,0,.15)' }} />

        {/* Actions */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={copyGradientCSS} style={{
            flex: 1, padding: '7px', borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer', fontSize: 11, fontWeight: 600,
            backgroundColor: gradCopied ? 'rgba(34,197,94,.15)' : 'var(--surface2)', color: gradCopied ? '#22c55e' : 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, transition: 'all .15s'
          }}>
            {gradCopied ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> Copy CSS</>}
          </button>
          <button onClick={randomizeGradient} style={{
            flex: 1, padding: '7px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 600,
            backgroundColor: 'var(--accent)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4
          }}>
            <Shuffle size={11} /> Randomize
          </button>
        </div>

        {/* CSS Output */}
        <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 8, background: '#0d1117', border: '1px solid #21262d', overflow: 'auto' }}>
          <code style={{ fontSize: 10, color: '#c9d1d9', fontFamily: 'var(--font-mono)', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            <span style={{ color: '#61afef' }}>background</span>: <span style={{ color: '#98c379' }}>{gradientCSS}</span>;
          </code>
        </div>
      </div>
    </div>
  );

  // ━━━ PREVIEW HELPERS ━━━
  const cr = colorRoles;

  return (
    <Layout sidebar={Sidebar}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-secondary)' }}>
        {/* Tab Bar */}
        <div style={{
          display: 'flex', gap: 8, padding: '12px 20px', borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--surface)', justifyContent: 'center', position: 'sticky', top: 0, zIndex: 10
        }}>
          {[
            { id: 'home', icon: Home, label: 'Home Preview' },
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'auth', icon: Lock, label: 'Auth Form' },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id as any)} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
              borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              backgroundColor: activeTab === t.id ? cr.primary : 'var(--surface2)',
              color: activeTab === t.id ? '#fff' : 'var(--text-secondary)',
              boxShadow: activeTab === t.id ? `0 4px 12px ${cr.primary}40` : 'none',
              transition: 'all 200ms'
            }}>
              <t.icon size={14} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Preview Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          <div style={{
            width: '100%', maxWidth: 900, borderRadius: 16, overflow: 'hidden',
            border: `1px solid ${cr.border}`, boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            backgroundColor: cr.background, color: cr.text,
            transition: 'background-color 400ms, color 400ms, border-color 400ms'
          }}>

            {/* ━━━ HOME PREVIEW ━━━ */}
            {activeTab === 'home' && (
              <div>
                <nav style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '16px 28px', borderBottom: `1px solid ${cr.border}`
                }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: gradientCSS, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14 }}>✦</div>
                    Brand
                  </div>
                  <div style={{ display: 'flex', gap: 24, fontSize: 14, fontWeight: 500, opacity: 0.7 }}>
                    <span>Products</span><span>Solutions</span><span>Pricing</span>
                  </div>
                  <button style={{ padding: '8px 18px', borderRadius: 8, background: gradientCSS, color: '#fff', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                    Sign Up
                  </button>
                </nav>

                <main style={{ padding: '64px 48px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, position: 'relative', overflow: 'hidden' }}>
                  {/* Gradient glow behind hero */}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 500, borderRadius: '50%', background: gradientCSS, opacity: 0.10, filter: 'blur(80px)', pointerEvents: 'none' }} />

                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 'var(--radius-full)', border: `1px solid ${cr.border}`, backgroundColor: cr.surface, fontSize: 12, fontWeight: 700 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: gradientCSS, display: 'inline-block' }} />
                    DesignLab Pro 2.0 is out
                  </div>

                  <h1 style={{ fontSize: 52, fontFamily: 'var(--font-display)', fontWeight: 900, lineHeight: 1.1, maxWidth: 600, margin: 0 }}>
                    Build faster with{' '}
                    <span style={{ backgroundImage: gradientCSS, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>intelligent</span>{' '}
                    design tools.
                  </h1>

                  <p style={{ fontSize: 17, opacity: 0.65, maxWidth: 480, lineHeight: 1.6, margin: 0 }}>
                    Stop wrestling with disconnected tools. Bring your colors, typography, and components into one unified workspace.
                  </p>

                  <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                    <button style={{ padding: '12px 24px', borderRadius: 10, background: gradientCSS, color: '#fff', border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                      Get Started <ArrowRight size={14} />
                    </button>
                    <button style={{ padding: '12px 24px', borderRadius: 10, backgroundColor: 'transparent', color: cr.text, border: `1px solid ${cr.border}`, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                      Live Demo
                    </button>
                  </div>
                </main>

                {/* Gradient divider strip */}
                <div style={{ height: 3, background: gradientCSS }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, backgroundColor: cr.border }}>
                  {[
                    { icon: '🎨', title: 'Color System', desc: 'Build accessible palettes with WCAG contrast checking built in.' },
                    { icon: '📐', title: 'Spacing Scale', desc: 'Consistent spacing with a 4px base grid that adapts to any design.' },
                    { icon: '✨', title: 'Effects Studio', desc: 'Glassmorphism, neumorphism, glow effects and 80+ more presets.' },
                  ].map((f) => (
                    <div key={f.title} style={{ padding: 28, backgroundColor: cr.surface, display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: gradientCSS, opacity: 0.7 }} />
                      <div style={{ fontSize: 28 }}>{f.icon}</div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{f.title}</h3>
                      <p style={{ fontSize: 13, opacity: 0.65, lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ━━━ DASHBOARD ━━━ */}
            {activeTab === 'dashboard' && (
              <div style={{ display: 'flex', minHeight: 580 }}>
                <aside style={{ width: 220, borderRight: `1px solid ${cr.border}`, padding: 20, backgroundColor: cr.surface, display: 'flex', flexDirection: 'column', gap: 20, flexShrink: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 6, background: gradientCSS, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11 }}>✦</div>
                    Admin
                  </div>
                  <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {[
                      { icon: Activity, label: 'Overview', active: true },
                      { icon: Layers, label: 'Analytics', active: false },
                      { icon: Users, label: 'Customers', active: false },
                      { icon: LayoutDashboard, label: 'Settings', active: false },
                    ].map(({ icon: Icon, label, active }) => (
                      <div key={label} style={{
                        padding: '8px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 8,
                        backgroundColor: active ? `${cr.primary}20` : 'transparent',
                        color: active ? cr.primary : cr.text, opacity: active ? 1 : 0.6
                      }}>
                        <Icon size={15} />{label}
                      </div>
                    ))}
                  </nav>
                </aside>

                <main style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0, overflowY: 'auto' }}>
                  {/* Gradient Banner */}
                  <div style={{ background: gradientCSS, padding: '18px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, margin: 0, color: '#fff' }}>Overview</h2>
                      <p style={{ fontSize: 12, margin: '4px 0 0', color: 'rgba(255,255,255,0.7)' }}>Welcome back, here's your summary</p>
                    </div>
                    <div style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', color: '#fff', fontSize: 12, fontWeight: 600 }}>Today</div>
                  </div>

                  <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                      {[
                        { label: 'Total Revenue', value: '$45,231', icon: DollarSign, delta: '+20.1%' },
                        { label: 'Subscriptions', value: '+2,350', icon: Users, delta: '+180.1%' },
                        { label: 'Active Now', value: '+573', icon: Activity, delta: '+19%' },
                      ].map(({ label, value, icon: Icon, delta }) => (
                        <div key={label} style={{ padding: '16px', borderRadius: 12, border: `1px solid ${cr.border}`, backgroundColor: cr.surface, position: 'relative', overflow: 'hidden' }}>
                          {/* Gradient accent bar */}
                          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: gradientCSS }} />
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <span style={{ fontSize: 12, opacity: 0.6, fontWeight: 600 }}>{label}</span>
                            <Icon size={14} style={{ opacity: 0.5 }} />
                          </div>
                          <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-mono)', marginBottom: 4 }}>{value}</div>
                          <div style={{ fontSize: 11, color: '#22c55e', fontWeight: 700 }}>{delta} from last month</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
                      <div style={{ padding: 20, borderRadius: 12, border: `1px solid ${cr.border}`, backgroundColor: cr.surface, height: 200 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, margin: '0 0 12px' }}>Revenue Over Time</h3>
                        <svg width="100%" height="140" viewBox="0 0 360 140" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="areaGrad" x1="0" y1="0" x2="1" y2="0">
                              {gradStops.map((stop, i) => (
                                <stop key={i} offset={`${(i / (gradStops.length - 1)) * 100}%`} stopColor={stop} stopOpacity={i === 0 ? 0.35 : i === gradStops.length - 1 ? 0.05 : 0.2} />
                              ))}
                            </linearGradient>
                            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                              {gradStops.map((stop, i) => (
                                <stop key={i} offset={`${(i / (gradStops.length - 1)) * 100}%`} stopColor={stop} />
                              ))}
                            </linearGradient>
                          </defs>
                          <polygon
                            points={`${polylinePoints([20, 35, 25, 50, 40, 65, 55, 78, 68, 90, 75, 100], 360, 130, 10)} 350,130 10,130`}
                            fill="url(#areaGrad)"
                          />
                          <polyline
                            points={polylinePoints([20, 35, 25, 50, 40, 65, 55, 78, 68, 90, 75, 100], 360, 130, 10)}
                            fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                          />
                        </svg>
                      </div>

                      <div style={{ padding: 20, borderRadius: 12, border: `1px solid ${cr.border}`, backgroundColor: cr.surface, height: 200, display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 8px' }}>Device Split</h3>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="110" height="110" viewBox="0 0 120 120">
                            {donutSegments([45, 30, 25], 60, 60, 50, 30, [gradStops[0] || cr.primary, gradStops[1] || '#8b5cf6', gradStops[2] || harmonyColors[2] || '#06b6d4']).map((seg, i) => (
                              <path key={i} d={seg.d} fill="none" stroke={seg.color} strokeWidth="22" strokeDasharray={seg.dasharray} strokeDashoffset={seg.dashoffset} />
                            ))}
                          </svg>
                        </div>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                          {['Desktop', 'Tablet', 'Mobile'].map((l, i) => (
                            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, opacity: 0.7 }}>
                              <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: [gradStops[0] || cr.primary, gradStops[1] || '#8b5cf6', gradStops[2] || '#06b6d4'][i] }} />
                              {l}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            )}

            {/* ━━━ AUTH FORM ━━━ */}
            {activeTab === 'auth' && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 580, padding: 32, backgroundColor: cr.background, position: 'relative', overflow: 'hidden' }}>
                {/* Gradient ambient glow */}
                <div style={{ position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)', width: 500, height: 300, background: gradientCSS, opacity: 0.08, filter: 'blur(60px)', borderRadius: '50%', pointerEvents: 'none' }} />
                <div style={{ width: '100%', maxWidth: 420, borderRadius: 20, border: `1px solid ${cr.border}`, backgroundColor: cr.surface, boxShadow: `0 20px 60px rgba(0,0,0,0.15)`, overflow: 'hidden', position: 'relative' }}>
                  {/* Gradient top bar */}
                  <div style={{ height: 4, background: gradientCSS }} />
                  <div style={{ padding: 40 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: gradientCSS, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                      <Lock size={22} color="#fff" />
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, marginBottom: 6, margin: '0 0 6px' }}>Welcome back</h2>
                    <p style={{ fontSize: 14, opacity: 0.6, lineHeight: 1.5, marginBottom: 28, margin: '0 0 28px' }}>Enter your credentials to access your account.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {[
                        { label: 'Email address', placeholder: 'name@example.com', type: 'email' },
                        { label: 'Password', placeholder: '••••••••', type: 'password' },
                      ].map(({ label, placeholder, type }) => (
                        <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <label style={{ fontSize: 13, fontWeight: 600, opacity: 0.8 }}>{label}</label>
                          <div style={{
                            padding: '11px 14px', borderRadius: 10, border: `2px solid ${cr.border}`,
                            backgroundColor: cr.background, fontSize: 14, color: cr.text, fontFamily: 'inherit',
                            outline: 'none'
                          }}>
                            <span style={{ opacity: 0.35 }}>{placeholder}</span>
                          </div>
                        </div>
                      ))}

                      <button style={{
                        width: '100%', padding: '13px', borderRadius: 10, border: 'none',
                        background: gradientCSS, color: '#fff', fontWeight: 800, fontSize: 15,
                        cursor: 'pointer', marginTop: 4,
                        boxShadow: `0 8px 24px rgba(0,0,0,0.2)`
                      }}>
                        Sign In
                      </button>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0' }}>
                        <div style={{ flex: 1, height: 1, backgroundColor: cr.border }} />
                        <span style={{ fontSize: 11, color: cr.text, opacity: 0.4, fontWeight: 600 }}>OR</span>
                        <div style={{ flex: 1, height: 1, backgroundColor: cr.border }} />
                      </div>

                      <div style={{ display: 'flex', gap: 8 }}>
                        {[['G', '#ea4335'], ['⌘', '#000'], ['in', '#0077b5']].map(([label, color], i) => (
                          <button key={i} style={{
                            flex: 1, padding: '10px', borderRadius: 10, border: `1px solid ${cr.border}`,
                            backgroundColor: cr.background, cursor: 'pointer', fontSize: 13, fontWeight: 700, color: color as string
                          }}>{label}</button>
                        ))}
                      </div>

                      <p style={{ textAlign: 'center', fontSize: 13, opacity: 0.6, margin: 0 }}>
                        Don't have an account?{' '}
                        <span style={{ backgroundImage: gradientCSS, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontWeight: 700, cursor: 'pointer' }}>Sign up</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </Layout>
  );
}
