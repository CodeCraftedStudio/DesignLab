import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Box, Plus, Trash2, Copy } from 'lucide-react';
import { ColorPickerInput } from '@/components/ui/ColorPickerInput';
import { contrastRatio } from '@/utils/colorMath';

interface ShadowLayer {
  id: string;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

export default function ShadowsTool() {
  const [layers, setLayers] = useState<ShadowLayer[]>([
    { id: '1', x: 0, y: 10, blur: 15, spread: -3, color: '#000000', opacity: 0.1, inset: false },
    { id: '2', x: 0, y: 4, blur: 6, spread: -2, color: '#000000', opacity: 0.05, inset: false }
  ]);
  const [bgColor, setBgColor] = useState('#f8fafc');
  const [cardColor, setCardColor] = useState('#ffffff');

  const addLayer = () => {
    if (layers.length >= 6) return;
    setLayers([...layers, { id: Math.random().toString(), x: 0, y: 5, blur: 10, spread: 0, color: '#000000', opacity: 0.1, inset: false }]);
  };

  const removeLayer = (id: string) => {
    setLayers(layers.filter(l => l.id !== id));
  };

  const updateLayer = (id: string, field: keyof ShadowLayer, value: any) => {
    setLayers(layers.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  // Convert hex to rgba based on opacity
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const g = parseInt(hex.slice(3, 5), 16) || 0;
    const b = parseInt(hex.slice(5, 7), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const boxShadowString = layers.map(l => 
    `${l.inset ? 'inset ' : ''}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${hexToRgba(l.color, l.opacity)}`
  ).join(', ');

  const Sidebar = (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div className="flex items-center gap-2">
          <Box size={16} className="text-primary" />
          <h2 className="font-display font-bold">Shadow Studio</h2>
        </div>
        <button onClick={addLayer} disabled={layers.length >= 6} className="p-1 rounded bg-secondary hover:bg-secondary/80 disabled:opacity-50">
          <Plus size={16} />
        </button>
      </div>

      <div className="flex flex-col gap-4 overflow-auto pb-20">
        {layers.map((layer, index) => (
          <div key={layer.id} className="p-4 bg-background border border-border rounded-xl space-y-4 shadow-sm relative group">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Layer {index + 1}</h3>
              <button onClick={() => removeLayer(layer.id)} className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-muted-foreground">X Offset ({layer.x}px)</label>
                <input type="range" min="-50" max="50" value={layer.x} onChange={e => updateLayer(layer.id, 'x', Number(e.target.value))} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-muted-foreground">Y Offset ({layer.y}px)</label>
                <input type="range" min="-50" max="50" value={layer.y} onChange={e => updateLayer(layer.id, 'y', Number(e.target.value))} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-muted-foreground">Blur ({layer.blur}px)</label>
                <input type="range" min="0" max="100" value={layer.blur} onChange={e => updateLayer(layer.id, 'blur', Number(e.target.value))} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-muted-foreground">Spread ({layer.spread}px)</label>
                <input type="range" min="-50" max="50" value={layer.spread} onChange={e => updateLayer(layer.id, 'spread', Number(e.target.value))} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-muted-foreground">Opacity ({Math.round(layer.opacity * 100)}%)</label>
              <input type="range" min="0" max="1" step="0.01" value={layer.opacity} onChange={e => updateLayer(layer.id, 'opacity', Number(e.target.value))} />
            </div>

            <div className="flex gap-4 items-center justify-between pt-2 border-t border-border">
              <div className="flex-1"><ColorPickerInput label="Color" value={layer.color} onChange={v => updateLayer(layer.id, 'color', v)} /></div>
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input type="checkbox" checked={layer.inset} onChange={e => updateLayer(layer.id, 'inset', e.target.checked)} className="rounded border-border accent-primary" />
                Inset
              </label>
            </div>
          </div>
        ))}
      </div>
      
      <div className="absolute bottom-0 left-0 w-[320px] p-4 bg-sidebar border-t border-border">
        <button className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-bold shadow-lg flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-transform">
          <Copy size={16} /> Copy CSS
        </button>
      </div>
    </div>
  );

  return (
    <Layout sidebar={Sidebar}>
      <div className="h-full flex flex-col" style={{ backgroundColor: bgColor }}>
        <div className="p-4 flex gap-4 bg-background/50 backdrop-blur border-b border-border shadow-sm sticky top-0 z-10 justify-end">
          <div className="w-48"><ColorPickerInput label="Background" value={bgColor} onChange={setBgColor} /></div>
          <div className="w-48"><ColorPickerInput label="Card Color" value={cardColor} onChange={setCardColor} /></div>
        </div>

        <div className="flex-1 p-12 flex flex-col items-center justify-center gap-16">
          <div 
            className="w-64 h-64 rounded-2xl flex items-center justify-center text-center p-6 transition-all duration-300 relative border border-black/5"
            style={{ backgroundColor: cardColor, boxShadow: boxShadowString }}
          >
            <span className="font-display font-bold opacity-50" style={{ color: contrastRatio(cardColor, '#000') > 4.5 ? '#000' : '#fff' }}>Preview Element</span>
          </div>
          
          <div className="w-full max-w-2xl bg-[#16161f] rounded-xl border border-[#1e1e2e] p-6 shadow-2xl relative">
            <h3 className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-3">Generated CSS</h3>
            <code className="text-[#a5b4fc] text-sm font-mono break-all">
              box-shadow: {boxShadowString};
            </code>
          </div>
        </div>
      </div>
    </Layout>
  );
}
