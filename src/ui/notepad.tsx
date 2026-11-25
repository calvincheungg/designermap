import { useSetting, useSwitch } from './storage';
import { formatTime, type ClockFormat } from './clock';
import { Dialog } from './dialog';
import { download } from './download';
import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { ContextMenu, type MenuAction } from './context-menu';
import { SaveAsDialog } from './save-as-dialog';
import { NOTEPAD_FONT_SIZES, NOTEPAD_KEY } from './settings';

const WRAP_KEY = 'designer-map:notepad-wrap';
const MENUS = ['File', 'Edit', 'Search', 'Help'] as const;
type MenuName = (typeof MENUS)[number];

/** Win98 Notepad's Time/Date (F5): short time, then short date. */
export const timeDate = (now = new Date(), clock: ClockFormat = 'auto') =>
  `${formatTime(now, clock)} ${now.toLocaleDateString([], { day: 'numeric', month: 'numeric', year: 'numeric' })}`;

/**
 * Notepad: a plain-text scratch pad, like Win98's. The text and Word Wrap are
 * remembered in this browser. File ▸ Save As… downloads it as a .txt file;
 * Edit has Time/Date (F5); Search ▸ Find… (F3 finds the next match).
 */
export function NotepadContent({ clock, fontSize, onFontSize, onClose, onHelp }: {
  clock?: ClockFormat;
  /** Text size in px, shared with Settings ▸ Notepad. */
  fontSize: number; onFontSize: (size: number) => void;
  onClose: () => void; onHelp: () => void;
}) {
  const [fontDialog, setFontDialog] = useState(false);
  const [text, setText] = useSetting<string>(NOTEPAD_KEY, (stored) => stored, '');
  const [wrap, setWrap] = useSwitch(WRAP_KEY);
  const [menu, setMenu] = useState<{ name: MenuName; x: number; y: number } | null>(null);
  const [find, setFind] = useState<{ open: boolean; query: string; missing: boolean }>({ open: false, query: '', missing: false });
  const [confirmNew, setConfirmNew] = useState(false);
  /** The Save As box; `thenClear` when it was opened from File ▸ New's Yes. */
  const [saving, setSaving] = useState<{ thenClear: boolean } | null>(null);
  /** The last name saved under, offered again next time (without the locked .txt). */
  const [fileName, setFileName] = useState('Untitled');
  const area = useRef<HTMLTextAreaElement>(null);
  const findInput = useRef<HTMLInputElement>(null);
  const justClosed = useRef<MenuName | null>(null);
  useEffect(() => { if (find.open) findInput.current?.focus(); }, [find.open]);

  /** Replace the selection (as typing would), keeping the caret after the new text. */
  const insert = (value: string) => {
    const element = area.current;
    if (!element) return;
    element.focus();
    element.setRangeText(value, element.selectionStart, element.selectionEnd, 'end');
    setText(element.value);
  };
  const selected = () => {
    const element = area.current;
    return element ? element.value.slice(element.selectionStart, element.selectionEnd) : '';
  };
  const copy = () => { const value = selected(); if (value) void navigator.clipboard?.writeText(value).catch(() => {}); };
  const paste = () => { void navigator.clipboard?.readText().then(insert).catch(() => {}); };
  const saveAs = () => setSaving({ thenClear: false });
  const clear = () => { setText(''); setConfirmNew(false); window.setTimeout(() => area.current?.focus()); };
  const findNext = () => {
    const element = area.current;
    const query = find.query;
    if (!element || !query) { setFind((f) => ({ ...f, open: true })); return; }
    const haystack = element.value.toLowerCase(), needle = query.toLowerCase();
    let index = haystack.indexOf(needle, element.selectionEnd);
    if (index < 0) index = haystack.indexOf(needle);
    setFind((f) => ({ ...f, missing: index < 0 }));
    if (index < 0) return;
    element.focus();
    element.setSelectionRange(index, index + query.length);
  };

  const actions = (name: MenuName): MenuAction[] => {
    const hasSelection = () => !!area.current && area.current.selectionStart !== area.current.selectionEnd;
    switch (name) {
      case 'File': return [
        { label: 'New', run: () => text ? setConfirmNew(true) : clear() },
        { label: 'Save As…', run: saveAs },
        { label: 'Exit', separator: true, run: onClose },
      ];
      case 'Edit': return [
        { label: 'Undo', run: () => { area.current?.focus(); document.execCommand?.('undo'); } },
        { label: 'Cut', separator: true, disabled: !hasSelection(), run: () => { copy(); insert(''); } },
        { label: 'Copy', disabled: !hasSelection(), run: copy },
        { label: 'Paste', disabled: !navigator.clipboard?.readText, run: paste },
        { label: 'Delete', disabled: !hasSelection(), run: () => insert('') },
        { label: 'Select All', separator: true, run: () => { area.current?.focus(); area.current?.select(); } },
        { label: 'Time/Date', shortcut: 'F5', run: () => insert(timeDate(new Date(), clock)) },
        { label: 'Word Wrap', separator: true, checked: wrap, run: () => setWrap((on) => !on) },
        { label: 'Set Font…', run: () => setFontDialog(true) },
      ];
      case 'Search': return [
        { label: 'Find…', run: () => setFind((f) => ({ ...f, open: true, missing: false })) },
        { label: 'Find Next', shortcut: 'F3', disabled: !find.query, run: findNext },
      ];
      case 'Help': return [{ label: 'Help Topics', run: onHelp }];
    }
  };
  const openMenu = (name: MenuName) => (event: MouseEvent<HTMLButtonElement>) => {
    if (justClosed.current === name) { justClosed.current = null; return; }
    const rect = event.currentTarget.getBoundingClientRect();
    setMenu({ name, x: rect.left, y: rect.bottom });
  };
  const keys = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'F5') { event.preventDefault(); insert(timeDate(new Date(), clock)); }
    else if (event.key === 'F3') { event.preventDefault(); findNext(); }
  };

  return <div className="notepad" onKeyDown={keys}>
    <div className="xl-menubar" role="menubar" aria-label="Notepad menu">
      {MENUS.map((name) => <button type="button" role="menuitem" key={name} aria-haspopup="menu" aria-expanded={menu?.name === name}
        className={menu?.name === name ? 'open' : undefined} onClick={openMenu(name)}><u>{name[0]}</u>{name.slice(1)}</button>)}
    </div>
    {find.open && <form className="notepad-find field-row" role="search" onSubmit={(event) => { event.preventDefault(); findNext(); }}>
      <label htmlFor="notepad-find">Find what:</label>
      <input ref={findInput} id="notepad-find" type="text" value={find.query}
        onChange={(event) => setFind({ open: true, query: event.target.value, missing: false })}
        onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); setFind((f) => ({ ...f, open: false })); area.current?.focus(); } }} />
      <button type="submit" disabled={!find.query}>Find Next</button>
      <button type="button" onClick={() => { setFind((f) => ({ ...f, open: false })); area.current?.focus(); }}>Cancel</button>
      {find.missing && <span className="notepad-missing" role="status">Cannot find "{find.query}"</span>}
    </form>}
    <textarea ref={area} className={`notepad-text${wrap ? '' : ' nowrap'}`} style={{ fontSize }} aria-label="Notepad text" spellCheck={false}
      wrap={wrap ? 'soft' : 'off'} value={text} onChange={(event) => setText(event.target.value)} />
    {fontDialog && <FontDialog size={fontSize} onCancel={() => { setFontDialog(false); area.current?.focus(); }}
      onApply={(size) => { onFontSize(size); setFontDialog(false); area.current?.focus(); }} />}
    {confirmNew && <div className="notepad-dialog-backdrop">
      <div className="window notepad-dialog" role="alertdialog" aria-labelledby="notepad-confirm-title" aria-describedby="notepad-confirm-text">
        <div className="title-bar"><div className="title-bar-text" id="notepad-confirm-title">Notepad</div></div>
        <div className="window-body">
          <p id="notepad-confirm-text">The text in the {fileName} file has changed.<br /><br />Do you want to save the changes?</p>
          <div className="notepad-dialog-buttons">
            <button type="button" autoFocus onClick={() => { setConfirmNew(false); setSaving({ thenClear: true }); }}>Yes</button>
            <button type="button" onClick={clear}>No</button>
            <button type="button" onClick={() => { setConfirmNew(false); area.current?.focus(); }}>Cancel</button>
          </div>
        </div>
      </div>
    </div>}
    {saving && <SaveAsDialog defaultName={fileName} extension="txt" typeLabel="Text Documents (*.txt)"
      onCancel={() => { setSaving(null); area.current?.focus(); }}
      onSave={(name) => {
        download(name, text.replace(/\n/g, '\r\n'), 'text/plain');
        setFileName(name.slice(0, -'.txt'.length));
        const { thenClear } = saving;
        setSaving(null);
        if (thenClear) clear(); else area.current?.focus();
      }} />}
    {menu && <ContextMenu x={menu.x} y={menu.y} label={`${menu.name} menu`} actions={actions(menu.name)}
      onClose={(restoreFocus) => {
        justClosed.current = restoreFocus ? null : menu.name;
        window.setTimeout(() => { justClosed.current = null; }, 300);
        setMenu(null);
      }} />}
  </div>;
}

/** Edit ▸ Set Font…: Win98's Font box, cut down to a Size list with a sample. */
function FontDialog({ size, onApply, onCancel }: { size: number; onApply: (size: number) => void; onCancel: () => void }) {
  const [chosen, setChosen] = useState(size);
  return <Dialog title="Font" className="notepad-font-dialog" onSubmit={() => onApply(chosen)} onCancel={onCancel}>
    <div className="notepad-font-row">
      <label htmlFor="notepad-font-size">Size:</label>
      <select data-autofocus id="notepad-font-size" size={5} value={chosen} onChange={(event) => setChosen(Number(event.target.value))}>
        {NOTEPAD_FONT_SIZES.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
      <fieldset className="notepad-font-sample"><legend>Sample</legend><span style={{ fontSize: chosen }}>AaBbYyZz</span></fieldset>
    </div>
  </Dialog>;
}
