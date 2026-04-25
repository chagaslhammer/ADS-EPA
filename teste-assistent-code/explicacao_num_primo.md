# Explicação do Módulo de Números Primos

## Visão Geral

Este módulo fornece funções para verificação e contagem de números primos, implementadas seguindo princípios de **Clean Code** para melhor legibilidade, manutenibilidade e robustez.

## Função `is_prime(number: int) -> bool`

Verifica se um número é primo de forma eficiente.

### Melhorias de Clean Code Implementadas

1. **Type Hints**: Utilizamos anotações de tipo (`number: int`) para deixar clara a entrada e saída esperadas.

2. **Docstring Descritiva**: Segue o padrão Google, incluindo descrição, argumentos, retorno e exceções possíveis.

3. **Validação de Entrada**: A função valida o tipo do argumento e levanta `TypeError` se necessário.

4. **Otimização Algoritmo**:
   - Verifica casos especiais (números <= 1, número 2, números pares) antes do loop
   - Itera apenas sobre números ímpares a partir de 3, reduzindo operações

### Como Funciona

1. **Validação de Tipo**: Verifica se a entrada é realmente um inteiro.

2. **Casos Base**:
   - Números ≤ 1: retorna `False`
   - Número 2: retorna `True` (único primo par)
   - Números pares: retorna `False`

3. **Loop Otimizado**: Itera apenas sobre números ímpares até a raiz quadrada do número.

4. **Resultado**: Se nenhum divisor for encontrado, o número é primo.

### Código da Função

```python
def is_prime(number: int) -> bool:
    """Verifica se um número é primo.
    
    Args:
        number: O número inteiro a ser verificado.
    
    Returns:
        True se o número é primo, False caso contrário.
    
    Raises:
        TypeError: Se o argumento não for um número inteiro.
    """
    if not isinstance(number, int):
        raise TypeError(f"Esperado int, recebido {type(number).__name__}")

    if number <= 1:
        return False

    if number == 2:
        return True

    if number % 2 == 0:
        return False

    limit = int(number**0.5) + 1
    for divisor in range(3, limit, 2):
        if number % divisor == 0:
            return False

    return True
```

## Função `count_primes(limit: int) -> int`

Conta quantos números primos existem até um determinado limite.

### Características

- **Validações**: Verifica tipo de entrada e se o limite é não-negativo
- **Responsabilidade Única**: Apenas conta primos, delegando a verificação para `is_prime()`
- **Documentação Clara**: Type hints e docstring completa

### Código da Função

```python
def count_primes(limit: int) -> int:
    """Conta quantos números primos existem até um determinado limite.
    
    Args:
        limit: O limite superior (inclusive) para contagem de primos.
    
    Returns:
        A quantidade de números primos encontrados.
    
    Raises:
        TypeError: Se o argumento não for um número inteiro.
        ValueError: Se o limite for negativo.
    """
    if not isinstance(limit, int):
        raise TypeError(f"Esperado int, recebido {type(limit).__name__}")

    if limit < 0:
        raise ValueError("O limite não pode ser negativo")

    count = 0
    for number in range(2, limit + 1):
        if is_prime(number):
            count += 1

    return count
```

## Exemplos de Uso

```python
# Verificar números individuais
print(is_prime(2))   # True
print(is_prime(4))   # False
print(is_prime(17))  # True

# Contar primos até um limite
print(count_primes(20))  # 8 (primos: 2, 3, 5, 7, 11, 13, 17, 19)
```

## Princípios de Clean Code Aplicados

✓ **Nomes Descritivos**: `number`, `divisor`, `limit` deixam clara a intenção

✓ **Type Hints**: Indicam tipos esperados de entrada e saída

✓ **Docstrings Completas**: Seguem padrão Google com todas as seções

✓ **Tratamento de Erros**: Validações claras com exceções apropriadas

✓ **Responsabilidade Única**: Cada função tem um propósito bem definido

✓ **Código Legível**: Espaçamento apropriado e lógica clara

✓ **Otimização**: Algoritmo eficiente sem sacrificar legibilidade
