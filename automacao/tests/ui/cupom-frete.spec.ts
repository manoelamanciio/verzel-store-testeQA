import { test } from '@playwright/test';

/**
 * ESQUELETO DE AUTOMAÇÃO DE UI
 *
 * Os seletores da loja ainda NÃO foram mapeados (a interface não foi inspecionada).
 * Para ativar: abra a loja, use `npx playwright codegen <URL>` ou o DevTools para descobrir
 * os seletores (preferir getByRole / getByLabel / data-testid), preencha os TODOs e troque
 * `test.fixme` por `test`.
 *
 * Os valores esperados abaixo já estão calculados (ver docs/analise-da-documentacao.md).
 */

test.describe('UI · cupom e frete grátis', () => {
  test.fixme('UI-01 · CA01 · aplicar BEMVINDO10 mostra 10% de desconto', async ({ page }) => {
    await page.goto('/');
    // TODO adicionar P002 x1 e P004 x2 ao carrinho
    // TODO abrir o carrinho, digitar "BEMVINDO10" no campo de cupom e aplicar
    // TODO validar: subtotal R$ 239,70 · desconto R$ 23,97 · frete R$ 0,00 · total R$ 215,73
  });

  test.fixme('UI-14 · CA08 · cupom não derruba o frete grátis (subtotal 200,00)', async ({ page }) => {
    await page.goto('/');
    // TODO adicionar P005 x2 e aplicar "BEMVINDO10"
    // TODO validar: desconto R$ 20,00 · frete R$ 0,00 · total R$ 180,00
  });

  test.fixme('UI-05 · CA03 · cupom inexistente exibe "Cupom inválido."', async ({ page }) => {
    await page.goto('/');
    // TODO adicionar qualquer produto e aplicar "PROMO50"
    // TODO validar mensagem exata "Cupom inválido." e total sem desconto
  });
});
