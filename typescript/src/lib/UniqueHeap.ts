const minCompareFunc: CompareFunc<number> = (l, r) => r - l
const maxCompareFunc: CompareFunc<number> = (l, r) => l - r

export const initMinNumberHeap = (): UniqueHeap<number> => new UniqueHeap(minCompareFunc)
export const initMaxNumberHeap = (): UniqueHeap<number> => new UniqueHeap(maxCompareFunc)

type CompareFunc<T> = (l: T, r: T) => number

const getLeftChildIndex = (i: number): number => 2 * i + 1
const getParentIndex = (i: number): number => Math.floor((i - 1) / 2)

export class UniqueHeap<T> {
  array: T[]
  compare: CompareFunc<T>
  indexMap: Map<T, number>

  constructor(compare: CompareFunc<T>) {
    this.array = []
    this.compare = compare
    this.indexMap = new Map()
  }

  size() {
    return this.array.length
  }

  peek(): T | undefined {
    return this.array[0]
  }

  contains(item: T) {
    return this.indexMap.has(item)
  }

  push(item: T) {
    if (Number.isNaN(item)) {
      throw new Error("Can not add NaN value to heap")
    }
    if (this.indexMap.has(item)) {
      throw new Error("Can not add the same item twice")
    }
    const newIndex = this.array.length
    this.array.push(item)
    this.indexMap.set(item, newIndex)
    this._bubbleUp(newIndex)
  }

  pop(): T | undefined {
    if (this.array.length === 0) {
      return
    }
    const top = this.array[0]
    this.delete(top)
    return top
  }

  replace(oldItem: T, newItem: T) {
    const itemIndex = this.indexMap.get(oldItem)
    if (itemIndex == null) {
      throw new Error("Cannot replace item that is not in heap")
    }
    if (this.indexMap.has(newItem)) {
      throw new Error("Cannot replace with an item that is already in the heap")
    }

    this.array[itemIndex] = newItem
    this.indexMap.delete(oldItem)
    this.indexMap.set(newItem, itemIndex)

    const comparison = this.compare(newItem, oldItem)
    if (comparison > 0) {
      this._bubbleUp(itemIndex)
    } else if (comparison < 0) {
      this._pushDown(itemIndex)
    }
  }

  delete(item: T) {
    if (!this.contains(item)) {
      return false
    }
    const lastItem = this.array.pop()! // we know the array won't be empty, it at least contains the item
    this.indexMap.delete(lastItem)
    if (item !== lastItem) {
      this.replace(item, lastItem)
    }
    return true
  }

  private _bubbleUp(currentIndex: number) {
    const parentIndex = getParentIndex(currentIndex)
    if (parentIndex < 0) {
      return
    }
    const current = this.array[currentIndex]
    const parent = this.array[parentIndex]
    const shouldSwap = this.compare(current, parent)
    if (shouldSwap > 0) {
      this.array[parentIndex] = current
      this.indexMap.set(current, parentIndex)
      this.array[currentIndex] = parent
      this.indexMap.set(parent, currentIndex)
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
      if (topChild === undefined || this.compare(child, topChild) > 0) {
        topChildIndex = childIndex
        topChild = child
      }
    }

    // no children to be swapped
    if (topChild == null || topChildIndex == null) {
      return
    }

    const shouldSwap = this.compare(topChild, current) > 0
    if (shouldSwap) {
      this.array[topChildIndex] = current
      this.indexMap.set(current, topChildIndex)
      this.array[currentIndex] = topChild
      this.indexMap.set(topChild, currentIndex)
      this._pushDown(topChildIndex)
    }
  }
}
