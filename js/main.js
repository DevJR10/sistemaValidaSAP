import { initPreview, renderTable } from './preview.js';
import { bindValidation } from './validation.js';
import { initScrollSync } from './scrollSync.js';

// Inicializa a pré-visualização
initPreview();

// Inicializa sincronização de scroll
initScrollSync();

// Botão de validação
bindValidation();

