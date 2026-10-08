# language: pt
Funcionalidade: Confirmação do pedido
  Regras de cliente pré-existentes e integração com o novo cálculo

  Contexto:
    Dado que o carrinho contém "Mochila Urbana 20L" x1

  @smoke
  Cenário: Confirmar pedido com dados válidos e cupom
    Quando confirmo o pedido com nome "Maria Silva", e-mail "maria@exemplo.com", CEP "01310-100" e cupom "BEMVINDO10"
    Então vejo um número de pedido no formato "VZ-" seguido de 6 dígitos
    E o resumo mostra subtotal R$ 100,00, desconto R$ 10,00, frete R$ 19,90 e total R$ 109,90

  Esquema do Cenário: Validação do nome
    Quando confirmo o pedido com nome "<nome>"
    Então o pedido é <resultado>

    Exemplos:
      | nome            | resultado |
      | Maria           | recusado  |
      | Maria[espaço]   | recusado  |
      | Maria Silva     | aceito    |
      | Ana de Souza    | aceito    |

  Esquema do Cenário: Validação do e-mail
    Quando confirmo o pedido com e-mail "<email>"
    Então o pedido é <resultado>

    Exemplos:
      | email              | resultado |
      | maria              | recusado  |
      | maria@             | recusado  |
      | maria@exemplo      | recusado  |
      | @exemplo.com       | recusado  |
      | maria @exemplo.com | recusado  |
      | maria@exemplo.com  | aceito    |

  Esquema do Cenário: Validação do CEP
    Quando confirmo o pedido com CEP "<cep>"
    Então o pedido é <resultado>

    Exemplos:
      | cep        | resultado |
      | 01310100   | aceito    |
      | 01310-100  | aceito    |
      | 0131010    | recusado  |
      | 013101000  | recusado  |
      | 0131-0100  | recusado  |
      | 0131a100   | recusado  |
      |            | recusado  |

  @CA03 @CA04 @api
  Esquema do Cenário: Cupom inválido ou expirado no pedido gera erro (diferente do cálculo)
    Quando envio o pedido com cupom "<cupom>"
    Então o status é 422
    E o código de erro é "<codigo>"

    Exemplos:
      | cupom     | codigo         |
      | PROMO50   | CUPOM_INVALIDO |
      | VERAO2026 | CUPOM_EXPIRADO |

  @api
  Cenário: CEP é devolvido normalizado, sem hífen
    Quando envio o pedido com CEP "01310-100"
    Então o campo cliente.cep da resposta é "01310100"
