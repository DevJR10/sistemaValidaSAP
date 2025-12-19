// =========================
// SCROLL SYNC COM BARRA SUPERIOR
// =========================
export function initScrollSync() {
  const eccWrapper = document.getElementById('eccWrapper');
  const s4Wrapper = document.getElementById('s4Wrapper');

  if (!eccWrapper || !s4Wrapper) return;

  // =========================
  // SCROLL HORIZONTAL SINCRONIZADO
  // =========================
  let syncing = false;

  eccWrapper.addEventListener('scroll', () => {
    if (syncing) return;
    syncing = true;
    s4Wrapper.scrollLeft = eccWrapper.scrollLeft;
    topScrollECC.scrollLeft = eccWrapper.scrollLeft;
    syncing = false;
  });

  s4Wrapper.addEventListener('scroll', () => {
    if (syncing) return;
    syncing = true;
    eccWrapper.scrollLeft = s4Wrapper.scrollLeft;
    topScrollECC.scrollLeft = s4Wrapper.scrollLeft;
    syncing = false;
  });

  // =========================
  // CRIA BARRA SUPERIOR
  // =========================
  createTopScroll(eccWrapper, s4Wrapper);
}

// =========================
// FUNÇÃO PARA CRIAR BARRA DE SCROLL ACIMA
// =========================
function createTopScroll(eccWrapper, s4Wrapper) {
  // Container da barra
  const topScrollContainer = document.createElement('div');
  topScrollContainer.style.overflowX = 'auto';
  topScrollContainer.style.overflowY = 'hidden';
  topScrollContainer.style.height = '16px'; // altura da barra
  topScrollContainer.style.marginBottom = '4px';

  // Elemento fictício para ocupar largura igual à tabela
  const filler = document.createElement('div');
  filler.style.width = eccWrapper.scrollWidth + 'px';
  filler.style.height = '1px';
  topScrollContainer.appendChild(filler);

  // Container da barra
  const topScrollContainer2 = document.createElement('div');
  topScrollContainer2.style.overflowX = 'auto';
  topScrollContainer2.style.overflowY = 'hidden';
  topScrollContainer2.style.height = '16px'; // altura da barra
  topScrollContainer2.style.marginBottom = '4px';

  // Elemento fictício para ocupar largura igual à tabela
  const filler2 = document.createElement('div');
  filler2.style.width = eccWrapper.scrollWidth + 'px';
  filler2.style.height = '1px';
  topScrollContainer2.appendChild(filler2);

  // Insere acima da tabela ECC
  eccWrapper.parentElement.insertBefore(topScrollContainer, eccWrapper);
  s4Wrapper.parentElement.insertBefore(topScrollContainer2, s4Wrapper);

  // Sincroniza scroll da barra superior
  topScrollContainer.addEventListener('scroll', () => {
    eccWrapper.scrollLeft = topScrollContainer.scrollLeft;
    s4Wrapper.scrollLeft = topScrollContainer.scrollLeft;
  });

  // Sincroniza scroll da barra superior
  topScrollContainer2.addEventListener('scroll', () => {
    eccWrapper.scrollLeft = topScrollContainer2.scrollLeft;
    s4Wrapper.scrollLeft = topScrollContainer2.scrollLeft;
  });

  // Atualiza largura se tabela mudar
  const observer = new MutationObserver(() => {
    filler.style.width = eccWrapper.scrollWidth + 'px';
  });
  observer.observe(eccWrapper, { childList: true, subtree: true });
  
  // Exporta referência para sincronização
  window.topScrollECC = topScrollContainer;
  window.topScrollECC = topScrollContainer2;
}
