import { test, expect } from '@playwright/test';
import { calcular, criarPedido, verificarErro } from './helpers';

const P = (produtoId: string, quantidade: unknown) => ({ produtoId, quantidade });

test.describe('Validação de itens e quantidades (CA10)', () => {
  test('API-12 · CA10 · calcular: 5 unidades OK, 6 unidades recusadas', async ({ request }) => {
    const ok = await calcular(request, [P('P001', 5)]);
    expect(ok.status()).toBe(200);

    const nok = await calcular(request, [P('P001', 6)]);
    expect(nok.status()).toBe(422);
    const body = await nok.json();
    verificarErro(body, 'QUANTIDADE_MAXIMA_EXCEDIDA');
    expect(body.erro.campo).toBe('itens[0].quantidade');
  });

  test('API-13 · CA10 · pedidos: o limite de 5 também vale (API)', async ({ request }) => {
    const ok = await criarPedido(request, [P('P001', 5)]);
    expect(ok.status()).toBe(201);

    const nok = await criarPedido(request, [P('P001', 6)]);
    expect(nok.status()).toBe(422);
    verificarErro(await nok.json(), 'QUANTIDADE_MAXIMA_EXCEDIDA');
  });

  test('API-12b · CA10 · limite é por produto, e não pelo total de itens', async ({ request }) => {
    const res = await calcular(request, [P('P001', 5), P('P004', 5)]);
    expect(res.status()).toBe(200);
  });

  for (const qtd of [0, -1, 1.5, null]) {
    test(`API-14 · quantidade ${JSON.stringify(qtd)} é inválida`, async ({ request }) => {
      const res = await calcular(request, [P('P001', qtd)]);
      expect(res.status()).toBe(422);
      verificarErro(await res.json(), 'QUANTIDADE_INVALIDA');
    });
  }

  test('API-16 · mesmo produto duas vezes → ITEM_DUPLICADO', async ({ request }) => {
    const res = await calcular(request, [P('P001', 1), P('P001', 2)]);
    expect(res.status()).toBe(422);
    verificarErro(await res.json(), 'ITEM_DUPLICADO');
  });

  test('API-17 · itens ausentes ou vazios → ITENS_OBRIGATORIOS', async ({ request }) => {
    const vazio = await calcular(request, []);
    expect(vazio.status()).toBe(422);
    verificarErro(await vazio.json(), 'ITENS_OBRIGATORIOS');

    const ausente = await request.post('/api/carrinho/calcular', { data: {} });
    expect(ausente.status()).toBe(422);
    verificarErro(await ausente.json(), 'ITENS_OBRIGATORIOS');
  });

  // API-18 Reorganizando em duas partes para cobrir a Ambiguidade A12

  // Itens que não são objetos válidos(string, nulos ...)
  for (const item of ['P001', null]) {
    test(`API-18a · item não-objeto ${JSON.stringify(item)} → ITEM_INVALIDO`, async ({ request }) => {
      const res = await calcular(request, [item]);
      expect(res.status()).toBe(422);
      verificarErro(await res.json(), 'ITEM_INVALIDO');
    });
  }

  // Objetos com dados ou estrutura incompletos
  for (const item of [{}, { produtoId: 'P001' }]) {
    test(`API-18b · item com formato incompleto ${JSON.stringify(item)} → ITEM_INVALIDO`, async ({ request }) => {
      const res = await calcular(request, [item]);
      expect(res.status()).toBe(422);
      verificarErro(await res.json(), 'ITEM_INVALIDO');
    });
  }

  test('API-19 · produto inexistente → PRODUTO_NAO_ENCONTRADO (422)', async ({ request }) => {
    const res = await calcular(request, [P('P999', 1)]);
    expect(res.status()).toBe(422);
    verificarErro(await res.json(), 'PRODUTO_NAO_ENCONTRADO');
  });
});
