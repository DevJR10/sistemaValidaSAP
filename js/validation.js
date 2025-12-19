import { eccData, s4Data, tableName } from "./preview.js";

export function bindValidation() {
  const btn = document.getElementById("validateBtn");
  btn.addEventListener("click", validateTables);
}

async function validateTables() {
  if (!eccData || !s4Data || !tableName) {
    alert("Dados não encontrados para validação");
    return;
  }

  try {
    const rules = await loadRules(tableName);
    compareTables(eccData, s4Data, rules);
  } catch (err) {
    console.error(err);
    alert("Erro ao carregar regras. Verifique se tabela foi escolhida corretamente.");
  }
}

// Carrega JSON de regras
async function loadRules(tableName) {
  const res = await fetch(`rules/${tableName}.json`);
  return await res.json();
}

// Normaliza valores (trim + uppercase)
function normalize(val) {
  return val?.toString().trim().toUpperCase();
}

// Função principal de comparação
function compareTables(eccData, s4Data, rules) {
  const eccTableDOM = document.getElementById("eccTable");
  const s4TableDOM = document.getElementById("s4Table");

  const eccRowsDOM = eccTableDOM.querySelectorAll("tbody tr");
  const s4RowsDOM = s4TableDOM.querySelectorAll("tbody tr");

  // Headers ECC
  const eccHeaders = Array.from(eccTableDOM.querySelectorAll("thead th")).map(
    (th) => th.textContent.trim()
  );

  // Headers S4
  const s4Headers = Array.from(s4TableDOM.querySelectorAll("thead th")).map(
    (th) => th.textContent.trim()
  );

  const eccKeyField = rules.keyField?.ecc || rules.keyField;
  const s4KeyField = rules.keyField?.s4 || rules.keyField;

  // Map S4 por cliente
  const s4Map = new Map();
  s4Data.forEach((row, index) => {
    const key = normalize(row[s4KeyField]);
    if (key) s4Map.set(key, { row, index });
  });

  // Loop ECC
  eccData.forEach((eccRow, i) => {
    const keyValue = normalize(eccRow[eccKeyField]);
    if (!keyValue) return;

    const s4Entry = s4Map.get(keyValue);
    if (!s4Entry) return; // cliente não encontrado no S/4

    const s4Row = s4Entry.row;
    const s4RowDOM = s4RowsDOM[s4Entry.index];
    const eccRowDOM = eccRowsDOM[i];

    eccHeaders.forEach((field) => {
      // procura mapeamento pelo eccField do JSON
      const mapping = Object.values(rules.fieldMappings).find(
        (m) => m.eccField === field
      );

      const eccVal = mapping?.eccField ? eccRow[mapping.eccField] : eccRow[field];

      // encontra índice da coluna S4
      const s4Index = mapping?.s4Field
        ? s4Headers.indexOf(mapping.s4Field)
        : s4Headers.indexOf(field);

      if (s4Index === -1) return; // coluna não existe no S4

      const eccCellDOM = eccRowDOM.querySelectorAll("td")[eccHeaders.indexOf(field)];
      const s4CellDOM = s4RowDOM.querySelectorAll("td")[s4Index];

      if (!eccCellDOM || !s4CellDOM) return;

      const s4Val = mapping?.s4Field ? s4Row[mapping.s4Field] : s4Row[field];

      // limpa classes antigas
      eccCellDOM.classList.remove("diff-error", "diff-converted");
      s4CellDOM.classList.remove("diff-error", "diff-converted");

      if (eccVal == null || s4Val == null) return;

      // valores iguais → nada pinta
      if (normalize(eccVal) === normalize(s4Val)) return;

      // verifica regra de de/para
      let converted = false;
      if (mapping?.map) {
        for (const [key, expected] of Object.entries(mapping.map)) {
          if (normalize(key) === normalize(eccVal) && normalize(expected) === normalize(s4Val)) {
            eccCellDOM.classList.add("diff-converted"); // amarelo
            s4CellDOM.classList.add("diff-converted");
            converted = true;
            break;
          }
        }
      }

      if (!converted) {
        eccCellDOM.classList.add("diff-error"); // vermelho
        s4CellDOM.classList.add("diff-error");
      }
    });
  });
}
