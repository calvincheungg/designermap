/**
 * Win98-style drop-down list boxes, replacing the browser's own popups (the
 * <datalist> suggestions and the open <select> menu can't be styled):
 * white list, 1px black border, navy highlight, same font as the rest of the UI.
 */

export interface ListItem<T> {
  label: string;
  /** Small grey hint after the label, e.g. "house" / "designer". */
  hint?: string;
  value: T;
}

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/** Lowercase without accents, so "chloe" finds "Chloé". */
const fold = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

let ids = 0;

/** A popup list under `anchor`; the caller decides what's in it and what picking does. */
class Popup<T> {
  readonly el = document.createElement('ul');
  private items: ListItem<T>[] = [];
  active = -1;

  constructor(
    private anchor: HTMLElement,
    private onPick: (item: ListItem<T>) => void,
  ) {
    this.el.className = 'w98-listbox';
    this.el.id = `w98-listbox-${++ids}`;
    this.el.setAttribute('role', 'listbox');
    this.el.hidden = true;
    anchor.after(this.el);
    // mousedown, not click, so the input doesn't lose focus (and close us) first.
    this.el.addEventListener('mousedown', (e) => {
      const li = (e.target as HTMLElement).closest<HTMLElement>('[data-i]');
      e.preventDefault();
      if (li) this.onPick(this.items[Number(li.dataset.i)]!);
    });
    this.el.addEventListener('mousemove', (e) => {
      const li = (e.target as HTMLElement).closest<HTMLElement>('[data-i]');
      if (li) this.setActive(Number(li.dataset.i), false);
    });
  }

  get open() {
    return !this.el.hidden;
  }

  show(items: ListItem<T>[], active = 0, empty = '') {
    this.items = items;
    this.el.innerHTML = items.length
      ? items
          .map(
            (it, i) =>
              `<li role="option" id="${this.el.id}-${i}" data-i="${i}">${esc(it.label)}` +
              (it.hint ? ` <span class="hint">${esc(it.hint)}</span>` : '') +
              `</li>`,
          )
          .join('')
      : `<li class="empty">${esc(empty)}</li>`;
    this.el.style.minWidth = `${this.anchor.offsetWidth}px`;
    this.el.hidden = false;
    this.anchor.setAttribute('aria-expanded', 'true');
    this.setActive(items.length ? active : -1);
  }

  hide() {
    this.el.hidden = true;
    this.anchor.setAttribute('aria-expanded', 'false');
    this.anchor.removeAttribute('aria-activedescendant');
  }

  setActive(i: number, scroll = true) {
    this.el.querySelector('.active')?.classList.remove('active');
    this.active = i;
    const li = this.el.querySelector<HTMLElement>(`[data-i="${i}"]`);
    if (!li) return this.anchor.removeAttribute('aria-activedescendant');
    li.classList.add('active');
    this.anchor.setAttribute('aria-activedescendant', li.id);
    if (scroll) li.scrollIntoView({ block: 'nearest' });
  }

  move(by: number) {
    if (!this.items.length) return;
    this.setActive(Math.max(0, Math.min(this.items.length - 1, this.active + by)));
  }

  pickActive() {
    const it = this.items[this.active];
    if (it) this.onPick(it);
    return !!it;
  }
}

function wrap(el: HTMLElement) {
  const box = document.createElement('div');
  box.className = 'w98-combo';
  el.replaceWith(box);
  box.append(el);
  return box;
}

/**
 * Type-ahead search box: shows matching items as you type (names starting with
 * the text first, then names containing it), arrow keys + Enter to pick.
 */
export function autocomplete<T>(
  input: HTMLInputElement,
  items: ListItem<T>[],
  onPick: (item: ListItem<T>) => void,
  limit = 60,
) {
  wrap(input);
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.autocomplete = 'off';
  const folded = items.map((it) => ({ it, key: fold(it.label) }));

  const popup = new Popup<T>(input, (it) => {
    input.value = it.label;
    popup.hide();
    onPick(it);
    input.blur();
  });
  input.setAttribute('aria-controls', popup.el.id);

  const matches = () => {
    const q = fold(input.value.trim());
    if (!q) return items.slice(0, limit);
    const starts = folded.filter((f) => f.key.startsWith(q) || f.key.includes(` ${q}`));
    const contains = folded.filter((f) => !starts.includes(f) && f.key.includes(q));
    return [...starts, ...contains].slice(0, limit).map((f) => f.it);
  };
  const refresh = () => popup.show(matches(), 0, 'No matches');

  input.addEventListener('input', refresh);
  input.addEventListener('focus', () => {
    input.select();
    refresh();
  });
  input.addEventListener('blur', () => popup.hide());
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!popup.open) refresh();
      else popup.move(e.key === 'ArrowDown' ? 1 : -1);
      e.preventDefault();
    } else if (e.key === 'Enter') {
      if (popup.open && popup.pickActive()) e.preventDefault();
    } else if (e.key === 'Escape') {
      popup.hide();
    }
  });
}

/**
 * Restyle a <select>'s menu: the select stays (so `.value` and `change` work as
 * before) but opens a Win98 list instead of the browser's menu.
 */
export function win98Select(select: HTMLSelectElement) {
  wrap(select);
  const options = () =>
    [...select.options].map((o) => ({ label: o.text, value: o.value }) satisfies ListItem<string>);

  const popup = new Popup<string>(select, (it) => {
    popup.hide();
    if (select.value !== it.value) {
      select.value = it.value;
      select.dispatchEvent(new Event('change'));
    }
  });
  select.setAttribute('aria-controls', popup.el.id);
  const open = () => {
    const opts = options();
    popup.show(opts, Math.max(0, opts.findIndex((o) => o.value === select.value)));
  };

  // Keep the browser's own menu from opening.
  select.addEventListener('mousedown', (e) => {
    e.preventDefault();
    select.focus();
    if (popup.open) popup.hide();
    else open();
  });
  select.addEventListener('keydown', (e) => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) e.preventDefault();
    if (!popup.open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) open();
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') popup.move(e.key === 'ArrowDown' ? 1 : -1);
    else if (e.key === 'Enter' || e.key === ' ') popup.pickActive();
    else if (e.key === 'Escape' || e.key === 'Tab') popup.hide();
  });
  select.addEventListener('blur', () => popup.hide());
}
