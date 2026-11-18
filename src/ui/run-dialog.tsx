import { useEffect, useRef, useState, type FormEvent } from 'react';
import { matchingItems, SearchBox, type ListItem } from './listbox';
import { StartIcon } from './start-icons';
import type { Place, Selection } from './panel';

/** What Run can open: a Properties window, a place window, or a year on the timeline. */
export type RunTarget =
  | { kind: 'select'; value: NonNullable<Selection> }
  | { kind: 'place'; value: Place }
  | { kind: 'year'; year: number };

/**
 * Win98's Start ▸ Run…, shown in an ordinary desktop window (`RUN` tool): type a
 * brand, designer, group, city, country or year and press Enter (or OK).
 * Picking a suggestion runs it straight away. The window stays open, keeping
 * the last entry, so several things can be opened in turn; Cancel closes it
 * and Browse… opens the Directory.
 */
export function RunContent({ items, onRun, onBrowse, onClose }: {
  items: readonly ListItem<RunTarget>[];
  onRun: (target: RunTarget) => void; onBrowse: () => void; onClose: () => void;
}) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => { form.current?.querySelector('input')?.focus(); }, []);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const query = value.trim();
    if (!query) return;
    const match = matchingItems(items, query, 1, true)[0];
    if (match) { setError(null); onRun(match.value); }
    else setError(`Cannot find '${query}'. Make sure you typed the name correctly, and then try again.`);
  };

  return <form className="run-form" ref={form} onSubmit={submit}>
    <div className="run-intro"><StartIcon name="run" />
      <p>Type the name of a brand, designer, group, city, country or year, and Designer Map will open it for you.</p>
    </div>
    <SearchBox items={items} value={value} onChange={(next) => { setValue(next); setError(null); }}
      onPick={(item) => { setError(null); onRun(item.value); }} label="Open:" inputId="run-input" placeholder="" limit={8} previewAll={false} exactFirst />
    {error && <p className="run-error" role="alert">{error}</p>}
    <div className="run-buttons">
      <button type="submit" disabled={!value.trim()}>OK</button>
      <button type="button" onClick={onClose}>Cancel</button>
      <button type="button" onClick={onBrowse}>Browse…</button>
    </div>
  </form>;
}
