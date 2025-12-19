// =========================
// DADOS EXPORTADOS
// =========================
export let eccData = [];
export let s4Data = [];
export let tableName = '';

// =========================
// INIT
// =========================
export function initPreview() {
  const eccTable = document.getElementById('eccTable');
  const s4Table = document.getElementById('s4Table');

  // 🔹 Atualiza as variáveis exportadas
  eccData = JSON.parse(localStorage.getItem('eccData') || '[]');
  s4Data = JSON.parse(localStorage.getItem('s4Data') || '[]');
  tableName = localStorage.getItem('tableName') || '';

  if (!eccData.length || !s4Data.length) {
    alert('Dados não encontrados');
    return;
  }

  // 🔹 Filtra linhas vazias
  eccData = filterEmptyRows(eccData);
  s4Data = filterEmptyRows(s4Data);

  renderTable(eccData, eccTable);
  renderTable(s4Data, s4Table);
}

// =========================
// FILTRA LINHAS VAZIAS
// =========================
function filterEmptyRows(data) {
  return data.filter(row => Object.values(row).some(val => val !== null && val !== ''));
}

// =========================
// RENDERIZAÇÃO
// =========================
export function renderTable(data, tableElement) {
  tableElement.innerHTML = '';

  // 🔹 Pega todos os headers válidos para não cortar colunas
  const headers = getCleanHeaders(data);

  // THEAD
  const thead = document.createElement('thead');
  const trHead = document.createElement('tr');
  headers.forEach(h => {
    const th = document.createElement('th');
    th.textContent = h;
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);
  tableElement.appendChild(thead);

  // TBODY
  const tbody = document.createElement('tbody');
  const cleanedData = renameHeaders(data, headers);

  cleanedData.forEach(row => {
    const tr = document.createElement('tr');
    headers.forEach(h => {
      const td = document.createElement('td');
      td.textContent = row[h] ?? '';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  tableElement.appendChild(tbody);
}

// =========================
// UTILITÁRIOS
// =========================
function getCleanHeaders(data) {
  if (!data.length) return [];
  const headers = Object.keys(data[0]);

  // pega apenas colunas com nome válido
  const cleanHeaders = headers.map(h => {
    if (h && h.toString().trim() !== '' && !h.toString().startsWith('__EMPTY')) return h;
    return null;
  }).filter(h => h !== null);

  return cleanHeaders;
}

function renameHeaders(data, cleanHeaders) {
  return data.map(row => {
    const newRow = {};
    cleanHeaders.forEach(h => {
      newRow[h] = row[h] ?? '';
    });
    return newRow;
  });
}
