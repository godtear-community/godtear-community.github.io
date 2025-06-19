QUnit.module('dice-utils.js');

/*---------------------------------------------------------------------------------------------
 * PERMUTATION STRUCTURE
 *-------------------------------------------------------------------------------------------*/

QUnit.test('PERMUTATION_COUNTS', assert => {
  // Zero dice should always have zero
  assert.equal(PERMUTATION_COUNTS[0][0], 1);
  assert.equal(PERMUTATION_COUNTS[0][1], 0);
  // With 1 dice there are 2 ways to make zero, 3 ways to make 1, and 2 ways to make 2
  assert.equal(PERMUTATION_COUNTS[1][0], 2);
  assert.equal(PERMUTATION_COUNTS[1][1], 3);
  assert.equal(PERMUTATION_COUNTS[1][2], 1);
  assert.equal(PERMUTATION_COUNTS[1][3], 0);

  assert.equal(PERMUTATION_COUNTS[10][0], 1024);
  assert.equal(PERMUTATION_COUNTS[10][1], 15360);
  assert.equal(PERMUTATION_COUNTS[10][2], 108800);
  assert.equal(PERMUTATION_COUNTS[10][3], 483840);
  assert.equal(PERMUTATION_COUNTS[10][4], 1514880);
  assert.equal(PERMUTATION_COUNTS[10][5], 3549312);
  assert.equal(PERMUTATION_COUNTS[10][6], 6456480);
  assert.equal(PERMUTATION_COUNTS[10][7], 9336960);
  assert.equal(PERMUTATION_COUNTS[10][8], 10901460);
  assert.equal(PERMUTATION_COUNTS[10][9], 10377180);
  assert.equal(PERMUTATION_COUNTS[10][10], 8097453);
  assert.equal(PERMUTATION_COUNTS[10][11], 5188590);
  assert.equal(PERMUTATION_COUNTS[10][12], 2725365);
  assert.equal(PERMUTATION_COUNTS[10][13], 1167120);
  assert.equal(PERMUTATION_COUNTS[10][14], 403530);
  assert.equal(PERMUTATION_COUNTS[10][15], 110916);
  assert.equal(PERMUTATION_COUNTS[10][16], 23670);
  assert.equal(PERMUTATION_COUNTS[10][17], 3780);
  assert.equal(PERMUTATION_COUNTS[10][18], 425);
  assert.equal(PERMUTATION_COUNTS[10][19], 30);
  assert.equal(PERMUTATION_COUNTS[10][20], 1);
  assert.equal(PERMUTATION_COUNTS[10][21], 0);
});

/*---------------------------------------------------------------------------------------------
 * BASIC PROBABILITY METHODS
 *-------------------------------------------------------------------------------------------*/

QUnit.test('calculateChanceToRollAtLeast(...)', assert => {
  assert.equal(calculateChanceToRollAtLeast(1, 0), 0);
  assert.equal(calculateChanceToRollAtLeast(0, 1), 1);
  assert.equal(calculateChanceToRollAtLeast(1, 1), 4 / 6);
  assert.equal(calculateChanceToRollAtLeast(2, 1), 1 / 6);

  assert.equal(calculateChanceToRollAtLeast(0, 5), 1);
  assert.equal(calculateChanceToRollAtLeast(0, 5), (32 + 240 + 800 + 1560 + 1970 + 1683 + 985 + 390 + 100 + 15 + 1) / 7776);
  assert.equal(calculateChanceToRollAtLeast(1, 5), (240 + 800 + 1560 + 1970 + 1683 + 985 + 390 + 100 + 15 + 1) / 7776);
  assert.equal(calculateChanceToRollAtLeast(2, 5), (800 + 1560 + 1970 + 1683 + 985 + 390 + 100 + 15 + 1) / 7776);
  assert.equal(calculateChanceToRollAtLeast(3, 5), (1560 + 1970 + 1683 + 985 + 390 + 100 + 15 + 1) / 7776);
  assert.equal(calculateChanceToRollAtLeast(4, 5), (1970 + 1683 + 985 + 390 + 100 + 15 + 1) / 7776);
  assert.equal(calculateChanceToRollAtLeast(5, 5), (1683 + 985 + 390 + 100 + 15 + 1) / 7776);
  assert.equal(calculateChanceToRollAtLeast(6, 5), (985 + 390 + 100 + 15 + 1) / 7776);
  assert.equal(calculateChanceToRollAtLeast(7, 5), (390 + 100 + 15 + 1) / 7776);
  assert.equal(calculateChanceToRollAtLeast(8, 5), (100 + 15 + 1) / 7776);
  assert.equal(calculateChanceToRollAtLeast(9, 5), (15 + 1) / 7776);
  assert.equal(calculateChanceToRollAtLeast(10, 5), 1 / 7776);
  assert.equal(calculateChanceToRollAtLeast(11, 5), 0);
});

QUnit.test('calculateChanceToRollExactly(...)', assert => {
  assert.equal(calculateChanceToRollExactly(1, 0), 0);
  assert.equal(calculateChanceToRollExactly(0, 1), 2 / 6);
  assert.equal(calculateChanceToRollExactly(1, 1), 3 / 6);
  assert.equal(calculateChanceToRollExactly(2, 1), 1 / 6);

  assert.equal(calculateChanceToRollExactly(0, 5), 32 / 7776);
  assert.equal(calculateChanceToRollExactly(1, 5), 240 / 7776);
  assert.equal(calculateChanceToRollExactly(2, 5), 800 / 7776);
  assert.equal(calculateChanceToRollExactly(3, 5), 1560 / 7776);
  assert.equal(calculateChanceToRollExactly(4, 5), 1970 / 7776);
  assert.equal(calculateChanceToRollExactly(5, 5), 1683 / 7776);
  assert.equal(calculateChanceToRollExactly(6, 5), 985 / 7776);
  assert.equal(calculateChanceToRollExactly(7, 5), 390 / 7776);
  assert.equal(calculateChanceToRollExactly(8, 5), 100 / 7776);
  assert.equal(calculateChanceToRollExactly(9, 5), 15 / 7776);
  assert.equal(calculateChanceToRollExactly(10, 5), 1 / 7776);
  assert.equal(calculateChanceToRollAtLeast(11, 5), 0);
});

/*---------------------------------------------------------------------------------------------
 * DAMAGE PROBABILITY METHODS
 *-------------------------------------------------------------------------------------------*/

QUnit.test('calculateDamage(...)', assert => {
  // 0/1 vs 0/0
  assert.deepEqual(
    calculateDamage({ 'accuracy': 0, 'damage': 1, 'dodge': 0, 'protection': 0 }),
    {
      "averageDamage": 0.83,
      "chanceToHit": 1,
      "damageProbabilities": [
        0.67,
        0.17
      ]
    }
  );

  // 5/5 vs 4/1
  assert.deepEqual(
    calculateDamage({ 'accuracy': 5, 'damage': 5, 'dodge': 4, 'protection': 1 }),
    {
      'averageDamage': 2.10,
      'chanceToHit': 0.66,
      'damageProbabilities': [
        0.64,
        0.57,
        0.44,
        0.27,
        0.13,
        0.04,
        0.01
      ]
    }
  );
});

QUnit.test('calculateDamage(...) with pierce', assert => {
  // 7/1 vs 4/1
  assert.deepEqual(
    calculateDamage({ 'accuracy': 7, 'damage': 1, 'pierce': 0, 'dodge': 4, 'protection': 1 }),
    {
      "averageDamage": 0.15,
      "chanceToHit": 0.9,
      "damageProbabilities": [
        0.15
      ]
    }
  );

  // 7p8/1 vs 4/1
  assert.deepEqual(
    calculateDamage({ 'accuracy': 7, 'damage': 1, 'pierce': 8, 'dodge': 4, 'protection': 1 }),
    {
      "averageDamage": 1.56,
      "chanceToHit": 0.9,
      "damageProbabilities": [
        0.64,
        0.43,
        0.26,
        0.14,
        0.06,
        0.03,
        0.01
      ]
    }
  );
});