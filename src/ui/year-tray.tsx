import { useEffect, useRef, useState } from 'react';

function useTime() {
  const format = () => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const [time, setTime] = useState(format);
  useEffect(() => { const timer = window.setInterval(() => setTime(format()), 10_000); return () => clearInterval(timer); }, []);
  return time;
}

/**
 * The taskbar tray: the clock, which opens the year slider like Win98's
 * Date/Time pop-up. While a year is set, the tray shows it beside the clock.
 */
export function YearTray({ year, minYear, maxYear, playing, onYear, onPlay }: {
  year: number; minYear: number; maxYear: number; playing: boolean;
  onYear: (year: number) => void; onPlay: () => void;
}) {
  const time = useTime();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setOpen(false);
      button.current?.focus();
    };
    document.addEventListener('pointerdown', outside, true);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside, true); document.removeEventListener('keydown', escape); };
  }, [open]);
  const filtered = year < maxYear;

  return <div className="tray" ref={root}>
    <button ref={button} type="button" className="tray-clock" aria-haspopup="dialog" aria-expanded={open}
      aria-label={`${time}. Year: ${filtered ? year : 'all years'}`} title={filtered ? `Showing up to ${year}` : 'Showing all years'}
      onClick={() => setOpen((current) => !current)}>
      {filtered && <span className="tray-year">{year}</span>}<span id="clock">{time}</span>
    </button>
    {open && <div className="window year-popup" role="dialog" aria-label="Year">
      <div className="field-row year-row"><label htmlFor="year">Year:</label>
        <input id="year" type="range" min={minYear} max={maxYear} step={1} value={year} onChange={(event) => onYear(Number(event.target.value))} />
        <output id="year-label" htmlFor="year">{filtered ? year : 'All'}</output>
        <button id="play" type="button" onClick={onPlay}>{playing ? '■ Stop' : '▶ Play'}</button>
      </div>
    </div>}
  </div>;
}
