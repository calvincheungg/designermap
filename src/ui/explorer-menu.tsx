import { useCallback, useRef, useState, type MouseEvent } from 'react';
import { ContextMenu, type MenuAction } from './context-menu';

export const EXPLORER_MENUS = ['File', 'Edit', 'View', 'Go', 'Favorites', 'Help'] as const;
export type ExplorerMenuName = (typeof EXPLORER_MENUS)[number];

/** Explorer's Win98 menu bar. */
export function ExplorerMenu({ actions }: { actions: (name: ExplorerMenuName) => readonly MenuAction[] }) {
  const [menu, setMenu] = useState<{ name: ExplorerMenuName; x: number; y: number } | null>(null);
  const bar = useRef<HTMLDivElement>(null);
  const justClosed = useRef<ExplorerMenuName | null>(null);
  const name = menu?.name ?? null;
  const open = (next: ExplorerMenuName) => (event: MouseEvent<HTMLButtonElement>) => {
    // The press that closed this menu shouldn't open it again.
    if (justClosed.current === next) { justClosed.current = null; return; }
    const rect = event.currentTarget.getBoundingClientRect();
    setMenu({ name: next, x: rect.left, y: rect.bottom });
  };
  const close = useCallback((restoreFocus?: boolean) => {
    if (restoreFocus) bar.current?.querySelector<HTMLElement>('[aria-expanded="true"]')?.focus({ preventScroll: true });
    else {
      justClosed.current = name;
      window.setTimeout(() => { justClosed.current = null; }, 300);
    }
    setMenu(null);
  }, [name]);
  return <><div ref={bar} className="xl-menubar explorer-menu" role="menubar" aria-label="Explorer menu">
    {EXPLORER_MENUS.map((item) => <button type="button" role="menuitem" key={item} aria-haspopup="menu" aria-expanded={name === item}
      className={name === item ? 'open' : undefined} onClick={open(item)}>{item === 'Favorites' ? <>F<u>a</u>vorites</> : <><u>{item[0]}</u>{item.slice(1)}</>}</button>)}
  </div>
  {menu && <ContextMenu x={menu.x} y={menu.y} label={`${menu.name} menu`} actions={actions(menu.name)} onClose={close} />}</>;
}
