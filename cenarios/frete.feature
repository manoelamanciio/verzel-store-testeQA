# language: pt
Funcionalidade: Frete grátis
  Como cliente da Verzel Store
  Quero frete grátis em compras maiores
  Para pagar menos nas minhas compras

  @CA06 @CA07
  Esquema do Cenário: Regra de frete por subtotal
    Dado que o carrinho tem subtotal de R$ <subtotal> com <itens>
    Então o frete é R$ <frete>
    E o valor faltante para frete grátis é R$ <faltante>

    Exemplos:
      | subtotal | itens                                  | frete | faltante |
      | 29,90    | P006 x1                                | 19,90 | 170,10   |
      | 179,70   | P001 x3                                | 19,90 | 20,30    |
      | 199,90   | P005 x1, P004 x1, P008 x1              | 19,90 | 0,10     |
      | 200,00   | P005 x2                                | 0,00  | 0,00     |
      | 229,90   | P007 x1                                | 0,00  | 0,00     |
      | 1149,50  | P007 x5                                | 0,00  | 0,00     |

  @CA07
  Cenário: O carrinho informa quanto falta para o frete grátis
    Dado que o carrinho contém "Camiseta Essencial" x1
    Então vejo o aviso de quanto falta para o frete grátis
    E o valor exibido é R$ 140,10

  @CA08
  Cenário: O frete grátis considera o subtotal antes do desconto
    Dado que o carrinho contém "Mochila Urbana 20L" x2
    Quando aplico o cupom "BEMVINDO10"
    Então o subtotal é R$ 200,00
    E o desconto é R$ 20,00
    E o frete é R$ 0,00
    E o total é R$ 180,00

  @CA09
  Cenário: O desconto do cupom não incide sobre o frete
    Dado que o carrinho contém "Mochila Urbana 20L" x1
    Quando aplico o cupom "BEMVINDO10"
    Então o desconto é R$ 10,00
    E o frete é R$ 19,90
    E o total é R$ 109,90

  @CA07 @ambiguidade-A7
  Cenário: Com frete grátis o aviso de "quanto falta" não é exibido
    Dado que o carrinho contém "Jaqueta Corta-Vento" x1
    Então o frete é R$ 0,00
    E não vejo aviso de valor faltante para frete grátis
