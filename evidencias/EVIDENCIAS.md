# Evidências da execução

Convenção de arquivos em `evidencias/prints/`:

- `UI-14-passo-02-total.png` para casos de UI (ID do caso + passo)
- `API-08-resposta.json` ou `.png` para API
- `BUG-003-01.png` para evidência de bug

> Cada print deve mostrar o carrinho **inteiro** (itens, cupom, subtotal, desconto, frete e total) e, quando possível, a URL/aba do navegador.

## Índice

| Caso | Resultado | Evidência | Observação |
|---|---|---|---|
| UI-01 | | `prints/UI-01-...png` | |
| UI-02 | | | |
| UI-03 | | | |
| ... | | | |
| API-01 | | | |

## Registro de requisições de API (opcional)

Para cada chamada relevante, guarde request e response:

```
POST /api/carrinho/calcular
{ ... }
→ 200
{ ... }
```
