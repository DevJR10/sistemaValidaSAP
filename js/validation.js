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

  const btn = document.getElementById("validateBtn");

  // Adiciona loader no botão
  btn.disabled = true;
  const originalText = btn.textContent;
  btn.innerHTML = `Validando <span class="loader">⏳</span>`;

  try {
    const rules = await loadRules(tableName);
    compareTables(eccData, s4Data, rules);
  } catch (err) {
    console.error(err);
    alert("Erro ao carregar regras. Verifique se tabela foi escolhida corretamente.");
  } finally {
    // Remove loader e ativa botão
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}


// Carrega JSON de regras
async function loadRules(tableName) {
  const res = await fetch(`rules/${tableName}.json`);
  return await res.json();
}

// Normaliza valores (trim + uppercase)
function normalize(val) {
  return val === null || val === undefined ? "" : val.toString().trim().toUpperCase();
}

// Função auxiliar para adicionar classe no tooltip e definir o texto
function setTooltipClass(cell, text, statusClass) {
  cell.classList.remove("tooltip-ok", "tooltip-dexpara", "tooltip-error");
  cell.classList.add(statusClass);
  cell.setAttribute("data-tooltip", text);
}

// Função principal de comparação
export function compareTables(eccData, s4Data, rules) {
  const eccTableDOM = document.getElementById("eccTable");
  const s4TableDOM = document.getElementById("s4Table");

  const eccRowsDOM = eccTableDOM.querySelectorAll("tbody tr");
  const s4RowsDOM = s4TableDOM.querySelectorAll("tbody tr");

  const eccHeaders = Array.from(eccTableDOM.querySelectorAll("thead th")).map(th => th.textContent.trim());
  const s4Headers = Array.from(s4TableDOM.querySelectorAll("thead th")).map(th => th.textContent.trim());

  const eccKeyField = rules.keyField?.ecc || rules.keyField;
  const s4KeyField = rules.keyField?.s4 || rules.keyField;

  // Map S4 por cliente → pode ter múltiplos registros
  const s4Map = new Map();
  s4Data.forEach((row, index) => {
    const key = normalize(row[s4KeyField]);
    if (!s4Map.has(key)) s4Map.set(key, []);
    s4Map.get(key).push({ row, index });
  });

  // Loop ECC
  eccData.forEach((eccRow, i) => {
    const keyValue = normalize(eccRow[eccKeyField]);
    if (!keyValue) return;

    const s4Entries = s4Map.get(keyValue) || [];
    if (!s4Entries.length) return;

    const eccRowDOM = eccRowsDOM[i];

    eccHeaders.forEach(field => {
      const mapping = Object.values(rules.fieldMappings).find(m => m.eccField === field);
      const eccVal = mapping?.eccField ? eccRow[mapping.eccField] : eccRow[field];
      if (eccVal == null) return;

      let matched = false;

      s4Entries.forEach(({ row: s4Row, index: s4IndexRow }) => {
        const s4CellIndex = mapping?.s4Field ? s4Headers.indexOf(mapping.s4Field) : s4Headers.indexOf(field);
        if (s4CellIndex === -1) return;

        const s4RowDOM = s4RowsDOM[s4IndexRow];
        const eccCellDOM = eccRowDOM.querySelectorAll("td")[eccHeaders.indexOf(field)];
        const s4CellDOM = s4RowDOM.querySelectorAll("td")[s4CellIndex];
        const s4Val = mapping?.s4Field ? s4Row[mapping.s4Field] : s4Row[field];

        const eccNorm = normalize(eccVal);
        const s4Norm = normalize(s4Val);

        // limpa classes antigas
        eccCellDOM.classList.remove("diff-error", "diff-converted");
        s4CellDOM.classList.remove("diff-error", "diff-converted");

        // valores iguais → tooltip verde
        if (eccNorm === s4Norm) {
          const text = `Cliente: ${keyValue}\nValor ECC: ${eccVal}\nValor S4: ${s4Val || 'vazio'}`;
          setTooltipClass(eccCellDOM, text, "tooltip-ok");
          setTooltipClass(s4CellDOM, text, "tooltip-ok");
          matched = true;
          return;
        }

        // verifica regra de Dex/Para
        let converted = false;
        if (mapping?.map) {
          const possibleTargets = mapping.map[eccNorm];
          if (possibleTargets !== undefined) {
            const targetsArray = Array.isArray(possibleTargets) ? possibleTargets : [possibleTargets];

            if ((s4Val === null || s4Val === '') && targetsArray.includes(null)) {
              converted = true;
            } else if (targetsArray.includes(s4Norm)) {
              converted = true;
            }

            if (converted) {
              eccCellDOM.classList.add("diff-converted");
              s4CellDOM.classList.add("diff-converted");
              const text = `Cliente: ${keyValue}\nDex/Para aplicado: ${eccVal} → ${s4Val || 'vazio'}`;
              setTooltipClass(eccCellDOM, text, "tooltip-dexpara");
              setTooltipClass(s4CellDOM, text, "tooltip-dexpara");
              matched = true;
              return;
            }
          }
        }

        // se não convertido → vermelho
        if (!converted) {
          eccCellDOM.classList.add("diff-error");
          s4CellDOM.classList.add("diff-error");
          const text = `Cliente: ${keyValue}\nValor ECC: ${eccVal}\nValor S4: ${s4Val || 'vazio'}`;
          setTooltipClass(eccCellDOM, text, "tooltip-error");
          setTooltipClass(s4CellDOM, text, "tooltip-error");
        }
      });
    });
  });
}
