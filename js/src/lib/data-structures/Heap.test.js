import { describe, it, expect, beforeAll } from "vitest"
import { initMinNumberHeap, initMaxNumberHeap } from "./Heap"

describe("Heap", () => {
  describe("constructor", () => {
    it("should construct an empty heap", () => {
      const heap = initMinNumberHeap()
      heap.push(2)
      heap.push(1)
      expect(heap.array).to.deep.eq([1, 2])
    })
  })

  describe("peek", () => {
    it("should return top value in heap", () => {
      const heap = initMinNumberHeap()
      heap.array[0] = 2
      const result = heap.peek()
      expect(result).to.eq(2)
    })
  })

  describe("size", () => {
    it("should return 0 for empty heap", () => {
      const heap = initMinNumberHeap()
      expect(heap.size()).to.equal(0)
    })

    it("should return size of array", () => {
      const heap = initMinNumberHeap()
      heap.array.push(1)
      heap.array.push(2)
      expect(heap.size()).to.eq(2)
    })
  })

  describe("push", () => {
    it("should keep track of top item when adding items to heap", () => {
      const heap = initMaxNumberHeap()
      heap.push(8)
      expect(heap.peek()).to.eq(8)
      heap.push(5)
      expect(heap.peek()).to.eq(8)
      heap.push(10)
      expect(heap.peek()).to.eq(10)
      heap.push(9)
      expect(heap.peek()).to.eq(10)
      heap.push(20)
      expect(heap.peek()).to.eq(20)
    })
  })

  describe("pop", () => {
    it("should pop items off heap in order of top to least", () => {
      const heap = initMaxNumberHeap()
      heap.push(8)
      heap.push(5)
      heap.push(10)
      heap.push(9)
      heap.push(20)
      expect(heap.pop()).to.eq(20)
      expect(heap.pop()).to.eq(10)
      expect(heap.pop()).to.eq(9)
      expect(heap.pop()).to.eq(8)
      expect(heap.pop()).to.eq(5)
      expect(heap.pop()).toBeUndefined()
    })
  })

  describe("push and pop behavior, test pushdown", () => {
    it("should keep the heap correctly ordered as items are pushed and popped", () => {
      const heap = initMinNumberHeap()
      heap.push(10)
      heap.push(15)
      heap.push(12)
      heap.push(20)
      expect(heap.pop()).to.eq(10)
      expect(heap.pop()).to.eq(12)
      expect(heap.pop()).to.eq(15)
      expect(heap.pop()).to.eq(20)
      expect(heap.pop()).toBeUndefined()
    })

    it("should keep the heap correctly ordered as items are pushed and popped", () => {
      const heap = initMinNumberHeap()
      heap.push(10)
      heap.push(15)
      heap.push(12)
      expect(heap.pop()).to.eq(10)
      expect(heap.pop()).to.eq(12)
      expect(heap.pop()).to.eq(15)
    })
  })

  describe("leetcode integration test (leetcode problem 703)", () => {
    class KthLargest {
      heap
      k
      constructor(k, nums) {
        this.heap = initMinNumberHeap()
        this.k = k
        nums.forEach((val) => {
          this.add(val)
        })
      }
      add(val) {
        if (this.heap.size() < this.k) {
          this.heap.push(val)
        }
        else if (val > this.heap.peek()) {
          this.heap.pop()
          this.heap.push(val)
        }
        return this.heap.peek()
      }
    }

    // prettier-ignore
    const methods = ["KthLargest", "add", "add", "add", "add", "add", "add", "add", "add", "add", "add", "add", "add", "add", "add", "add", "add", "add", "add", "add", "add", "add", "add", "add", "add", "add", "add", "add"]
    // prettier-ignore
    const args = [[7, [-10, 1, 3, 1, 4, 10, 3, 9, 4, 5, 1]], [3], [2], [3], [1], [2], [4], [5], [5], [6], [7], [7], [8], [2], [3], [1], [1], [1], [10], [11], [5], [6], [2], [4], [7], [8], [5], [6]]
    // prettier-ignore
    const expectedOutput = [null, 3, 3, 3, 3, 3, 3, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7]
    let instance
    let output = []

    beforeAll(() => {
      output = []
      methods.forEach((method, i) => {
        const nextArgs = args[i]
        if (method === "KthLargest") {
          instance = new KthLargest(nextArgs[0], nextArgs[1])
          output.push(null)
        }
        else {
          output.push(instance[method](nextArgs[0]))
        }
      })
    })

    it("should run the example input and construct the correct output", () => {
      expect(output).to.deep.equal(expectedOutput)
    })
  })
})
