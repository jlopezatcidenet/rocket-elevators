const CSV_PATH = '../../data/elevator_licenses.csv';

// Convierte un texto CSV completo en un array de objetos usando la primera fila como encabezados.
function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  // Divide una línea CSV en campos individuales, respetando valores entre comillas que contienen comas.
  function parseLine(line) {
    const fields = [];
    let cur = '', inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') { inQ = !inQ; }
      else if (c === ',' && !inQ) { fields.push(cur); cur = ''; }
      else { cur += c; }
    }
    fields.push(cur);
    return fields;
  }
  const headers = parseLine(lines[0]);
  return lines.slice(1).map(l =>
    parseLine(l).reduce((o, v, i) => { o[headers[i]] = v; return o; }, {})
  );
}

const MONTHS = {Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};

// Convierte una cadena de fecha en formato DD-Mon-AA o DD-Mon-AAAA a un objeto Date.
function parseDate(str) {
  if (!str) return null;
  const m = str.trim().match(/^(\d{1,2})-([A-Za-z]{3})-(\d{2,4})$/);
  if (!m) return null;
  let year = parseInt(m[3], 10);
  if (year < 100) year += (year < 50 ? 2000 : 1900);
  return new Date(year, MONTHS[m[2]], parseInt(m[1], 10));
}

// Formatea una cadena de fecha al formato AAAA-MM-DD legible por el usuario.
function formatDate(str) {
  const d = parseDate(str);
  if (!d) return str || '—';
  return d.toLocaleDateString('en-CA');
}

let allRows = [];
let sortCol = -1, sortDir = 1;
const today = new Date(); today.setHours(0, 0, 0, 0);

// Genera el HTML de un badge de estado de licencia con color según su valor.
function statusBadge(status) {
  if (!status) return '<span class="badge badge-default">—</span>';
  const s = status.toUpperCase();
  if (s === 'ACTIVE')  return '<span class="badge badge-active">Active</span>';
  if (s === 'EXPIRED') return '<span class="badge badge-expired">Expired</span>';
  return `<span class="badge badge-default">${status}</span>`;
}

// Genera el HTML de la celda de fecha de vencimiento, resaltando en rojo las fechas ya vencidas.
function expiryCell(str) {
  const d = parseDate(str);
  const formatted = formatDate(str);
  if (d && d < today) return `<span class="expiry-expired">${formatted}</span>`;
  return formatted;
}

// Extrae los campos clave de un registro CSV en un array con orden fijo de columnas.
function rowToTuple(r) {
  return [
    r['ElevatingDevicesNumber'] || '',
    r['LocationoftheElevatingDevice'] || '',
    r['ElevatingDevicesLicenseNumber'] || '',
    r['LICENSESTATUS'] || '',
    r['LICENSEEXPIRYDATE'] || '',
    r['LICENSEHOLDER'] || ''
  ];
}

// Renderiza el array de registros en la tabla HTML y actualiza el contador de filas.
function renderTable(rows) {
  const tbody   = document.getElementById('table-body');
  const table   = document.getElementById('data-table');
  const empty   = document.getElementById('empty-state');
  const counter = document.getElementById('row-count');
  counter.textContent = `${rows.length.toLocaleString()} record${rows.length !== 1 ? 's' : ''}`;
  if (rows.length === 0) { table.style.display = 'none'; empty.style.display = 'block'; return; }
  table.style.display = 'table';
  empty.style.display = 'none';
  tbody.innerHTML = rows.map(r => {
    const t = rowToTuple(r);
    return `<tr>
      <td title="${t[0]}">${t[0]}</td>
      <td title="${t[1]}">${t[1]}</td>
      <td title="${t[2]}">${t[2]}</td>
      <td>${statusBadge(t[3])}</td>
      <td>${expiryCell(t[4])}</td>
      <td title="${t[5]}">${t[5]}</td>
    </tr>`;
  }).join('');
}

// Filtra los registros según el texto de búsqueda actual y los ordena por la columna activa.
function getFilteredSorted() {
  const q = document.getElementById('search-input').value.toLowerCase();
  let rows = q
    ? allRows.filter(r => rowToTuple(r).some(v => v.toLowerCase().includes(q)))
    : allRows.slice();
  if (sortCol >= 0) {
    rows.sort((a, b) => {
      const ta = rowToTuple(a), tb = rowToTuple(b);
      if (sortCol === 4) {
        const da = parseDate(ta[4]), db = parseDate(tb[4]);
        if (da && db) return sortDir * (da - db);
        if (da) return -sortDir;
        if (db) return sortDir;
        return 0;
      }
      return sortDir * ta[sortCol].localeCompare(tb[sortCol]);
    });
  }
  return rows;
}

// Aplica el filtro y ordenamiento actuales y vuelve a dibujar la tabla.
function refresh() { renderTable(getFilteredSorted()); }

document.querySelectorAll('th[data-col]').forEach(th => {
  th.addEventListener('click', () => {
    const col = parseInt(th.dataset.col, 10);
    if (sortCol === col) { sortDir *= -1; } else { sortCol = col; sortDir = 1; }
    document.querySelectorAll('th').forEach(h => h.classList.remove('sort-asc', 'sort-desc'));
    th.classList.add(sortDir === 1 ? 'sort-asc' : 'sort-desc');
    refresh(); // Reaplica el filtro y ordenamiento al cambiar la columna de ordenación.
  });
});

document.getElementById('search-input').addEventListener('input', refresh);
// Carga el archivo CSV, procesa los datos para estadísticas y muestra la tabla. Maneja errores de carga.
fetch(CSV_PATH)
  .then(resp => {
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return resp.text();
  })
  .then(text => {
    allRows = parseCSV(text);
    const total   = allRows.length;
    const active  = allRows.filter(r => (r['LICENSESTATUS'] || '').toUpperCase() === 'ACTIVE').length;
    const expired = allRows.filter(r => { const d = parseDate(r['LICENSEEXPIRYDATE']); return d && d < today; }).length;
    document.getElementById('stat-total').textContent   = total.toLocaleString();
    document.getElementById('stat-active').textContent  = active.toLocaleString();
    document.getElementById('stat-expired').textContent = expired.toLocaleString();
    document.getElementById('loading-state').style.display = 'none';
    refresh();
  })
  .catch(err => {
    document.getElementById('loading-state').innerHTML =
      `<div style="color:#ef4444">Failed to load data: ${err.message}<br>` +
      `<small>Serve via a local web server, e.g. <code>npx serve .</code> from the project root.</small></div>`;
  });
