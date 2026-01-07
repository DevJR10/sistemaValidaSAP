Guia de Utilização: Sistema de Validação de Dados
Para que o sistema funcione corretamente, é necessário seguir estas três diretrizes principais de estruturação de dados e configuração de regras.

1. Requisitos das Tabelas (ECC e S4)
Coluna Chave: Ambas as tabelas devem conter a coluna KUNNR. Os códigos contidos nela devem ser obrigatoriamente os mesmos do ambiente ECC.

Nomenclatura (Headers): O nome das colunas deve ser idêntico em ambas as tabelas. O sistema diferencia maiúsculas de minúsculas e caracteres especiais; qualquer divergência impedirá a validação automática.

2. Configuração de Regras (Arquivos JSON)
As regras de tradução (DE x PARA) são definidas em arquivos JSON localizados na pasta /rules. Cada arquivo deve representar uma única tabela técnica.

3. Estrutura do Arquivo JSON
Abaixo, um exemplo da estrutura correta para configurar o mapeamento:

JSON

{
  "table": "NOME_TECNICO_DA_TABELA", // Ex: KNA1, KNVV
  "keyField": {
    "ecc": "KUNNR",
    "s4": "KUNNR"
  },
  "fieldMappings": {
    "NOME_DO_CAMPO_ALVO": {
      "eccField": "CAMPO_ORIGEM_ECC",
      "s4Field": "CAMPO_DESTINO_S4",
      "map": {
        "VALOR_ECC": ["VALOR_S4"] // Regra DE x PARA
      }
    }
    // Você pode adicionar quantos campos forem necessários seguindo o modelo acima.
  }
}
