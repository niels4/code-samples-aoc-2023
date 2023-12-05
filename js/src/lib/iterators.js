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

export function* skip (numSkips, iterable) {
  let nextItem

  for (let i = 0; i < numSkips; i++) {
    nextItem = iterable.next()
    if (nextItem.done) {
      break
    }
  }

  do  {
    nextItem = iterable.next()
    if (!nextItem.done) {
      yield nextItem.value
    }
  } while (!nextItem.done)
}

export function* reverseArray (array) {
  if (array.length === 0) { return }
  for (let curIndex = array.length - 1; curIndex >= 0; curIndex--) {
    yield array[curIndex]
  }
}
