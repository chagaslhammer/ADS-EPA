"""Módulo para verificação e contagem de números primos."""


def is_prime(number: int) -> bool:
    """Verifica se um número é primo.

    Um número primo é um inteiro maior que 1 que só é divisível por 1
    e por ele mesmo.

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


if __name__ == "__main__":
    # Exemplos de uso
    print(f"2 é primo: {is_prime(2)}")
    print(f"4 é primo: {is_prime(4)}")
    print(f"17 é primo: {is_prime(17)}")
    print(f"\nQuantidade de primos até 20: {count_primes(20)}")
