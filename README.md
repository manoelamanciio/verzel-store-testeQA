# Verzel Store · Teste técnico QA Júnior

Validação da entrega **VZS-142 · Cupom de desconto e frete grátis** (v2.3.0).

- Loja: https://verzel-store.qa-test-verzel-store.workers.dev/
- Documentação: https://verzel-store.qa-test-verzel-store.workers.dev/documentacao
- API: https://verzel-store.qa-test-verzel-store.workers.dev/api

**Autor:** _(Manoel Amancio)_ · **Data da execução:** _(06/10 - 08/10)_

---

## Onde encontrar cada entrega

| Entrega pedida | Onde está |
|---|---|
| Cenários de teste (Gherkin) | [`cenarios/`](cenarios/) (5 arquivos `.feature`, organizados por funcionalidade) |
| Análise, interpretações e ambiguidades | [`docs/analise-da-documentacao.md`](docs/analise-da-documentacao.md) |
| Execução dos testes (manual e exploratória) com resultado | [`execucao/casos-de-teste.md`](execucao/casos-de-teste.md) |
| Report dos bugs | [`bugs/`](bugs/) (índice em `bugs/README.md`, um arquivo por bug) |
| Evidências da execução | [`evidencias/EVIDENCIAS.md`](evidencias/EVIDENCIAS.md) + prints em [`evidencias/prints/`](evidencias/prints/) |
| Automação com Playwright | [`automacao/`](automacao/) |

## Estratégia de teste

1. **Análise da documentação**: extração das regras (CA01–CA11), cálculo de dados de fronteira e lista de ambiguidades com a interpretação adotada.
2. **Cenários em Gherkin**: cobrindo cada critério de aceite, valores-limite (R$ 199,90 / 200,00), cenários negativos e regressão das validações antigas (nome, e-mail, CEP).
3. **Execução manual** na interface e **exploratória** por missões curtas.
4. **Testes de API**: como os cálculos vêm da API, o contrato e as regras de negócio são verificados direto nela. Os valores esperados são calculados em centavos (inteiros) no próprio teste para não depender de ponto flutuante.
5. **Reporte** de bugs com passos, esperado × obtido, severidade e evidência.

Fora do escopo (conforme o enunciado): carga, estresse e segurança. O comportamento listado em "Sobre este ambiente" (carrinho por aba, pedidos não gravados, sem e-mail/estoque etc.) foi tratado como esperado e **não** foi reportado como bug.

## Como rodar a automação

Pré-requisitos: Node.js 18+.

```bash
cd automacao
npm install
npx playwright install chromium     # só necessário para os testes de UI

npm run test:api                    # testes de API (não precisam de navegador)
npm run test                        # tudo
npm run report                      # abre o relatório HTML
```

Para apontar para outro endereço: `BASE_URL=https://... npm run test:api`.

A configuração usa apenas 2 workers para não sobrecarregar o ambiente compartilhado.

### O que está automatizado

| Arquivo | Conteúdo |
|---|---|
| `tests/api/calculo.spec.ts` | CA01, CA02, CA03, CA04, CA06–CA09, CA11: cupom, caixa/espaços, inválido/expirado, limite do frete grátis (199,90 / 200,00), subtotal antes do desconto, ruído de ponto flutuante |
| `tests/api/validacoes.spec.ts` | CA10 e validação de itens: 5 × 6 unidades, quantidades inválidas, duplicados, vazios, produto inexistente |
| `tests/api/pedidos.spec.ts` | `/api/pedidos`: pedido válido, formato `VZ-000000`, CEP normalizado, cupom inválido/expirado (422), validação de cliente, consistência com `/calcular` |
| `tests/api/contrato.spec.ts` | Produtos, 404, 405, 400 e formato dos erros |
| `tests/ui/cupom-frete.spec.ts` | Esqueleto de 3 cenários de UI (`test.fixme`), com valores esperados prontos |

> **Sobre as asserções:** algumas verificações refletem a minha interpretação da documentação (ver ambiguidades A3–A6 na análise). Um teste vermelho **não é automaticamente um bug**: confirme manualmente e compare com a documentação antes de reportar.

## Status do trabalho

- [x] Análise da documentação e cenários em Gherkin
- [x] Casos de teste prontos para execução
- [x] Projeto Playwright com testes de API
- [x] Executar os casos manuais e exploratórios e preencher `execucao/casos-de-teste.md`
- [x] Rodar `npm run test:api` e conferir cada falha (bug ou interpretação?)
- [x] Reportar os bugs em `bugs/` e atualizar o índice
- [x] Anexar prints em `evidencias/prints/` e preencher `evidencias/EVIDENCIAS.md`
- [x] Completar a automação de UI com os seletores reais


## Uso de IA

A Inteligência Artificial foi utilizada como ferramenta de apoio durante a elaboração e execução deste teste técnico, principalmente para aumentar a produtividade e auxiliar na revisão dos artefatos.

### Como a IA foi utilizada

* Apoio na interpretação e organização dos critérios de aceite da documentação.
* Auxílio na identificação de possíveis cenários de teste, incluindo cenários positivos, negativos e casos de fronteira.
* Apoio na estruturação dos cenários em Gherkin.
* Sugestões para organização dos casos de teste e evidências.
* Auxílio na revisão da estrutura dos testes automatizados com Playwright.
* Apoio na identificação de possíveis ambiguidades nas regras de negócio, que posteriormente foram analisadas e validadas com base na documentação e no comportamento da aplicação.
* Auxílio na revisão textual dos relatos de bugs, mantendo uma estrutura clara com passos para reprodução, resultado esperado, resultado obtido, severidade e evidências.
* Apoio na análise de erros encontrados durante a automação e na investigação de possíveis causas.

### Papel da IA x responsabilidade do teste

A IA foi utilizada como **assistente**, não como substituta da análise de QA.

A definição dos cenários finais, interpretação das regras, execução dos testes, validação dos resultados, investigação das falhas, classificação dos bugs e coleta das evidências foram realizadas e validadas manualmente.

Quando uma sugestão da IA apresentou uma interpretação diferente da documentação ou do comportamento esperado da aplicação, a decisão final foi tomada com base nos critérios de aceite e nas evidências obtidas durante os testes.

### Exemplo de utilização

Durante a elaboração da automação, a IA foi utilizada para sugerir estruturas de teste e possíveis casos de fronteira. Um exemplo foi a análise do limite para frete grátis:

* R$ 199,90 → não deve conceder frete grátis;
* R$ 200,00 → deve conceder frete grátis.

A partir dessas sugestões, os cenários foram implementados e posteriormente validados diretamente contra a API e a aplicação.

### Transparência

Todo resultado apresentado neste repositório foi validado contra o ambiente de teste. A utilização de IA teve como objetivo apoiar a análise, documentação e desenvolvimento dos testes, mantendo a responsabilidade técnica e a validação dos resultados sob minha responsabilidade.
