'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { isValid, format, generate, strip } = require('../src/cpf');

test('aceita CPF válido sem máscara', () => {
  assert.equal(isValid('52998224725'), true);
});

test('aceita CPF válido com máscara', () => {
  assert.equal(isValid('529.982.247-25'), true);
});

test('rejeita CPF com dígito verificador errado', () => {
  assert.equal(isValid('52998224726'), false);
});

test('rejeita sequências de dígitos repetidos', () => {
  for (let digit = 0; digit <= 9; digit += 1) {
    const repeated = String(digit).repeat(11);
    assert.equal(isValid(repeated), false, `${repeated} deveria ser inválido`);
  }
});

test('rejeita tamanho diferente de 11 dígitos', () => {
  assert.equal(isValid('5299822472'), false);
  assert.equal(isValid('529982247250'), false);
  assert.equal(isValid(''), false);
});

test('rejeita entrada nula ou indefinida sem lançar erro', () => {
  assert.equal(isValid(null), false);
  assert.equal(isValid(undefined), false);
});

test('aceita CPF com zeros à esquerda passado como string', () => {
  assert.equal(isValid('01234567890'), true);
});

test('strip remove qualquer pontuação', () => {
  assert.equal(strip('529.982.247-25'), '52998224725');
  assert.equal(strip(' 529 982 247 25 '), '52998224725');
});

test('format aplica a máscara', () => {
  assert.equal(format('52998224725'), '529.982.247-25');
});

test('format lança erro quando não há 11 dígitos', () => {
  assert.throws(() => format('123'), TypeError);
});

test('generate produz CPF sempre válido', () => {
  for (let i = 0; i < 500; i += 1) {
    const cpf = generate();
    assert.equal(cpf.length, 11);
    assert.equal(isValid(cpf), true, `${cpf} deveria ser válido`);
  }
});

test('generate com máscara produz CPF formatado e válido', () => {
  const cpf = generate({ masked: true });
  assert.match(cpf, /^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
  assert.equal(isValid(cpf), true);
});
