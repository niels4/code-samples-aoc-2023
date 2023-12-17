const minCompareFunc = (l, r) => r - l
const maxCompareFunc = (l, r) => l - r

export const initMinNumberHeap = () => new Heap(minCompareFunc)
export const initMaxNumberHeap = () => new Heap(maxCompareFunc)

const getLeftChildIndex = (i) => 2 * i + 1
const getParentIndex = (i) => Math.floor((i - 1) / 2)

export class Heap {
  array
  compare

  constructor(compare) {
    this.array = []
    this.compare = compare
  }

  size() {
    return this.array.length
  }

  peek() {
    return this.array[0]
  }

  push(item) {
    this.array.push(item)
    this._bubbleUp(this.array.length - 1)
  }

  pop() {
    if (this.array.length === 0) { return }
    const top = this.array[0]

    const lastItem = this.array.pop() // already made sure length wasn't 0
    if (this.array.length !== 0) {
      this.array[0] = lastItem
      this._pushDown(0)
    }

    return top
  }

  _bubbleUp(currentIndex) {
    const parentIndex = getParentIndex(currentIndex)
    const current = this.array[currentIndex]
    const parent = this.array[parentIndex]
    const shouldSwap = this.compare(current, parent)
    if (shouldSwap > 0) {
      this.array[parentIndex] = current
      this.array[currentIndex] = parent
      this._bubbleUp(parentIndex)
    }
  }

  _pushDown(currentIndex) {
    const firstChildIndex = getLeftChildIndex(currentIndex)
    const current = this.array[currentIndex]

    // find the top child to be swapped
    let topChild
    let topChildIndex
    for (let childIndex = firstChildIndex; childIndex < this.array.length; childIndex++) {
      const child = this.array[childIndex]
      if (topChild === undefined || this.compare(child, topChild) > 0) {
        topChildIndex = childIndex
        topChild = child
      }
    }

    // no children to be swapped
    if (topChild == null) { return }

    const shouldSwap = this.compare(topChild, current) > 0
    if (shouldSwap) {
      this.array[topChildIndex] = current
      this.array[currentIndex] = topChild
      this._pushDown(topChildIndex)
    }
  }
}
