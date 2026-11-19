import type { ConnectionFilter } from '../graph/graph';
import type { LocationMode } from '../graph/locations';

export type MapTheme = 'day' | 'night';
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

export interface MapSettings {
  mapTheme: MapTheme;
  textSize: TextSize;
  cursorSize: CursorSize;
  locationMode: LocationMode;
  cityView: CityView;
  showLines: boolean;
  showCollaborations: boolean;
  connectionFilter: ConnectionFilter;
}

type Change = { [K in keyof MapSettings]: (value: MapSettings[K]) => void };

function Radios<T extends string>({ name, value, options, onChange }: {
  name: string; value: T; options: readonly (readonly [T, string])[]; onChange: (value: T) => void;
}) {
  return <>{options.map(([option, label]) => <div className="field-row" key={option}>
    <input type="radio" id={`settings-${name}-${option}`} name={`settings-${name}`} checked={value === option} onChange={() => onChange(option)} />
    <label htmlFor={`settings-${name}-${option}`}>{label}</label>
  </div>)}</>;
}

/** Settings tool window: the map's display options, grouped like a Win98 Properties sheet. */
export function SettingsContent({ settings, onChange }: { settings: MapSettings; onChange: Change }) {
  return <div className="settings-window">
    <fieldset>
      <legend>Map colours</legend>
      <div className="settings-theme">
        <div className={`settings-preview ${settings.mapTheme}`} aria-hidden="true"><span /></div>
        <div>
          <Radios name="theme" value={settings.mapTheme} onChange={onChange.mapTheme}
            options={[['day', 'Day'], ['night', 'Night']]} />
        </div>
      </div>
    </fieldset>
    <fieldset>
      <legend>Text size</legend>
      <div className="field-row">
        <label htmlFor="settings-text-size">Font size:</label>
        <select id="settings-text-size" value={settings.textSize} onChange={(event) => onChange.textSize(event.target.value as TextSize)}>
          {TEXT_SIZES.map(([id, label, scale]) => <option key={id} value={id}>{label} ({Math.round(scale * 100)}%)</option>)}
        </select>
      </div>
      <p className="settings-sample">The quick brown fox: AaBbYyZz</p>
    </fieldset>
    <fieldset>
      <legend>Mouse pointer</legend>
      <div className="field-row">
        <label htmlFor="settings-cursor-size">Pointer size:</label>
        <select id="settings-cursor-size" value={settings.cursorSize} onChange={(event) => onChange.cursorSize(event.target.value as CursorSize)}>
          {CURSOR_SIZES.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
        </select>
      </div>
    </fieldset>
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
    <fieldset>
      <legend>Connection lines</legend>
      <div className="field-row">
        <input type="checkbox" id="settings-show-lines" checked={settings.showLines} onChange={(event) => onChange.showLines(event.target.checked)} />
        <label htmlFor="settings-show-lines">Show move lines</label>
      </div>
      <div className="field-row">
        <input type="checkbox" id="settings-show-collaborations" checked={settings.showCollaborations} onChange={(event) => onChange.showCollaborations(event.target.checked)} />
        <label htmlFor="settings-show-collaborations">Show collaboration lines</label>
      </div>
      <hr className="settings-separator" />
      <Radios name="connections" value={settings.connectionFilter} onChange={onChange.connectionFilter}
        options={[['all', 'All connections'], ['designers', 'Designers only'], ['collaborations', 'Collaborations only']]} />
    </fieldset>
  </div>;
}
