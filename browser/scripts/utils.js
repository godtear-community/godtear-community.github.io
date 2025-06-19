function mod(value, modulus) {
  return ((value % modulus) + modulus) % modulus;
}

function round(number, decimals=2) {
  const factor = Math.pow(10, decimals);
  return Math.round(number * factor) / factor;
}