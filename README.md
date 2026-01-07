Guia de Utilização: Sistema de Validação de Dados
Para que o sistema funcione corretamente, é necessário seguir estas três diretrizes principais de estruturação de dados e configuração de regras.

1. Requisitos das Tabelas (ECC e S4)
Coluna Chave: Ambas as tabelas devem conter a coluna KUNNR. Os códigos contidos nela devem ser obrigatoriamente os mesmos do ambiente ECC.

Nomenclatura (Headers): O nome das colunas deve ser idêntico em ambas as tabelas. O sistema diferencia maiúsculas de minúsculas e caracteres especiais; qualquer divergência impedirá a validação automática.

2. Configuração de Regras (Arquivos JSON)
As regras de tradução (DE x PARA) são definidas em arquivos JSON localizados na pasta /rules. Cada arquivo deve representar uma única tabela técnica.

3. Estrutura do Arquivo JSON
Abaixo, um exemplo da estrutura correta para configurar o mapeamento:

```json
{
  "table": "KNA1",
  "keyField": {
    "ecc": "KUNNR",
    "s4": "KUNNR"
  },
  "fieldMappings": {
    "NOME_DO_CAMPO": {
      "eccField": "VALOR_ORIGEM",
      "s4Field": "VALOR_DESTINO",
      "map": {
        "CS1100": ["BR0000"]
      }
    }
  }
}
