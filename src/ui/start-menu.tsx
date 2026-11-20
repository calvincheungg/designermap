import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Win98 Start button and menu. The menu holds the map's options; `children`
 * receives `close` so commands can dismiss it, as Win98 menu commands do.
 * Checkboxes, radios and typing in Find leave it open. Ctrl+Esc opens or
 * closes it from anywhere, as the Windows key did.
 */
export function StartMenu({ children }: { children: (close: () => void) => ReactNode }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !event.ctrlKey) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      setOpen((current) => !current);
      button.current?.focus();
    };
    window.addEventListener('keydown', shortcut, true);
    return () => window.removeEventListener('keydown', shortcut, true);
  }, []);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!menu.current?.contains(target) && !button.current?.contains(target)) setOpen(false);
    };
    const resize = () => setOpen(false);
    const escape = (event: KeyboardEvent) => {
      // Let an open Find list handle Escape first.
      const target = event.target;
      if (event.key !== 'Escape' || (target instanceof HTMLInputElement && target.getAttribute('aria-expanded') === 'true')) return;
      event.preventDefault();
      setOpen(false);
      button.current?.focus();
    };
    document.addEventListener('pointerdown', outside, true);
    document.addEventListener('keydown', escape);
    window.addEventListener('resize', resize);
    return () => {
      document.removeEventListener('pointerdown', outside, true);
      document.removeEventListener('keydown', escape);
      window.removeEventListener('resize', resize);
    };
  }, [open]);

  return <>
    <button ref={button} className="start-button" aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? 'start-menu' : undefined}
      onClick={() => setOpen((current) => !current)}>
      <span className="start-logo" aria-hidden="true" /><b>Start</b>
    </button>
    {open && <div ref={menu} id="start-menu" className="window start-menu" role="dialog" aria-label="Start menu">
      <div className="start-banner" aria-hidden="true"><span><b>Designer</b>Map</span></div>
      <div className="start-items">{children(close)}</div>
    </div>}
  </>;
}
