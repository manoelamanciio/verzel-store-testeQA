# language: pt
Funcionalidade: Contrato da API
  Status HTTP e códigos de erro documentados

  @api
  Cenário: Listar produtos
    Quando faço GET em "/api/produtos"
    Então o status é 200
    E recebo 8 produtos com id, nome, descricao, categoria e preco

  @api
  Esquema do Cenário: Consultar produto por id
    Quando faço GET em "/api/produtos/<id>"
    Então o status é <status>

    Exemplos:
      | id   | status |
      | P001 | 200    |
      | P008 | 200    |
      | P999 | 404    |
      | p001 | 404    |

  @api
  Esquema do Cenário: Erros de rota, método e corpo
    Quando faço <metodo> em "<rota>" <corpo>
    Então o status é <status>
    E o código de erro é "<codigo>"

    Exemplos:
      | metodo | rota                   | corpo            | status | codigo               |
      | GET    | /api/inexistente       | sem corpo        | 404    | ROTA_NAO_ENCONTRADA  |
      | DELETE | /api/produtos          | sem corpo        | 405    | METODO_NAO_PERMITIDO |
      | GET    | /api/carrinho/calcular | sem corpo        | 405    | METODO_NAO_PERMITIDO |
      | POST   | /api/carrinho/calcular | JSON malformado  | 400    | JSON_INVALIDO        |
      | POST   | /api/carrinho/calcular | um array         | 400    | JSON_INVALIDO        |

  @api
  Esquema do Cenário: Erros de itens
    Quando envio itens <itens>
    Então o status é 422
    E o código de erro é "<codigo>"

    Exemplos:
      | itens                          | codigo                |
      | ausente                        | ITENS_OBRIGATORIOS    |
      | []                             | ITENS_OBRIGATORIOS    |
      | ["P001"]                       | ITEM_INVALIDO         |
      | [{"produtoId":"P999",...}]     | PRODUTO_NAO_ENCONTRADO|
      | P001 duas vezes                | ITEM_DUPLICADO        |

  @api @ambiguidade-A5
  Esquema do Cenário: Cupom ausente, vazio ou nulo é tratado como sem cupom
    Quando calculo o carrinho com cupom <cupom>
    Então o status é 200
    E o desconto é 0

    Exemplos:
      | cupom  |
      | ausente|
      | ""     |
      | null   |

  @api @CA11
  Cenário: Valores com no máximo 2 casas decimais
    Quando calculo "P001" x3 com cupom "BEMVINDO10"
    Então todos os valores monetários da resposta têm no máximo 2 casas decimais
