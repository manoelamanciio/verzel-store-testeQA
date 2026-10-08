# Análise da documentação (VZS-142 · v2.3.0)

Entrega analisada: **cupom de desconto + frete grátis** da Verzel Store.
Documentação: `/documentacao` · API: `/api`

## 1. O que foi entendido

| Tema | Regra |
|---|---|
| Subtotal | Σ (preço unitário × quantidade) |
| Desconto | `% do cupom × subtotal` (0 sem cupom válido). Não incide sobre o frete (CA09) |
| Frete | R$ 0,00 se `subtotal >= 200,00` (inclusive); senão R$ 19,90. Usa subtotal **antes** do desconto (CA08) |
| Faltante | `max(200 − subtotal, 0)` |
| Total | `subtotal − desconto + frete` |
| Cupons | `BEMVINDO10` (10%, válido) · `VERAO2026` (15%, expirado em 31/03/2026) |
| Limite | Máx. 5 unidades por produto, na UI **e** na API (CA10) |
| Arredondamento | 2 casas decimais em todos os valores (CA11) |

## 2. Dados de fronteira calculados

Todos os preços são múltiplos de R$ 0,10, então combinações exatas são fáceis de montar:

| Objetivo | Itens | Subtotal | Esperado |
|---|---|---|---|
| Limite exato (inclusive) | P005 ×2 | 200,00 | frete 0,00 |
| Logo abaixo do limite | P005 + P004 + P008 | 199,90 | frete 19,90 · faltante 0,10 · total 219,80 |
| CA08: cupom não derruba o frete grátis | P005 ×2 + `BEMVINDO10` | 200,00 | desc. 20,00 · frete 0,00 · total 180,00 |
| CA09: desconto não incide no frete | P005 ×1 + `BEMVINDO10` | 100,00 | desc. 10,00 · frete 19,90 · total 109,90 |
| Ponto flutuante (JS ingênuo: 199.8 × 0.10 = 19.980000000000004) | P001 + P002 + `BEMVINDO10` | 199,80 | desc. 19,98 · frete 19,90 (199,80 < 200) · total 199,72 |
| Soma de centavos | P001 ×3 | 179,70 | frete 19,90 · faltante 20,30 · total 199,60 |
| Quantidade máxima | P007 ×5 | 1.149,50 | frete 0,00 |
| Cupom com frete cobrado | P001 ×1 + `BEMVINDO10` | 59,90 | desc. 5,99 · frete 19,90 · total 73,81 |

## 3. Ambiguidades e interpretação adotada

> Regra do teste: registrar a interpretação e seguir em frente.

| # | Ambiguidade | Interpretação adotada |
|---|---|---|
| A1 | CA02 fala em espaços "no início e no fim". E espaços no meio (`BEM VINDO10`)? | Só trim nas pontas. Espaço no meio = cupom inexistente |
| A2 | CA10: "5 unidades por produto por pedido". Na API, `ITEM_DUPLICADO` impede repetir o produto. Na UI, adicionar o mesmo produto de novo deve somar | UI consolida na mesma linha e respeita o teto de 5 |
| A3 | Com vários erros ao mesmo tempo (ex.: cupom expirado + quantidade 6), qual prevalece? A documentação não define | Não assumo ordem. Registro o observado como exploratório, sem declarar bug |
| A4 | Quantidade `"2"` (string) ou `2.0`: a doc diz "número inteiro" | String = inválida (`QUANTIDADE_INVALIDA`). `2.0` é inteiro em JSON, tende a ser aceito |
| A5 | `cupom: ""`, `null` ou ausente | Tratado como "sem cupom", sem erro |
| A6 | `cupom` com tipo errado (número, objeto) | Esperado erro de validação ou "Cupom inválido." Registro o observado |
| A7 | Na UI, com frete já grátis, o aviso "falta R$ X" | Não deve aparecer (ou aparecer zerado). CA07 só exige o aviso abaixo de R$ 200 |
| A8 | Cupom aplicado em carrinho vazio | Desconto 0, sem quebrar a tela |
| A9 | Formato de e-mail "válido" não é detalhado | Uso casos óbvios: sem `@`, sem domínio, com espaço |
| A10 | Nome com "só espaços" depois do primeiro nome conta como sobrenome? | Não. Esperado inválido |
| A11 | CEP: "8 dígitos, com ou sem hífen". Letras? 7/9 dígitos? Hífen fora de lugar? | Tudo isso é inválido. O exemplo da doc devolve o CEP sem hífen (`01310100`) |

## 4. Fora do escopo / comportamentos esperados (não são bugs)

- Carrinho vive só na aba (outra aba, anônima ou outro navegador começam vazios).
- Pedidos não são gravados, número `VZ-xxxxxx` é fictício, sem consulta de pedidos.
- Sem e-mail, sem cobrança, sem estoque, sem estado entre chamadas da API.
- Login, cadastro, pagamento online e consulta de pedidos.
- Testes de carga, estresse e segurança (ambiente compartilhado).

## 5. Onde procurar bugs (hipóteses, **não confirmadas**)

Pontos de maior risco para testar primeiro. Só viram bug depois de executados e evidenciados.

1. **Limite do frete grátis**: `>` no lugar de `>=` em R$ 200,00 exatos.
2. **CA08**: frete calculado sobre o subtotal já com desconto (P005 ×2 + cupom: 180 < 200 cobraria frete).
3. **CA09**: desconto aplicado sobre subtotal + frete.
4. **CA02**: cupom minúsculo ou com espaços rejeitado; espaço interno aceito.
5. **CA10 na API**: limite só na UI, `>= 5` em vez de `> 5`, ou teto não aplicado em `/api/pedidos`.
6. **CA05 na UI**: dar para aplicar dois cupons, ou o segundo sobrescrever sem remover.
7. **Mensagens exatas**: pontuação e acento em "Cupom inválido." e "Cupom expirado.".
8. **Divergência UI × API**: valores exibidos diferentes dos retornados em `/calcular`.
9. **Ponto flutuante (CA11)**: valores como `19.980000000000004` ou `233.90999999999997` na resposta ou na tela (ocorre em implementações que não arredondam).
10. **Recalcular ao mudar o carrinho**: remover item ou mudar quantidade com cupom aplicado não atualiza desconto/frete.
11. **Validações antigas** (nome, e-mail, CEP): regressão. Ex.: CEP `01310-1000`, nome com um termo só.
12. **Códigos de erro**: 405 vs 404, JSON inválido (400), `Content-Type` ausente.
