import { test, expect } from '@playwright/test';
import { PRECOS, verificarErro } from './helpers';

test.describe('Contrato da API · produtos e erros', () => {
  test('API-27 · GET /api/produtos lista os 8 produtos com preços corretos', async ({ request }) => {
    const res = await request.get('/api/produtos');
    expect(res.status()).toBe(200);
    const produtos = await res.json();
    expect(produtos).toHaveLength(8);
    for (const p of produtos) {
      expect(p).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          nome: expect.any(String),
          descricao: expect.any(String),
          categoria: expect.any(String),
          preco: expect.any(Number),
        }),
      );
      expect(p.preco, `preço de ${p.id}`).toBe(PRECOS[p.id]);
    }
  });

  test('API-28 · GET /api/produtos/{id} existente', async ({ request }) => {
    const res = await request.get('/api/produtos/P001');
    expect(res.status()).toBe(200);
    expect((await res.json()).nome).toBe('Camiseta Essencial');
  });

  test('API-28 · GET /api/produtos/{id} inexistente → 404', async ({ request }) => {
    const res = await request.get('/api/produtos/P999');
    expect(res.status()).toBe(404);
    verificarErro(await res.json(), 'PRODUTO_NAO_ENCONTRADO');
  });

  test('API-29 · rota inexistente → 404 ROTA_NAO_ENCONTRADA', async ({ request }) => {
    const res = await request.get('/api/inexistente');
    expect(res.status()).toBe(404);
    verificarErro(await res.json(), 'ROTA_NAO_ENCONTRADA');
  });

  const metodosInvalidos: [string, string][] = [
    ['DELETE', '/api/produtos'],
    ['POST', '/api/produtos'],
    ['GET', '/api/carrinho/calcular'],
    ['PUT', '/api/pedidos'],
  ];
  for (const [metodo, rota] of metodosInvalidos) {
    test(`API-30 · ${metodo} ${rota} → 405 METODO_NAO_PERMITIDO`, async ({ request }) => {
      const res = await request.fetch(rota, { method: metodo });
      expect(res.status()).toBe(405);
      verificarErro(await res.json(), 'METODO_NAO_PERMITIDO');
    });
  }

  for (const corpo of ['{', 'não é json', '[]', '"texto"']) {
    test(`API-31 · corpo ${JSON.stringify(corpo)} → 400 JSON_INVALIDO`, async ({ request }) => {
      const res = await request.post('/api/carrinho/calcular', {
        headers: { 'Content-Type': 'application/json' },
        data: corpo,
      });
      expect(res.status()).toBe(400);
      verificarErro(await res.json(), 'JSON_INVALIDO');
    });
  }
});
