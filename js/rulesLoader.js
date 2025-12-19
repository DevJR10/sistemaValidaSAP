async function loadRules(tableName) {
  if (!tableName) {
    alert('Tabela não identificada');
    throw new Error('tableName is null');
  }

const response = await fetch(`../rules/${tableName.toUpperCase()}.json`);

  if (!response.ok) {
    alert(`Regras não encontradas para ${tableName}`);
    throw new Error('Rules file not found');
  }

  return response.json();
}
