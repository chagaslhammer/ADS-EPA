# Explicação dos Erros e Correções do Arquivo `debug.py`

## Erros identificados no código original

1. **Erro de sintaxe na string do input**
   - Linha com `item1 = float(input(Preço do item 1? ))`
   - A mensagem do `input()` não estava entre aspas, o que gera um `SyntaxError` antes do código ser executado.
   - Correção: colocar a string entre aspas: `float(input("Preço do item 1? "))`

2. **Uso de string em operação numérica**
   - Variável `desconto_cupom` foi atribuída com `input()`, que retorna texto.
   - Em seguida, o código faz `desconto_cupom / 100` e `desconto_cupom > 0`, o que causa um `TypeError` ou falha na comparação de tipos.
   - Correção: converter o valor para número antes de usar em cálculos e comparações.
     - Por exemplo: `desconto_cupom = float(input(...))`

3. **F-string faltando no `print` do Item 2**
   - Linha com `print(" Item 2:        R$ {total_item2:.2f}")`
   - Como a string não foi prefixada com `f`, o Python mostra o texto literal `{total_item2:.2f}` em vez do valor formatado.
   - Correção: usar `print(f" Item 2:        R$ {total_item2:.2f}")`

4. **Indentação incorreta dentro do `if`**
   - O `print(...)` após `if desconto_cupom > 0:` não estava indentado.
   - Isso causa um `IndentationError`, porque o Python espera um bloco indentado após o `if`.
   - Correção: adicionar quatro espaços antes do `print` dentro do `if`.

5. **Uso desnecessário de parênteses**
   - A linha `desconto_cupom = (input(...))` não causa erro, mas é redundante.
   - Melhora de estilo: remover parênteses extras.

## Código corrigido

O arquivo `debug.py` foi ajustado para ficar funcional com estas correções:

- prompt de entrada de preço corretamente delimitado por aspas
- conversão de `desconto_cupom` para `float`
- impressão correta do valor do item 2 com f-string
- bloco `if` corretamente indentado
- cálculo final exibido sem necessidade de `round()` adicional na string formatada

## Resultado esperado

Com as correções, o programa deve:

- solicitar nome do cliente
- pedir quantidade e preço de três itens
- calcular subtotal, imposto de 10% e desconto
- exibir um resumo formatado em reais

> O arquivo `debug.py` agora está funcional e deve rodar sem erros de sintaxe ou de tipo.