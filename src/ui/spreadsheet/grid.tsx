import { memo, useMemo, useRef, type KeyboardEvent, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { EntityLink, PlaceLink } from '../panel';
import { cellText, filterLabel, type SheetRow } from './data';
import { adds, MAC, measureText, OVERSCAN, ROW_HEADER_WIDTH, ROW_HEIGHT } from './metrics';
import { inRect, inRects } from './select';
import type { Commands } from './use-commands';
import type { GridDrag } from './use-grid-drag';
import type { Popups } from './use-popups';
import type { GridSelection } from './use-selection';
import type { SheetView } from './use-sheet-view';
import type { Workbook, WorkbookActions } from './use-workbook';

/** What rows call back. The object stays the same between renders, so memoized rows don't redraw for it. */
interface RowHandlers {
  pressCell: (event: ReactMouseEvent, row: number, col: number) => void;
  enterCell: (event: ReactPointerEvent, row: number, col: number) => void;
  cellMenu: (event: ReactMouseEvent, row: number, position: number, target: SheetRow) => void;
  pressRow: (event: ReactMouseEvent, row: number) => void;
  rowMenu: (event: ReactMouseEvent, row: number, target: SheetRow) => void;
  openRow: (target: SheetRow) => void;
  toggleGroup: (group: string) => void;
  openCellMenu: (target: SheetRow, row: number, col: number, element: HTMLElement) => void;
  onSelect: WorkbookActions['onSelect'];
  onOpenPlace: WorkbookActions['onOpenPlace'];
}
/** An object whose methods never change identity but always call the latest ones. */
function useStable<T extends object>(latest: T): T {
  const ref = useRef(latest);
  ref.current = latest;
  return useMemo(() => Object.fromEntries(Object.keys(ref.current).map((key) => [key,
    (...args: unknown[]) => (ref.current[key as keyof T] as (...args: unknown[]) => unknown)(...args)])) as T, []);
}

/** How the shown columns are drawn, the same for every row. */
interface RowLayout {
  columns: SheetView['columns']; shownCols: readonly number[]; widths: readonly number[];
  /** Sticky offsets of the frozen columns, by position. */
  frozenLefts: readonly number[];
  /** Each position's frozen-pane and hidden-neighbour classes. */
  classes: readonly string[];
  painters: SheetView['painters'];
}

function CellContent({ row, col, handlers }: { row: SheetRow; col: number; handlers: RowHandlers }) {
  const values = row.cells[col]!, links = row.links[col];
  if (!links) return <>{values.join(', ')}</>;
  return <>{values.map((value, i) => {
    const link = links[i];
    const content = !link ? value
      : link.kind === 'url' ? <a href={link.href} target="_blank" rel="noreferrer">{value}</a>
      : link.kind === 'place' ? <PlaceLink place={link.place} onOpenPlace={handlers.onOpenPlace}>{value}</PlaceLink>
      : <EntityLink kind={link.kind} id={link.id} onSelect={handlers.onSelect}>{value}</EntityLink>;
    return <span key={i}>{i > 0 && ', '}{content}</span>;
  })}</>;
}

/** One row. Its props are primitives or stable objects, so selecting or scrolling redraws only the rows that changed. */
const GridRow = memo(function GridRow({ target, index, number, layout, marks, headClass, rowClass, top, menuCol, collapsed, handlers }: {
  target: SheetRow; index: number; number: number; layout: RowLayout;
  /** Each cell's selection classes, joined by "|". */
  marks: string;
  headClass: string;
  /** Classes every cell of the row shares. */
  rowClass: string;
  /** A frozen row's sticky offset. */
  top?: number;
  /** The column whose in-cell list is open, or -1. */
  menuCol: number;
  collapsed: boolean; handlers: RowHandlers;
}) {
  const cellMarks = marks.split('|');
  return <tr className={target.subtotal ? 'xl-subtotal' : target.ended ? 'ended' : undefined} onDoubleClick={() => handlers.openRow(target)}>
    <th scope="row" className={`xl-row-number${headClass}${rowClass}`} style={{ top }} onPointerDown={(event) => handlers.pressRow(event, index)}
      onContextMenu={(event) => handlers.rowMenu(event, index, target)} onPointerEnter={(event) => handlers.enterCell(event, index, layout.shownCols[0]!)}>
      {target.subtotal && <button type="button" className="xl-outline" tabIndex={-1} aria-expanded={!collapsed}
        aria-label={`${collapsed ? 'Show' : 'Hide'} detail of ${target.name}`}
        onPointerDown={(event) => event.stopPropagation()} onDoubleClick={(event) => event.stopPropagation()}
        onClick={() => handlers.toggleGroup(target.subtotal!.group)}>{collapsed ? '+' : '−'}</button>}
      {number}</th>
    {layout.shownCols.map((c, p) => {
      const column = layout.columns[c]!;
      const text = cellText(target, c), hasMenu = !!target.menus[c]?.length, mark = cellMarks[p]!;
      const painter = target.subtotal ? undefined : layout.painters.get(c), paint = painter?.paint(target);
      // The selection tint covers a fill, and the copied border takes a data bar's place, while they show.
      const fill = mark.includes('in-range') ? undefined : paint?.fill;
      const bar = paint?.bar !== undefined && !mark.includes('ants') ? paint.bar : undefined;
      return <td key={column.id} data-cell={`${index}:${c}`}
        className={`${column.numeric ? 'numeric' : ''}${hasMenu ? ' has-menu' : ''}${mark}${layout.classes[p]}${rowClass}${fill ? ' painted' : ''}${bar !== undefined ? ' has-bar' : ''}`}
        style={{ top, left: layout.frozenLefts[p], backgroundColor: fill,
          ...(bar !== undefined ? { '--bar': painter && 'color' in painter.format ? painter.format.color : undefined, backgroundSize: `${bar * 100}% 100%` } : {}) }}
        title={measureText(text, false) + 8 > layout.widths[c]! ? text : undefined}
        onPointerDown={(event) => handlers.pressCell(event, index, c)} onPointerEnter={(event) => handlers.enterCell(event, index, c)}
        onContextMenu={(event) => handlers.cellMenu(event, index, p, target)}>
        <CellContent row={target} col={c} handlers={handlers} />
        {hasMenu && <button type="button" tabIndex={-1} className={`xl-cell-dropdown${menuCol === c ? ' xl-dropdown-open' : ''}`}
          aria-label={`${target.name} ${column.label.toLowerCase()} (${target.menus[c]!.length})`} aria-haspopup="listbox"
          onPointerDown={(event) => event.stopPropagation()} onDoubleClick={(event) => event.stopPropagation()}
          onClick={(event) => handlers.openCellMenu(target, index, c, event.currentTarget)} />}
      </td>;
    })}
  </tr>;
});

/** The worksheet: column letters, the field-name row, and the listed rows (only the ones in view are drawn). */
export function SheetGrid({ actions, workbook, popups, view, selection, commands, drag, onKeyDown }: {
  actions: WorkbookActions; workbook: Workbook; popups: Popups; view: SheetView; selection: GridSelection; commands: Commands; drag: GridDrag;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
}) {
  const { autoFilter, gridlines, greyEnded, grid, pivotOpen, sheet, sheetId, state } = workbook;
  const { copied, dropdown, cellMenu, setRowMenu, openColumnMenu } = popups;
  const { columns, order, shownCols, columnKey, widths, lefts, sheetWidth, frozenCols, frozenRows, all, list, shown, numbers, narrowed, filters, sort,
    zoom, rowHeight, viewport, setViewport, letterOf, painters } = view;
  const { rects, multi, row, col, position, fullColumns, isFullRow, inRange, selectAll, selectColumn, selectRow, setActive } = selection;
  const { outlineLevel, openDropdown, autoFit } = commands;
  const { dropAt, suppressClick, startDrag, startMove, pick, dragTo, resizeStart, resizeMove, resizeEnd } = drag;

  const start = Math.max(frozenRows, Math.floor(viewport.top / rowHeight) - OVERSCAN);
  const end = Math.max(start, Math.min(shown.length, Math.ceil((viewport.top + viewport.height) / rowHeight) + OVERSCAN));

  const ants = copied && copied.sheetId === sheetId && copied.shown === shown && copied.columns === columnKey ? copied.rects : null;
  /** A cell's selection: the active border, the tint and heavy outer border, the copied cells' moving border, and where dragged columns would land. */
  const mark = (index: number, p: number) => {
    let names = index === row && p === position ? ' active' : '';
    if (ants?.some((rect) => inRect(rect, index, p))) {
      const edge = (r: number, q: number) => !inRects(ants, r, q);
      const edges = `${edge(index - 1, p) ? ' ants-top' : ''}${edge(index + 1, p) ? ' ants-bottom' : ''}${edge(index, p - 1) ? ' ants-left' : ''}${edge(index, p + 1) ? ' ants-right' : ''}`;
      if (edges) names += ` ants${edges}`;
    }
    if (inRange(index, p)) {
      if (index !== row || p !== position) names += ' in-range';
      if (!inRects(rects, index - 1, p)) names += ' range-top';
      if (!inRects(rects, index + 1, p)) names += ' range-bottom';
      if (!inRects(rects, index, p - 1)) names += ' range-left';
      if (!inRects(rects, index, p + 1)) names += ' range-right';
    }
    return names + dropMark(p);
  };
  const dropMark = (p: number) => dropAt === p ? ' drop-before' : dropAt === shownCols.length && p === dropAt - 1 ? ' drop-after' : '';
  const layout = useMemo((): RowLayout => ({
    columns, shownCols, widths, painters, frozenLefts: lefts.slice(0, frozenCols),
    classes: shownCols.map((c, p) => {
      const before = order[order.indexOf(c) - 1];
      return `${p < frozenCols ? ` xl-frozen${p === frozenCols - 1 ? ' xl-frozen-edge' : ''}` : ''}${before !== undefined && state.hidden.includes(columns[before]!.id) ? ' after-hidden' : ''}`;
    }),
  }), [columns, shownCols, widths, painters, lefts, frozenCols, order, state.hidden]);
  const frozenLeft = (p: number) => p < frozenCols ? { left: lefts[p]! } : undefined;
  const inRow = (index: number) => multi && rects.some((rect) => index >= rect.r0 && index <= rect.r1);
  const hiddenRowKeys = useMemo(() => new Set(state.subtotals ? [] : state.hiddenRows), [state.subtotals, state.hiddenRows]);

  const handlers = useStable<RowHandlers>({
    pressCell: (event, index, c) => pick({ row: index, col: c })(event),
    enterCell: (event, index, c) => dragTo({ row: index, col: c })(event),
    cellMenu: (event, index, p, target) => {
      event.preventDefault();
      if (!inRange(index, p)) setActive({ row: index, col: shownCols[p]! });
      setRowMenu({ x: event.clientX, y: event.clientY, key: target.key, col: shownCols[p]! });
    },
    pressRow: (event, index) => {
      if (event.button !== 0 || (MAC && event.ctrlKey)) return;
      selectRow(index, event.shiftKey, adds(event));
      startDrag(event, 'rows');
    },
    rowMenu: (event, index, target) => {
      event.preventDefault();
      if (!isFullRow(index)) selectRow(index);
      setRowMenu({ x: event.clientX, y: event.clientY, key: target.key });
    },
    openRow: commands.openRow, toggleGroup: commands.toggleGroup, openCellMenu: commands.openCellMenu,
    onSelect: actions.onSelect, onOpenPlace: actions.onOpenPlace,
  });
  const renderRow = (index: number) => {
    const target = shown[index]!, number = numbers.get(target.key)!;
    const afterHidden = hiddenRowKeys.size > 0 && hiddenRowKeys.has(list.sorted[number - 3]?.key ?? '');
    return <GridRow key={target.key} target={target} index={index} number={number} layout={layout} handlers={handlers}
      marks={shownCols.map((_, p) => mark(index, p)).join('|')}
      headClass={`${narrowed ? ' filtered' : ''}${index === row || inRow(index) ? ' current' : ''}`}
      rowClass={`${index < frozenRows ? ` xl-pinned${index === frozenRows - 1 ? ' xl-pinned-edge' : ''}` : ''}${afterHidden ? ' after-hidden-row' : ''}`}
      // Frozen rows stick below the two header rows (unzoomed px: the table itself is zoomed).
      top={index < frozenRows ? ROW_HEIGHT * (2 + index) : undefined}
      menuCol={cellMenu?.key === target.key ? cellMenu.col : -1}
      collapsed={!!target.subtotal && state.collapsed.includes(target.subtotal.group)} />;
  };
  const spacer = (rows: number) => rows > 0 && <tr aria-hidden="true" style={{ height: rows * ROW_HEIGHT }}><td colSpan={shownCols.length + 1} /></tr>;

  return <div ref={grid} hidden={pivotOpen} className={`xl-grid${gridlines ? '' : ' no-gridlines'}${greyEnded ? ' grey-ended' : ''}${multi ? ' has-range' : ''}`} tabIndex={0} role="region" aria-label={`${sheet.name} worksheet`}
    onKeyDown={onKeyDown} onScroll={(event) => { const top = event.currentTarget.scrollTop; setViewport((current) => current.top === top ? current : { ...current, top }); }}>
    <table className="xl-sheet" style={{ width: sheetWidth, zoom }} aria-label={sheet.name} aria-rowcount={all.length + 1}
      // The sheet has its own selection: no browser text selection or link dragging, and focus stays on the grid so Ctrl+C copies the cells.
      onMouseDown={(event) => { if (event.button === 0) event.preventDefault(); }}
      onClickCapture={(event) => {
        if (suppressClick.current && event.detail > 0) { event.preventDefault(); event.stopPropagation(); }
        suppressClick.current = false;
      }}>
      <colgroup><col style={{ width: ROW_HEADER_WIDTH }} />{shownCols.map((target) => <col key={columns[target]!.id} style={{ width: widths[target] }} />)}</colgroup>
      <thead>
        <tr className="xl-letters">
          <th className="xl-corner" title="Select All" onPointerDown={(event) => { if (event.button === 0) { selectAll(); grid.current?.focus({ preventScroll: true }); } }}>
            {state.subtotals && <span className="xl-levels">{([1, 2, 3] as const).map((level) => <button type="button" key={level} tabIndex={-1} aria-label={`Outline level ${level}`}
              title={['Grand total only', 'Group totals', 'All rows'][level - 1]} onPointerDown={(event) => event.stopPropagation()} onClick={() => outlineLevel(level)}>{level}</button>)}</span>}
          </th>
          {shownCols.map((target, p) => {
            const column = columns[target]!, full = fullColumns.includes(p);
            const lit = target === col || (multi && rects.some((rect) => p >= rect.p0 && p <= rect.p1));
            return <th key={column.id} style={frozenLeft(p)} className={`${lit ? 'current' : ''}${full ? ' movable' : ''}${dropMark(p)}${layout.classes[p]}`}
              onPointerDown={(event) => {
                if (event.button !== 0 || (MAC && event.ctrlKey)) return;
                if (full && fullColumns.length < shownCols.length && !event.shiftKey && !adds(event) && event.pointerType !== 'touch') {
                  // A selected column's letter drags the selected columns to a new place; a plain click selects just that one.
                  startMove(event, target);
                  return;
                }
                selectColumn(target, event.shiftKey, adds(event));
                startDrag(event, 'columns');
              }}
              onPointerEnter={dragTo({ row: -1, col: target })}
              onContextMenu={(event) => { if (!full) selectColumn(target); openColumnMenu(event, target); }}>
              <span aria-hidden="true">{letterOf(target)}</span>
              <span className="xl-col-resize" role="separator" aria-orientation="vertical" aria-label={`Resize ${column.label} column`}
                aria-valuenow={widths[target]} title="Drag to resize · double-click to AutoFit" tabIndex={-1}
                onPointerDown={resizeStart(target)} onPointerMove={resizeMove} onPointerUp={resizeEnd} onPointerCancel={resizeEnd}
                onDoubleClick={(event) => { event.stopPropagation(); autoFit(target); }} />
            </th>;
          })}
        </tr>
        <tr className="xl-fields">
          <th className={`xl-row-number${row < 0 || (multi && rects.some((rect) => rect.r0 < 0)) ? ' current' : ''}`} scope="row">1</th>
          {shownCols.map((target, p) => {
            const column = columns[target]!, filter = filters[column.id];
            const primary = sort[0]?.column === column.id ? sort[0] : undefined;
            return <th key={column.id} scope="col" data-field={target} style={frozenLeft(p)} className={`${mark(-1, p)}${layout.classes[p]}`}
              aria-sort={primary ? primary.descending ? 'descending' : 'ascending' : undefined} onPointerDown={pick({ row: -1, col: target })} onPointerEnter={dragTo({ row: -1, col: target })}
              onContextMenu={(event) => openColumnMenu(event, target)}>
              <span className="xl-field-label">{column.label}</span>
              {autoFilter && <button type="button" className={`xl-filter-button${filter ? ' filtered' : ''}${dropdown?.col === target ? ' open xl-dropdown-open' : ''}`} tabIndex={-1}
                aria-label={`Filter ${column.label}${filter ? ` (${filterLabel(filter)})` : ''}`} title={filter ? filterLabel(filter) : undefined}
                onPointerDown={(event) => event.stopPropagation()} onClick={(event) => openDropdown(target, event.currentTarget)} />}
            </th>;
          })}
        </tr>
      </thead>
      <tbody>
        {shown.slice(0, frozenRows).map((_, index) => renderRow(index))}
        {spacer(start - frozenRows)}
        {shown.slice(start, end).map((_, i) => renderRow(start + i))}
        {spacer(shown.length - end)}
      </tbody>
    </table>
    {!shown.length && <p className="xl-empty">No rows match. Clear the search, or choose Data ▸ Show All.</p>}
  </div>;
}
