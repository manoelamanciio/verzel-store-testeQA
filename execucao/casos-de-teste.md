# Execução dos testes

> **Como usar:** execute cada caso, preencha **Obtido**, **Status** e **Evidência**, e vincule o bug (se houver).
> Status: ✅ Passou · ❌ Falhou · ⚠️ Passou com ressalva · ⬜ Não executado · 🚫 Bloqueado
>
> Nada aqui foi executado ainda. Toda a coluna **Obtido/Status** deve ser preenchida com o que você realmente observar.

- **Ambiente:** https://verzel-store.qa-test-verzel-store.workers.dev
- **Versão testada:** 2.3.0 (VZS-142)
- **Navegador/SO:** _(preencher)_
- **Data da execução:** _(preencher)_
- **Executor:** _(preencher)_

Legenda de **Tipo**: `UI` manual na loja · `API` via Playwright/Postman · `EXP` exploratório · `A` = automatizado (arquivo em `automacao/`)

---

## 1. Interface (UI)

Produtos usados: P001 Camiseta 59,90 · P002 Calça 139,90 · P003 Tênis 189,90 · P004 Boné 49,90 · P005 Mochila 100,00 · P006 Meias 29,90 · P007 Jaqueta 229,90 · P008 Garrafa 50,00

| ID | CA | Caso | Passos / dados | Esperado | Obtido | Status | Evidência | Bug |
|---|---|---|---|---|---|---|---|---|
| UI-01 | CA01 | Aplicar BEMVINDO10 | Carrinho: P002 ×1 + P004 ×2 → aplicar `BEMVINDO10` | Subtotal 239,70 · desc. 23,97 · frete 0,00 · total 215,73 · msg "Cupom aplicado: 10% de desconto nos produtos." | | ⬜ | | |
| UI-02 | CA02 | Cupom em minúsculas | Mesmo carrinho → `bemvindo10` | Mesmo resultado de UI-01 | | ⬜ | | |
| UI-03 | CA02 | Cupom com espaços nas pontas | `␣␣BEMVINDO10␣␣` | Mesmo resultado de UI-01 | | ⬜ | | |
| UI-04 | CA02/A1 | Espaço no meio do cupom | `BEM VINDO10` | "Cupom inválido." · sem desconto | | ⬜ | | |
| UI-05 | CA03 | Cupom inexistente | `PROMO50` | Mensagem exata "Cupom inválido." · sem desconto · total sem alteração | | ⬜ | | |
| UI-06 | CA03 | Variações inexistentes | `BEMVINDO100`, `BEMVINDO1`, só espaços, vazio | "Cupom inválido." (vazio: ver comportamento e registrar) | | ⬜ | | |
| UI-07 | CA04 | Cupom expirado | `VERAO2026` e `verao2026` | Mensagem exata "Cupom expirado." · sem desconto | | ⬜ | | |
| UI-08 | CA05 | Segundo cupom sem remover o atual | Aplicar `BEMVINDO10` e tentar `VERAO2026` | Só um cupom ativo; sem acúmulo | | ⬜ | | |
| UI-09 | CA05 | Trocar cupom (remover e aplicar) | Remover `BEMVINDO10` → aplicar outro | Remoção zera desconto; novo cupom aplicável | | ⬜ | | |
| UI-10 | CA06 | Frete grátis em exatos 200,00 | P005 ×2 | Frete 0,00 | | ⬜ | | |
| UI-11 | CA06/07 | Logo abaixo de 200,00 | P005 + P004 + P008 (199,90) | Frete 19,90 · aviso "falta R$ 0,10" · total 219,80 | | ⬜ | | |
| UI-12 | CA07 | Aviso de quanto falta | P001 ×1 | Frete 19,90 · aviso com R$ 140,10 | | ⬜ | | |
| UI-13 | CA07/A7 | Frete grátis sem aviso de faltante | P007 ×1 | Frete 0,00 · sem aviso (ou zerado) | | ⬜ | | |
| UI-14 | CA08 | Cupom não derruba frete grátis | P005 ×2 + `BEMVINDO10` | Subtotal 200,00 · desc. 20,00 · frete 0,00 · total 180,00 | | ⬜ | | |
| UI-15 | CA09 | Desconto não incide no frete | P005 ×1 + `BEMVINDO10` | Desc. 10,00 · frete 19,90 · total 109,90 | | ⬜ | | |
| UI-16 | CA10 | Máximo de 5 unidades | P001 até ×5 | Aceita 5 | | ⬜ | | |
| UI-17 | CA10 | 6ª unidade bloqueada | P001 ×5 → tentar 6 | Fica em 5 + indicação do limite | | ⬜ | | |
| UI-18 | CA10/A2 | Adicionar mesmo produto de novo | P004 ×4, adicionar P004 mais 2× | Uma linha só · máx. 5 | | ⬜ | | |
| UI-19 | CA10 | Digitar quantidade fora do limite | Campo de qtd: `6`, `0`, `-1`, `1.5`, `abc`, vazio | Rejeitado/ajustado; nunca > 5 nem < 1 | | ⬜ | | |
| UI-20 | recálculo | Alterar quantidade com cupom aplicado | `BEMVINDO10` ativo → mudar qtd | Desconto, frete e total recalculados | | ⬜ | | |
| UI-21 | recálculo | Remover item com cupom aplicado | Carrinho UI-01 → remover P004 | Subtotal 139,90 · desc. 13,99 · frete 19,90 · total 145,81 | | ⬜ | | |
| UI-22 | A8 | Esvaziar carrinho com cupom ativo | Remover todos os itens | Sem erro; totais zerados; estado coerente | | ⬜ | | |
| UI-23 | A8 | Cupom em carrinho vazio | Aplicar `BEMVINDO10` sem itens | Desconto 0; sem quebrar | | ⬜ | | |
| UI-24 | pré-existente | Nome sem sobrenome | Checkout: `Maria` | Recusado com mensagem | | ⬜ | | |
| UI-25 | pré-existente | E-mail inválido | `maria`, `maria@`, `maria@exemplo`, `@exemplo.com` | Recusado | | ⬜ | | |
| UI-26 | pré-existente | CEP | `01310100` ✔, `01310-100` ✔, `0131010` ✘, `013101000` ✘, `0131a100` ✘, vazio ✘ | Conforme marcado | | ⬜ | | |
| UI-27 | fluxo | Confirmar pedido completo | Dados válidos + cupom | Número `VZ-` + 6 dígitos; resumo igual ao do carrinho | | ⬜ | | |
| UI-28 | fluxo | Pedido sem cupom abaixo de 200 | P006 ×1 | Frete 19,90; total 49,80 | | ⬜ | | |
| UI-29 | CA11 | Formatação monetária | Observar todas as telas | `R$ 1.149,50`, duas casas, sem `…0000001` | | ⬜ | | |
| UI-30 | consistência | UI × API | Comparar valores da tela com `POST /api/carrinho/calcular` | Idênticos | | ⬜ | | |
| UI-31 | esperado | Carrinho por aba | Recarregar (F5) na mesma aba; abrir nova aba | F5 mantém; nova aba vazia **(esperado, não reportar)** | | ⬜ | | |
| UI-32 | usabilidade | Responsividade | 375px, 768px, 1366px | Layout íntegro, valores legíveis, botões acessíveis | | ⬜ | | |
| UI-33 | usabilidade | Teclado/acessibilidade básica | Aplicar cupom só com teclado (Tab/Enter) | Fluxo possível; foco visível; Enter aplica | | ⬜ | | |

---

## 2. API

Base: `/api`. Executar via Playwright (`A`) e/ou Postman/curl.

| ID | CA | Caso | Requisição | Esperado | A | Obtido | Status | Evidência | Bug |
|---|---|---|---|---|---|---|---|---|---|
| API-01 | CA01 | Exemplo da documentação | `calcular` P002 ×1 + P004 ×2, `BEMVINDO10` | 200 · 239.7 / 23.97 / 0 / 215.73 · `aplicado:true` | A | | ⬜ | | |
| API-02 | — | Sem cupom | `calcular` P001 ×1 | 200 · desc. 0 · frete 19.9 · total 79.8 · `cupom` coerente | A | | ⬜ | | |
| API-03 | CA02 | Caixa e espaços | `" bemvindo10 "` | Igual a API-01 | A | | ⬜ | | |
| API-04 | CA03 | Cupom inexistente (calcular) | `PROMO50` | **200** · desc. 0 · `aplicado:false` · mensagem "Cupom inválido." | A | | ⬜ | | |
| API-05 | CA04 | Cupom expirado (calcular) | `VERAO2026` | **200** · desc. 0 · `aplicado:false` · mensagem "Cupom expirado." | A | | ⬜ | | |
| API-06 | CA06 | Limite exato 200,00 | P005 ×2 | frete 0 · `freteGratis:true` · faltante 0 | A | | ⬜ | | |
| API-07 | CA06/07 | Logo abaixo 199,90 | P005+P004+P008 | frete 19.9 · faltante 0.1 · total 219.8 | A | | ⬜ | | |
| API-08 | CA08 | Frete usa subtotal sem desconto | P005 ×2 + `BEMVINDO10` | desc. 20 · frete 0 · total 180 | A | | ⬜ | | |
| API-09 | CA09 | Desconto não incide no frete | P005 ×1 + `BEMVINDO10` | desc. 10 · frete 19.9 · total 109.9 | A | | ⬜ | | |
| API-10 | CA11 | Ponto flutuante no desconto | P001 + P002 + `BEMVINDO10` (199,80) | subtotal 199.8 · desc. 19.98 (e não 19.980000000000004) · frete 19.9 · total 199.72 | A | | ⬜ | | |
| API-11 | CA11 | 2 casas decimais em todos os campos | P001+P002, P001+P005×2, P006×3+P004 com `BEMVINDO10` (e outras combinações) | Nenhum valor com mais de 2 casas | A | | ⬜ | | |
| API-12 | CA10 | Limite 5 / 6 em `calcular` | P001 ×5 (200) · ×6 (422) | `QUANTIDADE_MAXIMA_EXCEDIDA` no ×6 · campo `itens[0].quantidade` | A | | ⬜ | | |
| API-13 | CA10 | Limite 5 / 6 em `pedidos` | idem em `/api/pedidos` | 201 no ×5 · 422 no ×6 | A | | ⬜ | | |
| API-14 | — | Quantidades inválidas | `0`, `-1`, `1.5`, `null` | 422 `QUANTIDADE_INVALIDA` | A | | ⬜ | | |
| API-15 | A4 | Quantidade em string / `2.0` | `"2"`, `2.0`, `"abc"`, `true` | Registrar comportamento (ver A4) | | | ⬜ | | |
| API-16 | — | Item duplicado | P001 duas vezes | 422 `ITEM_DUPLICADO` | A | | ⬜ | | |
| API-17 | — | Itens ausentes/vazios | sem `itens` · `[]` | 422 `ITENS_OBRIGATORIOS` | A | | ⬜ | | |
| API-18 | — | Item mal formado | `["P001"]`, `[{}]`, `[null]` | 422 `ITEM_INVALIDO` | A | | ⬜ | | |
| API-19 | — | Produto inexistente | `P999` | 422 `PRODUTO_NAO_ENCONTRADO` | A | | ⬜ | | |
| API-20 | A5 | Cupom ausente / `""` / `null` | `calcular` | 200 sem desconto, sem erro | A | | ⬜ | | |
| API-21 | A6 | Cupom de tipo errado | `123`, `{}`, `[]`, `true` | Registrar comportamento | | | ⬜ | | |
| API-22 | pedidos | Pedido válido | `/api/pedidos` exemplo da doc | 201 · `numero` `VZ-\d{6}` · `criadoEm` ISO · resumo correto | A | | ⬜ | | |
| API-23 | pedidos | CEP normalizado | CEP `01310-100` | `cliente.cep = "01310100"` | A | | ⬜ | | |
| API-24 | CA03/04 | Cupom inválido/expirado em pedidos | `PROMO50` · `VERAO2026` | 422 `CUPOM_INVALIDO` / `CUPOM_EXPIRADO` | A | | ⬜ | | |
| API-25 | pré-existente | Dados do cliente inválidos | nome 1 termo · e-mail sem `@` · CEP 7 dígitos | 422 `DADOS_INVALIDOS` com `campos` | A | | ⬜ | | |
| API-26 | pré-existente | Cliente ausente / objeto vazio | sem `cliente` | 422 `DADOS_INVALIDOS` | | | ⬜ | | |
| API-27 | produtos | Listar | `GET /api/produtos` | 200 · 8 produtos com os campos documentados e preços da tabela | A | | ⬜ | | |
| API-28 | produtos | Consultar | `GET /api/produtos/P001` · `P999` · `p001` | 200 · 404 `PRODUTO_NAO_ENCONTRADO` · (caixa: registrar) | A | | ⬜ | | |
| API-29 | erros | Rota inexistente | `GET /api/xyz` | 404 `ROTA_NAO_ENCONTRADA` | A | | ⬜ | | |
| API-30 | erros | Método não permitido | `DELETE /api/produtos` · `GET /api/carrinho/calcular` · `PUT /api/pedidos` | 405 `METODO_NAO_PERMITIDO` | A | | ⬜ | | |
| API-31 | erros | JSON inválido | corpo `{` · corpo vazio · `[]` | 400 `JSON_INVALIDO` | A | | ⬜ | | |
| API-32 | erros | Formato do erro | qualquer erro | `erro.codigo`, `erro.mensagem`, `erro.campo` presentes | A | | ⬜ | | |
| API-33 | borda | Subtotal máximo | P007 ×5 | 1149.5 · frete 0 | A | | ⬜ | | |
| API-34 | A3 | Vários erros ao mesmo tempo | cupom expirado + qtd 6 · produto inexistente + qtd 0 | Registrar qual erro prevalece (ver A3) | | | ⬜ | | |
| API-35 | consistência | `calcular` × `pedidos` | Mesmos itens/cupom nas duas rotas | Valores monetários idênticos | A | | ⬜ | | |

---

## 3. Exploratórios (sessões livres)

Sessões curtas (15–20 min) com **missão**; anotar achados mesmo quando não viram bug.

| ID | Missão | Ideias | Achados |
|---|---|---|---|
| EXP-01 | Quebrar o campo de cupom | Texto longo, emojis, `<script>`, aspas, só pontuação, colar com quebra de linha, duplo clique em "Aplicar" | |
| EXP-02 | Quebrar o carrinho | Adicionar/remover rápido, voltar do navegador, F5 durante operação, vários produtos com qtd máx. | |
| EXP-03 | Navegação e estado | Aplicar cupom → navegar → voltar; cupom persiste ao recarregar? (carrinho persiste na aba, cupom?) | |
| EXP-04 | Mensagens e textos | Ortografia, acentos, pontuação, consistência entre telas e API | |
| EXP-05 | Checkout | Campos com espaços, maiúsculas no e-mail, nome com acento/hífen/apóstrofo, CEP colado com espaço | |
| EXP-06 | Combinações de cupom × frete | Varrer subtotais em torno de 200 com e sem cupom (ex.: 189,90 · 199,90 · 200,00 · 205,00) | |

---

## 4. Resumo da execução

| Total de casos | ✅ | ❌ | ⚠️ | 🚫 | ⬜ |
|---|---|---|---|---|---|
| | | | | | |
