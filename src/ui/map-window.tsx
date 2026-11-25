import { useEffect, useRef, useState, type ReactNode } from 'react';
import { clampRect, storedRect, useParentSize, useWindowGestures, type Size, type WindowRect } from './side-panel';
import { useSettingsCleared, writeJson } from './storage';

export const MAP_RECT_KEY = 'designer-map:map-window-rect';
const MARGIN = 12;
/** Room kept on the left of the default map window for the desktop icon column. */
export const ICON_COLUMN = 96;
export const MAP_MIN_SIZE: Size = { width: 320, height: 240 };

/** Default map window: the desktop area right of the icon column, inset like other windows. */
export function defaultMapRect(area: Size): WindowRect {
  const left = area.width - ICON_COLUMN - MARGIN >= MAP_MIN_SIZE.width ? ICON_COLUMN : MARGIN;
  return { x: left, y: MARGIN, width: area.width - left - MARGIN, height: area.height - 2 * MARGIN };
}

/**
 * The map's own Win98 window on the desktop: drag the title bar to move it, the
 * corner grip to resize it, double-click the title bar or press Maximize to fill
 * the desktop area. Until the user moves or resizes it, it follows the default
 * placement as the desktop resizes; its rect is remembered under MAP_RECT_KEY.
 */
export function MapWindowFrame({ title, icon, hidden, maximized, onMinimize, onToggleMaximize, onClose, onActivate, children }: {
  title: string; icon: ReactNode; hidden: boolean; maximized: boolean;
  /** A press anywhere in the window (Alt+Tab counts it as the most recently used). */
  onActivate?: () => void;
  onMinimize: () => void; onToggleMaximize: () => void; onClose: () => void; children: ReactNode;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const area = useParentSize(frame);
  const [rect, setRect] = useState<WindowRect | null>(() => storedRect(MAP_RECT_KEY));
  useSettingsCleared((keys) => { if (keys.includes(MAP_RECT_KEY)) setRect(null); });
  useEffect(() => { if (rect) writeJson(MAP_RECT_KEY, rect); }, [rect]);
  const placed = area ? maximized ? { x: 0, y: 0, width: area.width, height: area.height }
    : clampRect(rect ?? defaultMapRect(area), area, MAP_MIN_SIZE) : null;
  const { begin, move, end, arrows } = useWindowGestures(maximized ? null : placed, (next) => { if (area) setRect(clampRect(next, area, MAP_MIN_SIZE)); });

  return <div ref={frame} className={`window main-window${maximized ? ' maximized' : ''}`} id="map-window" aria-label={title}
    aria-hidden={hidden || undefined} inert={hidden || undefined} data-placed={placed ? 'true' : undefined} onPointerDownCapture={onActivate}
    style={placed ? { left: placed.x, top: placed.y, width: placed.width, height: placed.height } : undefined}>
    <div className="title-bar" tabIndex={maximized ? undefined : 0} aria-label={maximized ? undefined : `Move ${title} window`}
      onPointerDown={begin('move')} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onKeyDown={arrows('move')}
      onDoubleClick={(event) => { if (!(event.target as Element).closest('button')) onToggleMaximize(); }}>
      <div className="title-bar-text">{icon}{title}</div>
      <div className="title-bar-controls">
        <button aria-label="Minimize" onClick={onMinimize} />
        <button aria-label={maximized ? 'Restore' : 'Maximize'} onClick={onToggleMaximize} />
        <button aria-label="Close" onClick={onClose} />
      </div>
    </div>
    {children}
    {!maximized && <div className="resize-grip" role="separator" aria-label={`Resize ${title}`} tabIndex={0}
      onPointerDown={begin('resize')} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onKeyDown={arrows('resize')} />}
  </div>;
}
