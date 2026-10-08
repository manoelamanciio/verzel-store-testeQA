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

> _Rascunho: ajuste para refletir exatamente o que você fez e reaproveite no campo "Onde e como você usou IA" do formulário._

Usei o Claude (Anthropic) como apoio para: estruturar a análise da documentação, calcular dados de fronteira, redigir os cenários em Gherkin, montar o esqueleto do repositório e escrever os testes de API em Playwright. A execução dos testes na loja, a conferência dos resultados, a decisão do que é bug e a redação final dos relatos foram feitas por mim. Revisei todo o conteúdo gerado antes de incluí-lo.
