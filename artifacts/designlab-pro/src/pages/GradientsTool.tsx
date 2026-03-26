import React, { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { Layers, Plus, Trash2, Copy, Check, Shuffle } from 'lucide-react';

type GradientType = 'linear' | 'radial' | 'conic' | 'mesh';

interface Stop {
  id: string;
  color: string;
  position: number;
}

const PRESET_GRADIENTS = [
  { name: 'Ocean', stops: ['#0ea5e9', '#6366f1'], angle: 135, type: 'linear' as GradientType },
  { name: 'Sunset', stops: ['#f97316', '#ec4899'], angle: 90, type: 'linear' as GradientType },
  { name: 'Forest', stops: ['#22c55e', '#0ea5e9'], angle: 45, type: 'linear' as GradientType },
  { name: 'Aurora', stops: ['#a855f7', '#06b6d4', '#10b981'], angle: 120, type: 'linear' as GradientType },
  { name: 'Fire', stops: ['#ef4444', '#f97316', '#fbbf24'], angle: 180, type: 'linear' as GradientType },
  { name: 'Nebula', stops: ['#7c3aed', '#2563eb', '#0891b2'], angle: 225, type: 'linear' as GradientType },
  { name: 'Rose', stops: ['#fda4af', '#f9a8d4', '#c4b5fd'], angle: 160, type: 'linear' as GradientType },
  { name: 'Midnight', stops: ['#1e1b4b', '#312e81', '#4338ca'], angle: 135, type: 'linear' as GradientType },
];

function randomHex() {
  return '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
}

export default function GradientsTool() {
  const [gradType, setGradType] = useState<GradientType>('linear');
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<Stop[]>([
    { id: '1', color: '#6366f1', position: 0 },
    { id: '2', color: '#d04ed6', position: 100 },
  ]);
  const [copied, setCopied] = useState(false);

  const meshColors = stops.slice(0, 4);

  const gradientCSS = useMemo(() => {
    const stopStr = stops.map(s => `${s.color} ${s.position}%`).join(', ');
    if (gradType === 'linear') return `linear-gradient(${angle}deg, ${stopStr})`;
    if (gradType === 'radial') return `radial-gradient(circle at 50% 50%, ${stopStr})`;
    if (gradType === 'conic') return `conic-gradient(from ${angle}deg at 50% 50%, ${stopStr})`;
    return `radial-gradient(circle at 20% 20%, ${meshColors[0]?.color ?? '#6366f1'} 0%, transparent 50%),
radial-gradient(circle at 80% 20%, ${meshColors[1]?.color ?? '#d04ed6'} 0%, transparent 50%),
radial-gradient(circle at 80% 80%, ${meshColors[2]?.color ?? '#06b6d4'} 0%, transparent 50%),
radial-gradient(circle at 20% 80%, ${meshColors[3]?.color ?? '#10b981'} 0%, transparent 50%)`;
  }, [gradType, angle, stops]);

  const cssCode = `background: ${gradientCSS};`;

  const addStop = () => {
    if (stops.length >= 6) return;
    const midPos = Math.round((stops[0].position + stops[stops.length - 1].position) / 2);
    setStops([...stops, { id: Math.random().toString(36).slice(2), color: randomHex(), position: midPos }]);
  };

  const removeStop = (id: string) => {
    if (stops.length <= 2) return;
    setStops(stops.filter(s => s.id !== id));
  };

  const updateStop = (id: string, field: 'color' | 'position', value: any) => {
    setStops(stops.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const applyPreset = (p: typeof PRESET_GRADIENTS[0]) => {
    setGradType(p.type);
    setAngle(p.angle);
    setStops(p.stops.map((c, i) => ({
      id: String(i + 1),
      color: c,
      position: Math.round((i / (p.stops.length - 1)) * 100)
    })));
  };

  const randomize = () => {
    setAngle(Math.floor(Math.random() * 360));
    setStops(stops.map(s => ({ ...s, color: randomHex() })));
  };

  const copy = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const Sidebar = (
    <div className="flex flex-col gap-6 p-4 h-full overflow-y-auto pb-24">
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <Layers size={16} className="text-primary" />
        <h2 className="font-display font-bold">Gradient Builder</h2>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted-foreground">Type</label>
          <div className="grid grid-cols-2 gap-2">
            {(['linear', 'radial', 'conic', 'mesh'] as GradientType[]).map(t => (
              <button
                key={t}
                onClick={() => setGradType(t)}
                className={`py-1.5 text-xs rounded border capitalize transition-colors ${gradType === t ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:border-primary/50'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {(gradType === 'linear' || gradType === 'conic') && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground flex justify-between">
              Angle <span>{angle}°</span>
            </label>
            <input type="range" min="0" max="360" value={angle} onChange={e => setAngle(Number(e.target.value))} />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground">Color Stops</label>
            <button
              onClick={addStop}
              disabled={stops.length >= 6 || gradType === 'mesh'}
              className="p-1 rounded bg-secondary hover:bg-secondary/80 disabled:opacity-40 text-muted-foreground"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {stops.map((stop, i) => (
              <div key={stop.id} className="flex items-center gap-2 p-2 bg-background border border-border rounded-lg">
                <input
                  type="color"
                  value={stop.color}
                  onChange={e => updateStop(stop.id, 'color', e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border-none shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-xs truncate text-foreground">{stop.color}</div>
                  {gradType !== 'mesh' && (
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={stop.position}
                      onChange={e => updateStop(stop.id, 'position', Number(e.target.value))}
                      className="w-full mt-1"
                    />
                  )}
                </div>
                {gradType !== 'mesh' && (
                  <span className="text-[10px] text-muted-foreground w-8 text-right shrink-0">{stop.position}%</span>
                )}
                <button
                  onClick={() => removeStop(stop.id)}
                  disabled={stops.length <= 2}
                  className="text-destructive opacity-50 hover:opacity-100 disabled:opacity-20 shrink-0"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={randomize} className="flex-1 py-2 rounded border border-border bg-background text-sm font-medium flex justify-center items-center gap-2 hover:bg-secondary">
            <Shuffle size={14} /> Random
          </button>
          <button onClick={copy} className="flex-1 py-2 rounded bg-primary text-primary-foreground text-sm font-medium flex justify-center items-center gap-2 hover:opacity-90">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy CSS'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Layout sidebar={Sidebar}>
      <div className="h-full flex flex-col overflow-auto bg-card">
        <div className="h-1/2 min-h-64 relative overflow-hidden">
          <div
            className="absolute inset-0 transition-all duration-500"
            style={{ background: gradientCSS }}
          />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-card to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="inline-block bg-black/40 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2">
              <code className="text-white/90 text-xs font-mono break-all">{cssCode}</code>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Presets</h3>
            <div className="grid grid-cols-4 gap-4">
              {PRESET_GRADIENTS.map(p => (
                <button
                  key={p.name}
                  onClick={() => applyPreset(p)}
                  className="group relative rounded-xl overflow-hidden aspect-video border-2 border-transparent hover:border-primary transition-all shadow-md"
                >
                  <div
                    className="absolute inset-0 transition-transform duration-300 group-hover:scale-105"
                    style={{ background: `linear-gradient(${p.angle}deg, ${p.stops.join(', ')})` }}
                  />
                  <span className="absolute bottom-2 left-0 right-0 text-center text-white text-xs font-bold drop-shadow">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Stop Preview</h3>
            <div className="relative h-12 rounded-xl overflow-hidden shadow-inner border border-border">
              <div
                className="absolute inset-0 transition-all duration-300"
                style={{ background: gradType === 'mesh' ? gradientCSS : `linear-gradient(90deg, ${stops.map(s => `${s.color} ${s.position}%`).join(', ')})` }}
              />
              {gradType !== 'mesh' && stops.map(s => (
                <div
                  key={s.id}
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-lg"
                  style={{ left: `calc(${s.position}% - 8px)`, backgroundColor: s.color }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
