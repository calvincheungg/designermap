import { useState } from 'react';
import type { ConnectionFilter } from '../graph/graph';
import type { LocationMode } from '../graph/locations';
import type { MotionPreference } from '../motion';
import { CLOCK_FORMATS, formatTime, type ClockFormat } from './clock';
import { Dialog } from './dialog';
import type { FolderViewPreference } from './folder-view';
import type { Startup } from './session';
import { Tabs } from './tabs';

/** `auto` follows the system's light or dark theme. */
export type MapTheme = 'day' | 'night' | 'auto';
/** Desktop wallpapers: fabric patterns drawn in CSS over the desktop colour (styles/tools.css). */
export const WALLPAPERS = [['none', '(None)'], ['pinstripe', 'Pinstripe'], ['gingham', 'Gingham'], ['houndstooth', 'Houndstooth'], ['tartan', 'Tartan'], ['argyle', 'Argyle'], ['dots', 'Polka dots']] as const;
export type Wallpaper = typeof WALLPAPERS[number][0];
export const DESKTOP_COLORS = [['teal', 'Teal'], ['navy', 'Navy'], ['maroon', 'Maroon'], ['green', 'Green'], ['purple', 'Purple'], ['gray', 'Gray'], ['black', 'Black']] as const;
export type DesktopColor = typeof DESKTOP_COLORS[number][0];
export type CityView = 'window' | 'map';
/** Win98 Display Properties-style font sizes, as multipliers of the normal 11–14px text. */
export const TEXT_SIZES = [['normal', 'Normal', 1], ['large', 'Large', 1.25], ['extra-large', 'Extra large', 1.5]] as const;
export type TextSize = typeof TEXT_SIZES[number][0];
export const textScale = (size: TextSize) => TEXT_SIZES.find(([id]) => id === size)![2];
export const isTextSize = (value: unknown): value is TextSize => TEXT_SIZES.some(([id]) => id === value);
/** Mouse pointer sizes: the Win98 cursors drawn at 1x, 2x or 3x (style.css `data-cursor-size`). */
export const CURSOR_SIZES = [['normal', 'Normal'], ['large', 'Large (2x)'], ['extra-large', 'Extra large (3x)']] as const;
export type CursorSize = typeof CURSOR_SIZES[number][0];
export const isCursorSize = (value: unknown): value is CursorSize => CURSOR_SIZES.some(([id]) => id === value);

/** The note, remembered in this browser only (a per-viewer scratch pad). */
export const NOTEPAD_KEY = 'designer-map:notepad';
/** Notepad's font sizes in px (its Set Font… list and Settings ▸ Notepad); 16 by default. */
export const NOTEPAD_FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32] as const;
export const DEFAULT_NOTEPAD_FONT_SIZE = 16;
export const isNotepadFontSize = (value: unknown): value is number => NOTEPAD_FONT_SIZES.some((size) => size === value);

export interface MapSettings {
  mapTheme: MapTheme;
  textSize: TextSize;
  cursorSize: CursorSize;
  locationMode: LocationMode;
  cityView: CityView;
  showLines: boolean;
  showCollaborations: boolean;
  connectionFilter: ConnectionFilter;
  notepadFontSize: number;
  showPulses: boolean;
  motion: MotionPreference;
  wallpaper: Wallpaper;
  desktopColor: DesktopColor;
  clock: ClockFormat;
  folderView: FolderViewPreference;
  startup: Startup;
}
export const DEFAULT_SETTINGS: MapSettings = {
  mapTheme: 'day', textSize: 'normal', cursorSize: 'normal', locationMode: 'current', cityView: 'window', showLines: true, showCollaborations: true,
  connectionFilter: 'all', notepadFontSize: DEFAULT_NOTEPAD_FONT_SIZE, showPulses: true, motion: 'system', wallpaper: 'none', desktopColor: 'teal',
  clock: 'auto', folderView: 'last', startup: 'fresh',
};

export type SettingsChange = { [K in keyof MapSettings]: (value: MapSettings[K]) => void };

function Radios<T extends string>({ name, value, options, onChange }: {
  name: string; value: T; options: readonly (readonly [T, string])[]; onChange: (value: T) => void;
}) {
  return <>{options.map(([option, label]) => <div className="field-row" key={option}>
    <input type="radio" id={`settings-${name}-${option}`} name={`settings-${name}`} checked={value === option} onChange={() => onChange(option)} />
    <label htmlFor={`settings-${name}-${option}`}>{label}</label>
  </div>)}</>;
}

function Choice<T extends string>({ id, label, value, options, onChange }: {
  id: string; label: string; value: T; options: readonly (readonly [T, string])[]; onChange: (value: T) => void;
}) {
  return <div className="field-row">
    <label htmlFor={`settings-${id}`}>{label}</label>
    <select id={`settings-${id}`} value={value} onChange={(event) => onChange(event.target.value as T)}>
      {options.map(([option, text]) => <option key={option} value={option}>{text}</option>)}
    </select>
  </div>;
}

function Check({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: (on: boolean) => void }) {
  return <div className="field-row">
    <input type="checkbox" id={`settings-${id}`} checked={checked} onChange={(event) => onChange(event.target.checked)} />
    <label htmlFor={`settings-${id}`}>{label}</label>
  </div>;
}

const TABS = [['map', 'Map'], ['connections', 'Connections'], ['appearance', 'Appearance'], ['accessibility', 'Accessibility'], ['general', 'General']] as const;
const TAB_KEY = 'designer-map:settings-tab';
const CONFIRM = {
  reset: ['Restore Defaults', 'Set everything in Settings back to its default? Your note, documents and window positions are kept.'],
  note: ['Clear Notepad', 'Erase the text in Notepad? This cannot be undone.'],
} as const;

/** Settings tool window: display options in tabs, applied as they change, like a Win98 Properties sheet. */
export function SettingsContent({ settings, onChange, onClearRecent, onResetPositions, onClearNote }: {
  settings: MapSettings; onChange: SettingsChange;
  /** Saved data: Start ▸ Documents, where windows and icons sit, and Notepad's text. */
  onClearRecent: () => void; onResetPositions: () => void; onClearNote: () => void;
}) {
  const [confirm, setConfirm] = useState<keyof typeof CONFIRM | null>(null);
  const [done, setDone] = useState('');
  const reset = () => {
    const set = <K extends keyof MapSettings>(key: K) => onChange[key](DEFAULT_SETTINGS[key]);
    for (const key of Object.keys(DEFAULT_SETTINGS) as (keyof MapSettings)[]) if (settings[key] !== DEFAULT_SETTINGS[key]) set(key);
    setDone('Defaults restored');
  };
  const panels = {
    map: () => <>
      <fieldset>
        <legend>Show brands at</legend>
        <Radios name="location" value={settings.locationMode} onChange={onChange.locationMode}
          options={[['current', 'Current base'], ['origin', 'Origin']]} />
      </fieldset>
      <fieldset>
        <legend>Clicking a city pin opens it</legend>
        <Radios name="city-view" value={settings.cityView} onChange={onChange.cityView}
          options={[['window', 'In windows'], ['map', 'On map']]} />
      </fieldset>
    </>,
    connections: () => <>
      <fieldset>
        <legend>Connection lines</legend>
        <Check id="show-lines" label="Show move lines" checked={settings.showLines} onChange={onChange.showLines} />
        <Check id="show-collaborations" label="Show collaboration lines" checked={settings.showCollaborations} onChange={onChange.showCollaborations} />
        <hr className="settings-separator" />
        <Radios name="connections" value={settings.connectionFilter} onChange={onChange.connectionFilter}
          options={[['all', 'All connections'], ['designers', 'Designers only'], ['collaborations', 'Collaborations only']]} />
      </fieldset>
      <fieldset>
        <legend>Pulses</legend>
        <Check id="show-pulses" label="Show moving blocks along lines" checked={settings.showPulses} onChange={onChange.showPulses} />
        <p className="hint">Blocks also stop when animations are off (Accessibility).</p>
      </fieldset>
    </>,
    appearance: () => <>
      <fieldset>
        <legend>Map colours</legend>
        <div className="settings-theme">
          <div className={`settings-preview ${settings.mapTheme}`} aria-hidden="true"><span /></div>
          <div>
            <Radios name="theme" value={settings.mapTheme} onChange={onChange.mapTheme}
              options={[['day', 'Day'], ['night', 'Night'], ['auto', 'Automatic (follow system)']]} />
          </div>
        </div>
      </fieldset>
      <fieldset>
        <legend>Desktop</legend>
        <Choice id="wallpaper" label="Wallpaper:" value={settings.wallpaper} options={WALLPAPERS} onChange={onChange.wallpaper} />
        <Choice id="desktop-color" label="Colour:" value={settings.desktopColor} options={DESKTOP_COLORS} onChange={onChange.desktopColor} />
        <div className="settings-wallpaper" data-wallpaper={settings.wallpaper} aria-hidden="true" />
      </fieldset>
    </>,
    accessibility: () => <>
      <fieldset>
        <legend>Text size</legend>
        <Choice id="text-size" label="Font size:" value={settings.textSize} onChange={onChange.textSize}
          options={TEXT_SIZES.map(([id, label, scale]) => [id, `${label} (${Math.round(scale * 100)}%)`] as const)} />
        <p className="settings-sample">The quick brown fox: AaBbYyZz</p>
      </fieldset>
      <fieldset>
        <legend>Mouse pointer</legend>
        <Choice id="cursor-size" label="Pointer size:" value={settings.cursorSize} options={CURSOR_SIZES} onChange={onChange.cursorSize} />
      </fieldset>
      <fieldset>
        <legend>Animations</legend>
        <Radios name="motion" value={settings.motion} onChange={onChange.motion}
          options={[['system', 'Same as system'], ['on', 'Always on'], ['off', 'Always off']]} />
      </fieldset>
    </>,
    general: () => <>
      <fieldset>
        <legend>When I come back</legend>
        <Radios name="startup" value={settings.startup} onChange={onChange.startup}
          options={[['fresh', 'Start fresh'], ['restore', 'Open where I left off']]} />
      </fieldset>
      <fieldset>
        <legend>Windows</legend>
        <Choice id="folder-view" label="Open folders as:" value={settings.folderView} onChange={onChange.folderView}
          options={[['last', 'Last used'], ['icons', 'Large Icons'], ['details', 'Details']]} />
        <div className="field-row">
          <label htmlFor="settings-notepad-size">Notepad font size:</label>
          <select id="settings-notepad-size" value={settings.notepadFontSize} onChange={(event) => onChange.notepadFontSize(Number(event.target.value))}>
            {NOTEPAD_FONT_SIZES.map((size) => <option key={size} value={size}>{size}{size === DEFAULT_NOTEPAD_FONT_SIZE ? ' (default)' : ''}</option>)}
          </select>
        </div>
        <p className="settings-sample notepad-sample" style={{ fontSize: settings.notepadFontSize }}>AaBbYyZz 123</p>
      </fieldset>
      <fieldset>
        <legend>Clock</legend>
        <Choice id="clock" label="Time format:" value={settings.clock} onChange={onChange.clock}
          options={CLOCK_FORMATS.map(([id, label]) => [id, `${label} (${formatTime(new Date(2000, 0, 1, 15, 5), id)})`] as const)} />
      </fieldset>
      <fieldset>
        <legend>Saved data</legend>
        <div className="settings-data">
          <button type="button" onClick={() => { onClearRecent(); setDone('Documents cleared'); }}>Clear Documents</button>
          <button type="button" onClick={() => { onResetPositions(); setDone('Positions reset'); }}>Reset Window and Icon Positions</button>
          <button type="button" onClick={() => setConfirm('note')}>Clear Notepad…</button>
        </div>
      </fieldset>
    </>,
  };
  return <div className="settings-window">
    <Tabs label="Settings" tabs={TABS} storageKey={TAB_KEY} panels={panels} />
    <div className="settings-footer">
      <span role="status">{done}</span>
      <button type="button" onClick={() => setConfirm('reset')}>Restore Defaults…</button>
    </div>
    {confirm && <Dialog title={CONFIRM[confirm][0]} submitLabel={confirm === 'reset' ? 'Restore' : 'Clear'} onCancel={() => setConfirm(null)} onSubmit={() => {
      if (confirm === 'reset') reset(); else { onClearNote(); setDone('Notepad cleared'); }
      setConfirm(null);
    }}><p>{CONFIRM[confirm][1]}</p></Dialog>}
  </div>;
}
