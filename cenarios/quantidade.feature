# language: pt
Funcionalidade: Limite de unidades por produto
  Cada produto pode ter no máximo 5 unidades por pedido, na interface e na API

  @CA10 @ui
  Cenário: Aceitar até 5 unidades na interface
    Quando adiciono "Camiseta Essencial" 5 vezes
    Então a quantidade no carrinho é 5

  @CA10 @ui
  Cenário: Bloquear a 6ª unidade na interface
    Dado que o carrinho tem "Camiseta Essencial" x5
    Quando tento aumentar a quantidade para 6
    Então a quantidade permanece 5
    E vejo uma indicação do limite

  @CA10 @ambiguidade-A2 @ui
  Cenário: Adicionar de novo o mesmo produto soma na mesma linha e respeita o teto
    Dado que o carrinho tem "Boné Aba Curva" x4
    Quando adiciono "Boné Aba Curva" mais 2 vezes
    Então existe uma única linha de "Boné Aba Curva"
    E a quantidade é no máximo 5

  @CA10 @api
  Esquema do Cenário: Limite na API (calcular e pedidos)
    Quando envio produto "P001" com quantidade <qtd> para "<endpoint>"
    Então o status é <status>
    E o código de erro é "<codigo>"

    Exemplos:
      | endpoint                | qtd | status | codigo                     |
      | /api/carrinho/calcular  | 5   | 200    |                            |
      | /api/carrinho/calcular  | 6   | 422    | QUANTIDADE_MAXIMA_EXCEDIDA |
      | /api/pedidos            | 5   | 201    |                            |
      | /api/pedidos            | 6   | 422    | QUANTIDADE_MAXIMA_EXCEDIDA |
      | /api/carrinho/calcular  | 100 | 422    | QUANTIDADE_MAXIMA_EXCEDIDA |

  @api
  Esquema do Cenário: Quantidade inválida
    Quando envio produto "P001" com quantidade <qtd>
    Então o status é 422
    E o código de erro é "QUANTIDADE_INVALIDA"

    Exemplos:
      | qtd  |
      | 0    |
      | -1   |
      | 1.5  |
      | null |
      | "2"  |
