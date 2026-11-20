import { useEffect, useRef, useState, type ReactNode } from 'react';

export interface SwitchTarget { key: string; title: string; icon: ReactNode }

/**
 * Win98's Alt+Tab: holding Alt, each Tab (Shift+Tab goes back) moves through
 * the open windows, most recently used first, in a box of icons; releasing Alt
 * switches to the chosen one and Escape cancels. `targets` is read when the
 * switcher opens, so it can be a fresh list each time.
 */
export function useTaskSwitcher(targets: () => SwitchTarget[], onSwitch: (key: string) => void) {
  const [state, setState] = useState<{ list: SwitchTarget[]; index: number } | null>(null);
  const current = useRef(state);
  current.current = state;
  const latest = useRef({ targets, onSwitch });
  latest.current = { targets, onSwitch };
  useEffect(() => {
    const set = (next: typeof state) => { current.current = next; setState(next); };
    const down = (event: KeyboardEvent) => {
      const open = current.current;
      if (event.key === 'Tab' && event.altKey) {
        event.preventDefault();
        if (open) {
          const step = event.shiftKey ? -1 : 1;
          set({ ...open, index: (open.index + step + open.list.length) % open.list.length });
          return;
        }
        const list = latest.current.targets();
        if (list.length < 2) return;
        set({ list, index: event.shiftKey ? list.length - 1 : 1 });
      } else if (open && event.key === 'Escape') {
        event.preventDefault();
        set(null);
      }
    };
    const up = (event: KeyboardEvent) => {
      const open = current.current;
      if (!open || event.key !== 'Alt') return;
      set(null);
      const chosen = open.list[open.index];
      if (chosen) latest.current.onSwitch(chosen.key);
    };
    const cancel = () => set(null);
    window.addEventListener('keydown', down, true);
    window.addEventListener('keyup', up, true);
    window.addEventListener('blur', cancel);
    return () => {
      window.removeEventListener('keydown', down, true);
      window.removeEventListener('keyup', up, true);
      window.removeEventListener('blur', cancel);
    };
  }, []);
  return state;
}

/** The Alt+Tab box: a row of window icons with the chosen one outlined and its title below. */
export function TaskSwitcher({ list, index }: { list: readonly SwitchTarget[]; index: number }) {
  const chosen = list[index];
  return <div className="window task-switcher" role="dialog" aria-label="Switch windows">
    <div className="task-switcher-icons" role="listbox" aria-label="Open windows" aria-activedescendant={chosen ? `switch-${chosen.key}` : undefined}>
      {list.map((target, i) => <span key={target.key} id={`switch-${target.key}`} role="option" aria-selected={i === index} aria-label={target.title}
        className={`task-switcher-icon${i === index ? ' chosen' : ''}`}>{target.icon}</span>)}
    </div>
    <div className="task-switcher-title sunken-panel">{chosen?.title}</div>
  </div>;
}
