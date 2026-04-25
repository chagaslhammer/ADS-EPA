"""Módulo para cálculo de estatísticas básicas de uma lista de números."""

from typing import Tuple


def calculate_statistics(numbers: list[float]) -> Tuple[float, float, float, float]:
    """Calcula estatísticas de uma lista de números.

    Realiza o cálculo de soma total, média aritmética, valor máximo
    e valor mínimo de uma lista de números.

    Args:
        numbers: Lista contendo números (int ou float).

    Returns:
        Tupla contendo (total, média, máximo, mínimo).

    Raises:
        ValueError: Se a lista estiver vazia.
        TypeError: Se a lista contiver elementos não-numéricos.
    """
    if not numbers:
        raise ValueError("A lista não pode estar vazia")

    # Valida se todos os elementos são números
    if not all(isinstance(num, (int, float)) for num in numbers):
        raise TypeError("Todos os elementos devem ser números")

    # Calcula as estatísticas de forma eficiente
    total = sum(numbers)
    average = total / len(numbers)
    maximum = max(numbers)
    minimum = min(numbers)

    return total, average, maximum, minimum


def display_statistics(total: float, average: float, maximum: float, minimum: float) -> None:
    """Exibe as estatísticas formatadas.

    Args:
        total: Soma total dos números.
        average: Média aritmética.
        maximum: Valor máximo.
        minimum: Valor mínimo.
    """
    print(f"Total:  {total}")
    print(f"Média:  {average:.2f}")
    print(f"Maior:  {maximum}")
    print(f"Menor:  {minimum}")


if __name__ == "__main__":
    # Dados para análise
    data = [23, 7, 45, 2, 67, 12, 89, 34, 56, 11]

    # Calcula as estatísticas
    total, average, maximum, minimum = calculate_statistics(data)

    # Exibe os resultados
    display_statistics(total, average, maximum, minimum)