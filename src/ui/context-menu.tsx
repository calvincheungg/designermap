import { useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface MenuAction {
  label: string; run: () => void;
  /** Greyed out and skipped by the arrow keys, as in Win98 menus. */
  disabled?: boolean;
  /** Draw an etched separator above this item. */
  separator?: boolean;
  /** Bold, like Win98's default menu command. */
  primary?: boolean;
  /** A toggle: shows a check mark when on, like Win98's View menu. */
  checked?: boolean;
}
/** A Win98 pop-up menu at (x, y); with `above`, its bottom edge sits at y (for taskbar menus). */
export function ContextMenu({ x, y, actions, onClose, label = 'Map Actions', above = false }: {
  x: number; y: number; actions: readonly MenuAction[]; onClose: (restoreFocus?: boolean) => void; label?: string; above?: boolean;
}) {
  const menu = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = menu.current!;
    element.style.left = `${Math.max(4, Math.min(x, window.innerWidth - element.offsetWidth - 4))}px`;
    element.style.top = `${Math.max(4, Math.min(above ? y - element.offsetHeight : y, window.innerHeight - element.offsetHeight - 4))}px`;
    element.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus({ preventScroll: true });
  }, [x, y, above]);
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
  return createPortal(<div ref={menu} className="window map-context-menu" role="menu" aria-label={label} style={{ left: x, top: y }}
    onKeyDown={(event) => {
      const buttons = [...menu.current!.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')];
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
    {actions.map((action) => [
      action.separator ? <hr key={`${action.label}-separator`} className="menu-separator" /> : null,
      <button type="button" role={action.checked === undefined ? 'menuitem' : 'menuitemcheckbox'} aria-checked={action.checked} key={action.label}
        disabled={action.disabled} className={action.primary ? 'primary' : undefined}
        onClick={() => { onClose(true); action.run(); }}>{action.checked !== undefined && <span className="menu-check" aria-hidden="true">{action.checked ? '✓' : ''}</span>}{action.label}</button>,
    ])}
  </div>, document.body);
}
