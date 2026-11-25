import type { HouseFilters } from '../data/tags';
import type { ConnectionFilter } from '../graph/graph';
import { HELP_ICON, LIST_VIEW_ICON, NOTEPAD_ICON, SETTINGS_ICON } from './desk-windows';
import { HELP, LIST_VIEW, MY_COMPUTER, NOTEPAD, RUN, SETTINGS, STATISTICS, tool, type Item } from './desktop';
import { FilterMenu } from './filters';
import { recentLabel, type RecentItem } from './recent';
import { StartIcon } from './start-icons';
import type { useSettings } from './use-settings';
import { MY_COMPUTER_ICON } from './window-icons';

/** Start menu's What's Missing report: a research aid, so development builds only. */
const SHOW_MISSING_REPORT = import.meta.env.DEV;
const RECENT_HINTS = { house: 'brand', designer: 'designer', group: 'group', city: 'city', country: 'country' } as const;

/** The Start menu's commands. */
export function StartMenuItems({ close, settings: { showLines, setShowLines, showCollaborations, setShowCollaborations }, recent, canOpen, onOpenRecent, onClearRecent,
  connectionFilter, onConnectionFilter, filters, onFilters, allExpanded, onToggleExpanded, onOpen, onReset }: {
  close: () => void; settings: ReturnType<typeof useSettings>;
  /** Start ▸ Documents; `canOpen` is false for items the year or filters hide. */
  recent: readonly RecentItem[]; canOpen: (item: RecentItem) => boolean; onOpenRecent: (item: RecentItem) => void; onClearRecent: () => void;
  connectionFilter: ConnectionFilter; onConnectionFilter: (filter: ConnectionFilter) => void;
  filters: HouseFilters; onFilters: (filters: HouseFilters) => void;
  allExpanded: boolean; onToggleExpanded: () => void;
  onOpen: (item: Item) => void; onReset: () => void;
}) {
  return <>
    <div className="start-item start-parent" tabIndex={0} aria-haspopup="true">
      <StartIcon name="documents" /><span className="start-label">Documents</span><span className="start-arrow" aria-hidden="true" />
      <div className="window start-submenu documents-submenu" role="group" aria-label="Documents">
        {recent.length ? recent.map((item) => <button type="button" className="start-subitem start-subcommand" key={`${item.kind}:${item.id}`}
          disabled={!canOpen(item)} title={canOpen(item) ? undefined : 'Hidden by the year or brand filters'}
          onClick={() => { close(); onOpenRecent(item); }}>
          <span className="start-label">{recentLabel(item)}</span><span className="recent-kind">{RECENT_HINTS[item.kind]}</span>
        </button>) : <button type="button" className="start-subitem start-subcommand" disabled>(Empty)</button>}
        {recent.length > 0 && <><hr className="start-separator" />
          <button type="button" className="start-subitem start-subcommand" onClick={onClearRecent}>Clear Documents</button></>}
      </div>
    </div>
    <hr className="start-separator" />
    <div className="start-item start-parent" tabIndex={0} aria-haspopup="true">
      <StartIcon name="lines" /><span className="start-label">Connection lines</span><span className="start-arrow" aria-hidden="true" />
      <fieldset className="window start-submenu">
        <legend className="visually-hidden">Connection lines</legend>
        <div className="field-row start-subitem"><input type="checkbox" id="show-lines" checked={showLines} onChange={(event) => setShowLines(event.target.checked)} /><label htmlFor="show-lines">Show move lines</label></div>
        <div className="field-row start-subitem"><input type="checkbox" id="show-collaborations" checked={showCollaborations} onChange={(event) => setShowCollaborations(event.target.checked)} /><label htmlFor="show-collaborations">Show collaboration lines</label></div>
        <hr className="start-separator" />
        <div role="radiogroup" aria-label="Connection filter">
          {([['all', 'All connections'], ['designers', 'Designers only'], ['collaborations', 'Collaborations only']] as const).map(([filter, label]) => <div className="field-row start-subitem" key={filter}>
            <input type="radio" id={`connections-${filter}`} name="connection-filter" checked={connectionFilter === filter} onChange={() => onConnectionFilter(filter)} />
            <label htmlFor={`connections-${filter}`}>{label}</label>
          </div>)}
        </div>
      </fieldset>
    </div>
    <FilterMenu value={filters} onChange={onFilters} />
    <hr className="start-separator" />
    <button className="start-item start-command" id="expand-all" aria-pressed={allExpanded} onClick={() => { close(); onToggleExpanded(); }}><StartIcon name={allExpanded ? 'collapse' : 'expand'} /><span className="start-label">{allExpanded ? 'Collapse all' : 'Expand all'}</span></button>
    <hr className="start-separator" />
    <button className="start-item start-command" id="statistics" onClick={() => { close(); onOpen(STATISTICS); }}><StartIcon name="chart" /><span className="start-label">Statistics</span></button>
    <button className="start-item start-command" id="list-view" onClick={() => { close(); onOpen(LIST_VIEW); }}><img className="start-icon xl-icon" src={LIST_VIEW_ICON} alt="" width={32} height={32} /><span className="start-label">Spreadsheet</span></button>
    {SHOW_MISSING_REPORT && <button className="start-item start-command" id="missing-report" onClick={() => { close(); onOpen(tool('missing')); }}><StartIcon name="folder" /><span className="start-label">What's Missing</span></button>}
    <button className="start-item start-command" id="notepad" onClick={() => { close(); onOpen(NOTEPAD); }}><img className="start-icon" src={NOTEPAD_ICON} alt="" width={32} height={32} /><span className="start-label">Notepad</span></button>
    <button className="start-item start-command" id="my-computer" onClick={() => { close(); onOpen(MY_COMPUTER); }}><img className="start-icon smooth-icon" src={MY_COMPUTER_ICON} alt="" width={32} height={32} /><span className="start-label">My Computer</span></button>
    <hr className="start-separator" />
    <button className="start-item start-command" id="settings" onClick={() => { close(); onOpen(SETTINGS); }}><img className="start-icon" src={SETTINGS_ICON} alt="" width={32} height={32} /><span className="start-label">Settings</span></button>
    <button className="start-item start-command" id="help" onClick={() => { close(); onOpen(HELP); }}><img className="start-icon" src={HELP_ICON} alt="" width={32} height={32} /><span className="start-label">Help</span></button>
    <button className="start-item start-command" id="run" onClick={() => { close(); onOpen(RUN); }}><StartIcon name="run" /><span className="start-label">Run…</span></button>
    <hr className="start-separator" />
    <button className="start-item start-command" id="reset-view" onClick={() => { close(); onReset(); }}><StartIcon name="reset" /><span className="start-label">Reset View</span></button>
  </>;
}
