export function isSuperset(set, subset) {
  for (const elem of subset) {
    if (!set.has(elem)) {
      return false
    }
  }
  return true
}

export function union(setA, setB) {
  const _union = new Set(setA)
  for (const elem of setB) {
    _union.add(elem)
  }
  return _union
}

export function intersection(setA, setB) {
  const _intersection = new Set()
  for (const elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem)
    }
  }
  return _intersection
}

export function symmetricDifference(setA, setB) {
  const _difference = new Set(setA)
  for (const elem of setB) {
    if (_difference.has(elem)) {
      _difference.delete(elem)
    } else {
      _difference.add(elem)
    }
  }
  return _difference
}

export function difference(setA, setB) {
  const _difference = new Set(setA)
  for (const elem of setB) {
    _difference.delete(elem)
  }
  return _difference
}

export const mapSet = (set, func) => {
  const mapped = new Set()
  for (const val of set) {
    mapped.add(func(val))
  }
  return mapped
}

export const setsAreEqual = (setA, setB) => {
  if (setA.size !== setB.size) { return  false }
  for (const val of setA) {
    if (!setB.has(val)) { return false }
  }
  return true
}
