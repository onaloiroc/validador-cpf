'use strict';

/**
 * Validação de CPF pelo algoritmo oficial dos dígitos verificadores.
 *
 * O CPF tem 11 dígitos: 9 de base e 2 verificadores. Cada verificador é o
 * resto da divisão por 11 da soma ponderada dos dígitos anteriores, com pesos
 * decrescentes. Resto 0 ou 1 resulta em dígito 0.
 */

const CPF_LENGTH = 11;
const BASE_LENGTH = 9;

/** Remove tudo que não for dígito. */
function strip(value) {
  return String(value ?? '').replace(/\D/g, '');
}

/**
 * Calcula um dígito verificador a partir dos dígitos já conhecidos.
 * O peso inicial é o número de dígitos considerados mais um.
 */
function checkDigit(digits) {
  const weightStart = digits.length + 1;
  const sum = digits.reduce(
    (acc, digit, index) => acc + digit * (weightStart - index),
    0,
  );
  const remainder = sum % CPF_LENGTH;
  return remainder < 2 ? 0 : CPF_LENGTH - remainder;
}

/**
 * Indica se todos os dígitos são iguais (000.000.000-00, 111.111.111-11, ...).
 * Essas sequências passam no cálculo dos verificadores, mas não são CPFs válidos.
 */
function hasRepeatedDigits(digits) {
  return digits.every((digit) => digit === digits[0]);
}

/**
 * Valida um CPF.
 *
 * Aceita com ou sem máscara. Não consulta a Receita Federal: verifica apenas se
 * os dígitos verificadores conferem, que é o que o algoritmo oficial define.
 *
 * @param {string|number} value CPF com ou sem pontuação.
 * @returns {boolean}
 */
function isValid(value) {
  const cleaned = strip(value);
  if (cleaned.length !== CPF_LENGTH) return false;

  const digits = [...cleaned].map(Number);
  if (hasRepeatedDigits(digits)) return false;

  const base = digits.slice(0, BASE_LENGTH);
  const first = checkDigit(base);
  const second = checkDigit([...base, first]);

  return first === digits[9] && second === digits[10];
}

/**
 * Aplica a máscara 000.000.000-00.
 *
 * @param {string|number} value
 * @returns {string} CPF formatado.
 * @throws {TypeError} Se não houver 11 dígitos.
 */
function format(value) {
  const cleaned = strip(value);
  if (cleaned.length !== CPF_LENGTH) {
    throw new TypeError(`CPF deve ter ${CPF_LENGTH} dígitos, recebido ${cleaned.length}`);
  }
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Gera um CPF válido. Útil para testes e para popular ambiente de homologação.
 *
 * @param {{ masked?: boolean }} [options]
 * @returns {string}
 */
function generate({ masked = false } = {}) {
  let base;
  do {
    base = Array.from({ length: BASE_LENGTH }, () => Math.floor(Math.random() * 10));
  } while (hasRepeatedDigits(base));

  const first = checkDigit(base);
  const second = checkDigit([...base, first]);
  const cpf = [...base, first, second].join('');

  return masked ? format(cpf) : cpf;
}

module.exports = { isValid, format, generate, strip };
