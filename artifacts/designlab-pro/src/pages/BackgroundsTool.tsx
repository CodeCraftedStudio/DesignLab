import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Layout from '@/components/Layout';
import { Image as ImageIcon, Shuffle, Copy, Check, Download, Code2, Eye, ChevronDown, FolderDown, Maximize, Minimize } from 'lucide-react';
import { ColorPickerInput } from '@/components/ui/ColorPickerInput';
import { useDesignStore } from '@/store/useDesignStore';
import JSZip from 'jszip';
import { toast } from '@/utils/toastStore';

const TYPES = [
  'gradient-mesh', 'aurora', 'gradient-wave', 'floating-particles',
  'starfield', 'fireflies', 'animated-grid', 'diagonal-stripes',
  'svg-sine-wave', 'mouse-gradient', 'breathing', 'vortex'
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CODE GENERATORS — produce standalone HTML/CSS/JS for each bg
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function generateCode(type: string, primary: string, secondary: string, speed: number, opacity: number, particleCount: number) {
  let html = '';
  let css = '';
  let js = '';

  const baseCSS = `* { margin: 0; padding: 0; box-sizing: border-box; }
body { min-height: 100vh; background: #0a0a0f; overflow: hidden; }
.bg-container { position: fixed; inset: 0; opacity: ${opacity}; }
.overlay {
  position: relative; z-index: 10; display: flex;
  flex-direction: column; align-items: center; justify-content: center;
  min-height: 100vh; text-align: center; color: #fff; padding: 40px;
  pointer-events: none;
}
.overlay h1 { font-size: 56px; font-weight: 800; margin-bottom: 16px; text-shadow: 0 4px 30px rgba(0,0,0,.5); font-family: 'Inter', system-ui, sans-serif; }
.overlay p { font-size: 18px; opacity: .7; max-width: 480px; font-family: 'Inter', system-ui, sans-serif; }`;

  const overlayHTML = `\n<div class="overlay">\n  <h1>Your Content Here</h1>\n  <p>Beautiful animated background ready to use.</p>\n</div>`;

  switch (type) {
    case 'gradient-mesh':
      css = `${baseCSS}
.bg-container .blob {
  position: absolute; border-radius: 50%;
  mix-blend-mode: screen; filter: blur(100px);
}
.blob-1 {
  top: 25%; left: 25%; width: 800px; height: 800px;
  background: ${primary};
  animation: mesh1 ${(20 / speed).toFixed(1)}s infinite alternate;
}
.blob-2 {
  bottom: 25%; right: 25%; width: 600px; height: 600px;
  background: ${secondary};
  animation: mesh2 ${(15 / speed).toFixed(1)}s infinite alternate;
}
@keyframes mesh1 {
  0%   { transform: translate(0, 0) scale(1); }
  33%  { transform: translate(30%, -50%) scale(1.2); }
  66%  { transform: translate(-20%, 20%) scale(0.8); }
  100% { transform: translate(0, 0) scale(1); }
}
@keyframes mesh2 {
  0%   { transform: translate(0, 0) scale(1); }
  33%  { transform: translate(-30%, 50%) scale(0.8); }
  66%  { transform: translate(20%, -20%) scale(1.2); }
  100% { transform: translate(0, 0) scale(1); }
}`;
      html = `<div class="bg-container">\n  <div class="blob blob-1"></div>\n  <div class="blob blob-2"></div>\n</div>${overlayHTML}`;
      break;

    case 'aurora':
      css = `${baseCSS}
.bg-container .aurora {
  position: absolute; border-radius: 50%;
  mix-blend-mode: screen; filter: blur(80px);
}
.aurora-1 {
  top: -20%; left: -10%; width: 120%; height: 60%;
  background: ${primary}; opacity: 0.6;
  animation: aurora1 ${(12 / speed).toFixed(1)}s ease-in-out infinite;
}
.aurora-2 {
  top: -10%; right: -10%; width: 100%; height: 50%;
  background: ${secondary}; opacity: 0.5;
  animation: aurora2 ${(15 / speed).toFixed(1)}s ease-in-out infinite;
}
.aurora-3 {
  top: 10%; left: 20%; width: 60%; height: 40%;
  background: ${primary}88; opacity: 0.3;
  filter: blur(100px);
  animation: aurora1 ${(18 / speed).toFixed(1)}s ease-in-out infinite reverse;
}
@keyframes aurora1 { 0%,100% { transform: translateX(-10%) rotate(-5deg); } 50% { transform: translateX(10%) rotate(5deg); } }
@keyframes aurora2 { 0%,100% { transform: translateX(10%) rotate(3deg); } 50% { transform: translateX(-10%) rotate(-3deg); } }`;
      html = `<div class="bg-container">\n  <div class="aurora aurora-1"></div>\n  <div class="aurora aurora-2"></div>\n  <div class="aurora aurora-3"></div>\n</div>${overlayHTML}`;
      break;

    case 'gradient-wave':
      css = `${baseCSS}
.bg-container {
  background: linear-gradient(-45deg, ${primary}, ${secondary}, ${primary}, ${secondary});
  background-size: 400% 400%;
  animation: gradientWave ${(15 / speed).toFixed(1)}s ease infinite;
}
@keyframes gradientWave {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}`;
      html = `<div class="bg-container"></div>${overlayHTML}`;
      break;

    case 'floating-particles':
      css = `${baseCSS}
.particle {
  position: absolute; border-radius: 50%;
  animation: floatUp linear infinite;
}
@keyframes floatUp {
  0%   { transform: translateY(100vh) scale(0); opacity: 0; }
  50%  { opacity: 1; }
  100% { transform: translateY(-100px) scale(1); opacity: 0; }
}`;
      html = `<div class="bg-container" id="particles"></div>${overlayHTML}`;
      js = `const container = document.getElementById('particles');
for (let i = 0; i < ${particleCount}; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random() * 10 + 2;
  p.style.left = Math.random() * 100 + '%';
  p.style.width = size + 'px';
  p.style.height = size + 'px';
  p.style.backgroundColor = Math.random() > 0.5 ? '${primary}' : '${secondary}';
  p.style.animationDuration = (Math.random() * 10 + ${(5 / speed).toFixed(1)}) + 's';
  p.style.animationDelay = Math.random() * 5 + 's';
  p.style.opacity = Math.random() * 0.5 + 0.2;
  container.appendChild(p);
}`;
      break;

    case 'starfield':
      css = `${baseCSS}
.star {
  position: absolute; border-radius: 50%; background: #fff;
  animation: twinkle ease-in-out infinite;
}
@keyframes twinkle { 0%,100% { opacity: 0.2; } 50% { opacity: 1; } }`;
      html = `<div class="bg-container" id="stars"></div>${overlayHTML}`;
      js = `const container = document.getElementById('stars');
const count = ${Math.min(particleCount * 3, 120)};
for (let i = 0; i < count; i++) {
  const s = document.createElement('div');
  s.className = 'star';
  const size = Math.random() * 3 + 1;
  s.style.left = Math.random() * 100 + '%';
  s.style.top = Math.random() * 100 + '%';
  s.style.width = size + 'px';
  s.style.height = size + 'px';
  s.style.animationDuration = (Math.random() * 3 + 1) + 's';
  s.style.animationDelay = Math.random() * 3 + 's';
  container.appendChild(s);
}`;
      break;

    case 'fireflies':
      css = `${baseCSS}
.firefly {
  position: absolute; border-radius: 50%;
  background: ${primary};
  animation: fireflyFloat ease-in-out infinite;
}
@keyframes fireflyFloat {
  0%   { transform: translate(0, 0); opacity: 0; }
  20%  { opacity: 1; }
  80%  { opacity: 1; }
  100% { transform: translate(80px, -80px); opacity: 0; }
}`;
      html = `<div class="bg-container" id="fireflies"></div>${overlayHTML}`;
      js = `const container = document.getElementById('fireflies');
for (let i = 0; i < ${Math.min(particleCount, 30)}; i++) {
  const f = document.createElement('div');
  f.className = 'firefly';
  const size = Math.random() * 6 + 3;
  f.style.left = (Math.random() * 90 + 5) + '%';
  f.style.top = (Math.random() * 90 + 5) + '%';
  f.style.width = size + 'px';
  f.style.height = size + 'px';
  f.style.boxShadow = '0 0 ' + (Math.random()*10+5) + 'px ${primary}';
  f.style.animationDuration = (Math.random() * 5 + 3) + 's';
  f.style.animationDelay = Math.random() * 5 + 's';
  container.appendChild(f);
}`;
      break;

    case 'animated-grid':
      css = `${baseCSS}
.grid-lines {
  position: absolute; inset: -100%;
  background-image:
    linear-gradient(to right, ${primary} 1px, transparent 1px),
    linear-gradient(to bottom, ${primary} 1px, transparent 1px);
  background-size: 40px 40px;
  animation: moveGrid ${(2 / speed).toFixed(1)}s linear infinite;
  opacity: 0.2;
}
.grid-fade {
  position: absolute; inset: 0;
  background: linear-gradient(to top, #0a0a0f, transparent, #0a0a0f);
}
@keyframes moveGrid {
  0%   { transform: translateY(0); }
  100% { transform: translateY(40px); }
}`;
      html = `<div class="bg-container">\n  <div class="grid-lines"></div>\n  <div class="grid-fade"></div>\n</div>${overlayHTML}`;
      break;

    case 'diagonal-stripes':
      css = `${baseCSS}
.bg-container {
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 20px,
    ${primary}22 20px,
    ${primary}22 22px
  );
}`;
      html = `<div class="bg-container"></div>${overlayHTML}`;
      break;

    case 'svg-sine-wave':
      css = `${baseCSS}
.wave-svg {
  position: absolute; bottom: 0; width: 200%; height: 40%;
  animation: sineShift ${(8 / speed).toFixed(1)}s linear infinite;
}
@keyframes sineShift { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`;
      html = `<div class="bg-container">
  <svg class="wave-svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
    <path d="M0,160 C240,260 480,60 720,160 C960,260 1200,60 1440,160 L1440,320 L0,320Z" fill="${primary}" opacity="0.5"/>
    <path d="M0,200 C240,300 480,100 720,200 C960,300 1200,100 1440,200 L1440,320 L0,320Z" fill="${secondary}" opacity="0.3"/>
  </svg>
</div>${overlayHTML}`;
      break;

    case 'mouse-gradient':
      css = `${baseCSS}
.bg-container {
  transition: background 0.1s;
}`;
      html = `<div class="bg-container" id="mouseGrad"></div>${overlayHTML}`;
      js = `const el = document.getElementById('mouseGrad');
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth * 100).toFixed(1);
  const y = (e.clientY / window.innerHeight * 100).toFixed(1);
  el.style.background =
    'radial-gradient(circle at ' + x + '% ' + y + '%, ${primary} 0%, transparent 50%), ' +
    'radial-gradient(circle at ' + (100 - x) + '% ' + (100 - y) + '%, ${secondary} 0%, transparent 50%)';
});`;
      break;

    case 'breathing':
      css = `${baseCSS}
.bg-container {
  background: radial-gradient(circle at 50% 50%, ${primary}, ${secondary}, transparent 70%);
  animation: breathe ${(6 / speed).toFixed(1)}s ease-in-out infinite;
}
@keyframes breathe { 0%,100% { opacity: 0.4; } 50% { opacity: 0.8; } }`;
      html = `<div class="bg-container"></div>${overlayHTML}`;
      break;

    case 'vortex':
      css = `${baseCSS}
.vortex-inner {
  position: absolute; inset: -50%;
  background: conic-gradient(from 0deg at 50% 50%, ${primary}, transparent, ${secondary}, transparent, ${primary});
  animation: vortexSpin ${(10 / speed).toFixed(1)}s linear infinite;
  filter: blur(60px);
}
@keyframes vortexSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
      html = `<div class="bg-container">\n  <div class="vortex-inner"></div>\n</div>${overlayHTML}`;
      break;

    default:
      css = `${baseCSS}\n.bg-container { background: linear-gradient(135deg, ${primary}, ${secondary}); }`;
      html = `<div class="bg-container"></div>${overlayHTML}`;
  }

  return { html, css, js };
}

/* ━━━ Syntax highlight helpers ━━━ */
function hlHTML(code: string): string {
  return code
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/(&lt;\/?)([\w-]+)/g, '$1<span style="color:#e06c75">$2</span>')
    .replace(/([\w-]+)=(&quot;|")/g, '<span style="color:#d19a66">$1</span>=<span style="color:#98c379">"</span>')
    .replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color:#5c6370">$1</span>');
}
function hlCSS(code: string): string {
  return code
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/([\w.-]+)\s*\{/g, '<span style="color:#e06c75">$1</span> {')
    .replace(/([\w-]+)\s*:/g, '<span style="color:#61afef">$1</span>:')
    .replace(/:([^;{]+);/g, ':<span style="color:#98c379">$1</span>;')
    .replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color:#5c6370">$1</span>');
}
function hlJS(code: string): string {
  return code
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\b(const|let|var|function|return|if|else|for|while|new|document|Math|window)\b/g, '<span style="color:#c678dd">$1</span>')
    .replace(/(["'`])(?:(?=(\\?))\2.)*?\1/g, '<span style="color:#98c379">$&</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#d19a66">$1</span>')
    .replace(/(\/\/.*$)/gm, '<span style="color:#5c6370">$1</span>');
}

/* ━━━ MAIN COMPONENT ━━━ */
export default function BackgroundsTool() {
  const { colorRoles } = useDesignStore();
  const [bgType, setBgType] = useState('gradient-mesh');
  const [primaryColor, setPrimaryColor] = useState(colorRoles.primary);
  const [secondaryColor, setSecondaryColor] = useState('#8b5cf6');
  const [speed, setSpeed] = useState(1);
  const [opacity, setOpacity] = useState(0.8);
  const [particleCount, setParticleCount] = useState(30);
  const [showCode, setShowCode] = useState(false);
  const [codeTab, setCodeTab] = useState<'html' | 'css' | 'js' | 'full'>('full');
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const randomize = () => {
    setPrimaryColor(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
    setSecondaryColor(`#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`);
    setSpeed(+(Math.random() * 2 + 0.5).toFixed(1));
  };

  const code = useMemo(
    () => generateCode(bgType, primaryColor, secondaryColor, speed, opacity, particleCount),
    [bgType, primaryColor, secondaryColor, speed, opacity, particleCount]
  );

  const fullPage = useMemo(() => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${bgType.replace(/-/g, ' ')} – DesignLab Background</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap" rel="stylesheet">
  <style>\n${code.css}\n  </style>
</head>
<body>
${code.html}
${code.js ? `<script>\n${code.js}\n</script>` : ''}
</body>
</html>`;
  }, [code, bgType]);

  const getActiveCode = () => {
    if (codeTab === 'html') return code.html;
    if (codeTab === 'css') return code.css;
    if (codeTab === 'js') return code.js || '// No JavaScript needed for this effect.';
    return fullPage;
  };

  const getHighlighted = (src: string) => {
    if (codeTab === 'html') return hlHTML(src);
    if (codeTab === 'css') return hlCSS(src);
    if (codeTab === 'js') return hlJS(src);
    // full → mix
    return src
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/(&lt;\/?)([\w-]+)/g, '$1<span style="color:#e06c75">$2</span>')
      .replace(/([\w-]+)\s*:/g, '<span style="color:#61afef">$1</span>:')
      .replace(/(["'`])(?:(?=(\\?))\2.)*?\1/g, '<span style="color:#98c379">$&</span>')
      .replace(/\b(const|let|var|function|return|if|else|for|document|Math|window)\b/g, '<span style="color:#c678dd">$1</span>')
      .replace(/(\/\/.*$)/gm, '<span style="color:#5c6370">$1</span>');
  };

  const copyCode = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    toast.success('Code copied!');
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadZip = async () => {
    const zip = new JSZip();
    zip.file('index.html', fullPage);
    zip.file('styles.css', code.css);
    if (code.js) zip.file('script.js', code.js);
    // standalone version
    zip.file('standalone.html', fullPage);
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `designlab-bg-${bgType}.zip`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('ZIP downloaded!');
  };

  const codeTabs: { key: typeof codeTab; label: string; color: string }[] = [
    { key: 'full', label: 'Full Page', color: '#c678dd' },
    { key: 'html', label: 'HTML', color: '#e06c75' },
    { key: 'css', label: 'CSS', color: '#61afef' },
    { key: 'js', label: 'JS', color: '#e5c07b' },
  ];

  /* ─── SIDEBAR ─── */
  const Sidebar = (
    <div className="flex flex-col gap-6 p-4 h-full overflow-y-auto">
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <ImageIcon size={16} className="text-primary" />
        <h2 className="font-display font-bold">Background Studio</h2>
      </div>

      <div className="flex flex-col gap-4">
        {/* Type Select */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted-foreground">Type</label>
          <select value={bgType} onChange={e => setBgType(e.target.value)}
            className="p-2 rounded bg-background border border-border outline-none text-sm capitalize">
            {TYPES.map(t => <option key={t} value={t}>{t.replace(/-/g, ' ')}</option>)}
          </select>
        </div>

        {/* Colors */}
        <div className="flex flex-col gap-2">
          <ColorPickerInput label="Primary" value={primaryColor} onChange={setPrimaryColor} />
          <ColorPickerInput label="Secondary" value={secondaryColor} onChange={setSecondaryColor} />
        </div>

        {/* Speed */}
        <div className="flex flex-col gap-1 mt-2">
          <label className="text-xs font-medium text-muted-foreground flex justify-between">Speed <span>{speed.toFixed(1)}x</span></label>
          <input type="range" min="0.1" max="5" step="0.1" value={speed} onChange={e => setSpeed(Number(e.target.value))} />
        </div>

        {/* Opacity */}
        <div className="flex flex-col gap-1 mt-2">
          <label className="text-xs font-medium text-muted-foreground flex justify-between">Opacity <span>{Math.round(opacity * 100)}%</span></label>
          <input type="range" min="0" max="1" step="0.05" value={opacity} onChange={e => setOpacity(Number(e.target.value))} />
        </div>

        {/* Particles */}
        {['floating-particles', 'starfield', 'fireflies'].includes(bgType) && (
          <div className="flex flex-col gap-1 mt-2">
            <label className="text-xs font-medium text-muted-foreground flex justify-between">Particles <span>{particleCount}</span></label>
            <input type="range" min="10" max="100" step="1" value={particleCount} onChange={e => setParticleCount(Number(e.target.value))} />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <button onClick={randomize} className="flex-1 py-2 rounded border border-border bg-background hover:bg-secondary text-sm font-medium flex justify-center items-center gap-2">
            <Shuffle size={14} /> Randomize
          </button>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setShowCode(!showCode)}
            className="flex-1 py-2 rounded border border-border bg-background hover:bg-secondary text-sm font-medium flex justify-center items-center gap-2"
            style={{ borderColor: showCode ? 'var(--accent)' : undefined, color: showCode ? 'var(--accent)' : undefined }}>
            <Code2 size={14} /> {showCode ? 'Hide Code' : 'View Code'}
          </button>
          <button onClick={downloadZip}
            className="flex-1 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 text-sm font-medium flex justify-center items-center gap-2">
            <FolderDown size={14} /> ZIP
          </button>
        </div>
      </div>
    </div>
  );

  /* ─── CODE PANEL ─── */
  const CodePanel = (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      height: isFullscreen ? '100%' : '45%',
      background: '#0d1117', borderTop: '1px solid #21262d',
      display: 'flex', flexDirection: 'column', zIndex: 30,
      transition: 'height .3s',
    }}>
      {/* Code toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 16px', borderBottom: '1px solid #21262d', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {codeTabs.map(t => (
            <button key={t.key} onClick={() => setCodeTab(t.key)}
              style={{
                padding: '5px 14px', borderRadius: 6, border: 'none', fontSize: 12,
                fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-mono)',
                background: codeTab === t.key ? '#1c2333' : 'transparent',
                color: codeTab === t.key ? t.color : '#6e7681',
                borderBottom: codeTab === t.key ? `2px solid ${t.color}` : '2px solid transparent',
              }}>
              {t.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <button onClick={copyCode} title="Copy code"
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 12px', background: '#1c2333', border: '1px solid #30363d', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', color: copied ? '#3fb950' : '#c9d1d9', transition: '.15s' }}>
            {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
          </button>
          <button onClick={downloadZip} title="Download ZIP"
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 12px', background: '#1c2333', border: '1px solid #30363d', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', color: '#c9d1d9' }}>
            <Download size={12} /> ZIP
          </button>
          <button onClick={() => setIsFullscreen(!isFullscreen)} title={isFullscreen ? 'Collapse' : 'Expand'}
            style={{ background: 'none', border: 'none', color: '#6e7681', cursor: 'pointer', padding: 4 }}>
            {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
          </button>
          <button onClick={() => { setShowCode(false); setIsFullscreen(false); }} title="Close"
            style={{ background: 'none', border: 'none', color: '#6e7681', cursor: 'pointer', padding: 4, fontSize: 16, lineHeight: 1 }}>
            ✕
          </button>
        </div>
      </div>

      {/* Code content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '12px 16px' }}>
        <pre style={{
          margin: 0, fontFamily: '"Fira Code", "JetBrains Mono", Consolas, monospace',
          fontSize: 12, lineHeight: 1.7, color: '#c9d1d9', whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}>
          {getActiveCode().split('\n').map((line, i) => (
            <div key={i} style={{ display: 'flex', minHeight: '1.7em' }}>
              <span style={{ color: '#484f58', width: 36, textAlign: 'right', paddingRight: 12, userSelect: 'none', flexShrink: 0, fontSize: 11 }}>{i + 1}</span>
              <span dangerouslySetInnerHTML={{ __html: getHighlighted(line) }} />
            </div>
          ))}
        </pre>
      </div>
    </div>
  );

  /* ─── RENDER ─── */
  return (
    <Layout sidebar={Sidebar}>
      <div className="h-full bg-[#0a0a0f] relative overflow-hidden flex flex-col">
        <BackgroundRenderer
          type={bgType}
          primary={primaryColor}
          secondary={secondaryColor}
          speed={speed}
          opacity={opacity}
          particleCount={particleCount}
        />

        {/* Center content */}
        {!isFullscreen && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-8 z-10 text-white text-center"
            style={{ bottom: showCode ? '45%' : 0, transition: 'bottom .3s' }}>
            <h1 className="text-6xl font-display font-bold mb-6 drop-shadow-2xl">Create Atmosphere.</h1>
            <p className="text-xl max-w-lg opacity-80 drop-shadow-md mb-8">Beautiful, lightweight CSS and SVG background effects to elevate your design system.</p>
            {/* Quick info pills */}
            <div style={{ display: 'flex', gap: 8, pointerEvents: 'auto' }}>
              <span style={{ padding: '6px 16px', background: 'rgba(255,255,255,.08)', backdropFilter: 'blur(12px)', borderRadius: 20, fontSize: 12, fontWeight: 600, border: '1px solid rgba(255,255,255,.12)' }}>
                {bgType.replace(/-/g, ' ')}
              </span>
              <button onClick={() => setShowCode(true)} style={{ padding: '6px 16px', background: 'rgba(99,102,241,.2)', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: '1px solid rgba(99,102,241,.3)', color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Code2 size={12} /> View Code
              </button>
              <button onClick={downloadZip} style={{ padding: '6px 16px', background: 'rgba(34,197,94,.15)', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: '1px solid rgba(34,197,94,.25)', color: '#86efac', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Download size={12} /> Download
              </button>
            </div>
          </div>
        )}

        {/* Code Panel */}
        {showCode && CodePanel}
      </div>
    </Layout>
  );
}

/* ━━━━ BACKGROUND RENDERER (unchanged visual) ━━━━ */
function BackgroundRenderer({ type, primary, secondary, speed, opacity, particleCount }: any) {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (type !== 'mouse-gradient') return;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [type]);

  if (type === 'gradient-mesh') {
    return (
      <div className="absolute inset-0 overflow-hidden" style={{ opacity }}>
        <style>{`
          @keyframes mesh1 { 0% { transform: translate(0, 0) scale(1); } 33% { transform: translate(30%, -50%) scale(1.2); } 66% { transform: translate(-20%, 20%) scale(0.8); } 100% { transform: translate(0, 0) scale(1); } }
          @keyframes mesh2 { 0% { transform: translate(0, 0) scale(1); } 33% { transform: translate(-30%, 50%) scale(0.8); } 66% { transform: translate(20%, -20%) scale(1.2); } 100% { transform: translate(0, 0) scale(1); } }
        `}</style>
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] rounded-full mix-blend-screen filter blur-[100px]" style={{ backgroundColor: primary, animation: `mesh1 ${20 / speed}s infinite alternate` }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full mix-blend-screen filter blur-[100px]" style={{ backgroundColor: secondary, animation: `mesh2 ${15 / speed}s infinite alternate` }}></div>
      </div>
    );
  }

  if (type === 'gradient-wave') {
    return (
      <div className="absolute inset-0"
        style={{ opacity, background: `linear-gradient(-45deg, ${primary}, ${secondary}, ${primary}, ${secondary})`, backgroundSize: '400% 400%', animation: `gradientWave ${15 / speed}s ease infinite` }}>
        <style>{`@keyframes gradientWave { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }`}</style>
      </div>
    );
  }

  if (type === 'floating-particles') {
    return (
      <div className="absolute inset-0 overflow-hidden" style={{ opacity }}>
        <style>{`@keyframes floatUp { 0% { transform: translateY(100vh) scale(0); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(-100px) scale(1); opacity: 0; } }`}</style>
        {Array.from({ length: particleCount }).map((_, i) => (
          <div key={i} className="absolute rounded-full"
            style={{ left: `${Math.random() * 100}%`, width: `${Math.random() * 10 + 2}px`, height: `${Math.random() * 10 + 2}px`, backgroundColor: Math.random() > 0.5 ? primary : secondary, animation: `floatUp ${Math.random() * 10 + 5 / speed}s linear infinite`, animationDelay: `${Math.random() * 5}s`, opacity: Math.random() * 0.5 + 0.2 }} />
        ))}
      </div>
    );
  }

  if (type === 'mouse-gradient') {
    return (
      <div className="absolute inset-0 transition-opacity duration-300"
        style={{ opacity, background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, ${primary} 0%, transparent 50%), radial-gradient(circle at ${100 - mousePos.x}% ${100 - mousePos.y}%, ${secondary} 0%, transparent 50%)` }} />
    );
  }

  if (type === 'animated-grid') {
    return (
      <div className="absolute inset-0" style={{ opacity }}>
        <style>{`@keyframes moveGrid { 0% { transform: translateY(0); } 100% { transform: translateY(40px); } }`}</style>
        <div className="absolute inset-[-100%]"
          style={{ backgroundImage: `linear-gradient(to right, ${primary} 1px, transparent 1px), linear-gradient(to bottom, ${primary} 1px, transparent 1px)`, backgroundSize: '40px 40px', animation: `moveGrid ${2 / speed}s linear infinite`, opacity: 0.2 }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-[#0a0a0f]" />
      </div>
    );
  }

  if (type === 'aurora') {
    return (
      <div className="absolute inset-0 overflow-hidden" style={{ opacity }}>
        <style>{`
          @keyframes aurora1 { 0%,100% { transform: translateX(-10%) rotate(-5deg); } 50% { transform: translateX(10%) rotate(5deg); } }
          @keyframes aurora2 { 0%,100% { transform: translateX(10%) rotate(3deg); } 50% { transform: translateX(-10%) rotate(-3deg); } }
        `}</style>
        <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[60%] rounded-full mix-blend-screen filter blur-[80px]" style={{ backgroundColor: primary, animation: `aurora1 ${12 / speed}s ease-in-out infinite`, opacity: 0.6 }} />
        <div className="absolute top-[-10%] right-[-10%] w-[100%] h-[50%] rounded-full mix-blend-screen filter blur-[80px]" style={{ backgroundColor: secondary, animation: `aurora2 ${15 / speed}s ease-in-out infinite`, opacity: 0.5 }} />
        <div className="absolute top-[10%] left-[20%] w-[60%] h-[40%] rounded-full mix-blend-screen filter blur-[100px]" style={{ backgroundColor: `${primary}88`, animation: `aurora1 ${18 / speed}s ease-in-out infinite reverse`, opacity: 0.3 }} />
      </div>
    );
  }

  if (type === 'starfield') {
    return (
      <div className="absolute inset-0 overflow-hidden" style={{ opacity }}>
        <style>{`@keyframes twinkle { 0%,100% { opacity: 0.2; } 50% { opacity: 1; } }`}</style>
        {Array.from({ length: Math.min(particleCount * 3, 120) }).map((_, i) => (
          <div key={i} className="absolute rounded-full" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, width: `${Math.random() * 3 + 1}px`, height: `${Math.random() * 3 + 1}px`, backgroundColor: '#fff', animation: `twinkle ${Math.random() * 3 + 1}s ease-in-out infinite`, animationDelay: `${Math.random() * 3}s` }} />
        ))}
      </div>
    );
  }

  if (type === 'fireflies') {
    return (
      <div className="absolute inset-0 overflow-hidden" style={{ opacity }}>
        <style>{`@keyframes fireflyFloat { 0% { transform: translate(0,0); opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { transform: translate(80px, -80px); opacity: 0; } }`}</style>
        {Array.from({ length: Math.min(particleCount, 30) }).map((_, i) => (
          <div key={i} className="absolute rounded-full" style={{ left: `${Math.random() * 90 + 5}%`, top: `${Math.random() * 90 + 5}%`, width: `${Math.random() * 6 + 3}px`, height: `${Math.random() * 6 + 3}px`, backgroundColor: primary, boxShadow: `0 0 ${Math.random() * 10 + 5}px ${primary}`, animation: `fireflyFloat ${Math.random() * 5 + 3}s ease-in-out infinite`, animationDelay: `${Math.random() * 5}s` }} />
        ))}
      </div>
    );
  }

  if (type === 'diagonal-stripes') {
    return (
      <div className="absolute inset-0" style={{ opacity, backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, ${primary}22 20px, ${primary}22 22px)` }} />
    );
  }

  if (type === 'svg-sine-wave') {
    return (
      <div className="absolute inset-0 overflow-hidden" style={{ opacity }}>
        <style>{`@keyframes sineShift { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
        <svg className="absolute bottom-0 w-[200%] h-[40%]" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ animation: `sineShift ${8 / speed}s linear infinite` }}>
          <path d="M0,160 C240,260 480,60 720,160 C960,260 1200,60 1440,160 L1440,320 L0,320Z" fill={primary} opacity="0.5" />
          <path d="M0,200 C240,300 480,100 720,200 C960,300 1200,100 1440,200 L1440,320 L0,320Z" fill={secondary} opacity="0.3" />
        </svg>
      </div>
    );
  }

  if (type === 'breathing') {
    return (
      <div className="absolute inset-0" style={{ opacity }}>
        <style>{`@keyframes breathe { 0%,100% { opacity: 0.4; } 50% { opacity: 0.8; } }`}</style>
        <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 50%, ${primary}, ${secondary}, transparent 70%)`, animation: `breathe ${6 / speed}s ease-in-out infinite` }} />
      </div>
    );
  }

  if (type === 'vortex') {
    return (
      <div className="absolute inset-0 overflow-hidden" style={{ opacity }}>
        <style>{`@keyframes vortexSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <div className="absolute inset-[-50%]" style={{ background: `conic-gradient(from 0deg at 50% 50%, ${primary}, transparent, ${secondary}, transparent, ${primary})`, animation: `vortexSpin ${10 / speed}s linear infinite`, filter: 'blur(60px)' }} />
      </div>
    );
  }

  return (
    <div className="absolute inset-0" style={{ opacity, background: `linear-gradient(135deg, ${primary}, ${secondary})` }} />
  );
}
