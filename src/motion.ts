/** Whether the interface animates: as the system asks, or always / never (Settings ▸ Animations). */
export const MOTION_PREFERENCES = ['system', 'on', 'off'] as const;
export type MotionPreference = typeof MOTION_PREFERENCES[number];
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

let preference: MotionPreference = 'system';
export const setMotionPreference = (next: MotionPreference) => { preference = next; };
export const reducedMotion = () => preference === 'system' ? !!globalThis.matchMedia?.(REDUCED_MOTION_QUERY).matches : preference === 'off';
