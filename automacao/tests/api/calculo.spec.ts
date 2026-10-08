import { test, expect } from '@playwright/test';
import { calcular, esperado, verificarResumo, casasDecimais } from './helpers';

const P = (produtoId: string, quantidade: number) => ({ produtoId, quantidade });

test.describe('Cálculo do carrinho · POST /api/carrinho/calcular', () => {
  test('API-01 · CA01 · BEMVINDO10 aplica 10% (exemplo da documentação)', async ({ request }) => {
    const itens = [P('P002', 1), P('P004', 2)];
    const res = await calcular(request, itens, 'BEMVINDO10');
    expect(res.status()).toBe(200);
    const body = await res.json();

    // Valores literais da documentação
    expect(body.subtotal).toBe(239.7);
    expect(body.desconto).toBe(23.97);
    expect(body.frete).toBe(0);
    expect(body.freteGratis).toBe(true);
    expect(body.total).toBe(215.73);
    expect(body.cupom).toMatchObject({ codigo: 'BEMVINDO10', aplicado: true });
    verificarResumo(body, esperado(itens, 10));
  });

  test('API-02 · sem cupom: frete cobrado abaixo de R$ 200', async ({ request }) => {
    const itens = [P('P001', 1)];
    const res = await calcular(request, itens);
    expect(res.status()).toBe(200);
    const body = await res.json();
    verificarResumo(body, esperado(itens, 0));
    expect(body.desconto).toBe(0);
    expect(body.frete).toBe(19.9);
    expect(body.total).toBe(79.8);
  });

  for (const digitado of ['bemvindo10', 'BemVindo10', '  BEMVINDO10  ', '\tbemvindo10 ']) {
    test(`API-03 · CA02 · cupom ${JSON.stringify(digitado)} é aceito`, async ({ request }) => {
      const itens = [P('P002', 1), P('P004', 2)];
      const res = await calcular(request, itens, digitado);
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.cupom.aplicado).toBe(true);
      expect(body.desconto).toBe(23.97);
      expect(body.total).toBe(215.73);
    });
  }

  test('API-04 · CA03 · cupom inexistente não gera erro e não desconta', async ({ request }) => {
    const itens = [P('P002', 1), P('P004', 2)];
    const res = await calcular(request, itens, 'PROMO50');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.cupom.aplicado).toBe(false);
    expect(body.cupom.mensagem).toBe('Cupom inválido.');
    expect(body.desconto).toBe(0);
    verificarResumo(body, esperado(itens, 0));
  });

  for (const codigo of ['VERAO2026', 'verao2026']) {
    test(`API-05 · CA04 · cupom expirado ${codigo} não desconta`, async ({ request }) => {
      const itens = [P('P002', 1), P('P004', 2)];
      const res = await calcular(request, itens, codigo);
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.cupom.aplicado).toBe(false);
      expect(body.cupom.mensagem).toBe('Cupom expirado.');
      expect(body.desconto).toBe(0);
      verificarResumo(body, esperado(itens, 0));
    });
  }

  const limites = [
    { nome: 'API-07 · CA06/07 · subtotal 199,90 (logo abaixo do limite)', itens: [P('P005', 1), P('P004', 1), P('P008', 1)], gratis: false },
    { nome: 'API-06 · CA06 · subtotal 200,00 (limite inclusive)', itens: [P('P005', 2)], gratis: true },
    { nome: 'API-33 · subtotal máximo 1149,50', itens: [P('P007', 5)], gratis: true },
  ];
  for (const c of limites) {
    test(c.nome, async ({ request }) => {
      const res = await calcular(request, c.itens);
      expect(res.status()).toBe(200);
      const body = await res.json();
      verificarResumo(body, esperado(c.itens));
      expect(body.freteGratis).toBe(c.gratis);
    });
  }

  test('API-08 · CA08 · frete grátis considera o subtotal ANTES do desconto', async ({ request }) => {
    const itens = [P('P005', 2)]; // subtotal 200,00; com desconto ficaria 180,00
    const res = await calcular(request, itens, 'BEMVINDO10');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.subtotal).toBe(200);
    expect(body.desconto).toBe(20);
    expect(body.frete).toBe(0);
    expect(body.freteGratis).toBe(true);
    expect(body.total).toBe(180);
  });

  test('API-09 · CA09 · desconto não incide sobre o frete', async ({ request }) => {
    const itens = [P('P005', 1)];
    const res = await calcular(request, itens, 'BEMVINDO10');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.desconto).toBe(10); // 10% de 100,00 (e não de 119,90)
    expect(body.frete).toBe(19.9);
    expect(body.total).toBe(109.9);
  });

  test('API-10 · CA11 · sem ruído de ponto flutuante no desconto (199,80 × 10%)', async ({ request }) => {
    // Cálculo ingênuo em float: 199.8 * 0.1 = 19.980000000000004
    const itens = [P('P001', 1), P('P002', 1)];
    const res = await calcular(request, itens, 'BEMVINDO10');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.subtotal).toBe(199.8);
    expect(body.desconto).toBe(19.98);
    expect(body.frete).toBe(19.9); // 199,80 < 200,00
    expect(body.total).toBe(199.72);
    verificarResumo(body, esperado(itens, 10));
  });

  test('API-10b · soma de centavos (59,90 × 3)', async ({ request }) => {
    const itens = [P('P001', 3)];
    const res = await calcular(request, itens);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.subtotal).toBe(179.7);
    expect(body.valorFaltanteFreteGratis).toBe(20.3);
    expect(body.total).toBe(199.6);
  });

  test('API-11 · CA11 · no máximo 2 casas decimais em todos os valores', async ({ request }) => {
    const combinacoes = [
      { itens: [P('P001', 1), P('P002', 1)], cupom: 'BEMVINDO10' },
      { itens: [P('P001', 1), P('P005', 2)], cupom: 'BEMVINDO10' },
      { itens: [P('P006', 3), P('P004', 1)], cupom: 'BEMVINDO10' },
      { itens: [P('P003', 1), P('P001', 1)], cupom: undefined },
    ];
    for (const { itens, cupom } of combinacoes) {
      const res = await calcular(request, itens, cupom);
      expect(res.status()).toBe(200);
      const body = await res.json();
      for (const campo of ['subtotal', 'desconto', 'frete', 'valorFaltanteFreteGratis', 'total']) {
        expect(casasDecimais(body[campo]), `${campo}=${body[campo]}`).toBeLessThanOrEqual(2);
      }
      for (const linha of body.itens) {
        expect(casasDecimais(linha.total), `item.total=${linha.total}`).toBeLessThanOrEqual(2);
      }
    }
  });

  test('API-20 · cupom ausente, vazio ou nulo é tratado como "sem cupom"', async ({ request }) => {
    for (const cupom of [undefined, '', null]) {
      const res = await calcular(request, [P('P002', 1)], cupom);
      expect(res.status(), `cupom=${JSON.stringify(cupom)}`).toBe(200);
      const body = await res.json();
      expect(body.desconto).toBe(0);
    }
  });
});
