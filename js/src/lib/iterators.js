export function* subArray (start, length, array) {
  let curIndex = start
  const endIndex = start + length - 1
  while (curIndex <= endIndex) {
    yield array[curIndex]
    curIndex++
  }
}

export function* windows (windowSize, array) {
  let curIndex = 0
  while (curIndex + windowSize -1 < array.length) {
    yield subArray(curIndex, windowSize, array)
    curIndex++
  }
}

export function sum (iterable) {
  let total = 0
  for (const value of iterable) {
    total += value
  }
  return total 
}
