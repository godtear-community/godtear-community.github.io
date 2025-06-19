QUnit.module('utils.js');

QUnit.test('mod(...)', assert => {
  assert.equal(mod(4, 3), 1);
  assert.equal(mod(3, 3), 0);
  assert.equal(mod(2, 3), 2);
  assert.equal(mod(1, 3), 1);

  assert.equal(mod(0, 3), 0);

  assert.equal(mod(-1, 3), 2);
  assert.equal(mod(-2, 3), 1);
  assert.equal(mod(-3, 3), 0);
  assert.equal(mod(-4, 3), 2);
});

QUnit.test('round(...)', assert => {
  assert.equal(round(12.3440), 12.34);
  assert.equal(round(12.3445), 12.34);
  assert.equal(round(12.3450), 12.35);
  assert.equal(round(12.3455), 12.35);

  assert.equal(round(12.3440, 3), 12.344);
  assert.equal(round(12.3445, 3), 12.345);
  assert.equal(round(12.3450, 3), 12.345);
  assert.equal(round(12.3455, 3), 12.346);
});