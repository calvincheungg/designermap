import { useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface MenuAction { label: string; run: () => void }
export function ContextMenu({ x, y, actions, onClose }: {
  x: number; y: number; actions: readonly MenuAction[]; onClose: (restoreFocus?: boolean) => void;
}) {
  const menu = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = menu.current!;
    element.style.left = `${Math.max(4, Math.min(x, window.innerWidth - element.offsetWidth - 4))}px`;
    element.style.top = `${Math.max(4, Math.min(y, window.innerHeight - element.offsetHeight - 4))}px`;
    element.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true });
  }, [x, y]);
  useEffect(() => {
    const outside = (event: PointerEvent) => { if (!menu.current?.contains(event.target as Node)) onClose(); };
    const close = () => onClose();
    document.addEventListener('pointerdown', outside, true);
    document.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    window.addEventListener('blur', close);
    return () => {
      document.removeEventListener('pointerdown', outside, true);
      document.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
      window.removeEventListener('blur', close);
    };
  }, [onClose]);
  return createPortal(<div ref={menu} className="window map-context-menu" role="menu" aria-label="Map Actions" style={{ left: x, top: y }}
    onKeyDown={(event) => {
      const buttons = [...menu.current!.querySelectorAll('button')];
      const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
      let next: number | undefined;
      if (event.key === 'ArrowDown') next = (index + 1) % buttons.length;
      if (event.key === 'ArrowUp') next = (index - 1 + buttons.length) % buttons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = buttons.length - 1;
      if (next !== undefined) { event.preventDefault(); buttons[next]?.focus(); }
      else if (event.key === 'Escape') { event.preventDefault(); onClose(true); }
      else if (event.key === 'Tab') onClose(true);
    }}>
    {actions.map((action) => <button type="button" role="menuitem" key={action.label} onClick={() => { onClose(true); action.run(); }}>{action.label}</button>)}
  </div>, document.body);
}
