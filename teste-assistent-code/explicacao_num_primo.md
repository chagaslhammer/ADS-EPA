# Explicação da Função is_prime

A função `is_prime(n)` verifica se um número inteiro `n` é primo. Um número primo é um número maior que 1 que não tem divisores positivos além de 1 e ele mesmo.

## Como a Função Funciona

1. **Verificação Inicial**: Se `n` for menor ou igual a 1, a função retorna `False` imediatamente, pois números primos são definidos como maiores que 1.

2. **Loop de Verificação**: Para `n` maior que 1, a função itera sobre os números de 2 até a raiz quadrada de `n` (usando `int(n**0.5) + 1` para incluir o limite superior). Isso é eficiente porque se `n` tem um divisor maior que sua raiz quadrada, o outro divisor correspondente será menor.

3. **Teste de Divisibilidade**: Para cada `i` no intervalo, verifica se `n % i == 0`. Se sim, significa que `i` divide `n`, então `n` não é primo e retorna `False`.

4. **Resultado Final**: Se nenhum divisor for encontrado, a função retorna `True`, indicando que `n` é primo.

## Código da Função

```python
def is_prime(n):
    """
    Verifica se um número é primo.
    
    Args:
        n (int): O número a ser verificado.
    
    Returns:
        bool: True se o número for primo, False caso contrário.
    """
    if n <= 1:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True
```

## Exemplos de Uso

- `is_prime(2)` → `True` (2 é primo)
- `is_prime(4)` → `False` (4 não é primo, pois é divisível por 2)
- `is_prime(17)` → `True` (17 é primo)

Essa implementação é simples e eficiente para números pequenos a médios.