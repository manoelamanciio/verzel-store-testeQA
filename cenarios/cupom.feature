# language: pt
Funcionalidade: Cupom de desconto
  Como cliente da Verzel Store
  Quero aplicar um cupom no carrinho
  Para pagar menos nas minhas compras

  Contexto:
    Dado que o carrinho contém "Calça Jeans Slim" x1 e "Boné Aba Curva" x2

  @CA01 @smoke
  Cenário: Aplicar o cupom BEMVINDO10
    Quando aplico o cupom "BEMVINDO10"
    Então o subtotal é R$ 239,70
    E o desconto é R$ 23,97
    E o frete é R$ 0,00
    E o total é R$ 215,73
    E vejo a mensagem "Cupom aplicado: 10% de desconto nos produtos."

  @CA02
  Esquema do Cenário: Código do cupom ignora caixa e espaços nas pontas
    Quando aplico o cupom "<digitado>"
    Então o desconto é R$ 23,97

    Exemplos:
      | digitado                          |
      | bemvindo10                        |
      | BemVindo10                        |
      | [espaço]BEMVINDO10                |
      | BEMVINDO10[espaço]                |
      | [3 espaços]bemvindo10[3 espaços]  |

  @CA02 @ambiguidade-A1
  Cenário: Espaço no meio do código não é ignorado
    Quando aplico o cupom "BEM VINDO10"
    Então vejo a mensagem "Cupom inválido."
    E nenhum desconto é aplicado

  @CA03
  Esquema do Cenário: Cupom inexistente
    Quando aplico o cupom "<codigo>"
    Então vejo a mensagem "Cupom inválido."
    E nenhum desconto é aplicado
    E o total é R$ 239,70

    Exemplos:
      | codigo      |
      | PROMO50     |
      | BEMVINDO100 |
      | BEMVINDO1   |

  @CA04
  Esquema do Cenário: Cupom expirado
    Quando aplico o cupom "<codigo>"
    Então vejo a mensagem "Cupom expirado."
    E nenhum desconto é aplicado

    Exemplos:
      | codigo             |
      | VERAO2026          |
      | verao2026          |
      | [espaço]VERAO2026  |

  @CA05
  Cenário: Apenas um cupom por vez
    Dado que o cupom "BEMVINDO10" está aplicado
    Quando tento aplicar o cupom "VERAO2026" sem remover o atual
    Então o cupom "BEMVINDO10" continua sendo o único aplicado
    E não há acúmulo de descontos

  @CA05
  Cenário: Trocar de cupom exige remover o atual
    Dado que o cupom "BEMVINDO10" está aplicado
    Quando removo o cupom atual
    Então o desconto volta a R$ 0,00
    E o total volta a R$ 239,70
    E consigo aplicar outro cupom

  @ambiguidade-A8
  Cenário: Cupom em carrinho vazio
    Dado que o carrinho está vazio
    Quando aplico o cupom "BEMVINDO10"
    Então o desconto é R$ 0,00
    E a tela não apresenta erro

  @recalculo
  Cenário: Alterar o carrinho com cupom aplicado recalcula o desconto
    Dado que o cupom "BEMVINDO10" está aplicado
    Quando removo "Boné Aba Curva" do carrinho
    Então o subtotal é R$ 139,90
    E o desconto é R$ 13,99
    E o frete é R$ 19,90
    E o total é R$ 145,81
