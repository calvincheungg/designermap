import { cellText, columnLetter, formatPainter, type CellFormat, type CellLink, type Sheet, type SheetRow } from './list-view-data';

/**
 * File ▸ Save As Excel Workbook: a small .xlsx writer (an Open XML zip), with the
 * listed rows, column order and widths, frozen panes, AutoFilter, links, outline
 * levels, tab colours and conditional formatting. No React.
 */
export interface XlsxSheet {
  sheet: Sheet;
  rows: readonly { row: SheetRow; hidden?: boolean }[];
  /** Shown columns, in order, and their pixel widths. */
  columns: readonly number[]; widths: readonly number[];
  freeze: { rows: number; cols: number };
  formats: Partial<Record<string, CellFormat>>;
  tabColor?: string; greyEnded: boolean; gridlines: boolean;
  /** Subtotals are on: rows carry outline levels, and AutoFilter is left off. */
  outline: boolean;
  /** A cell link's address, if it has one outside the map. */
  href: (link: CellLink) => string | undefined;
}

// eslint-disable-next-line no-control-regex
const escape = (text: string) => text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f￾￿]/g, '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const argb = (color: string) => `FF${color.replace('#', '').toUpperCase()}`;
/** Excel's limit on links in one sheet. */
const MAX_LINKS = 65000;
const HEAD = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
const MAIN = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
const REL = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const PACKAGE_REL = 'http://schemas.openxmlformats.org/package/2006/relationships';

/** The cell styles the workbook uses, numbered as they first appear: font (0 plain, 1 bold, 2 link) and fill. */
function styleBook() {
  const fills: string[] = [], styles = new Map<string, number>([['0|', 0]]);
  const style = (font: 0 | 1 | 2, fill = '') => {
    if (fill && !fills.includes(fill)) fills.push(fill);
    const key = `${font}|${fill}`;
    return styles.get(key) ?? styles.set(key, styles.size).get(key)!;
  };
  const xml = () => `${HEAD}<styleSheet xmlns="${MAIN}"><fonts count="3"><font><sz val="10"/><name val="Arial"/></font><font><b/><sz val="10"/><name val="Arial"/></font><font><u/><sz val="10"/><color rgb="FF0000FF"/><name val="Arial"/></font></fonts>`
    + `<fills count="${fills.length + 2}"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>${fills.map((fill) => `<fill><patternFill patternType="solid"><fgColor rgb="${argb(fill)}"/><bgColor indexed="64"/></patternFill></fill>`).join('')}</fills>`
    + '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
    + `<cellXfs count="${styles.size}">${[...styles.keys()].map((key) => {
      const [font, fill] = key.split('|') as [string, string];
      return `<xf numFmtId="0" fontId="${font}" fillId="${fill ? fills.indexOf(fill) + 2 : 0}" borderId="0" xfId="0" applyFont="1" applyFill="1"/>`;
    }).join('')}</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;
  return { style, xml };
}

function sheetXml(data: XlsxSheet, style: ReturnType<typeof styleBook>['style'], first: boolean) {
  const { sheet, columns } = data;
  const links: string[] = [], targets: string[] = [];
  const painters = columns.map((col) => { const format = data.formats[sheet.columns[col]!.id]; return format && formatPainter(sheet, col, format); });
  const last = `${columnLetter(columns.length - 1)}${data.rows.length + 1}`;
  const text = (ref: string, value: string, s: number) => `<c r="${ref}" t="inlineStr"${s ? ` s="${s}"` : ''}><is><t xml:space="preserve">${escape(value)}</t></is></c>`;
  const body = data.rows.map(({ row, hidden }, i) => {
    const r = i + 2;
    const cells = columns.map((col, p) => {
      const ref = `${columnLetter(p)}${r}`, value = cellText(row, col);
      const only = row.cells[col]!.length === 1 ? row.links[col]?.[0] : undefined;
      const url = only && links.length < MAX_LINKS ? data.href(only) : undefined;
      if (url) { targets.push(url); links.push(`<hyperlink ref="${ref}" r:id="rId${targets.length}"/>`); }
      const fill = (row.subtotal ? undefined : painters[p]?.(row)?.fill) ?? (row.ended && data.greyEnded ? '#c0c0c0' : undefined);
      const s = style(row.subtotal ? 1 : url ? 2 : 0, fill);
      if (!value) return s ? `<c r="${ref}" s="${s}"/>` : '';
      const numeric = (row.subtotal || sheet.columns[col]!.numeric) && row.cells[col]!.length === 1 && /^-?\d+(\.\d+)?$/.test(value);
      return numeric ? `<c r="${ref}"${s ? ` s="${s}"` : ''}><v>${value}</v></c>` : text(ref, value, s);
    }).join('');
    const level = data.outline ? row.subtotal ? row.subtotal.grand ? 0 : 1 : 2 : 0;
    return `<row r="${r}"${level ? ` outlineLevel="${level}"` : ''}${hidden ? ' hidden="1"' : ''}>${cells}</row>`;
  }).join('');
  const x = Math.min(data.freeze.cols, columns.length), y = data.freeze.rows + 1;
  const pane = `<pane${x ? ` xSplit="${x}"` : ''} ySplit="${y}" topLeftCell="${columnLetter(x)}${y + 1}" activePane="${x ? 'bottomRight' : 'bottomLeft'}" state="frozen"/>`;
  // Data bars and colour scales stay live in Excel; the other formats are plain fills above.
  const rules = columns.flatMap((col, p) => {
    const format = data.formats[sheet.columns[col]!.id];
    if (!data.rows.length || (format?.kind !== 'bars' && format?.kind !== 'scale')) return [];
    const ref = `${columnLetter(p)}2:${columnLetter(p)}${data.rows.length + 1}`;
    const rule = format.kind === 'bars'
      ? `<cfRule type="dataBar" priority="${p + 1}"><dataBar><cfvo type="min"/><cfvo type="max"/><color rgb="${argb(format.color)}"/></dataBar></cfRule>`
      : `<cfRule type="colorScale" priority="${p + 1}"><colorScale><cfvo type="min"/><cfvo type="percentile" val="50"/><cfvo type="max"/><color rgb="FFF8696B"/><color rgb="FFFFEB84"/><color rgb="FF63BE7B"/></colorScale></cfRule>`;
    return [`<conditionalFormatting sqref="${ref}">${rule}</conditionalFormatting>`];
  }).join('');
  const xml = `${HEAD}<worksheet xmlns="${MAIN}" xmlns:r="${REL}"><sheetPr>${data.tabColor ? `<tabColor rgb="${argb(data.tabColor)}"/>` : ''}</sheetPr><dimension ref="A1:${last}"/>`
    + `<sheetViews><sheetView${data.gridlines ? '' : ' showGridLines="0"'}${first ? ' tabSelected="1"' : ''} workbookViewId="0">${pane}</sheetView></sheetViews><sheetFormatPr defaultRowHeight="12.75"${data.outline ? ' outlineLevelRow="2"' : ''}/>`
    + `<cols>${columns.map((_, p) => `<col min="${p + 1}" max="${p + 1}" width="${(Math.min(1700, data.widths[p]!) / 7).toFixed(2)}" customWidth="1"/>`).join('')}</cols>`
    + `<sheetData><row r="1">${columns.map((col, p) => text(`${columnLetter(p)}1`, sheet.columns[col]!.label, style(1))).join('')}</row>${body}</sheetData>`
    + (data.outline ? '' : `<autoFilter ref="A1:${last}"/>`) + rules + (links.length ? `<hyperlinks>${links.join('')}</hyperlinks>` : '') + '</worksheet>';
  const rels = links.length ? `${HEAD}<Relationships xmlns="${PACKAGE_REL}">${targets.map((target, i) => `<Relationship Id="rId${i + 1}" Type="${REL}/hyperlink" Target="${escape(target)}" TargetMode="External"/>`).join('')}</Relationships>` : undefined;
  return { xml, rels };
}

/** The workbook's files, by path in the zip. */
export function xlsxFiles(sheets: readonly XlsxSheet[]): Map<string, string> {
  const files = new Map<string, string>();
  const { style, xml: stylesXml } = styleBook();
  const name = (data: XlsxSheet) => escape(data.sheet.name);
  files.set('[Content_Types].xml', `${HEAD}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${sheets.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}</Types>`);
  files.set('_rels/.rels', `${HEAD}<Relationships xmlns="${PACKAGE_REL}"><Relationship Id="rId1" Type="${REL}/officeDocument" Target="xl/workbook.xml"/></Relationships>`);
  const filters = sheets.flatMap((data, i) => data.outline ? [] : [`<definedName name="_xlnm._FilterDatabase" localSheetId="${i}" hidden="1">'${name(data)}'!$A$1:$${columnLetter(data.columns.length - 1)}$${data.rows.length + 1}</definedName>`]);
  files.set('xl/workbook.xml', `${HEAD}<workbook xmlns="${MAIN}" xmlns:r="${REL}"><sheets>${sheets.map((data, i) => `<sheet name="${name(data)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')}</sheets>${filters.length ? `<definedNames>${filters.join('')}</definedNames>` : ''}</workbook>`);
  files.set('xl/_rels/workbook.xml.rels', `${HEAD}<Relationships xmlns="${PACKAGE_REL}">${sheets.map((_, i) => `<Relationship Id="rId${i + 1}" Type="${REL}/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('')}<Relationship Id="rId${sheets.length + 1}" Type="${REL}/styles" Target="styles.xml"/></Relationships>`);
  sheets.forEach((data, i) => {
    const { xml, rels } = sheetXml(data, style, i === 0);
    files.set(`xl/worksheets/sheet${i + 1}.xml`, xml);
    if (rels) files.set(`xl/worksheets/_rels/sheet${i + 1}.xml.rels`, rels);
  });
  files.set('xl/styles.xml', stylesXml());
  return files;
}

/* ---------- zip ---------- */
const CRC = Uint32Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
export function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = CRC[(crc ^ byte) & 255]! ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
async function deflate(bytes: Uint8Array<ArrayBuffer>): Promise<Uint8Array<ArrayBuffer> | undefined> {
  if (typeof CompressionStream === 'undefined' || typeof Response === 'undefined') return undefined;
  try {
    const stream = new Response(bytes).body!.pipeThrough(new CompressionStream('deflate-raw'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  } catch { return undefined; } // older browsers: store uncompressed
}
/** Pack files into a zip, deflated where the browser can. */
export async function zip(files: ReadonlyMap<string, string>): Promise<Uint8Array<ArrayBuffer>> {
  const encoder = new TextEncoder();
  const parts: Uint8Array<ArrayBuffer>[] = [], directory: Uint8Array<ArrayBuffer>[] = [];
  let offset = 0;
  for (const [path, text] of files) {
    const name = encoder.encode(path), raw = encoder.encode(text), packed = await deflate(raw), data = packed ?? raw;
    const header = (central: boolean) => {
      const head = new DataView(new ArrayBuffer(central ? 46 : 30));
      let at = 0;
      const u16 = (n: number) => { head.setUint16(at, n, true); at += 2; }, u32 = (n: number) => { head.setUint32(at, n, true); at += 4; };
      u32(central ? 0x02014b50 : 0x04034b50);
      if (central) u16(20);
      u16(20); u16(0x0800); u16(packed ? 8 : 0); u16(0); u16(0x21); // UTF-8 names; a fixed date (1 January 1980)
      u32(crc32(raw)); u32(data.length); u32(raw.length); u16(name.length); u16(0);
      if (central) { u16(0); u16(0); u16(0); u32(0); u32(offset); }
      return new Uint8Array(head.buffer);
    };
    directory.push(header(true), name);
    const local = [header(false), name, data];
    parts.push(...local);
    offset += local.reduce((sum, part) => sum + part.length, 0);
  }
  const size = directory.reduce((sum, part) => sum + part.length, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, files.size, true); end.setUint16(10, files.size, true);
  end.setUint32(12, size, true); end.setUint32(16, offset, true);
  const all = [...parts, ...directory, new Uint8Array(end.buffer)];
  const out = new Uint8Array(all.reduce((sum, part) => sum + part.length, 0));
  let at = 0;
  for (const part of all) { out.set(part, at); at += part.length; }
  return out;
}
