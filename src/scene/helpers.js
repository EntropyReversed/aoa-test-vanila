export const linearMap = (value, minA, maxA, minB, maxB) => {
  const val = (1 - (value - minA) / (maxA - minA)) * minB + (value - minA) / (maxA - minA) * maxB;

  const lowerBound = Math.min(minB, maxB);
  const upperBound = Math.max(minB, maxB);

  if (val < lowerBound) {
    return lowerBound;
  }
  if (val > upperBound) {
    return upperBound;
  }
  return val;
};