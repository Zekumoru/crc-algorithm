/**
 * Converts an array of degrees to a number with each bit corresponding to the degrees.
 * @param degrees An array of numbers specifying which degrees are 1.
 * @returns A number that if viewed in bits correspond to the degrees given on the array.
 */
const buildBitsFromDegrees = (degrees: number[]) => {
  let bits = 0;
  const set = new Set(degrees);
  for (const degree of set) {
    bits += 1 << degree;
  }
  return bits;
};

/**
 * Calculates the degree of the left-most bit.
 * @param x The number to get its left-most bit's degree.
 * @returns The degree of the left-most bit.
 * @throws Throws an Error if x is negative.
 */
const degree = (x: number) => {
  if (x < 0) throw new Error('Number cannot be negative to get its degree.');
  return Math.floor(Math.log2(x));
};

/**
 * Calculates the leading bit.
 * @param x The number to get its leading bit.
 * @param p The placement of the leading bit.
 * @returns A binary number of the leading bit.
 */
const lead = (x: number, p: number) => {
  const t = 1 << p;
  return (x & t) >> p;
};

/**
 * Long divides binary numbers.
 * @param n The dividend.
 * @param d The divisor.
 * @returns Returns a tuple of the quotient and the remainder.
 */
const longDivBits = (n: number, d: number) => {
  if (d === 0) throw new Error('Divisor cannot be 0.');

  let q = 0; // quotient
  let r = n; // remainder

  for (
    let degreeR = degree(r), degreeD = degree(d);
    r !== 0 && degreeR >= degreeD;
    degreeR--
  ) {
    const t = Math.round(lead(r, degreeR) / lead(d, degreeD));
    q = (q << 1) + t;
    r = r ^ ((t * d) << (degreeR - degreeD));
  }

  return [q, r] as const;
};

/**
 * Generates the remainder bits to append to data before sending.
 * @param data The data to generate remainder from.
 * @param generator The generator bits.
 * @returns The new data bits.
 */
const crcGenerate = (data: number, generator: number) => {
  const genDegree = degree(generator);
  console.log(genDegree);
  const [_quotient, remainder] = longDivBits(data << genDegree, generator);

  return (data << genDegree) | remainder;
};

/**
 * Checks if the message is valid.
 * @param message The message to check.
 * @param generator The generator bits.
 * @returns True if message's remainder is 0, otherwise false.
 */
const crcCheck = (message: number, generator: number) => {
  const [_quotient, remainder] = longDivBits(message, generator);
  return remainder === 0;
};

const data = buildBitsFromDegrees([7, 5, 4, 2]);
const generator = buildBitsFromDegrees([4, 2, 0]);

const message = crcGenerate(data, generator);

console.log(message.toString(2));
console.log(crcCheck(message, generator));
