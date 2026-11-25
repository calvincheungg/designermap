import { useEffect, useId, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';

/** A small modal Win98 dialog laid over its window; Escape or Cancel closes it. Mark the first field `data-autofocus`. */
export function Dialog({ title, onSubmit, onCancel, children, extra, disabled = false, message = false, submitLabel = 'OK', className = '' }: {
  title: string; onSubmit: () => void; onCancel: () => void; children: ReactNode;
  /** More buttons, before OK. */
  extra?: ReactNode; disabled?: boolean; submitLabel?: string;
  /** A message box: OK only. */
  message?: boolean;
  className?: string;
}) {
  const id = useId();
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => { form.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus(); }, []);
  return <div className="xl-dialog-backdrop" onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onCancel(); } }}>
    <div className={`window xl-dialog ${className}`} role="dialog" aria-labelledby={id}>
      <div className="title-bar"><div className="title-bar-text" id={id}>{title}</div>
        <div className="title-bar-controls"><button type="button" className="close" aria-label={`Close ${title}`} onClick={onCancel} /></div></div>
      <form ref={form} className="window-body xl-dialog-body" onSubmit={(event) => { event.preventDefault(); if (!disabled) onSubmit(); }}>
        {children}
        <div className="xl-dialog-buttons">{extra}<button type="submit" disabled={disabled} data-autofocus={message || undefined}>{submitLabel}</button>
          {!message && <button type="button" onClick={onCancel}>Cancel</button>}</div>
      </form>
    </div>
  </div>;
}

/** Drag a modeless dialog by its title bar: spread `bar` on the title bar and `style` on the window. */
export function useTitleBarDrag() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number } | null>(null);
  const end = () => { drag.current = null; };
  return {
    style: { transform: `translate(${offset.x}px, ${offset.y}px)` },
    bar: {
      onPointerDown: (event: ReactPointerEvent<HTMLElement>) => {
        if (event.button !== 0 || (event.target as Element).closest('button')) return;
        event.currentTarget.setPointerCapture?.(event.pointerId);
        drag.current = { x: event.clientX - offset.x, y: event.clientY - offset.y };
      },
      onPointerMove: (event: ReactPointerEvent<HTMLElement>) => { if (drag.current) setOffset({ x: event.clientX - drag.current.x, y: event.clientY - drag.current.y }); },
      onPointerUp: end, onPointerCancel: end,
    },
  };
}
