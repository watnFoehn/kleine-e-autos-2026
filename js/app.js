let vehicles = [];
let compareList = [];
let lastFocusedElement = null;

const price = (vehicle) => vehicle.herstellerrabatt ? vehicle.preisUVP - vehicle.herstellerrabatt : vehicle.preisUVP;
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const displayValue = (value, suffix = '') => value == null || value === '' ? '—' : `${value}${suffix}`;
const formatDimensions = (vehicle) => `${[vehicle.laenge, vehicle.breite, vehicle.hoehe].map((value) => value == null ? '—' : value).join(' × ')} m`;

function render() {
  const sort = document.getElementById('sort').value;
  const sorted = [...vehicles].sort((a, b) => sort === 'preis' ? price(a) - price(b) : sort === 'reichweite' ? b.reichweiteWLTP - a.reichweiteWLTP : a.laenge - b.laenge);
  document.getElementById('cards').innerHTML = sorted.map((vehicle) => `
    <article class="rounded-lg bg-white p-5 shadow dark:bg-gray-800" role="listitem">
      <div class="mb-4 flex h-40 items-center justify-center rounded bg-gray-100 dark:bg-gray-700"><span class="text-sm text-gray-500 dark:text-gray-400">Fahrzeugbild folgt</span></div>
      <div class="mb-3 flex items-start justify-between gap-2">
        <h2 class="text-lg font-bold dark:text-white"><a href="${vehicle.url}" target="_blank" rel="noopener noreferrer" class="rounded hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">${esc(vehicle.name)}</a></h2>
        <div class="flex gap-1">${vehicle.gebraucht ? '<span class="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Gebraucht</span>' : ''}${vehicle.comingSoon ? '<span class="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200">Neu</span>' : ''}</div>
      </div>
      <div class="mb-1 text-2xl font-bold text-blue-600 dark:text-blue-400">${vehicle.preisUVP.toLocaleString('de')} € <span class="text-sm font-normal text-gray-500">UVP</span></div>
      ${vehicle.herstellerrabatt ? `<div class="text-sm text-gray-600 dark:text-gray-400">− ${vehicle.herstellerrabatt.toLocaleString('de')} € Herstellerrabatt</div><div class="text-lg font-semibold text-green-600 dark:text-green-400">= ${price(vehicle).toLocaleString('de')} € mit Rabatt</div>` : ''}
      <dl class="mt-4 space-y-2 text-sm">${[['Reichweite WLTP', displayValue(vehicle.reichweiteWLTP, ' km')], ['Real', displayValue(vehicle.reichweiteReal)], ['Batterie', displayValue(vehicle.batterie)], ['Leistung', displayValue(vehicle.leistung)], ['DC-Laden', displayValue(vehicle.ladeleistungDC)], ['Maße', formatDimensions(vehicle)], ['Kofferraum', displayValue(vehicle.kofferraum, ' l')], ['Sitze / ISOFIX', `${displayValue(vehicle.sitze)} / ${displayValue(vehicle.isofix)}`]].map(([label, value]) => `<div class="flex justify-between gap-4"><dt class="text-gray-600 dark:text-gray-400">${label}</dt><dd class="font-medium text-right dark:text-white">${esc(value)}</dd></div>`).join('')}</dl>
      <button type="button" data-name="${esc(vehicle.name)}" class="compare-btn mt-4 w-full rounded border py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${compareList.includes(vehicle.name) ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 dark:border-gray-600 dark:text-white'}" aria-pressed="${compareList.includes(vehicle.name)}">${compareList.includes(vehicle.name) ? '✓ Im Vergleich' : '+ Vergleichen'}</button>
    </article>`).join('');
  document.querySelectorAll('.compare-btn').forEach((button) => button.addEventListener('click', () => toggleCompare(button.dataset.name)));
}

function toggleCompare(name) {
  if (compareList.includes(name)) compareList = compareList.filter((item) => item !== name);
  else if (compareList.length < 3) compareList.push(name);
  updateBar();
  render();
}

function updateBar() {
  const bar = document.getElementById('compare-bar');
  bar.classList.toggle('hidden', !compareList.length);
  document.getElementById('selection').innerHTML = compareList.map((name) => `<span class="rounded bg-blue-100 px-3 py-1 text-blue-800 dark:bg-blue-900 dark:text-blue-200">${esc(name)}</span>`).join('');
}

function showCompare() {
  if (!compareList.length) return;
  const selected = vehicles.filter((vehicle) => compareList.includes(vehicle.name));
  const fields = [
    ['UVP', (v) => `${v.preisUVP.toLocaleString('de')} €`],
    ['Herstellerrabatt', (v) => v.herstellerrabatt ? `− ${v.herstellerrabatt.toLocaleString('de')} €` : '—'],
    ['Mit Rabatt', (v) => `${price(v).toLocaleString('de')} €`, (v) => price(v), 'low'],
    ['Reichweite WLTP', (v) => displayValue(v.reichweiteWLTP, ' km'), (v) => v.reichweiteWLTP, 'high'],
    ['Real', (v) => displayValue(v.reichweiteReal)], ['Batterie', (v) => displayValue(v.batterie)], ['Leistung', (v) => displayValue(v.leistung)], ['DC-Laden', (v) => displayValue(v.ladeleistungDC)],
    ['Länge', (v) => displayValue(v.laenge, ' m'), (v) => v.laenge, 'low'], ['Breite', (v) => displayValue(v.breite, ' m')], ['Höhe', (v) => displayValue(v.hoehe, ' m')],
    ['Kofferraum', (v) => displayValue(v.kofferraum, ' l'), (v) => v.kofferraum, 'high'], ['Sitze', (v) => displayValue(v.sitze)], ['ISOFIX', (v) => displayValue(v.isofix)]
  ];
  document.getElementById('compare-content').innerHTML = `<table class="w-full text-sm"><caption class="sr-only">Vergleich der ausgewählten Fahrzeuge</caption><thead><tr class="border-b dark:border-gray-700"><th scope="col" class="p-2 text-left"></th>${selected.map((v) => `<th scope="col" class="p-2 text-left font-bold">${esc(v.name)}</th>`).join('')}</tr></thead><tbody>${fields.map(([label, display, get, best]) => { let classes = selected.map(() => ''); if (get && best && selected.length > 1) { const values = selected.map(get); const target = best === 'high' ? Math.max(...values) : Math.min(...values); classes = values.map((value) => value === target ? 'bg-green-100 dark:bg-green-900' : ''); } return `<tr class="border-b dark:border-gray-700"><th scope="row" class="p-2 text-left font-normal text-gray-600 dark:text-gray-400">${label}</th>${selected.map((v, i) => `<td class="p-2 ${classes[i]}">${esc(display(v))}</td>`).join('')}</tr>`; }).join('')}</tbody></table>`;
  lastFocusedElement = document.activeElement;
  document.getElementById('modal').classList.remove('hidden');
  document.getElementById('close').focus();
}

function closeCompare() {
  document.getElementById('modal').classList.add('hidden');
  if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
  lastFocusedElement = null;
}

function getModalFocusableElements() {
  return [...document.getElementById('modal').querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
    .filter((element) => !element.hasAttribute('hidden'));
}

function updateThemeButton() {
  const dark = document.documentElement.classList.contains('dark');
  document.getElementById('theme').setAttribute('aria-label', dark ? 'Hellen Modus aktivieren' : 'Dunklen Modus aktivieren');
  document.getElementById('theme-icon').textContent = dark ? '☀️' : '🌙';
}

document.getElementById('sort').addEventListener('change', render);
document.getElementById('compare').addEventListener('click', showCompare);
document.getElementById('clear').addEventListener('click', () => { compareList = []; updateBar(); render(); });
document.getElementById('close').addEventListener('click', closeCompare);
document.addEventListener('keydown', (event) => {
  const modal = document.getElementById('modal');
  if (modal.classList.contains('hidden')) return;
  if (event.key === 'Escape') {
    closeCompare();
    return;
  }
  if (event.key !== 'Tab') return;
  const focusable = getModalFocusableElements();
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
document.getElementById('theme').addEventListener('click', () => { document.documentElement.classList.toggle('dark'); localStorage.setItem('darkMode', document.documentElement.classList.contains('dark')); updateThemeButton(); });
if (localStorage.getItem('darkMode') === 'true') document.documentElement.classList.add('dark');
updateThemeButton();

async function loadVehicles() {
  const response = await fetch('./data/vehicles.json');
  if (!response.ok) throw new Error(`Fahrzeugdaten konnten nicht geladen werden (${response.status}).`);
  vehicles = await response.json();
}

async function init() {
  try {
    await loadVehicles();
    render();
  } catch (error) {
    console.error(error);
    document.getElementById('cards').innerHTML = `
      <div class="rounded-lg border border-red-300 bg-red-50 p-6 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200" role="alert">
        Die Fahrzeugdaten konnten nicht geladen werden. Bitte später erneut versuchen.
      </div>`;
  }
}

init();