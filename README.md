# validador-cpf

Validação, formatação e geração de CPF em Node.js pelo algoritmo oficial dos
dígitos verificadores. **Sem dependências.**

```js
const { isValid, format, generate } = require('./src/cpf');

isValid('529.982.247-25');  // true
isValid('52998224726');     // false  (dígito verificador errado)
isValid('111.111.111-11');  // false  (sequência repetida)

format('52998224725');      // '529.982.247-25'
generate();                 // '84729163508'
generate({ masked: true }); // '847.291.635-08'
```

## Como o algoritmo funciona

O CPF tem 11 dígitos: 9 de base e 2 verificadores.

Cada verificador é calculado sobre os dígitos anteriores, com pesos decrescentes:

1. **Primeiro dígito** — soma os 9 dígitos de base com pesos de 10 a 2.
2. **Segundo dígito** — soma os 10 dígitos (base + primeiro verificador) com
   pesos de 11 a 2.
3. Em ambos, o dígito é `11 - (soma % 11)`. Se o resto for 0 ou 1, o dígito é `0`.

Exemplo com `529.982.247-25`:

```
dígitos    5   2   9   9   8   2   2   4   7
pesos     10   9   8   7   6   5   4   3   2
produto   50  18  72  63  48  10   8  12  14   → soma 295

295 % 11 = 9   →   11 - 9 = 2   →   primeiro dígito: 2
```

## Sequências repetidas

`000.000.000-00`, `111.111.111-11` e as demais sequências de dígitos iguais
**passam** no cálculo dos verificadores. Matematicamente conferem.

Por isso são rejeitadas explicitamente — é o erro mais comum em implementação
caseira de validador de CPF, e o motivo de `111.111.111-11` ser aceito por
muitos formulários por aí.

## O que isto não faz

Verifica apenas a consistência matemática dos dígitos. **Não consulta a Receita
Federal** e não diz se o CPF existe, está ativo ou pertence a alguém.

Para isso é preciso integração com serviço oficial ou autorizado.

## Testes

```bash
npm test
```

Usa o runner nativo do Node (`node --test`), sem framework externo.
Cobre dígito verificador correto e incorreto, as dez sequências repetidas,
tamanho inválido, entrada nula, zeros à esquerda, máscara e 500 CPFs gerados.

## Requisitos

Node.js 18 ou superior.

## Licença

MIT
