import { test, expect } from '@playwright/test';
import { CLIENTE_VALIDO, calcular, criarPedido, esperado, verificarErro, verificarResumo } from './helpers';

const P = (produtoId: string, quantidade: number) => ({ produtoId, quantidade });

test.describe('Pedidos · POST /api/pedidos', () => {
  test('API-22 · pedido válido com cupom (exemplo da documentação)', async ({ request }) => {
    const itens = [P('P005', 1)];
    const res = await criarPedido(request, itens, 'BEMVINDO10');
    expect(res.status()).toBe(201);
    const body = await res.json();

    expect(body.numero).toMatch(/^VZ-\d{6}$/);
    expect(Number.isNaN(Date.parse(body.criadoEm))).toBe(false);
    expect(body.subtotal).toBe(100);
    expect(body.desconto).toBe(10);
    expect(body.frete).toBe(19.9);
    expect(body.freteGratis).toBe(false);
    expect(body.valorFaltanteFreteGratis).toBe(100);
    expect(body.total).toBe(109.9);
    expect(body.cupom).toMatchObject({ codigo: 'BEMVINDO10', aplicado: true });
  });

  test('API-23 · CEP é devolvido sem hífen', async ({ request }) => {
    const res = await criarPedido(request, [P('P005', 1)]);
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.cliente.cep).toBe('01310100');
    expect(body.cliente.nome).toBe(CLIENTE_VALIDO.nome);
    expect(body.cliente.email).toBe(CLIENTE_VALIDO.email);
  });

  test('API-24 · CA03 · cupom inexistente no pedido → 422 CUPOM_INVALIDO', async ({ request }) => {
    const res = await criarPedido(request, [P('P005', 1)], 'PROMO50');
    expect(res.status()).toBe(422);
    verificarErro(await res.json(), 'CUPOM_INVALIDO');
  });

  test('API-24 · CA04 · cupom expirado no pedido → 422 CUPOM_EXPIRADO', async ({ request }) => {
    const res = await criarPedido(request, [P('P005', 1)], 'VERAO2026');
    expect(res.status()).toBe(422);
    verificarErro(await res.json(), 'CUPOM_EXPIRADO');
  });

  test('API-35 · calcular e pedidos retornam os mesmos valores', async ({ request }) => {
    const itens = [P('P003', 1), P('P006', 2)];
    const calc = await (await calcular(request, itens, 'BEMVINDO10')).json();
    const resPedido = await criarPedido(request, itens, 'BEMVINDO10');
    expect(resPedido.status()).toBe(201);
    const pedido = await resPedido.json();
    verificarResumo(pedido, esperado(itens, 10));
    for (const campo of ['subtotal', 'desconto', 'frete', 'freteGratis', 'valorFaltanteFreteGratis', 'total']) {
      expect(pedido[campo], campo).toEqual(calc[campo]);
    }
  });

  const clientesInvalidos = [
    { nome: 'nome com um termo só', cliente: { ...CLIENTE_VALIDO, nome: 'Maria' } },
    { nome: 'e-mail sem @', cliente: { ...CLIENTE_VALIDO, email: 'mariaexemplo.com' } },
    { nome: 'e-mail sem domínio', cliente: { ...CLIENTE_VALIDO, email: 'maria@' } },
    { nome: 'CEP com 7 dígitos', cliente: { ...CLIENTE_VALIDO, cep: '0131010' } },
    { nome: 'CEP com 9 dígitos', cliente: { ...CLIENTE_VALIDO, cep: '013101000' } },
    { nome: 'CEP com letra', cliente: { ...CLIENTE_VALIDO, cep: '0131a100' } },
  ];
  for (const c of clientesInvalidos) {
    test(`API-25 · cliente inválido: ${c.nome} → DADOS_INVALIDOS`, async ({ request }) => {
      const res = await criarPedido(request, [P('P005', 1)], undefined, c.cliente);
      expect(res.status()).toBe(422);
      const body = await res.json();
      verificarErro(body, 'DADOS_INVALIDOS');
      expect(body.campos ?? body.erro.campos, 'detalhes em "campos"').toBeTruthy();
    });
  }

  for (const cep of ['01310100', '01310-100']) {
    test(`API-25b · CEP ${cep} é aceito (com ou sem hífen)`, async ({ request }) => {
      const res = await criarPedido(request, [P('P005', 1)], undefined, { ...CLIENTE_VALIDO, cep });
      expect(res.status()).toBe(201);
    });
  }
});
