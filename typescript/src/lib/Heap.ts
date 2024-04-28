type CompareFunc<T> = (l: T, r: T) => boolean

const minCompareFunc: CompareFunc<number> = (l, r) => l < r
const maxCompareFunc: CompareFunc<number> = (l, r) => l > r

export const initMinNumberHeap = (): Heap<number> => new Heap(minCompareFunc)
export const initMaxNumberHeap = (): Heap<number> => new Heap(maxCompareFunc)

const getLeftChildIndex = (i: number): number => 2 * i + 1
const getParentIndex = (i: number): number => Math.floor((i - 1) / 2)

export class Heap<T> {
  array: T[]
  compare: CompareFunc<T>

  constructor(compare: CompareFunc<T>) {
    this.array = []
    this.compare = compare
  }

  size() {
    return this.array.length
  }

  peek(): T | undefined {
    return this.array[0]
  }

  push(item: T) {
    this.array.push(item)
    this._bubbleUp(this.array.length - 1)
  }

  pop(): T | undefined {
    if (this.array.length === 0) {
      return
    }
    const top = this.array[0]
    const lastItem = this.array.pop()! // already made sure length wasn't 0
    if (this.array.length !== 0) {
      this.array[0] = lastItem
      this._pushDown(0)
    }
    return top
  }

  private _bubbleUp(currentIndex: number) {
    const parentIndex = getParentIndex(currentIndex)
    const current = this.array[currentIndex]
    const parent = this.array[parentIndex]
    const shouldSwap = this.compare(current, parent)
    if (shouldSwap) {
      this.array[parentIndex] = current
      this.array[currentIndex] = parent
      this._bubbleUp(parentIndex)
    }
  }

  private _pushDown(currentIndex: number) {
    const firstChildIndex = getLeftChildIndex(currentIndex)
    const current = this.array[currentIndex]

    // find the top child to be swapped
    let topChild: T | undefined
    let topChildIndex: number | undefined
    for (let childIndex = firstChildIndex; childIndex < this.array.length; childIndex++) {
      const child = this.array[childIndex]
      if (topChild === undefined || this.compare(child, topChild)) {
        topChildIndex = childIndex
        topChild = child
      }
    }

    // no children to be swapped
    if (topChild == null || topChildIndex == null) {
      return
    }

    const shouldSwap = this.compare(topChild, current)
    if (shouldSwap) {
      this.array[topChildIndex] = current
      this.array[currentIndex] = topChild
      this._pushDown(topChildIndex)
    }
  }
}
