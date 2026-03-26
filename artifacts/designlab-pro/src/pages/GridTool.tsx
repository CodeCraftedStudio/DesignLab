import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { LayoutGrid, Copy, Check, AlignJustify } from 'lucide-react';

type LayoutMode = 'grid' | 'flexbox';
type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
type JustifyContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
type AlignItems = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';

const ITEM_COUNT = 12;
const PASTEL_COLORS = [
  '#a5b4fc', '#f9a8d4', '#6ee7b7', '#fde68a', '#93c5fd', '#c4b5fd',
  '#fbcfe8', '#86efac', '#fca5a5', '#67e8f9', '#d9f99d', '#fcd34d'
];

export default function GridTool() {
  const [mode, setMode] = useState<LayoutMode>('grid');
  const [itemCount, setItemCount] = useState(8);
  const [copied, setCopied] = useState(false);

  // Grid state
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(3);
  const [colGap, setColGap] = useState(16);
  const [rowGap, setRowGap] = useState(16);
  const [gridAutoRows, setGridAutoRows] = useState(100);

  // Flexbox state
  const [flexDir, setFlexDir] = useState<FlexDirection>('row');
  const [justifyContent, setJustifyContent] = useState<JustifyContent>('flex-start');
  const [alignItems, setAlignItems] = useState<AlignItems>('stretch');
  const [flexWrap, setFlexWrap] = useState<FlexWrap>('wrap');
  const [flexGap, setFlexGap] = useState(16);
  const [flexItemGrow, setFlexItemGrow] = useState(0);
  const [flexItemShrink, setFlexItemShrink] = useState(1);
  const [flexBasis, setFlexBasis] = useState(120);

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: `${rowGap}px ${colGap}px`,
    gridAutoRows: `${gridAutoRows}px`,
  };

  const flexStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: flexDir,
    justifyContent,
    alignItems,
    flexWrap,
    gap: `${flexGap}px`,
  };

  const flexItemStyle: React.CSSProperties = {
    flexGrow: flexItemGrow,
    flexShrink: flexItemShrink,
    flexBasis: `${flexBasis}px`,
    minWidth: `${flexBasis}px`,
    minHeight: 60,
  };

  const cssCode = mode === 'grid'
    ? `.grid-container {
  display: grid;
  grid-template-columns: repeat(${cols}, 1fr);
  grid-auto-rows: ${gridAutoRows}px;
  gap: ${rowGap}px ${colGap}px;
}`
    : `.flex-container {
  display: flex;
  flex-direction: ${flexDir};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  flex-wrap: ${flexWrap};
  gap: ${flexGap}px;
}
.flex-item {
  flex: ${flexItemGrow} ${flexItemShrink} ${flexBasis}px;
}`;

  const copy = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const Sidebar = (
    <div className="flex flex-col gap-6 p-4 h-full overflow-y-auto">
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <LayoutGrid size={16} className="text-primary" />
        <h2 className="font-display font-bold">Layout Builder</h2>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setMode('grid')}
          className={`flex-1 py-2 rounded border text-sm font-medium flex items-center justify-center gap-2 transition-colors ${mode === 'grid' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:border-primary/50'}`}
        >
          <LayoutGrid size={14} /> Grid
        </button>
        <button
          onClick={() => setMode('flexbox')}
          className={`flex-1 py-2 rounded border text-sm font-medium flex items-center justify-center gap-2 transition-colors ${mode === 'flexbox' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:border-primary/50'}`}
        >
          <AlignJustify size={14} /> Flexbox
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground flex justify-between">
          Items <span>{itemCount}</span>
        </label>
        <input type="range" min="2" max="16" value={itemCount} onChange={e => setItemCount(Number(e.target.value))} />
      </div>

      {mode === 'grid' ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground flex justify-between">Columns <span>{cols}</span></label>
            <input type="range" min="1" max="6" value={cols} onChange={e => setCols(Number(e.target.value))} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground flex justify-between">Column Gap <span>{colGap}px</span></label>
            <input type="range" min="0" max="48" value={colGap} onChange={e => setColGap(Number(e.target.value))} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground flex justify-between">Row Gap <span>{rowGap}px</span></label>
            <input type="range" min="0" max="48" value={rowGap} onChange={e => setRowGap(Number(e.target.value))} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground flex justify-between">Auto Row Height <span>{gridAutoRows}px</span></label>
            <input type="range" min="40" max="200" value={gridAutoRows} onChange={e => setGridAutoRows(Number(e.target.value))} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground">Direction</label>
            <div className="grid grid-cols-2 gap-2">
              {(['row', 'column', 'row-reverse', 'column-reverse'] as FlexDirection[]).map(d => (
                <button key={d} onClick={() => setFlexDir(d)}
                  className={`py-1.5 text-xs rounded border capitalize transition-colors ${flexDir === d ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:border-primary/50'}`}>
                  {d.replace(/-/g, ' ')}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground">Justify Content</label>
            <select value={justifyContent} onChange={e => setJustifyContent(e.target.value as JustifyContent)}
              className="p-2 rounded bg-background border border-border text-sm outline-none">
              {['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'].map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground">Align Items</label>
            <select value={alignItems} onChange={e => setAlignItems(e.target.value as AlignItems)}
              className="p-2 rounded bg-background border border-border text-sm outline-none">
              {['flex-start', 'flex-end', 'center', 'stretch', 'baseline'].map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground">Wrap</label>
            <div className="flex gap-2">
              {(['nowrap', 'wrap', 'wrap-reverse'] as FlexWrap[]).map(w => (
                <button key={w} onClick={() => setFlexWrap(w)}
                  className={`flex-1 py-1.5 text-xs rounded border capitalize transition-colors ${flexWrap === w ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border'}`}>
                  {w}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground flex justify-between">Gap <span>{flexGap}px</span></label>
            <input type="range" min="0" max="48" value={flexGap} onChange={e => setFlexGap(Number(e.target.value))} />
          </div>
          <div className="border-t border-border pt-4 flex flex-col gap-3">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Item</label>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground flex justify-between">Basis <span>{flexBasis}px</span></label>
              <input type="range" min="40" max="300" value={flexBasis} onChange={e => setFlexBasis(Number(e.target.value))} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-muted-foreground">Grow ({flexItemGrow})</label>
                <input type="range" min="0" max="3" step="1" value={flexItemGrow} onChange={e => setFlexItemGrow(Number(e.target.value))} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-muted-foreground">Shrink ({flexItemShrink})</label>
                <input type="range" min="0" max="3" step="1" value={flexItemShrink} onChange={e => setFlexItemShrink(Number(e.target.value))} />
              </div>
            </div>
          </div>
        </div>
      )}

      <button onClick={copy} className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 mt-auto">
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? 'Copied!' : 'Copy CSS'}
      </button>
    </div>
  );

  return (
    <Layout sidebar={Sidebar}>
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-8 bg-card">
          <div className="max-w-4xl mx-auto space-y-8">
            <div
              className="min-h-96 bg-background border border-border rounded-2xl p-6 shadow-inner overflow-hidden"
              style={mode === 'grid' ? gridStyle : flexStyle}
            >
              {Array.from({ length: itemCount }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl flex items-center justify-center font-bold text-slate-800 shadow-sm text-sm"
                  style={{
                    backgroundColor: PASTEL_COLORS[i % PASTEL_COLORS.length],
                    ...(mode === 'flexbox' ? flexItemStyle : {}),
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            <div className="bg-[#16161f] border border-[#1e1e2e] rounded-xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-[#a5b4fc] uppercase tracking-wider">Generated CSS</h3>
                <button onClick={copy} className="text-muted-foreground hover:text-white p-1">
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
              <pre className="text-[#e2e2f0] font-mono text-sm whitespace-pre-wrap">{cssCode}</pre>
            </div>

            {mode === 'grid' && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Column Presets</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: '12-Col Grid', cols: 12, colGap: 16, rowGap: 24, autoRows: 80 },
                    { label: '4-Col Cards', cols: 4, colGap: 24, rowGap: 24, autoRows: 200 },
                    { label: 'Holy Grail', cols: 3, colGap: 32, rowGap: 32, autoRows: 120 },
                    { label: 'Masonry-ish', cols: 3, colGap: 16, rowGap: 8, autoRows: 60 },
                    { label: '2-Col Article', cols: 2, colGap: 48, rowGap: 16, autoRows: 100 },
                    { label: 'Gallery', cols: 5, colGap: 8, rowGap: 8, autoRows: 120 },
                  ].map(p => (
                    <button
                      key={p.label}
                      onClick={() => { setCols(p.cols); setColGap(p.colGap); setRowGap(p.rowGap); setGridAutoRows(p.autoRows); }}
                      className="p-4 bg-background border border-border rounded-xl text-sm font-medium hover:border-primary hover:text-primary transition-colors text-left"
                    >
                      <div className="font-bold mb-1">{p.label}</div>
                      <div className="text-xs text-muted-foreground font-mono">repeat({p.cols}, 1fr)</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
