# 🧪 Verzel Store · Teste Técnico QA Júnior

![QA](https://img.shields.io/badge/QA-Software%20Testing-blue)
![API Testing](https://img.shields.io/badge/API-Testing-orange)
![Playwright](https://img.shields.io/badge/Automation-Playwright-green)
![Gherkin](https://img.shields.io/badge/Gherkin-BDD-purple)
![TypeScript](https://img.shields.io/badge/TypeScript-Testing-blue)
![Status](https://img.shields.io/badge/Status-Concluído-success)

Projeto desenvolvido como parte de um **teste técnico para a posição de QA Júnior**, com o objetivo de validar a entrega **VZS-142 — Cupom de desconto e frete grátis**, versão **2.3.0**, da Verzel Store.

O trabalho contempla análise da documentação, elaboração de cenários BDD/Gherkin, testes manuais e exploratórios, validação da API, automação com Playwright, registro de defeitos e organização das evidências.

---

## 👨‍💻 Autor

**Manoel Amancio da Silva Neto**

📍 Paulista – PE
💼 QA / Testes de Software
💻 Interesse em Qualidade de Software, Automação de Testes e Desenvolvimento Full Stack

---

# 📋 Sobre o teste

A entrega **VZS-142** adiciona à Verzel Store funcionalidades relacionadas a:

* Aplicação de cupons de desconto;
* Cálculo de descontos;
* Frete grátis;
* Regras de valor mínimo para frete grátis;
* Validações de cupons;
* Validação de itens e quantidades;
* Criação de pedidos;
* Validações de dados do cliente;
* Regras de negócio relacionadas ao carrinho.

O objetivo deste projeto foi verificar se a implementação atende aos critérios definidos na documentação e se o comportamento da aplicação permanece consistente em diferentes cenários.

---

# 🎯 Objetivos dos testes

Os testes foram realizados com foco em:

* Validar os critérios de aceitação da entrega;
* Identificar comportamentos inesperados;
* Validar regras de negócio;
* Testar cenários positivos e negativos;
* Testar valores de fronteira;
* Validar respostas da API;
* Verificar contratos e códigos HTTP;
* Validar integração entre funcionalidades;
* Realizar testes exploratórios;
* Automatizar cenários relevantes;
* Registrar e documentar defeitos encontrados;
* Produzir evidências das execuções.

---

# 🧪 Estratégia de testes

A estratégia utilizada foi dividida nas seguintes etapas:

```text
Análise da documentação
        ↓
Identificação das regras de negócio
        ↓
Elaboração dos cenários Gherkin
        ↓
Casos de teste
        ↓
Testes manuais
        ↓
Testes exploratórios
        ↓
Testes de API
        ↓
Automação com Playwright
        ↓
Registro de bugs
        ↓
Evidências
        ↓
Análise dos resultados
```

---

# 📚 Critérios de aceitação

Durante a análise da documentação foram consideradas as regras de negócio identificadas como **CA01 a CA11**.

Entre os principais pontos validados estão:

* Aplicação de cupom válido;
* Cálculo correto do desconto;
* Cupons inválidos;
* Cupons expirados;
* Cupons com diferentes formatos;
* Tratamento de espaços e diferenças de caixa;
* Frete grátis;
* Valor mínimo para frete grátis;
* Validação de quantidade de produtos;
* Validação dos dados do cliente;
* Criação de pedidos;
* Consistência entre cálculo e pedido.

---

# 🔎 Testes de fronteira

Foi aplicada a técnica de **Boundary Value Analysis**, principalmente na regra de frete grátis.

Foram considerados valores próximos ao limite definido:

|         Valor | Objetivo                                |
| ------------: | --------------------------------------- |
|     R$ 199,89 | Abaixo do limite                        |
| **R$ 199,90** | Limite                                  |
|     R$ 199,91 | Acima do limite                         |
|     R$ 200,00 | Cenário de validação do limite superior |

Essa abordagem permite verificar se a regra é aplicada corretamente tanto no limite quanto imediatamente antes e depois dele.

---

# 🧮 Validação de valores monetários

Durante os testes de API, os valores monetários foram tratados preferencialmente como **centavos inteiros**, evitando problemas relacionados à representação de números decimais em ponto flutuante.

Exemplo:

```text
R$ 199,90 → 19990 centavos
R$ 200,00 → 20000 centavos
```

Essa abordagem permite comparar os valores esperados de maneira mais confiável.

Também foram observados possíveis ruídos de ponto flutuante nos cálculos.

---

# 🗂️ Estrutura do projeto

```text
verzel-store-testeQA/
│
├── automacao/
│   ├── tests/
│   │   ├── api/
│   │   │   ├── calculo.spec.ts
│   │   │   ├── validacoes.spec.ts
│   │   │   ├── pedidos.spec.ts
│   │   │   └── contrato.spec.ts
│   │   │
│   │   └── ui/
│   │       └── cupom-frete.spec.ts
│   │
│   └── package.json
│
├── bugs/
│   ├── README.md
│   └── ...
│
├── cenarios/
│   ├── ...
│   └── *.feature
│
├── docs/
│   └── analise-da-documentacao.md
│
├── evidencias/
│   ├── EVIDENCIAS.md
│   └── prints/
│
├── execucao/
│   └── casos-de-teste.md
│
├── .gitignore
│
└── README.md
```

---

# 🥒 Cenários BDD / Gherkin

Os cenários foram escritos utilizando **Gherkin**, buscando representar o comportamento esperado da aplicação de forma clara e próxima à linguagem de negócio.

Foram contemplados:

* Cenários positivos;
* Cenários negativos;
* Valores de fronteira;
* Cupons válidos;
* Cupons inválidos;
* Cupons expirados;
* Regras de frete;
* Validações de produtos;
* Validações de quantidade;
* Validações de pedidos;
* Cenários de regressão.

Os arquivos podem ser encontrados em:

📁 `cenarios/`

---

# 🖥️ Testes manuais e exploratórios

Foram realizados testes manuais na aplicação com o objetivo de validar o comportamento funcional da entrega.

Além dos cenários previamente definidos, foram realizados testes exploratórios buscando identificar comportamentos não necessariamente descritos diretamente nos critérios de aceitação.

Foram observados, entre outros pontos:

* Comportamento do carrinho;
* Aplicação e remoção de cupons;
* Alteração de quantidades;
* Valores próximos aos limites;
* Dados inválidos;
* Mensagens de erro;
* Comportamentos inesperados;
* Consistência dos valores apresentados;
* Fluxo de criação de pedidos.

Os casos executados estão documentados em:

📁 `execucao/casos-de-teste.md`

---

# 🔌 Testes de API

A API foi testada diretamente para validar tanto as regras de negócio quanto o comportamento dos endpoints.

Foram considerados:

* Status codes HTTP;
* Payloads válidos;
* Payloads inválidos;
* Campos obrigatórios;
* Produtos inexistentes;
* Quantidades inválidas;
* Cupons inválidos;
* Cupons expirados;
* Cálculo de descontos;
* Cálculo de frete;
* Frete grátis;
* Criação de pedidos;
* Consistência entre endpoints;
* Formato das respostas;
* Tratamento de erros.

### Endpoints analisados

```text
/api
/api/produtos
/api/calcular
/api/pedidos
```

Os testes automatizados da API estão organizados em:

```text
automacao/tests/api/
```

---

# 🤖 Automação de testes

Foi utilizada a ferramenta **Playwright** para automatização dos testes.

A automação foi desenvolvida utilizando **TypeScript** e organizada por responsabilidade.

### Automação da API

```text
tests/api/calculo.spec.ts
tests/api/validacoes.spec.ts
tests/api/pedidos.spec.ts
tests/api/contrato.spec.ts
```

### Automação da interface

```text
tests/ui/cupom-frete.spec.ts
```

A automação contempla cenários relacionados a:

* Cálculo;
* Cupons;
* Frete;
* Validações;
* Pedidos;
* Contratos HTTP;
* Regras de negócio;
* Cenários positivos e negativos.

---

# 🧪 Execução da automação

Entre na pasta de automação:

```bash
cd automacao
```

Instale as dependências:

```bash
npm install
```

Instale o navegador utilizado pelo Playwright:

```bash
npx playwright install chromium
```

### Executar testes de API

```bash
npm run test:api
```

### Executar todos os testes

```bash
npm run test
```

### Gerar/visualizar relatório

```bash
npm run report
```

Também é possível definir a URL da aplicação através da variável:

```bash
BASE_URL=https://verzel-store.qa-test-verzel-store.workers.dev npm run test:api
```

---

# 🐞 Bugs encontrados

Os defeitos identificados durante a execução foram documentados individualmente.

Cada registro contém informações como:

* Identificação do problema;
* Título;
* Ambiente;
* Pré-condições;
* Passos para reprodução;
* Resultado esperado;
* Resultado atual;
* Severidade;
* Evidências;
* Observações.

Os registros estão disponíveis em:

📁 `bugs/`

O índice dos defeitos pode ser consultado em:

📁 `bugs/README.md`

---

# 📸 Evidências

As evidências dos testes foram organizadas para facilitar a análise e rastreabilidade dos resultados.

Estão disponíveis em:

📁 `evidencias/`

E o índice das evidências em:

📄 `evidencias/EVIDENCIAS.md`

As evidências incluem registros visuais e informações relacionadas aos cenários executados.

---

# 📊 Cobertura de testes

A cobertura foi construída considerando diferentes níveis e técnicas de teste:

| Tipo de teste                  | Executado |
| ------------------------------ | :-------: |
| Teste funcional                |     ✅     |
| Teste manual                   |     ✅     |
| Teste exploratório             |     ✅     |
| Teste de API                   |     ✅     |
| Teste de contrato              |     ✅     |
| Teste negativo                 |     ✅     |
| Teste de fronteira             |     ✅     |
| Teste de regressão             |     ✅     |
| Teste automatizado             |     ✅     |
| Validação de regras de negócio |     ✅     |
| Registro de defeitos           |     ✅     |
| Coleta de evidências           |     ✅     |

---

# 🧠 Técnicas utilizadas

Durante o desenvolvimento do teste foram utilizadas técnicas e conceitos de QA, incluindo:

* **Boundary Value Analysis**
* **Negative Testing**
* **Positive Testing**
* **Exploratory Testing**
* **Functional Testing**
* **API Testing**
* **Regression Testing**
* **Contract Testing**
* **Equivalence/variações de entrada**
* Validação de regras de negócio
* Validação de códigos HTTP
* Análise de respostas da API
* Rastreabilidade entre requisitos, testes e evidências

---

# 🛠️ Tecnologias e ferramentas

### Testes

* Playwright
* TypeScript
* Gherkin / BDD
* REST API
* JSON
* HTTP

### Desenvolvimento e execução

* Node.js
* npm
* Git
* GitHub
* VS Code
* DevTools

### Documentação

* Markdown
* Evidências de execução
* Casos de teste
* Relatórios de defeitos

---

# 🤖 Uso de Inteligência Artificial

A Inteligência Artificial foi utilizada como **ferramenta de apoio ao processo de QA**, principalmente para:

* Auxiliar na interpretação da documentação;
* Identificar possíveis cenários de teste;
* Sugerir cenários positivos, negativos e de fronteira;
* Apoiar a estruturação dos cenários em Gherkin;
* Organizar casos de teste;
* Apoiar a revisão dos testes automatizados;
* Auxiliar na análise de possíveis inconsistências;
* Apoiar a revisão da documentação;
* Auxiliar na organização dos registros de defeitos.

Um exemplo foi a identificação da necessidade de testar valores próximos ao limite de frete grátis, como **R$ 199,90 e R$ 200,00**.

A IA não foi utilizada como substituta da execução ou da análise de QA.

A definição final dos cenários, interpretação das regras, execução dos testes, validação dos resultados, investigação dos defeitos, classificação da severidade e coleta das evidências foram realizadas e validadas no ambiente de testes.

---

# 🚫 Escopo não contemplado

O foco deste teste foi a validação funcional da entrega.

Não fizeram parte do escopo principal:

* Testes de carga;
* Testes de stress;
* Testes de performance;
* Testes de segurança aprofundados;
* Pentest;
* Testes de infraestrutura.

---

# 📌 Considerações finais

O teste foi conduzido buscando reproduzir um fluxo próximo ao encontrado em um projeto real de QA:

```text
Requisito
   ↓
Análise
   ↓
Cenários
   ↓
Execução
   ↓
Evidências
   ↓
Defeitos
   ↓
Automação
   ↓
Resultado
```

O objetivo não foi apenas verificar se os cenários principais funcionavam, mas também explorar **limites, entradas inválidas, regras de negócio, contratos da API e possíveis comportamentos inesperados**.

Todos os testes descritos neste projeto foram **executados e validados no ambiente disponibilizado para o teste técnico**.

---

## 🔗 Links

**Aplicação:**
[Verzel Store](https://verzel-store.qa-test-verzel-store.workers.dev/?utm_source=chatgpt.com)

**Documentação da API:**
[Documentação da Verzel Store](https://verzel-store.qa-test-verzel-store.workers.dev/documentacao?utm_source=chatgpt.com)

**Repositório:**
[GitHub — verzel-store-testeQA](https://github.com/manoelamanciio/verzel-store-testeQA?utm_source=chatgpt.com)

---

## 👨‍💻 Sobre o autor

**Manoel Amancio da Silva Neto**

Profissional em transição para a área de tecnologia, com foco em **Qualidade de Software, Testes e Desenvolvimento Full Stack**.

Atualmente desenvolvendo conhecimentos em:

* QA e automação de testes;
* Java;
* Spring Boot;
* APIs REST;
* SQL;
* React;
* JavaScript;
* Git/GitHub.

📌 **Objetivo:** oportunidade como **QA Júnior, QA Estágio ou Desenvolvedor Full Stack Júnior/Estágio**.
