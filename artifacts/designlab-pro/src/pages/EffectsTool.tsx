import React, { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { Sparkles, Copy, Check } from 'lucide-react';
import { toast } from '@/utils/toastStore';

type EffectCategory = 'glassmorphism' | 'neumorphism' | 'glow' | 'text' | 'filters' | 'holographic' | 'presets';

// ━━━ STYLE PRESETS ━━━
const DESIGN_PRESETS = [
  {
    name: 'Glassmorphism', emoji: '🪟',
    desc: 'Frosted glass, translucent surfaces, blur',
    colors: { primary: '#6366f1', bg: '#0f172a', surface: 'rgba(255,255,255,0.1)', text: '#f1f5f9' },
    styles: { backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }
  },
  {
    name: 'Neumorphism', emoji: '🫧',
    desc: 'Soft UI, extruded surfaces, dual shadows',
    colors: { primary: '#6366f1', bg: '#e8e8f0', surface: '#e8e8f0', text: '#333350' },
    styles: { background: '#e8e8f0', borderRadius: '20px', boxShadow: '8px 8px 16px #c8c8d8, -8px -8px 16px #ffffff', border: 'none' }
  },
  {
    name: 'Brutalism', emoji: '🧱',
    desc: 'Bold borders, raw offset shadows',
    colors: { primary: '#ff0066', bg: '#ffffff', surface: '#ffffff', text: '#000000' },
    styles: { background: '#ffffff', border: '3px solid #000000', borderRadius: '0px', boxShadow: '6px 6px 0px #000000' }
  },
  {
    name: 'Minimalism', emoji: '◻',
    desc: 'Clean lines, lots of whitespace, subtle',
    colors: { primary: '#000000', bg: '#fafafa', surface: '#ffffff', text: '#111111' },
    styles: { background: '#ffffff', border: '1px solid #e5e5e5', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }
  },
  {
    name: 'Material Design', emoji: '🎨',
    desc: 'Elevation, color system, ripple',
    colors: { primary: '#6200ee', bg: '#f5f5f5', surface: '#ffffff', text: '#212121' },
    styles: { background: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.15), 0 2px 4px -2px rgba(0,0,0,0.1)', border: 'none' }
  },
  {
    name: 'iOS', emoji: '',
    desc: 'Rounded cards, blur backgrounds, SF Pro',
    colors: { primary: '#007aff', bg: '#f2f2f7', surface: '#ffffff', text: '#000000' },
    styles: { background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(40px) saturate(1.8)', borderRadius: '22px', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 10px 40px rgba(0,0,0,0.12)' }
  },
  {
    name: 'Dark Luxury', emoji: '✨',
    desc: 'Deep blacks, gold accents, elegant',
    colors: { primary: '#d4af37', bg: '#0a0a0a', surface: '#141414', text: '#f0e6c8' },
    styles: { background: '#141414', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '12px', boxShadow: '0 20px 60px rgba(0,0,0,0.8)', color: '#f0e6c8' }
  },
  {
    name: 'Cyberpunk', emoji: '🤖',
    desc: 'Neon on dark, glitch, electric',
    colors: { primary: '#00fff5', bg: '#0d0221', surface: '#130a2d', text: '#00fff5' },
    styles: { background: '#130a2d', border: '1px solid #00fff5', borderRadius: '4px', boxShadow: '0 0 20px rgba(0,255,245,0.4), inset 0 0 20px rgba(0,255,245,0.05)', color: '#00fff5' }
  },
  {
    name: 'Vaporwave', emoji: '🌴',
    desc: 'Pink/purple pastels, retro grid, sunset',
    colors: { primary: '#ff6ec7', bg: '#1a0533', surface: '#2d1052', text: '#ff6ec7' },
    styles: { background: 'linear-gradient(135deg, #2d1052, #1a0533)', border: '1px solid #ff6ec7', borderRadius: '8px', boxShadow: '0 0 30px rgba(255,110,199,0.5)', color: '#ff6ec7' }
  },
  {
    name: 'Y2K', emoji: '💿',
    desc: 'Chrome, plastic, bubbly, iridescent',
    colors: { primary: '#a78bfa', bg: '#f0f4ff', surface: '#ffffff', text: '#2d1b69' },
    styles: { background: 'linear-gradient(135deg, #e0e7ff, #fdf4ff)', border: '2px solid rgba(167,139,250,0.5)', borderRadius: '20px', boxShadow: '0 4px 20px rgba(167,139,250,0.4), inset 0 1px 0 rgba(255,255,255,0.8)' }
  },
  {
    name: 'Synthwave', emoji: '🎸',
    desc: 'Deep purple, pink grid, retro neon',
    colors: { primary: '#e040fb', bg: '#12002b', surface: '#1a0040', text: '#e040fb' },
    styles: { background: '#1a0040', border: '1px solid #e040fb', borderRadius: '8px', boxShadow: '0 0 40px rgba(224,64,251,0.3)' }
  },
  {
    name: 'Paper / Editorial', emoji: '📄',
    desc: 'Warm white, ink blacks, serif fonts',
    colors: { primary: '#1a1a1a', bg: '#fdfbf7', surface: '#ffffff', text: '#1a1a1a' },
    styles: { background: '#fdfbf7', border: '1px solid #d6cfc4', borderRadius: '2px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }
  },
];

function CopyBtn({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button onClick={copy} style={{
      display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
      backgroundColor: copied ? 'rgba(34,197,94,0.1)' : 'var(--surface2)',
      border: `1px solid ${copied ? '#22c55e' : 'var(--border)'}`,
      borderRadius: 'var(--radius)', color: copied ? '#22c55e' : 'var(--text-secondary)',
      cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all 150ms'
    }}>
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {label ?? (copied ? 'Copied!' : 'Copy CSS')}
    </button>
  );
}

function CodeOutput({ css }: { css: string }) {
  return (
    <div style={{
      backgroundColor: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: 'var(--radius-md)',
      padding: 16, position: 'relative'
    }}>
      <div style={{ position: 'absolute', top: 10, right: 10 }}>
        <CopyBtn value={css} />
      </div>
      <pre style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#a5b4fc', lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0, paddingTop: 24 }}>
        {css}
      </pre>
    </div>
  );
}

// ━━━ GLASSMORPHISM ━━━
function GlassSection() {
  const [blur, setBlur] = useState(16);
  const [bgOpacity, setBgOpacity] = useState(10);
  const [borderOpacity, setBorderOpacity] = useState(20);
  const [saturation, setSaturation] = useState(180);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [borderColor, setBorderColor] = useState('#ffffff');
  const [shadow, setShadow] = useState(30);

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const { r: br, g: bg2, b: bb } = hexToRgb(bgColor);
  const { r: bor, g: bog, b: bob } = hexToRgb(borderColor);
  const bgRgba = `rgba(${br},${bg2},${bb},${(bgOpacity / 100).toFixed(2)})`;
  const borderRgba = `rgba(${bor},${bog},${bob},${(borderOpacity / 100).toFixed(2)})`;

  const css = `.glass {
  background: ${bgRgba};
  backdrop-filter: blur(${blur}px) saturate(${saturation}%);
  -webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);
  border: 1px solid ${borderRgba};
  border-radius: 16px;
  box-shadow: 0 ${Math.round(shadow * 0.3)}px ${shadow * 2}px rgba(0,0,0,${(shadow / 300).toFixed(2)});
}`;

  const previewStyle: React.CSSProperties = {
    background: bgRgba,
    backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
    border: `1px solid ${borderRgba}`,
    borderRadius: 16,
    boxShadow: `0 ${Math.round(shadow * 0.3)}px ${shadow * 2}px rgba(0,0,0,${(shadow / 300).toFixed(2)})`,
    padding: 28, minHeight: 160,
    display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center'
  };

  const controls: { label: string; val: number; set: (v: number) => void; min: number; max: number; unit: string }[] = [
    { label: 'Blur', val: blur, set: setBlur, min: 0, max: 60, unit: 'px' },
    { label: 'BG Opacity', val: bgOpacity, set: setBgOpacity, min: 0, max: 100, unit: '%' },
    { label: 'Border Opacity', val: borderOpacity, set: setBorderOpacity, min: 0, max: 100, unit: '%' },
    { label: 'Saturation', val: saturation, set: setSaturation, min: 100, max: 300, unit: '%' },
    { label: 'Shadow', val: shadow, set: setShadow, min: 0, max: 100, unit: '' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa)',
        borderRadius: 16, padding: 32, position: 'relative', overflow: 'hidden', minHeight: 240,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
        <div style={previewStyle}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>Glassmorphism Card</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>A frosted glass effect on top of a colorful background. Adjust the controls to tune the effect.</div>
          <button style={{ marginTop: 8, padding: '8px 16px', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8, color: '#fff', cursor: 'pointer', fontSize: 13 }}>
            Action Button
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {controls.map(c => (
          <div key={c.label} style={{ flex: '1 1 140px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
              {c.label} <span style={{ color: 'var(--text-muted)' }}>{c.val}{c.unit}</span>
            </label>
            <input type="range" min={c.min} max={c.max} value={c.val} onChange={e => c.set(Number(e.target.value))} style={{ width: '100%' }} />
          </div>
        ))}
        <div style={{ flex: '1 1 140px', display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>BG Color</label>
            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} style={{ width: '100%', height: 36, borderRadius: 6, cursor: 'pointer' }} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>Border</label>
            <input type="color" value={borderColor} onChange={e => setBorderColor(e.target.value)} style={{ width: '100%', height: 36, borderRadius: 6, cursor: 'pointer' }} />
          </div>
        </div>
      </div>

      <CodeOutput css={css} />
    </div>
  );
}

// ━━━ NEUMORPHISM ━━━
function NeuSection() {
  const [bgColor, setBgColor] = useState('#e0e0f0');
  const [distance, setDistance] = useState(10);
  const [blur, setBlur] = useState(20);
  const [intensity, setIntensity] = useState(25);
  const [mode, setMode] = useState<'flat' | 'concave' | 'convex' | 'inset'>('flat');
  const [radius, setRadius] = useState(16);

  const hexToRgb = (hex: string) => ({ r: parseInt(hex.slice(1,3),16), g: parseInt(hex.slice(3,5),16), b: parseInt(hex.slice(5,7),16) });
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const toHex = (v: number) => v.toString(16).padStart(2,'0');

  const { r, g, b } = hexToRgb(bgColor);
  const factor = intensity / 100;
  const dark = `#${toHex(clamp(Math.round(r - 50 * factor)))}${toHex(clamp(Math.round(g - 50 * factor)))}${toHex(clamp(Math.round(b - 50 * factor)))}`;
  const light = `#${toHex(clamp(Math.round(r + 50 * factor)))}${toHex(clamp(Math.round(g + 50 * factor)))}${toHex(clamp(Math.round(b + 50 * factor)))}`;

  const shadowMap = {
    flat: `${distance}px ${distance}px ${blur}px ${dark}, -${distance}px -${distance}px ${blur}px ${light}`,
    concave: `${distance}px ${distance}px ${blur}px ${dark}, -${distance}px -${distance}px ${blur}px ${light}`,
    convex: `${distance}px ${distance}px ${blur}px ${dark}, -${distance}px -${distance}px ${blur}px ${light}`,
    inset: `inset ${distance}px ${distance}px ${blur}px ${dark}, inset -${distance}px -${distance}px ${blur}px ${light}`,
  };

  const bgMap = {
    flat: bgColor,
    concave: `linear-gradient(145deg, ${dark}, ${light})`,
    convex: `linear-gradient(145deg, ${light}, ${dark})`,
    inset: bgColor,
  };

  const css = `.neumorphic {
  background: ${bgMap[mode]};
  border-radius: ${radius}px;
  box-shadow: ${shadowMap[mode]};
}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ backgroundColor: bgColor, borderRadius: 24, padding: 40, display: 'flex', gap: 24, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', minHeight: 200 }}>
        {['Card', 'Button', 'Input'].map((label, i) => (
          <div key={label} style={{
            background: i === 1 ? bgMap[mode] : bgColor,
            borderRadius: radius,
            boxShadow: i === 2 ? shadowMap.inset : shadowMap[mode],
            padding: i === 1 ? '12px 24px' : 24,
            minWidth: i === 0 ? 180 : undefined, minHeight: i === 0 ? 100 : undefined,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 600, color: `rgba(${r},${g},${b},0)`,
            filter: `brightness(0.5) sepia(0.5)`,
            cursor: 'pointer'
          }}>
            <span style={{ color: `rgba(0,0,0,0.4)` }}>{label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {(['flat','concave','convex','inset'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            padding: '6px 14px', borderRadius: 8, border: '1px solid var(--border)',
            background: mode === m ? 'var(--accent)' : 'var(--surface2)',
            color: mode === m ? '#fff' : 'var(--text-secondary)', cursor: 'pointer', fontSize: 12, fontWeight: 600, textTransform: 'capitalize'
          }}>{m}</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {[
          { label: 'Distance', val: distance, set: setDistance, min: 2, max: 30, unit: 'px' },
          { label: 'Blur', val: blur, set: setBlur, min: 5, max: 60, unit: 'px' },
          { label: 'Intensity', val: intensity, set: setIntensity, min: 5, max: 50, unit: '%' },
          { label: 'Radius', val: radius, set: setRadius, min: 0, max: 50, unit: 'px' },
        ].map(c => (
          <div key={c.label} style={{ flex: '1 1 140px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
              {c.label} <span style={{ color: 'var(--text-muted)' }}>{c.val}{c.unit}</span>
            </label>
            <input type="range" min={c.min} max={c.max} value={c.val} onChange={e => c.set(Number(e.target.value))} />
          </div>
        ))}
        <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>Base Color</label>
          <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} style={{ width: 48, height: 36, borderRadius: 6, cursor: 'pointer' }} />
        </div>
      </div>

      <CodeOutput css={css} />
    </div>
  );
}

// ━━━ GLOW EFFECTS ━━━
function GlowSection() {
  const [color, setColor] = useState('#6366f1');
  const [intensity, setIntensity] = useState(60);
  const [blur, setBlur] = useState(20);
  const [spread, setSpread] = useState(0);
  const [glowType, setGlowType] = useState<'box' | 'text' | 'inner' | 'border' | 'pulse' | 'neon'>('box');
  const [layers, setLayers] = useState(1);

  const hexToRgb = (hex: string) => ({ r: parseInt(hex.slice(1,3),16), g: parseInt(hex.slice(3,5),16), b: parseInt(hex.slice(5,7),16) });
  const { r, g, b } = hexToRgb(color);
  const alpha = (intensity / 100).toFixed(2);

  const keyframeId = `glow-pulse-${color.replace('#','')}`;

  const generateCSS = () => {
    const base = `rgba(${r},${g},${b},${alpha})`;
    if (glowType === 'box') return `.glow {\n  box-shadow: 0 0 ${blur}px ${spread}px ${base};\n}`;
    if (glowType === 'text') return `.glow {\n  text-shadow: 0 0 ${blur}px ${base}, 0 0 ${blur * 2}px ${base};\n  color: ${color};\n}`;
    if (glowType === 'inner') return `.glow {\n  box-shadow: inset 0 0 ${blur}px ${spread}px ${base};\n}`;
    if (glowType === 'border') return `.glow {\n  border: 2px solid ${color};\n  box-shadow: 0 0 ${blur}px ${base}, inset 0 0 ${blur}px ${base};\n}`;
    if (glowType === 'neon') return `.glow {\n  border: 2px solid ${color};\n  box-shadow: 0 0 ${blur}px ${base}, 0 0 ${blur * 2}px ${base}, 0 0 ${blur * 4}px ${base};\n  text-shadow: 0 0 ${blur}px ${base};\n  color: ${color};\n}`;
    return `@keyframes glowPulse {\n  0%, 100% { box-shadow: 0 0 ${blur}px ${base}; }\n  50% { box-shadow: 0 0 ${blur * 2}px ${blur}px ${base}; }\n}\n.glow {\n  animation: glowPulse 2s ease-in-out infinite;\n}`;
  };

  const previewStyle = useMemo((): React.CSSProperties => {
    const base = `rgba(${r},${g},${b},${alpha})`;
    if (glowType === 'box') return { boxShadow: `0 0 ${blur}px ${spread}px ${base}` };
    if (glowType === 'text') return { textShadow: `0 0 ${blur}px ${base}, 0 0 ${blur * 2}px ${base}`, color };
    if (glowType === 'inner') return { boxShadow: `inset 0 0 ${blur}px ${spread}px ${base}` };
    if (glowType === 'border') return { border: `2px solid ${color}`, boxShadow: `0 0 ${blur}px ${base}, inset 0 0 ${blur}px ${base}` };
    if (glowType === 'neon') return { border: `2px solid ${color}`, boxShadow: `0 0 ${blur}px ${base}, 0 0 ${blur * 2}px ${base}, 0 0 ${blur * 4}px ${base}`, textShadow: `0 0 ${blur}px ${base}`, color };
    return { boxShadow: `0 0 ${blur}px ${base}`, animation: `glowPulse-${color.replace('#','')} 2s ease-in-out infinite` };
  }, [color, intensity, blur, spread, glowType, r, g, b, alpha]);

  const GLOW_TYPES = ['box', 'text', 'inner', 'border', 'neon', 'pulse'] as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {glowType === 'pulse' && (
        <style>{`@keyframes glowPulse-${color.replace('#','')} { 0%,100%{ box-shadow: 0 0 ${blur}px rgba(${r},${g},${b},${alpha}); } 50%{ box-shadow: 0 0 ${blur*2}px ${blur}px rgba(${r},${g},${b},${alpha}); } }`}</style>
      )}

      <div style={{ background: '#0a0a0f', borderRadius: 16, padding: 48, display: 'flex', gap: 24, alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
        <div style={{ width: 120, height: 120, borderRadius: 16, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, transition: 'all 300ms', ...previewStyle }}>
          {glowType === 'text' ? <span style={{ ...previewStyle, fontSize: 28, fontWeight: 900 }}>Glow</span> : '✦'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ width: 160, height: 44, borderRadius: 8, background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, ...previewStyle }}>
            {glowType === 'text' ? <span style={{ ...previewStyle }}>Button</span> : 'Button'}
          </div>
          <div style={{ width: 160, height: 2, background: color, ...previewStyle }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {GLOW_TYPES.map(t => (
          <button key={t} onClick={() => setGlowType(t)} style={{
            padding: '6px 14px', borderRadius: 8, border: '1px solid var(--border)',
            background: glowType === t ? 'var(--accent)' : 'var(--surface2)',
            color: glowType === t ? '#fff' : 'var(--text-secondary)', cursor: 'pointer', fontSize: 12, fontWeight: 600, textTransform: 'capitalize'
          }}>{t}</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>Color</label>
          <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: 48, height: 36, borderRadius: 6, cursor: 'pointer' }} />
        </div>
        {[
          { label: 'Intensity', val: intensity, set: setIntensity, min: 5, max: 100, unit: '%' },
          { label: 'Blur', val: blur, set: setBlur, min: 2, max: 80, unit: 'px' },
          { label: 'Spread', val: spread, set: setSpread, min: -20, max: 40, unit: 'px' },
        ].map(c => (
          <div key={c.label} style={{ flex: '1 1 120px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
              {c.label} <span style={{ color: 'var(--text-muted)' }}>{c.val}{c.unit}</span>
            </label>
            <input type="range" min={c.min} max={c.max} value={c.val} onChange={e => c.set(Number(e.target.value))} />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {['#00fff5', '#ff00ff', '#39ff14', '#ff6600', '#a855f7', '#ef4444', '#ffffff', '#ffd700', '#3b82f6'].map(c => (
          <button key={c} onClick={() => setColor(c)} style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: c, border: `2px solid ${c === color ? '#fff' : 'transparent'}`, cursor: 'pointer' }} />
        ))}
      </div>

      <CodeOutput css={generateCSS()} />
    </div>
  );
}

// ━━━ TEXT EFFECTS ━━━
function TextSection() {
  const [effect, setEffect] = useState<'gradient' | 'neon' | 'stroke' | 'emboss' | 'shadow3d' | 'chrome' | 'outline'>('gradient');
  const [color1, setColor1] = useState('#6366f1');
  const [color2, setColor2] = useState('#d04ed6');
  const [angle, setAngle] = useState(135);
  const [size, setSize] = useState(64);
  const [text, setText] = useState('DesignLab');

  const effectStyles: Record<string, React.CSSProperties> = {
    gradient: {
      background: `linear-gradient(${angle}deg, ${color1}, ${color2})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    neon: {
      color: color1,
      textShadow: `0 0 10px ${color1}, 0 0 20px ${color1}, 0 0 40px ${color1}, 0 0 80px ${color1}`,
    },
    stroke: {
      color: 'transparent',
      WebkitTextStroke: `2px ${color1}`,
    },
    emboss: {
      color: color1,
      textShadow: `1px 1px 1px rgba(255,255,255,0.8), -1px -1px 1px rgba(0,0,0,0.4)`,
    },
    shadow3d: {
      color: color1,
      textShadow: [3,6,9,12,15].map(n => `${n}px ${n}px 0px ${color2}`).join(', '),
    },
    chrome: {
      background: `linear-gradient(${angle}deg, #999 0%, #fff 25%, #999 50%, #888 75%, #fff 100%)`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    outline: {
      color: 'transparent',
      WebkitTextStroke: `3px ${color1}`,
      textShadow: `4px 4px 0 ${color2}`,
    },
  };

  const effectCSS: Record<string, string> = {
    gradient: `.text {\n  background: linear-gradient(${angle}deg, ${color1}, ${color2});\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  background-clip: text;\n}`,
    neon: `.text {\n  color: ${color1};\n  text-shadow: 0 0 10px ${color1}, 0 0 20px ${color1}, 0 0 40px ${color1};\n}`,
    stroke: `.text {\n  color: transparent;\n  -webkit-text-stroke: 2px ${color1};\n}`,
    emboss: `.text {\n  color: ${color1};\n  text-shadow: 1px 1px 1px rgba(255,255,255,0.8), -1px -1px 1px rgba(0,0,0,0.4);\n}`,
    shadow3d: `.text {\n  color: ${color1};\n  text-shadow: ${[3,6,9,12,15].map(n => `${n}px ${n}px 0px ${color2}`).join(', ')};\n}`,
    chrome: `.text {\n  background: linear-gradient(${angle}deg, #999 0%, #fff 25%, #999 50%, #888 75%, #fff 100%);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n}`,
    outline: `.text {\n  color: transparent;\n  -webkit-text-stroke: 3px ${color1};\n  text-shadow: 4px 4px 0 ${color2};\n}`,
  };

  const EFFECTS = ['gradient','neon','stroke','emboss','shadow3d','chrome','outline'] as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ background: '#0a0a0f', borderRadius: 16, padding: 32, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', justifyContent: 'center', minHeight: 180 }}>
        <span style={{ fontSize: size, fontWeight: 900, fontFamily: 'var(--font-display)', lineHeight: 1, ...effectStyles[effect], transition: 'all 300ms' }}>
          {text}
        </span>
        <span style={{ fontSize: size * 0.4, fontWeight: 700, fontFamily: 'var(--font-display)', ...effectStyles[effect], opacity: 0.7 }}>
          Subtitle text here
        </span>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {EFFECTS.map(e => (
          <button key={e} onClick={() => setEffect(e)} style={{
            padding: '6px 14px', borderRadius: 8, border: '1px solid var(--border)',
            background: effect === e ? 'var(--accent)' : 'var(--surface2)',
            color: effect === e ? '#fff' : 'var(--text-secondary)', cursor: 'pointer', fontSize: 12, fontWeight: 600, textTransform: 'capitalize'
          }}>{e}</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: '2 1 200px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>Preview text</label>
          <input value={text} onChange={e => setText(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface2)', color: 'var(--text)', fontSize: 14 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>Color 1</label>
          <input type="color" value={color1} onChange={e => setColor1(e.target.value)} style={{ width: 48, height: 36, borderRadius: 6, cursor: 'pointer' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>Color 2</label>
          <input type="color" value={color2} onChange={e => setColor2(e.target.value)} style={{ width: 48, height: 36, borderRadius: 6, cursor: 'pointer' }} />
        </div>
        {(effect === 'gradient' || effect === 'chrome' || effect === 'outline') && (
          <div style={{ flex: '1 1 100px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>Angle <span>{angle}°</span></label>
            <input type="range" min="0" max="360" value={angle} onChange={e => setAngle(Number(e.target.value))} />
          </div>
        )}
        <div style={{ flex: '1 1 100px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>Size <span>{size}px</span></label>
          <input type="range" min="24" max="120" value={size} onChange={e => setSize(Number(e.target.value))} />
        </div>
      </div>

      <CodeOutput css={effectCSS[effect]} />
    </div>
  );
}

// ━━━ CSS FILTERS ━━━
function FiltersSection() {
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [hueRotate, setHueRotate] = useState(0);
  const [blur, setBlur] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [invert, setInvert] = useState(0);

  const filterStr = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hueRotate}deg) blur(${blur}px) sepia(${sepia}%) grayscale(${grayscale}%) invert(${invert}%)`;

  const css = `.element {\n  filter: ${filterStr};\n}`;

  const PRESETS = [
    { name: 'Normal', vals: [100,100,100,0,0,0,0,0] },
    { name: 'Vintage', vals: [110,90,80,10,0,40,15,0] },
    { name: 'B&W Film', vals: [105,115,0,0,0,10,100,0] },
    { name: 'Warm', vals: [105,100,120,15,0,15,0,0] },
    { name: 'Cool', vals: [100,100,110,-20,0,0,0,0] },
    { name: 'Lo-Fi', vals: [90,110,70,0,0,20,10,0] },
    { name: 'Cyberpunk', vals: [120,150,200,180,0,0,0,0] },
    { name: 'Dream', vals: [110,80,120,0,2,20,0,0] },
    { name: 'X-Ray', vals: [100,200,0,0,0,0,100,100] },
  ];

  const apply = (vals: number[]) => {
    setBrightness(vals[0]); setContrast(vals[1]); setSaturation(vals[2]); setHueRotate(vals[3]);
    setBlur(vals[4]); setSepia(vals[5]); setGrayscale(vals[6]); setInvert(vals[7]);
  };

  const controls = [
    { label: 'Brightness', val: brightness, set: setBrightness, min: 0, max: 200, unit: '%' },
    { label: 'Contrast', val: contrast, set: setContrast, min: 0, max: 200, unit: '%' },
    { label: 'Saturation', val: saturation, set: setSaturation, min: 0, max: 300, unit: '%' },
    { label: 'Hue Rotate', val: hueRotate, set: setHueRotate, min: 0, max: 360, unit: '°' },
    { label: 'Blur', val: blur, set: setBlur, min: 0, max: 20, unit: 'px' },
    { label: 'Sepia', val: sepia, set: setSepia, min: 0, max: 100, unit: '%' },
    { label: 'Grayscale', val: grayscale, set: setGrayscale, min: 0, max: 100, unit: '%' },
    { label: 'Invert', val: invert, set: setInvert, min: 0, max: 100, unit: '%' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', gap: 12, overflow: 'hidden', borderRadius: 16 }}>
        <div style={{ flex: 1, minHeight: 200, background: 'linear-gradient(135deg, #6366f1, #d04ed6, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff', fontWeight: 600, opacity: 0.7 }}>Original</div>
        <div style={{ flex: 1, minHeight: 200, background: 'linear-gradient(135deg, #6366f1, #d04ed6, #f97316)', filter: filterStr, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: '8px 16px', color: '#fff', fontSize: 11, fontWeight: 600 }}>Filtered</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {PRESETS.map(p => (
          <button key={p.name} onClick={() => apply(p.vals)} style={{
            padding: '5px 12px', borderRadius: 8, border: '1px solid var(--border)',
            background: 'var(--surface2)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 12
          }}>{p.name}</button>
        ))}
        <button onClick={() => apply([100,100,100,0,0,0,0,0])} style={{ padding: '5px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--error-soft)', color: 'var(--error)', cursor: 'pointer', fontSize: 12 }}>Reset</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {controls.map(c => (
          <div key={c.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
              {c.label} <span style={{ color: 'var(--text-muted)' }}>{c.val}{c.unit}</span>
            </label>
            <input type="range" min={c.min} max={c.max} value={c.val} onChange={e => c.set(Number(e.target.value))} />
          </div>
        ))}
      </div>

      <CodeOutput css={css} />
    </div>
  );
}

// ━━━ HOLOGRAPHIC ━━━
function HolographicSection() {
  const [mode, setMode] = useState<'holographic' | 'iridescent' | 'chrome' | 'foil'>('holographic');
  const [speed, setSpeed] = useState(3);
  const [angle, setAngle] = useState(135);
  const [intensity, setIntensity] = useState(80);
  const [metalType, setMetalType] = useState('silver');

  const animId = `holo-${mode}`;

  const metalGradients: Record<string, string> = {
    silver: 'linear-gradient(105deg, #999 0%, #fff 20%, #999 40%, #ddd 60%, #999 80%, #bbb 100%)',
    gold: 'linear-gradient(105deg, #b8860b 0%, #ffd700 20%, #daa520 40%, #ffd700 60%, #b8860b 80%, #ffd700 100%)',
    rosegold: 'linear-gradient(105deg, #b76e79 0%, #ffc0cb 20%, #e8b4b8 40%, #ffc0cb 60%, #b76e79 80%, #f4c2c2 100%)',
    copper: 'linear-gradient(105deg, #b87333 0%, #e5863a 20%, #c87941 40%, #e5863a 60%, #b87333 80%, #d4965a 100%)',
    gunmetal: 'linear-gradient(105deg, #2a3439 0%, #6e7f80 20%, #3d5159 40%, #6e7f80 60%, #2a3439 80%, #4e6166 100%)',
  };

  const cssMap: Record<string, string> = {
    holographic: `@keyframes holoShift {\n  0% { background-position: 0% 50%; filter: hue-rotate(0deg); }\n  50% { background-position: 100% 50%; }\n  100% { background-position: 0% 50%; filter: hue-rotate(360deg); }\n}\n.holographic {\n  background: linear-gradient(${angle}deg, #ff0000, #ff8800, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000);\n  background-size: 400% 400%;\n  animation: holoShift ${speed}s linear infinite;\n}`,
    iridescent: `@keyframes iridescent {\n  0%, 100% { filter: hue-rotate(0deg) brightness(${intensity}%); }\n  50% { filter: hue-rotate(180deg) brightness(${intensity + 20}%); }\n}\n.iridescent {\n  background: linear-gradient(${angle}deg, rgba(255,0,128,0.4), rgba(0,255,255,0.4), rgba(128,0,255,0.4));\n  animation: iridescent ${speed}s ease-in-out infinite;\n}`,
    chrome: `.chrome {\n  background: ${metalGradients[metalType]};\n  background-size: 200% 100%;\n}`,
    foil: `@keyframes foilShift {\n  0% { background-position: 0% 50%; }\n  100% { background-position: 200% 50%; }\n}\n.foil {\n  background: repeating-linear-gradient(${angle}deg, #ff0080, #ffff00, #00ff80, #00ffff, #8000ff, #ff0080);\n  background-size: 300% 100%;\n  animation: foilShift ${speed}s linear infinite;\n  filter: brightness(${intensity}%);\n}`,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <style>{`
        @keyframes holoShift { 0% { background-position: 0% 50%; filter: hue-rotate(0deg); } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; filter: hue-rotate(360deg); } }
        @keyframes iridescent { 0%, 100% { filter: hue-rotate(0deg) brightness(${intensity}%); } 50% { filter: hue-rotate(180deg) brightness(${intensity + 20}%); } }
        @keyframes foilShift { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
        .holo-preview { border-radius: 12px; width: 200px; height: 120px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 20px; }
      `}</style>

      <div style={{ background: '#0a0a0f', borderRadius: 16, padding: 48, display: 'flex', gap: 24, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
        {mode === 'holographic' && (
          <div className="holo-preview" style={{ background: `linear-gradient(${angle}deg, #ff0000, #ff8800, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)`, backgroundSize: '400% 400%', animation: `holoShift ${speed}s linear infinite` }}>✦</div>
        )}
        {mode === 'iridescent' && (
          <div className="holo-preview" style={{ background: `linear-gradient(${angle}deg, rgba(255,0,128,0.7), rgba(0,255,255,0.7), rgba(128,0,255,0.7))`, animation: `iridescent ${speed}s ease-in-out infinite` }}>✦</div>
        )}
        {mode === 'chrome' && (
          <div className="holo-preview" style={{ background: metalGradients[metalType] }}>✦</div>
        )}
        {mode === 'foil' && (
          <div className="holo-preview" style={{ background: `repeating-linear-gradient(${angle}deg, #ff0080, #ffff00, #00ff80, #00ffff, #8000ff, #ff0080)`, backgroundSize: '300% 100%', animation: `foilShift ${speed}s linear infinite`, filter: `brightness(${intensity}%)` }}>✦</div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        {(['holographic','iridescent','chrome','foil'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid var(--border)', background: mode === m ? 'var(--accent)' : 'var(--surface2)', color: mode === m ? '#fff' : 'var(--text-secondary)', cursor: 'pointer', fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>{m}</button>
        ))}
      </div>

      {mode === 'chrome' && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {Object.keys(metalGradients).map(m => (
            <button key={m} onClick={() => setMetalType(m)} style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${metalType === m ? 'var(--accent)' : 'var(--border)'}`, background: metalGradients[m], cursor: 'pointer', fontSize: 12, fontWeight: 700, textTransform: 'capitalize', color: '#000' }}>{m}</button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {[
          { label: 'Speed', val: speed, set: setSpeed, min: 0.5, max: 10, step: 0.5, unit: 's' },
          { label: 'Angle', val: angle, set: setAngle, min: 0, max: 360, step: 1, unit: '°' },
          { label: 'Intensity', val: intensity, set: setIntensity, min: 50, max: 150, step: 1, unit: '%' },
        ].map(c => (
          <div key={c.label} style={{ flex: '1 1 120px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
              {c.label} <span>{c.val}{c.unit}</span>
            </label>
            <input type="range" min={c.min} max={c.max} step={c.step} value={c.val} onChange={e => c.set(Number(e.target.value))} />
          </div>
        ))}
      </div>

      <CodeOutput css={cssMap[mode]} />
    </div>
  );
}

// ━━━ DESIGN PRESETS ━━━
function PresetsSection() {
  const [active, setActive] = useState(0);
  const preset = DESIGN_PRESETS[active];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {DESIGN_PRESETS.map((p, i) => (
          <button key={p.name} onClick={() => setActive(i)} style={{
            padding: '10px 6px', borderRadius: 10, border: `2px solid ${active === i ? 'var(--accent)' : 'var(--border)'}`,
            background: active === i ? 'var(--accent-soft)' : 'var(--surface2)', cursor: 'pointer',
            fontSize: 11, fontWeight: 600, color: active === i ? 'var(--accent)' : 'var(--text-secondary)',
            display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', transition: 'all 150ms'
          }}>
            <span style={{ fontSize: 20 }}>{p.emoji}</span>
            <span style={{ textAlign: 'center', lineHeight: 1.2 }}>{p.name}</span>
          </button>
        ))}
      </div>

      <div style={{ padding: 12, background: 'var(--surface2)', borderRadius: 10, fontSize: 12, color: 'var(--text-secondary)', borderLeft: '3px solid var(--accent)' }}>
        <strong style={{ color: 'var(--text)' }}>{preset.name}</strong> — {preset.desc}
      </div>

      <div style={{ borderRadius: 20, padding: 40, background: preset.colors.bg, display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', minHeight: 280 }}>
        <div style={{ ...preset.styles, padding: 24, display: 'flex', flexDirection: 'column', gap: 12, minWidth: 220 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: preset.colors.text }}>Card Title</div>
          <div style={{ fontSize: 13, color: preset.colors.text, opacity: 0.7, lineHeight: 1.5 }}>Sample card component with this design style applied.</div>
          <button style={{ padding: '8px 16px', borderRadius: 8, background: preset.colors.primary, color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13, marginTop: 4 }}>
            Action
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button style={{ ...preset.styles, padding: '10px 20px', background: preset.colors.primary, color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
            Primary
          </button>
          <button style={{ ...preset.styles, padding: '10px 20px', background: 'transparent', color: preset.colors.primary, border: `2px solid ${preset.colors.primary}`, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
            Outline
          </button>
          <div style={{ padding: '8px 12px', background: `${preset.colors.primary}20`, borderRadius: 6, fontSize: 12, fontWeight: 700, color: preset.colors.primary }}>
            Badge Component
          </div>
        </div>
      </div>

      <CodeOutput css={Object.entries(preset.styles).map(([k, v]) => `  ${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v};`).join('\n').replace(/^/, '.preset {\n').replace(/$/, '\n}')} />
    </div>
  );
}

// ━━━ MAIN COMPONENT ━━━
const CATEGORIES: { id: EffectCategory; label: string; icon: string }[] = [
  { id: 'glassmorphism', label: 'Glassmorphism', icon: '🪟' },
  { id: 'neumorphism', label: 'Neumorphism', icon: '🫧' },
  { id: 'glow', label: 'Glow Effects', icon: '✨' },
  { id: 'text', label: 'Text Effects', icon: '🔤' },
  { id: 'filters', label: 'CSS Filters', icon: '🎛' },
  { id: 'holographic', label: 'Holographic', icon: '🌈' },
  { id: 'presets', label: 'Style Presets', icon: '🎨' },
];

export default function EffectsTool() {
  const [category, setCategory] = useState<EffectCategory>('glassmorphism');

  const Sidebar = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Sparkles size={16} style={{ color: 'var(--accent)' }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>Effects Studio</h2>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          Generate CSS effects, animations, and style presets.
        </p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
              borderRadius: 'var(--radius)', border: 'none', cursor: 'pointer',
              textAlign: 'left', width: '100%', transition: 'all 150ms',
              background: category === c.id ? 'var(--accent-soft)' : 'transparent',
              color: category === c.id ? 'var(--accent)' : 'var(--text-secondary)',
              fontWeight: category === c.id ? 600 : 400, fontSize: 13,
              borderLeft: `3px solid ${category === c.id ? 'var(--accent)' : 'transparent'}`,
            }}
          >
            <span>{c.icon}</span>
            <span>{c.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const sectionMap: Record<EffectCategory, React.ReactNode> = {
    glassmorphism: <GlassSection />,
    neumorphism: <NeuSection />,
    glow: <GlowSection />,
    text: <TextSection />,
    filters: <FiltersSection />,
    holographic: <HolographicSection />,
    presets: <PresetsSection />,
  };

  const activeCategory = CATEGORIES.find(c => c.id === category)!;

  return (
    <Layout sidebar={Sidebar}>
      <div style={{ height: '100%', overflowY: 'auto', padding: 32, backgroundColor: 'var(--bg)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>{activeCategory.icon}</span> {activeCategory.label}
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 14 }}>
            {category === 'glassmorphism' && 'Frosted glass effects with backdrop blur, translucency, and layered surfaces.'}
            {category === 'neumorphism' && 'Soft UI with extruded surfaces created by dual-direction shadows.'}
            {category === 'glow' && 'Neon glow effects for boxes, text, borders, and animated pulses.'}
            {category === 'text' && 'Gradient, neon, chrome, and 3D text shadow effects.'}
            {category === 'filters' && 'CSS filter adjustments: brightness, contrast, saturation, hue and more.'}
            {category === 'holographic' && 'Holographic, iridescent, chrome metallic, and foil effects.'}
            {category === 'presets' && 'One-click design style presets: Glassmorphism, Brutalism, Cyberpunk and more.'}
          </p>
          {sectionMap[category]}
        </div>
      </div>
    </Layout>
  );
}
