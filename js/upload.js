const btn = document.getElementById('btnPreview');
const eccInput = document.getElementById('eccInput');
const s4Input = document.getElementById('s4Input');
const tableNameSelect = document.getElementById('tableName');

btn.addEventListener('click', async () => {
  const eccFile = eccInput.files[0];
  const s4File = s4Input.files[0];
  const tableName = tableNameSelect.value;

  if (!tableName) return alert('Selecione a tabela');
  if (!eccFile || !s4File) return alert('Selecione as duas planilhas (ECC e S/4)');

  localStorage.setItem('tableName', tableName);

  try {
    const eccData = await readExcel(eccFile);
    const s4Data = await readExcel(s4File);

    localStorage.setItem('eccData', JSON.stringify(eccData));
    localStorage.setItem('s4Data', JSON.stringify(s4Data));

    window.location.href = 'preview.html';
  } catch (err) {
    console.error(err);
    alert('Erro ao ler os arquivos. Confira se são planilhas válidas.');
  }
});

function readExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = e => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: '' }); // garante valor padrão vazio
        resolve(json);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = err => reject(err);

    reader.readAsArrayBuffer(file);
  });
}
