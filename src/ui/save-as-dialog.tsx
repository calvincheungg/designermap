import { Dialog } from './dialog';
import { useEffect, useId, useRef, useState } from 'react';

/** Characters Windows doesn't allow in a file name. */
const INVALID = /[\\/:*?"<>|]/g;

/** The name the user typed, made safe, without the (locked) extension if they typed it too. */
export function cleanFileName(name: string, extension: string) {
  const trimmed = name.replace(INVALID, '').trim();
  const suffix = `.${extension}`.toLowerCase();
  return (trimmed.toLowerCase().endsWith(suffix) ? trimmed.slice(0, -suffix.length) : trimmed).trim();
}

/**
 * Win98's Save As box: edit the file name; the extension and file type are
 * fixed. Save (or Enter) calls `onSave` with the full name, Cancel or Escape
 * closes it. Laid over its window, like the Spreadsheet dialogs.
 */
export function SaveAsDialog({ defaultName, extension, typeLabel, onSave, onCancel }: {
  defaultName: string; extension: string;
  /** "Save as type", e.g. "Text Documents (*.txt)". */
  typeLabel: string;
  onSave: (fileName: string) => void; onCancel: () => void;
}) {
  const id = useId();
  const [name, setName] = useState(defaultName);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { input.current?.focus(); input.current?.select(); }, []);
  const clean = cleanFileName(name, extension);
  return <Dialog title="Save As" className="save-as-dialog" submitLabel="Save" disabled={!clean} onSubmit={() => onSave(`${clean}.${extension}`)} onCancel={onCancel}>
    <div className="field-row save-as-row">
      <label htmlFor={`${id}-name`}>File name:</label>
      <span className="save-as-name">
        <input ref={input} id={`${id}-name`} type="text" value={name} onChange={(event) => setName(event.target.value)} spellCheck={false} />
        <span className="save-as-extension" aria-label="Extension">.{extension}</span>
      </span>
    </div>
    <div className="field-row save-as-row">
      <label htmlFor={`${id}-type`}>Save as type:</label>
      <select id={`${id}-type`} disabled value="type"><option value="type">{typeLabel}</option></select>
    </div>
  </Dialog>;
}
