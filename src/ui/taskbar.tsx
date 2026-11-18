import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { ContextMenu, type MenuAction } from './context-menu';

export interface Task { key: string; title: string; minimized: boolean; controls: string }

/**
 * A taskbar button for one kind of window. A single window gets a plain
 * Win98 task button; two or more collapse into one button that opens a menu
 * of the open windows, like Windows XP's grouped taskbar buttons.
 */
export function TaskGroup({ label, tasks, active, onToggle, onShow, onClose, windowActions, groupActions }: {
  label: string; tasks: Task[]; active: string | null;
  /** The X beside a window in the group menu. */
  onClose: (key: string) => void;
  /** Right-click menu of a single window's button, or of its row in the group menu. */
  windowActions: (task: Task) => MenuAction[];
  /** Right-click menu of a grouped button, acting on every window in it. */
  groupActions: (tasks: Task[]) => MenuAction[];
  /** A plain task button: restore, minimize if active, else focus. */
  onToggle: (key: string) => void;
  /** Picking a window from the group menu: restore and focus it. */
  onShow: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  /** An open right-click menu: for one window (`task`) or for the whole group. */
  const [menu, setMenu] = useState<{ x: number; y: number; task?: Task } | null>(null);
  const closeMenu = useCallback((restoreFocus?: boolean) => {
    setMenu(null);
    if (restoreFocus) button.current?.focus();
  }, []);
  // Right-click (or the menu key / Shift+F10) opens the window menu above the button, as in Win98.
  const openMenu = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setOpen(false);
    const rect = event.currentTarget.getBoundingClientRect();
    setMenu({ x: event.clientX || rect.left, y: rect.top - 2 });
  };
  // A row of the group menu opens that window's menu at the pointer, leaving the list open.
  const openRowMenu = (task: Task) => (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    setMenu({ x: event.clientX || rect.left, y: event.clientY || rect.bottom, task });
  };
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const grouped = tasks.length > 1;
  useEffect(() => { if (!grouped) setOpen(false); setMenu(null); }, [grouped]);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setOpen(false);
      button.current?.focus();
    };
    const resize = () => setOpen(false);
    document.addEventListener('pointerdown', outside, true);
    document.addEventListener('keydown', escape);
    window.addEventListener('resize', resize);
    return () => {
      document.removeEventListener('pointerdown', outside, true);
      document.removeEventListener('keydown', escape);
      window.removeEventListener('resize', resize);
    };
  }, [open]);

  const isPressed = (task: Task) => active === task.key && !task.minimized;
  if (!tasks.length) return null;
  if (!grouped) {
    const [task] = tasks as [Task];
    const pressed = isPressed(task);
    return <>
      <button ref={button} className={`task${pressed ? ' active' : ''}`} aria-pressed={pressed} aria-controls={task.controls}
        title={pressed ? `Minimize ${task.title}` : `Show ${task.title}`} onClick={() => onToggle(task.key)} onContextMenu={openMenu}>
        <span className="task-label">{task.title}</span>
      </button>
      {menu && <ContextMenu x={menu.x} y={menu.y} above label={`${task.title} window`} actions={windowActions(task)} onClose={closeMenu} />}
    </>;
  }
  const pressed = open || tasks.some(isPressed);
  return <div className="task-group" ref={root}>
    <button ref={button} className={`task${pressed ? ' active' : ''}`} aria-haspopup="menu" aria-expanded={open}
      aria-label={`${label}, ${tasks.length} windows`} title={`${tasks.length} ${label} windows`} onClick={() => setOpen((current) => !current)} onContextMenu={openMenu}>
      <span className="task-count">{tasks.length}</span><span className="task-label">{label}</span><span className="task-arrow" aria-hidden="true" />
    </button>
    {open && <div className="window task-menu" role="menu" aria-label={`${label} windows`}>
      {tasks.map((task) => <div key={task.key} className="task-menu-row" onContextMenu={openRowMenu(task)}>
        <button type="button" role="menuitem" className={`task-menu-item${isPressed(task) ? ' current' : ''}`}
          aria-controls={task.controls} onClick={() => { setOpen(false); onShow(task.key); }}>
          {task.minimized ? <span className="visually-hidden">(minimized) </span> : null}{task.title}
        </button>
        <span className="title-bar-controls"><button type="button" className="close" aria-label={`Close ${task.title} window`} title="Close"
          onClick={() => onClose(task.key)} /></span>
      </div>)}
    </div>}
    {menu && (menu.task
      ? <ContextMenu x={menu.x} y={menu.y} label={`${menu.task.title} window`} onClose={() => setMenu(null)}
        actions={windowActions(menu.task).map((action) => ({ ...action, run: () => { setOpen(false); action.run(); } }))} />
      : <ContextMenu x={menu.x} y={menu.y} above label={`${label} group`} actions={groupActions(tasks)} onClose={closeMenu} />)}
  </div>;
}
