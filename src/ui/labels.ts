/** Display tags in title case while preserving their stored enum values. */
export const tagLabel = (value: string): string =>
  value.replace(/(^|[\s-])\p{L}/gu, (letter) => letter.toUpperCase());
