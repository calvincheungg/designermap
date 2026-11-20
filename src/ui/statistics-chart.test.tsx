// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { collaborations, houses } from '../data';
import { MIN_SHARE_RELEASES, StatisticsContent, chartedReleases, yearShare } from './statistics';

afterEach(() => { cleanup(); localStorage.clear(); });
const chart = () => screen.getByRole('group', { name: /^Collaboration releases per year/ });
const heights = () => [...chart().querySelectorAll<HTMLElement>('.stats-chart-bar')].map((bar) => bar.style.height);

describe('Collaborations by year as a share of each year', () => {
  it('rounds shares to one decimal place', () => {
    expect(yearShare(1, 3)).toBe(33.3);
    expect(yearShare(0, 0)).toBe(0);
    expect(yearShare(5, 5)).toBe(100);
  });

  it('offers Show as only with colours, fills each year in Share of year, and rescales a focused colour', () => {
    localStorage.setItem('designer-map:stats-year-breakdown', 'total');
    const view = render(<StatisticsContent visibleHouses={houses} year={Infinity} filtered={false} onSelect={() => {}} />);
    expect(screen.queryByRole('button', { name: /Show the chart as/ })).toBeNull();
    view.unmount();

    localStorage.setItem('designer-map:stats-year-breakdown', 'partners');
    localStorage.setItem('designer-map:stats-year-scale', 'share');
    render(<StatisticsContent visibleHouses={houses} year={Infinity} filtered={false} onSelect={() => {}} />);
    expect(chart().getAttribute('aria-label')).toContain('as a share of each year');
    expect(chart().querySelector('.stats-chart-scale')!.textContent).toBe('100%0%');
    // Years with too few releases are left out, so the axis runs from the first to the last busy year.
    const perYear = new Map<number, number>();
    for (const release of collaborations) perYear.set(release.year, (perYear.get(release.year) ?? 0) + 1);
    const busy = [...perYear].filter(([, n]) => n >= MIN_SHARE_RELEASES).map(([year]) => year);
    expect(chart().getAttribute('aria-label')).toContain(`${Math.min(...busy)}–${Math.max(...busy)}`);
    const quiet = [...perYear].find(([year, n]) => n < MIN_SHARE_RELEASES && year > Math.min(...busy) && year < Math.max(...busy));
    if (quiet) expect(screen.getByRole('button', { name: `${quiet[0]}: ${quiet[1]} release${quiet[1] === 1 ? '' : 's'}, too few to show as a share` })).toBeTruthy();
    // Every year with releases fills the plot; empty years stay empty.
    expect(heights().every((height) => height === '100%' || height === '0%')).toBe(true);
    expect(heights()).toContain('100%');
    // Focusing one colour shows its share of each year, scaled to its peak share.
    const legend = within(screen.getByRole('list', { name: 'Chart colours' }));
    fireEvent.click(legend.getAllByRole('button')[0]!);
    const peak = chart().querySelector('.stats-chart-scale span')!.textContent!;
    expect(peak).toMatch(/^\d+%$/);
    // The peak share reaches the top (within the axis's rounding up to a whole percent).
    expect(Math.max(...heights().map(parseFloat))).toBeGreaterThan(95);
    expect(heights().some((height) => height !== '100%' && height !== '0%')).toBe(true);
  });
});

describe('Collaborations by year as lines', () => {
  const lines = () => chart().querySelector('svg.stats-chart-lines');
  const colours = () => [...lines()!.querySelectorAll('g')].map((group) => group.getAttribute('stroke'));

  it('draws one line per colour instead of bars, in counts or shares, and one line for a focused colour', () => {
    localStorage.setItem('designer-map:stats-year-style', 'lines');
    localStorage.setItem('designer-map:stats-year-breakdown', 'partners');
    render(<StatisticsContent visibleHouses={houses} year={Infinity} filtered={false} onSelect={() => {}} />);
    expect(chart().querySelector('.stats-chart-bar')).toBeNull();
    const legend = within(screen.getByRole('list', { name: 'Chart colours' }));
    expect(colours()).toHaveLength(legend.getAllByRole('button').length);
    expect(lines()!.querySelectorAll('polyline').length).toBeGreaterThan(0);
    fireEvent.click(legend.getAllByRole('button')[0]!);
    expect(colours()).toHaveLength(1);
  });

  it('breaks a share line at years left out for having too few releases', () => {
    localStorage.setItem('designer-map:stats-year-style', 'lines');
    localStorage.setItem('designer-map:stats-year-breakdown', 'partners');
    localStorage.setItem('designer-map:stats-year-scale', 'share');
    render(<StatisticsContent visibleHouses={houses} year={Infinity} filtered={false} onSelect={() => {}} />);
    expect(chart().querySelector('.stats-chart-scale span')!.textContent).toMatch(/%$/);
    // Every point sits inside the plot (0–100 from the top).
    const ys = [...lines()!.querySelectorAll('.stats-chart-marker')].map((marker) => Number(marker.getAttribute('d')!.split(',')[1]!.replace('h0', '')));
    expect(ys.length).toBeGreaterThan(0);
    expect(ys.every((y) => y >= 0 && y <= 100)).toBe(true);
  });
});

describe('Collaborations by year leaves out future years', () => {
  it('charts nothing dated after the current year and notes how many releases wait', () => {
    const releases = [{ id: 'a', houses: ['dior', 'nike'], year: 2026 }, { id: 'b', houses: ['dior', 'nike'], year: 2027 }] as never[];
    expect(chartedReleases(releases, 2026).map((release: { id: string }) => release.id)).toEqual(['a']);
    localStorage.setItem('designer-map:stats-year-breakdown', 'total');
    render(<StatisticsContent visibleHouses={houses} year={Infinity} filtered={false} onSelect={() => {}} />);
    const thisYear = new Date().getFullYear();
    const last = Number(chart().getAttribute('aria-label')!.match(/–(\d{4})/)![1]);
    expect(last).toBeLessThanOrEqual(thisYear);
    const upcoming = collaborations.filter((release) => release.year > thisYear).length;
    if (upcoming) expect(screen.getByText(new RegExp(`dated after ${thisYear}`)).textContent).toContain(String(upcoming));
  });
});
