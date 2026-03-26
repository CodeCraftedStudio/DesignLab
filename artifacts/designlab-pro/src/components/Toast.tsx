import React, { useEffect, useState } from 'react';
import { useToastStore, Toast as ToastItem } from '@/utils/toastStore';

function ToastCard({ toast, onRemove }: { toast: ToastItem; onRemove: () => void }) {
  const [progress, setProgress] = useState(100);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const duration = toast.duration ?? 2200;
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.max(0, 100 - (elapsed / duration) * 100));
    }, 50);
    return () => clearInterval(interval);
  }, [toast.duration]);

  const icons: Record<string, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  const colors: Record<string, { border: string; bg: string; icon: string }> = {
    success: { border: '#22c55e', bg: 'rgba(34,197,94,0.08)', icon: '#22c55e' },
    error: { border: '#ef4444', bg: 'rgba(239,68,68,0.08)', icon: '#ef4444' },
    warning: { border: '#f59e0b', bg: 'rgba(245,158,11,0.08)', icon: '#f59e0b' },
    info: { border: '#6366f1', bg: 'rgba(99,102,241,0.08)', icon: '#6366f1' },
  };

  const c = colors[toast.type];

  return (
    <div
      onClick={onRemove}
      style={{
        transform: visible ? 'translateX(0)' : 'translateX(120%)',
        opacity: visible ? 1 : 0,
        transition: 'transform 300ms cubic-bezier(0.4,0,0.2,1), opacity 300ms ease',
        backgroundColor: 'var(--surface)',
        border: `1px solid var(--border)`,
        borderLeft: `3px solid ${c.border}`,
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        padding: '12px 16px 16px',
        minWidth: 280,
        maxWidth: 360,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: c.bg, color: c.icon, fontSize: 12, fontWeight: 700, flexShrink: 0
        }}>
          {icons[toast.type]}
        </span>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', lineHeight: 1.4 }}>
          {toast.message}
        </span>
      </div>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
        backgroundColor: 'var(--border)', borderRadius: '0 0 var(--radius-md) var(--radius-md)'
      }}>
        <div style={{
          height: '100%', backgroundColor: c.border, borderRadius: 'inherit',
          width: `${progress}%`, transition: 'width 50ms linear'
        }} />
      </div>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end'
    }}>
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} onRemove={() => removeToast(t.id)} />
      ))}
    </div>
  );
}
