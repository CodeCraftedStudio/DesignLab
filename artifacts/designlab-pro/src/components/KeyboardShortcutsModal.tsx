import React from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { section: 'Navigation' },
  { key: '1 – 9', desc: 'Switch to tool 1–9' },
  { key: '0', desc: 'Switch to tool 10' },
  { key: 'Shift + 0', desc: 'Switch to tool 11' },
  { section: 'Global' },
  { key: 'T', desc: 'Toggle dark / light theme' },
  { key: 'R', desc: 'Randomize active tool' },
  { key: 'E', desc: 'Open export modal' },
  { key: '?', desc: 'Show this shortcuts panel' },
  { key: 'Escape', desc: 'Close modal / panel' },
  { section: 'Edit' },
  { key: 'Ctrl + Z', desc: 'Undo' },
  { key: 'Ctrl + Shift + Z', desc: 'Redo' },
  { key: 'Ctrl + C', desc: 'Copy selected / focused value' },
  { section: 'Canvas' },
  { key: 'Ctrl + D', desc: 'Duplicate selected element' },
  { key: 'Ctrl + G', desc: 'Group selected elements' },
  { key: 'Delete / Backspace', desc: 'Delete selected element' },
  { section: 'Code Editor' },
  { key: 'Ctrl + S', desc: 'Format code' },
  { key: 'Ctrl + /', desc: 'Toggle comment' },
  { key: 'Ctrl + F', desc: 'Find in file' },
];

export default function KeyboardShortcutsModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)',
          width: 520, maxHeight: '80vh', overflow: 'auto', padding: 32
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 'var(--radius)', border: '1px solid var(--border)',
              background: 'var(--surface2)', color: 'var(--text-secondary)', cursor: 'pointer',
              fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {SHORTCUTS.map((item, i) => {
            if ('section' in item && item.desc === undefined) {
              return (
                <div key={i} style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'var(--text-muted)', paddingTop: i > 0 ? 16 : 0, paddingBottom: 6
                }}>
                  {item.section}
                </div>
              );
            }
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 12px', borderRadius: 'var(--radius)'
              }} className="shortcut-row">
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{(item as any).desc}</span>
                <kbd style={{
                  fontSize: 11, fontFamily: 'var(--font-mono)', backgroundColor: 'var(--surface2)',
                  border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                  padding: '2px 8px', color: 'var(--text)', whiteSpace: 'nowrap'
                }}>{(item as any).key}</kbd>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
