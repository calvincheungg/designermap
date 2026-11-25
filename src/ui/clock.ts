/** Settings ▸ Clock: the browser's own format, 12-hour or 24-hour. */
export const CLOCK_FORMATS = [['auto', 'Automatic'], ['12', '12-hour'], ['24', '24-hour']] as const;
export type ClockFormat = typeof CLOCK_FORMATS[number][0];

/** Short time for the taskbar clock and Notepad's Time/Date. */
export const formatTime = (time: Date, format: ClockFormat = 'auto') => time.toLocaleTimeString([], {
  hour: format === '24' ? '2-digit' : 'numeric', minute: '2-digit',
  ...(format === 'auto' ? {} : { hourCycle: format === '24' ? 'h23' as const : 'h12' as const }),
});
