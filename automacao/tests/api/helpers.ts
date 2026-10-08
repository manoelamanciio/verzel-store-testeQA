import { APIRequestContext, APIResponse, expect } from '@playwright/test';

export type Item = { produtoId: string; quantidade: unknown };

/** Preços fixos da documentação (Dados para teste). */
export const PRECOS: Record<string, number> = {
  P001: 59.9,
  P002: 139.9,
  P003: 189.9,
  P004: 49.9,
  P005: 100,
  P006: 29.9,
  P007: 229.9,
  P008: 50,
};

export const CLIENTE_VALIDO = {
  nome: 'Maria Silva',
  email: 'maria@exemplo.com',
  cep: '01310-100',
};

/**
 * Valores esperados calculados em CENTAVOS (inteiros), seguindo a fórmula da documentação:
 * total = subtotal - desconto + frete. Evita ruído de ponto flutuante no oráculo do teste.
 */
export function esperado(itens: { produtoId: string; quantidade: number }[], percentualCupom = 0) {
  const subtotal = itens.reduce(
    (soma, i) => soma + Math.round(PRECOS[i.produtoId] * 100) * i.quantidade,
    0,
  );
  const desconto = Math.round((subtotal * percentualCupom) / 100);
  const freteGratis = subtotal >= 20000; // CA06: inclusive
  const frete = freteGratis ? 0 : 1990; // CA07
  const faltante = Math.max(20000 - subtotal, 0);
  const total = subtotal - desconto + frete;
  return {
    subtotal: subtotal / 100,
    desconto: desconto / 100,
    frete: frete / 100,
    freteGratis,
    valorFaltanteFreteGratis: faltante / 100,
    total: total / 100,
  };
}

export async function calcular(
  request: APIRequestContext,
  itens: unknown,
  cupom?: unknown,
): Promise<APIResponse> {
  const data: Record<string, unknown> = { itens };
  if (cupom !== undefined) data.cupom = cupom;
  return request.post('/api/carrinho/calcular', { data });
}

export async function criarPedido(
  request: APIRequestContext,
  itens: unknown,
  cupom?: unknown,
  cliente: unknown = CLIENTE_VALIDO,
): Promise<APIResponse> {
  const data: Record<string, unknown> = { cliente, itens };
  if (cupom !== undefined) data.cupom = cupom;
  return request.post('/api/pedidos', { data });
}

/** Comparação estrita (toBe): se a API devolver 179.70000000000002, o teste falha de propósito (CA11). */
export function verificarResumo(body: any, esp: ReturnType<typeof esperado>) {
  expect(body.subtotal, 'subtotal').toBe(esp.subtotal);
  expect(body.desconto, 'desconto').toBe(esp.desconto);
  expect(body.frete, 'frete').toBe(esp.frete);
  expect(body.freteGratis, 'freteGratis').toBe(esp.freteGratis);
  expect(body.valorFaltanteFreteGratis, 'valorFaltanteFreteGratis').toBe(esp.valorFaltanteFreteGratis);
  expect(body.total, 'total').toBe(esp.total);
}

export function casasDecimais(n: number): number {
  const s = String(n);
  return s.includes('.') ? s.split('.')[1].length : 0;
}

export function verificarErro(body: any, codigo: string) {
  expect(body.erro, 'objeto erro').toBeTruthy();
  expect(body.erro.codigo).toBe(codigo);
  expect(typeof body.erro.mensagem).toBe('string');
}
