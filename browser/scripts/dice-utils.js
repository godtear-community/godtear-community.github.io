/*---------------------------------------------------------------------------------------------
 * PERMUTATION STRUCTURE
 *-------------------------------------------------------------------------------------------*/

// Prepare the probability structure:
// * First index "d" is number of dice
// * Second index "p" is number of permutations that result in that value
// * The total number of permutations is 6^d
// * The percent chance of rolling the value is p/(6^d)
// * The percent chance of rolling at least the value is (p0+p1+p2...+pn)/(6^d)
const DICE_VALUES = [0, 0, 1, 1, 1, 2];
const MAX_DICE = 15;
const MAX_DICE_SUM = MAX_DICE * 2;
const PERMUTATION_COUNTS = Array.from({ length: MAX_DICE + 1 }, () =>
  Array(MAX_DICE_SUM + 1).fill(0)
);
PERMUTATION_COUNTS[0][0] = 1;
for (let i = 1; i <= MAX_DICE; i++) {
  for (let sum = 0; sum <= MAX_DICE_SUM; sum++) {
    for (let value of DICE_VALUES) {
      if (sum >= value) {
        PERMUTATION_COUNTS[i][sum] += PERMUTATION_COUNTS[i - 1][sum - value];
      }
    }
  }
}

/*---------------------------------------------------------------------------------------------
 * BASIC PROBABILITY METHODS
 *-------------------------------------------------------------------------------------------*/

function calculateChanceToRollAtLeast(target, numberOfDice) {
  const totalSuccesses = PERMUTATION_COUNTS[numberOfDice]
    .slice(target)
    .reduce((memo, value) => memo + value);
  const totalPossibilities = PERMUTATION_COUNTS[numberOfDice]
    .reduce((memo, value) => memo + value);
  return totalSuccesses / totalPossibilities;
}

function calculateChanceToRollExactly(target, numberOfDice) {
  const totalSuccesses = PERMUTATION_COUNTS[numberOfDice][target];
  const totalPossibilities = PERMUTATION_COUNTS[numberOfDice]
    .reduce((memo, value) => memo + value);
  return totalSuccesses / totalPossibilities;
}

/*---------------------------------------------------------------------------------------------
 * DAMAGE PROBABILITY METHODS
 *-------------------------------------------------------------------------------------------*/

function calculateDamage(parameters) {
  // Destructure the profiles
  const accuracyDice = parameters['accuracy'] || 0;
  const damageDice = parameters['damage'] || 0;
  const maxPierce = parameters['pierce'] || 0;
  const dodgeDice = parameters['dodge'] || 0;
  const protectionDice = parameters['protection'] || 0;

  // Default the damage probabilities
  const damageProbabilities = [];
  for (let i = 0; i <= MAX_DICE_SUM; i++) {
    damageProbabilities[i] = 0;
  }

  // For each of the potential accuracy rolls
  for (let accuracySum = 0; accuracySum <= accuracyDice * 2; accuracySum++) {
    // Calculate the number of ways to reach this accuracy
    const accuracyWeight = calculateChanceToRollExactly(accuracySum, accuracyDice);
    // Calculate the amount of pierce to be added to the damage dice
    const pierce = Math.min(maxPierce, Math.max(0, accuracySum - dodgeDice));
    // Calculate the adjusted damage dice
    const adjustedDamageDice = damageDice + pierce;
    // For each of the potential damage rolls
    for (let damageSum = 0; damageSum <= adjustedDamageDice * 2; damageSum++) {
      const damageWeight = calculateChanceToRollExactly(damageSum, adjustedDamageDice);
      const damageIndex = accuracySum < dodgeDice
          ? 0
          : Math.max(0, damageSum - protectionDice);
      damageProbabilities[damageIndex] += accuracyWeight * damageWeight;
    }
  }

  // Calculate average damage
  let averageDamage = 0;
  for (let damageSum = 0; damageSum <= MAX_DICE_SUM; damageSum++) {
    averageDamage += damageSum * damageProbabilities[damageSum];
  }
  averageDamage = round(averageDamage);

  // Determine the chance to hit
  let chanceToHit = calculateChanceToRollAtLeast(dodgeDice, accuracyDice);
  chanceToHit = round(chanceToHit);

  // Build the list of cumulative non-zero damage probabilities (starting at 1)
  let cumulativeDamageProbabilities = new Array(damageProbabilities.length);
  let sum = 0;
  for (let i = damageProbabilities.length - 1; i >= 0; i--) {
    sum += damageProbabilities[i];
    cumulativeDamageProbabilities[i] = sum;
  }
  cumulativeDamageProbabilities = cumulativeDamageProbabilities
    .map(item => round(item));
  cumulativeDamageProbabilities = cumulativeDamageProbabilities
    .slice(1, cumulativeDamageProbabilities.findLastIndex(item => item != 0)+1);

  // Return the result
  return {
    'averageDamage': averageDamage,
    'chanceToHit': chanceToHit,
    'damageProbabilities': cumulativeDamageProbabilities
  }

}
