import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode, type RefObject } from 'react';
import { readJson, writeJson, useSettingsCleared } from './storage';

export const DEFAULT_PANEL_WIDTH = 400;
export const MIN_PANEL_WIDTH = 260;
export const MIN_PANEL_HEIGHT = 180;
const MIN_SIZE: Size = { width: MIN_PANEL_WIDTH, height: MIN_PANEL_HEIGHT };
const MARGIN = 12;
/** Space kept below a fold heading so its section's top border shows. */
const FOLD_GAP = 6;
const KEY_STEP = 10;

export interface WindowRect { x: number; y: number; width: number; height: number }
export interface Size { width: number; height: number }

export function storedRect(key: string | undefined): WindowRect | null {
  const value = key ? readJson(key) as Partial<WindowRect> | null | undefined : null;
  return value && [value.x, value.y, value.width, value.height].every(Number.isFinite) ? value as WindowRect : null;
}

/** Cleared (clearSettings) to send every open window back to its usual place. */
export const WINDOW_PLACES = 'designer-map:window-places';

/** Steps between cascaded windows, like Win98's Cascade Windows. */
const CASCADE = 28;

/**
 * Properties windows cascade down and to the left from the right edge;
 * city and tool windows cascade from the left edge at a shorter height.
 */
export function defaultRect(area: Size, cascade = 0, align: 'left' | 'right' = 'right', preferred?: Size, min = MIN_SIZE): WindowRect {
  const width = Math.min(preferred?.width ?? DEFAULT_PANEL_WIDTH, Math.max(min.width, area.width - 2 * MARGIN));
  const offset = cascade * CASCADE;
  const full = area.height - 2 * MARGIN - offset;
  return {
    x: align === 'right' ? area.width - width - MARGIN - offset : MARGIN + offset - CASCADE, y: MARGIN + offset, width,
    height: Math.max(min.height, Math.min(full, preferred?.height ?? (align === 'right' ? full : 420))),
  };
}

/** Gap between an anchor (a city pin) and the window opened beside it. */
const ANCHOR_GAP = 8;

/**
 * Beside an anchor box (in the area's coordinates): to its right, or to its
 * left when the right side has no room, with the title bar level with the
 * anchor's middle. `clampRect` then keeps it inside the area.
 */
export function anchoredRect(area: Size, anchor: { left: number; top: number; right: number; bottom: number }, preferred?: Size, min = MIN_SIZE): WindowRect {
  const width = Math.min(preferred?.width ?? DEFAULT_PANEL_WIDTH, Math.max(min.width, area.width - 2 * MARGIN));
  const height = Math.max(min.height, Math.min(area.height - 2 * MARGIN, preferred?.height ?? 420));
  const right = anchor.right + ANCHOR_GAP;
  const left = anchor.left - ANCHOR_GAP - width;
  const x = right + width <= area.width - MARGIN || left < MARGIN && area.width - right >= anchor.left ? right : left;
  const y = (anchor.top + anchor.bottom) / 2 - TITLE_BAR_MIDDLE;
  return { x, y: Math.min(Math.max(y, MARGIN), Math.max(MARGIN, area.height - height - MARGIN)), width, height };
}
/** Roughly half a 98.css title bar plus the window border, so the title bar lines up with the anchor. */
const TITLE_BAR_MIDDLE = 12;

/** Keep the whole window, including its title bar, inside the desktop area. */
export function clampRect(rect: WindowRect, area: Size, min = MIN_SIZE): WindowRect {
  const width = Math.round(Math.min(Math.max(rect.width, min.width), Math.max(min.width, area.width)));
  const height = Math.round(Math.min(Math.max(rect.height, min.height), Math.max(min.height, area.height)));
  const x = Math.round(Math.min(Math.max(rect.x, 0), Math.max(0, area.width - width)));
  const y = Math.round(Math.min(Math.max(rect.y, 0), Math.max(0, area.height - height)));
  return { x, y, width, height };
}

/** The client size of an element's parent (the desktop area windows live in), tracked as it resizes. */
export function useParentSize(element: RefObject<HTMLElement | null>): Size | null {
  const [area, setArea] = useState<Size | null>(null);
  useLayoutEffect(() => {
    const parent = element.current?.parentElement;
    if (!parent) return;
    const update = () => setArea((current) => {
      if (!parent.clientWidth || !parent.clientHeight) return null;
      return current?.width === parent.clientWidth && current.height === parent.clientHeight ? current : { width: parent.clientWidth, height: parent.clientHeight };
    });
    update();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
    observer?.observe(parent);
    window.addEventListener('resize', update);
    return () => { observer?.disconnect(); window.removeEventListener('resize', update); };
  }, [element]);
  return area;
}

/**
 * Win98 window gestures: drag the title bar to move, the corner grip to resize,
 * or press arrow keys on either (Shift for bigger steps). `placed` is null while
 * the window can't move (unmeasured or maximized); `update` receives the new rect.
 */
export function useWindowGestures(placed: WindowRect | null, update: (next: WindowRect) => void) {
  const gesture = useRef<{ mode: 'move' | 'resize'; x: number; y: number; start: WindowRect } | null>(null);
  const begin = (mode: 'move' | 'resize') => (event: PointerEvent<HTMLElement>) => {
    if (event.button !== 0 || !placed || (event.target as Element).closest('button')) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    gesture.current = { mode, x: event.clientX, y: event.clientY, start: placed };
  };
  const move = (event: PointerEvent<HTMLElement>) => {
    const current = gesture.current;
    if (!current) return;
    const dx = event.clientX - current.x;
    const dy = event.clientY - current.y;
    const { start } = current;
    update(current.mode === 'move' ? { ...start, x: start.x + dx, y: start.y + dy }
      : { ...start, width: start.width + dx, height: start.height + dy });
  };
  const end = () => { gesture.current = null; };
  const arrows = (mode: 'move' | 'resize') => (event: KeyboardEvent<HTMLElement>) => {
    if (!placed || event.target !== event.currentTarget) return;
    const step = event.shiftKey ? KEY_STEP * 4 : KEY_STEP;
    const delta = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[event.key];
    if (!delta) return;
    event.preventDefault();
    const [dx, dy] = delta as [number, number];
    update(mode === 'move' ? { ...placed, x: placed.x + dx, y: placed.y + dy }
      : { ...placed, width: placed.width + dx, height: placed.height + dy });
  };
  return { begin, move, end, arrows };
}

/**
 * A Properties window floating on the desktop like a Win98 window:
 * drag its title bar to move it, drag the corner grip to resize it, minimize
 * it to the taskbar, maximize it or close it. Arrow keys move it from the focused
 * title bar or resize it from the focused grip; double-clicking the title bar
 * maximizes or restores it (without `onMaximize`, it restores the default
 * placement). Pressing anywhere in it brings it to the front.
 */
export function PropertiesWindow({ id, titleId, bodyId, title, icon, minimized, maximized = false, onMaximize, active, zIndex, cascade = 0, anchor, align = 'right', preferredSize, minSize = MIN_SIZE, fitHeight = false, storageKey, initialRect, onRect, scrollKey,
  className, onMinimize, onClose, onFocus, children }: {
  id: string; titleId: string; bodyId: string; title: string; minimized: boolean;
  /** A 16px application icon before the title, like Win98's window menu icon. */
  icon?: ReactNode;
  /** Fill the whole desktop area, like a maximized Win98 window (no moving or resizing until restored). */
  maximized?: boolean;
  /** Shows the Maximize / Restore button; double-clicking the title bar toggles it too. */
  onMaximize?: () => void; active: boolean; zIndex: number;
  cascade?: number; align?: 'left' | 'right'; storageKey?: string;
  /** Where the user had put the window before a refresh; `onRect` reports each later change (null = back to its default place). */
  initialRect?: WindowRect; onRect?: (rect: WindowRect | null) => void; scrollKey: unknown; className?: string;
  /** Open beside this box (viewport pixels, e.g. the clicked city pin) instead of cascading. A new anchor moves the window there again. */
  anchor?: { left: number; top: number; right: number; bottom: number };
  /** Default size before the user moves or resizes the window (still kept inside the desktop area). */
  preferredSize?: Size;
  /** Smallest size when opening or resizing; defaults to MIN_PANEL_WIDTH × MIN_PANEL_HEIGHT. */
  minSize?: Size;
  /** Open just tall enough for the content (up to the desktop area), tracking it until the user moves or resizes the window. */
  fitHeight?: boolean;
  onMinimize: () => void; onClose: () => void; onFocus: () => void; children: ReactNode;
}) {
  const win = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const area = useParentSize(win);
  const [rect, setRect] = useState<WindowRect | null>(() => initialRect ?? storedRect(storageKey));
  useSettingsCleared((keys) => { if (keys.includes(WINDOW_PLACES)) setRect(null); });
  const reportRect = useRef(onRect);
  reportRect.current = onRect;
  useEffect(() => reportRect.current?.(rect), [rect]);
  // The anchor in the desktop area's coordinates; a new anchor (another pin click) drops any manual position.
  const [localAnchor, setLocalAnchor] = useState<WindowRect | null>(null);
  useLayoutEffect(() => {
    const parent = win.current?.parentElement;
    if (!anchor || !parent) { setLocalAnchor(null); return; }
    const origin = parent.getBoundingClientRect();
    setLocalAnchor({ x: anchor.left - origin.left, y: anchor.top - origin.top, width: anchor.right - anchor.left, height: anchor.bottom - anchor.top });
    setRect(null);
  }, [anchor]);
  useEffect(() => { if (rect && storageKey) writeJson(storageKey, rect); }, [rect, storageKey]);
  useLayoutEffect(() => { if (body.current) body.current.scrollTop = 0; }, [scrollKey]);

  // Measure the content's natural height: the body itself stretches to the window, so use its last child's bottom edge.
  const [fitted, setFitted] = useState<number | null>(null);
  useLayoutEffect(() => {
    const el = body.current, frame = win.current;
    if (!fitHeight || !el || !frame || typeof ResizeObserver === 'undefined') return;
    const measure = () => {
      const last = el.lastElementChild;
      if (!last || !frame.offsetHeight) return;
      const bottom = last.getBoundingClientRect().bottom + parseFloat(getComputedStyle(last).marginBottom || '0');
      const content = bottom - el.getBoundingClientRect().top + el.scrollTop + parseFloat(getComputedStyle(el).paddingBottom || '0');
      if (content <= 0) return;
      const chrome = frame.offsetHeight - el.clientHeight;
      let height = chrome + content;
      // Stop at a [data-fold] section's heading (brand Tags), unless that would be shorter than the minimum.
      const fold = el.querySelector('[data-fold] > legend');
      if (fold) {
        const atFold = chrome + fold.getBoundingClientRect().bottom - el.getBoundingClientRect().top + el.scrollTop + FOLD_GAP;
        if (atFold >= minSize.height) height = Math.min(height, atFold);
      }
      setFitted(Math.ceil(height));
    };
    const sizes = new ResizeObserver(measure);
    const watch = () => { sizes.disconnect(); for (const child of el.children) sizes.observe(child); measure(); };
    const children = new MutationObserver(watch);
    children.observe(el, { childList: true });
    watch();
    return () => { sizes.disconnect(); children.disconnect(); };
  }, [fitHeight, scrollKey, minSize.height]);
  const preferred = fitHeight && fitted ? { width: preferredSize?.width ?? DEFAULT_PANEL_WIDTH, height: fitted } : preferredSize;

  // Without a measured area (first paint, tests) CSS places the window at the right edge.
  const placed = area ? maximized ? { x: 0, y: 0, width: area.width, height: area.height }
    : clampRect(rect ?? (localAnchor
      ? anchoredRect(area, { left: localAnchor.x, top: localAnchor.y, right: localAnchor.x + localAnchor.width, bottom: localAnchor.y + localAnchor.height }, preferred, minSize)
      : defaultRect(area, cascade, align, preferred, minSize)), area, minSize) : null;
  const { begin, move, end, arrows } = useWindowGestures(maximized ? null : placed, (next) => { if (area) setRect(clampRect(next, area, minSize)); });

  return <div ref={win} className={`window side-window${maximized ? ' maximized' : ''}${className ? ` ${className}` : ''}`} id={id} role="dialog" aria-labelledby={titleId} hidden={minimized}
    data-placed={placed ? 'true' : undefined} data-active={active ? 'true' : undefined}
    onPointerDownCapture={() => { if (!active) onFocus(); }} onFocusCapture={() => { if (!active) onFocus(); }}
    style={{ zIndex, ...(placed ? { left: placed.x, top: placed.y, width: placed.width, height: placed.height } : {}) }}>
    <div className={`title-bar${active ? '' : ' inactive'}`} tabIndex={0} aria-label={`Move ${title} window`}
      onPointerDown={begin('move')} onPointerMove={move} onPointerUp={end} onPointerCancel={end}
      onKeyDown={arrows('move')} onDoubleClick={(event) => {
        if ((event.target as Element).closest('button')) return;
        if (onMaximize) onMaximize(); else setRect(null);
      }}>
      {icon && <span className="title-bar-icon" aria-hidden="true">{icon}</span>}
      <div className="title-bar-text" id={titleId}>{title}</div>
      <div className="title-bar-controls">
        <button className="minimize" aria-label={`Minimize ${title}`} title="Minimize" onClick={onMinimize} />
        {onMaximize && <button className={maximized ? 'restore' : 'maximize'} aria-label={`${maximized ? 'Restore' : 'Maximize'} ${title}`}
          title={maximized ? 'Restore' : 'Maximize'} onClick={onMaximize} />}
        <button className="close" aria-label={`Close ${title}`} title="Close" onClick={onClose} />
      </div>
    </div>
    <div className="window-body" id={bodyId} ref={body}>{children}</div>
    {!maximized && <div className="resize-grip" role="separator" aria-label={`Resize ${title}`} tabIndex={0}
      onPointerDown={begin('resize')} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onKeyDown={arrows('resize')} />}
  </div>;
}
