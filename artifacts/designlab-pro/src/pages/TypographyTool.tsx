import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Type, Save, Download } from 'lucide-react';

const GOOGLE_FONTS = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 
  'Playfair Display', 'Merriweather', 'Space Grotesk', 'Syne', 
  'JetBrains Mono', 'Fira Code', 'Outfit', 'DM Sans', 'Poppins',
  'Plus Jakarta Sans', 'Oswald', 'Raleway', 'Work Sans', 'Lora'
];

export default function TypographyTool() {
  const [baseSize, setBaseSize] = useState(16);
  const [scaleRatio, setScaleRatio] = useState(1.25);
  const [headerFont, setHeaderFont] = useState('Syne');
  const [bodyFont, setBodyFont] = useState('Inter');
  const [lineHeight, setLineHeight] = useState(1.5);
  const [weight, setWeight] = useState(700);
  const [letterSpacing, setLetterSpacing] = useState(0);

  const scale = Array.from({ length: 9 }, (_, i) => {
    // scale from text-xs (i=0) to text-9xl (i=8)
    // index 2 is text-base (16px)
    const power = i - 2; 
    const size = baseSize * Math.pow(scaleRatio, power);
    return {
      label: ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'][i] || `${i}xl`,
      px: size.toFixed(1),
      rem: (size / 16).toFixed(3)
    };
  }).reverse();

  const Sidebar = (
    <div className="flex flex-col gap-6 p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <Type size={16} className="text-primary" />
          <h2 className="font-display font-bold">Typography Scale</h2>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">Heading Font</label>
            <select 
              value={headerFont}
              onChange={(e) => setHeaderFont(e.target.value)}
              className="w-full bg-background border border-border rounded-lg p-2 text-sm outline-none focus:border-primary"
            >
              {GOOGLE_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">Body Font</label>
            <select 
              value={bodyFont}
              onChange={(e) => setBodyFont(e.target.value)}
              className="w-full bg-background border border-border rounded-lg p-2 text-sm outline-none focus:border-primary"
            >
              {GOOGLE_FONTS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground flex justify-between">
              Base Size <span>{baseSize}px</span>
            </label>
            <input type="range" min="12" max="24" value={baseSize} onChange={e => setBaseSize(Number(e.target.value))} className="accent-primary" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground flex justify-between">
              Scale Ratio <span>{scaleRatio}</span>
            </label>
            <select 
              value={scaleRatio}
              onChange={(e) => setScaleRatio(Number(e.target.value))}
              className="w-full bg-background border border-border rounded-lg p-2 text-sm outline-none"
            >
              <option value="1.125">Major Second (1.125)</option>
              <option value="1.200">Minor Third (1.200)</option>
              <option value="1.250">Major Third (1.250)</option>
              <option value="1.333">Perfect Fourth (1.333)</option>
              <option value="1.414">Augmented Fourth (1.414)</option>
              <option value="1.618">Golden Ratio (1.618)</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground flex justify-between">
              Heading Weight <span>{weight}</span>
            </label>
            <input type="range" min="100" max="900" step="100" value={weight} onChange={e => setWeight(Number(e.target.value))} />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground flex justify-between">
              Letter Spacing <span>{letterSpacing}px</span>
            </label>
            <input type="range" min="-5" max="10" step="0.5" value={letterSpacing} onChange={e => setLetterSpacing(Number(e.target.value))} />
          </div>
        </div>
      </div>

      <div className="mt-auto space-y-2">
        <button className="w-full py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 flex items-center justify-center gap-2">
          <Download size={14} /> Load Google Fonts
        </button>
        <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 flex items-center justify-center gap-2">
          <Save size={14} /> Export CSS Vars
        </button>
      </div>
    </div>
  );

  return (
    <Layout sidebar={Sidebar}>
      <div className="h-full overflow-auto bg-card">
        {/* Inject Google Fonts for preview */}
        <style dangerouslySetInnerHTML={{
          __html: `@import url('https://fonts.googleapis.com/css2?family=${headerFont.replace(/ /g, '+')}:wght@${weight}&family=${bodyFont.replace(/ /g, '+')}:wght@400;500;600&display=swap');`
        }} />
        
        <div className="max-w-4xl mx-auto p-12 space-y-16">
          <header className="pb-8 border-b border-border">
            <h1 className="text-4xl font-display font-bold mb-4" style={{ fontFamily: headerFont }}>Type Scale Preview</h1>
            <p className="text-muted-foreground text-lg" style={{ fontFamily: bodyFont }}>
              Previewing <strong className="text-foreground">{headerFont}</strong> (Headings) and <strong className="text-foreground">{bodyFont}</strong> (Body) with a ratio of {scaleRatio}.
            </p>
          </header>

          <div className="space-y-12">
            {scale.map((s, i) => {
              const isHeading = i < 5;
              const family = isHeading ? headerFont : bodyFont;
              const fw = isHeading ? weight : (i === 5 ? 600 : 400);
              
              return (
                <div key={s.label} className="flex flex-col md:flex-row gap-6 md:items-baseline border-b border-border/40 pb-12 last:border-0">
                  <div className="w-32 shrink-0 text-muted-foreground font-mono text-sm space-y-1">
                    <div className="text-foreground font-bold">{s.label}</div>
                    <div>{s.px}px</div>
                    <div>{s.rem}rem</div>
                  </div>
                  
                  <div 
                    className="flex-1 text-foreground"
                    style={{ 
                      fontFamily: family, 
                      fontSize: `${s.px}px`, 
                      fontWeight: fw, 
                      lineHeight: lineHeight,
                      letterSpacing: isHeading ? `${letterSpacing}px` : 'normal'
                    }}
                  >
                    {isHeading ? 'The quick brown fox jumps over the lazy dog.' : 'A design system is a collection of reusable components, guided by clear standards, that can be assembled together to build any number of applications.'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
