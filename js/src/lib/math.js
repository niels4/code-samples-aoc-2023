export function gcd(a, b) {
  while (b !== 0) {
    let t = b
    b = a % b
    a = t
  }
  return a
}

export function findGCD(numbers) {
  let result = numbers[0]
  for (let i = 1; i < numbers.length; i++) {
    result = gcd(result, numbers[i])

    // If at any point the GCD is 1, we can stop, as it won't get any lower
    if (result === 1) {
      break
    }
  }
  return result
}
