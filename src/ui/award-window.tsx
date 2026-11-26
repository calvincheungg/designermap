import { awardInfo, awardRecipients, formatAwardYear, getDesigner, getHouse, type AwardId } from '../data';
import { useMemo, useState } from 'react';
import { EntityLink, Fields, type Actions } from './panel';

/** An award's window: who received it, when, and for which brand. */
export function AwardWindowContent({ award, onSelect }: { award: AwardId } & Pick<Actions, 'onSelect'>) {
  const info = awardInfo[award];
  const [ascending, setAscending] = useState(false);
  const recipients = useMemo(() => {
    const all = awardRecipients(award); // oldest first, undated last
    if (ascending) return all;
    const dated = all.filter((record) => record.year !== undefined);
    // Newest first; same-year names stay A–Z and undated recipients stay at the end.
    return [...dated.sort((a, b) => b.year! - a.year!), ...all.filter((record) => record.year === undefined)];
  }, [award, ascending]);
  return <>
    <h2>{info.name}</h2>
    <Fields rows={[['Presented by', info.presenter]]} />
    <fieldset><legend>Recipients ({recipients.length})</legend>
      {recipients.length ? <div className="sunken-panel award-recipients"><table className="interactive"><thead><tr>
        <th aria-sort={ascending ? 'ascending' : 'descending'}><button type="button" className="award-sort" onClick={() => setAscending(!ascending)}>Year{ascending ? ' ▲' : ' ▼'}</button></th><th>Designer</th><th>Brand</th></tr></thead><tbody>
        {recipients.map((record, index) => <tr key={index}>
          <td className="nowrap">{formatAwardYear(record)}</td>
          <td><EntityLink kind="designer" id={record.designerId} onSelect={onSelect}>{getDesigner(record.designerId)?.name ?? record.designerId}</EntityLink>
            {record.detail && <span className="hint"> ({record.detail})</span>}</td>
          <td>{record.house && <EntityLink kind="house" id={record.house} onSelect={onSelect}>{getHouse(record.house)?.name ?? record.house}</EntityLink>}</td>
        </tr>)}
      </tbody></table></div> : <p className="hint">No recipients recorded.</p>}
    </fieldset>
  </>;
}
