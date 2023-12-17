import { describe, it, expect, beforeAll, beforeEach } from "vitest"
import { initMinNumberHeap, initMaxNumberHeap, UniqueHeap } from "./UniqueHeap"
const minTestObjCompare = (l, r) => r.val - l.val
const maxTestObjCompare = (l, r) => l.val - r.val
describe("UniqueHeap", () => {
  describe("should pass all of the same tests that the normal Heap does", () => {
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
          this.heap = new UniqueHeap(minTestObjCompare)
          this.k = k
          nums.forEach((val) => {
            this.add(val)
          })
        }
        add(val) {
          if (this.heap.size() < this.k) {
            this.heap.push({ val })
          }
          else if (val > this.heap.peek().val) {
            this.heap.pop()
            this.heap.push({ val })
          }
          return this.heap.peek().val
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
  describe("push", () => {
    describe("with primatives", () => {
      let heap
      beforeEach(() => {
        heap = initMaxNumberHeap()
      })
      it("should throw an error if you push the same value twice", () => {
        heap.push(5)
        expect(() => heap.push(5)).toThrowError()
      })
      it("should throw an error if you try to push NaN", () => {
        expect(() => heap.push(NaN)).toThrowError()
      })
    })
    describe("with objects", () => {
      let heap
      beforeEach(() => {
        heap = new UniqueHeap(maxTestObjCompare)
      })
      it("should throw an error if you push the same object twice", () => {
        const item = { val: 5 }
        heap.push(item)
        expect(() => heap.push(item)).toThrowError()
      })
      it("should not throw an error if you push a different object with the same value", () => {
        const item = { val: 5 }
        const item2 = { val: 5 }
        heap.push(item)
        heap.push(item2)
        expect(heap.contains(item)).toBe(true)
        expect(heap.contains(item2)).toBe(true)
      })
    })
  })
  describe("contains", () => {
    describe("with primatives", () => {
      let heap
      beforeEach(() => {
        heap = initMaxNumberHeap()
      })
      it("should return false when the heap does not contain an item", () => {
        expect(heap.contains(0)).to.eq(false)
      })
      it("should return true when the heap does contain an item", () => {
        heap.push(0)
        expect(heap.contains(0)).to.eq(true)
      })
      it("behave correctly with more complex usage", () => {
        heap.push(5)
        heap.push(10)
        heap.push(20)
        heap.push(30)
        expect(heap.contains(30)).toBe(true)
        heap.pop()
        expect(heap.contains(30)).toBe(false)
        expect(heap.contains(20)).toBe(true)
        heap.pop()
        expect(heap.contains(20)).toBe(false)
        heap.push(20)
        expect(heap.contains(20)).toBe(true)
        heap.pop()
        expect(heap.contains(20)).toBe(false)
      })
    })
    describe("with objects", () => {
      let heap
      beforeEach(() => {
        heap = new UniqueHeap(maxTestObjCompare)
      })
      it("should return false when the heap does not contain an item", () => {
        const item0 = { val: 0 }
        expect(heap.contains(item0)).to.eq(false)
      })
      it("should return true when the heap does contain an item", () => {
        const item0 = { val: 0 }
        heap.push(item0)
        expect(heap.contains(item0)).to.eq(true)
      })
      it("behave correctly with more complex usage", () => {
        const item10 = { val: 10 }
        const item20 = { val: 20 }
        const item30 = { val: 30 }
        heap.push(item10)
        heap.push(item20)
        heap.push(item30)
        expect(heap.contains(item30)).toBe(true)
        expect(heap.pop()).to.equal(item30)
        expect(heap.contains(item30)).toBe(false)
        expect(heap.contains(item20)).toBe(true)
        heap.pop()
        expect(heap.contains(item20)).toBe(false)
        heap.push(item20)
        expect(heap.contains(item20)).toBe(true)
        heap.pop()
        expect(heap.contains(item20)).toBe(false)
      })
    })
  })
  describe("replace", () => {
    let heap
    beforeEach(() => {
      heap = new UniqueHeap(maxTestObjCompare)
    })
    it("should replace the item on the heap with a new one in the simple case", () => {
      const item1 = { val: 10 }
      const item2 = { val: 20 }
      heap.push(item1)
      expect(heap.contains(item1)).toBe(true)
      expect(heap.contains(item2)).toBe(false)
      heap.replace(item1, item2)
      expect(heap.contains(item1)).toBe(false)
      expect(heap.contains(item2)).toBe(true)
    })
    it("should throw an error when you try to replace an item that doesn't exist", () => {
      const item1 = { val: 10 }
      const item2 = { val: 20 }
      const item3 = { val: 30 }
      heap.push(item1)
      expect(() => heap.replace(item2, item3)).toThrowError()
    })
    it("should throw an error when you try to replace with an item that is already in the heap", () => {
      const item1 = { val: 10 }
      const item2 = { val: 20 }
      heap.push(item1)
      heap.push(item2)
      expect(() => heap.replace(item1, item2)).toThrowError()
    })
    it("make sure bubble up keeps track of indices when replacing", () => {
      const item1 = { val: 10 }
      const item2 = { val: 20 }
      const item3 = { val: 30 }
      heap.push(item1)
      heap.push(item2)
      expect(heap.peek()).toBe(item2)
      heap.replace(item1, item3)
      expect(heap.contains(item1)).toBe(false)
      expect(heap.peek()).toBe(item3)
      heap.replace(item3, item1)
      expect(heap.peek()).toBe(item2)
    })
    it("make sure pushdown keeps track of indices when replacing", () => {
      const item0 = { val: 0 }
      const item1 = { val: 10 }
      const item2 = { val: 20 }
      const item3 = { val: 30 }
      heap.push(item1)
      heap.push(item2)
      heap.push(item3)
      expect(heap.pop()).toBe(item3)
      expect(heap.peek()).toBe(item2)
      heap.replace(item2, item0)
      expect(heap.contains(item0)).toBe(true)
      expect(heap.contains(item1)).toBe(true)
      expect(heap.contains(item2)).toBe(false)
      expect(heap.contains(item3)).toBe(false)
      expect(heap.peek()).toBe(item1)
    })
  })
  describe("delete", () => {
    let heap
    beforeEach(() => {
      heap = new UniqueHeap(maxTestObjCompare)
    })
    it("should return false if heap does not already contain item", () => {
      const item1 = { val: 10 }
      expect(heap.delete(item1)).toBe(false)
    })
    it("should return true and remove item if contained by heap", () => {
      const item1 = { val: 10 }
      const item2 = { val: 20 }
      const item3 = { val: 30 }
      heap.push(item1)
      heap.push(item2)
      heap.push(item3)
      expect(heap.contains(item2)).toBe(true)
      expect(heap.delete(item2)).toBe(true)
      expect(heap.contains(item2)).toBe(false)
      expect(heap.pop()).toBe(item3)
      expect(heap.pop()).toBe(item1)
      expect(heap.pop()).toBe(undefined)
    })
  })
  describe("leetcode integration test. Problem 743, uses Dijkstra's", () => {
    const minDistanceCompare = (l, r) => r.distance - l.distance
    function networkDelayTime(times, n, k) {
      const graph = new Map()
      for (let nextId = 1; nextId <= n; nextId++) {
        graph.set(nextId, {
          id: nextId,
          edges: new Map(),
          distance: Infinity,
        })
      }
      times.forEach(([start, end, weight]) => {
        const node = graph.get(start)
        node?.edges.set(end, weight)
      })
      const startNode = graph.get(k)
      startNode.distance = 0
      // dijkstras to find shortest distance to each node
      const minDistancePriorityQueue = new UniqueHeap(minDistanceCompare)
      minDistancePriorityQueue.push(startNode)
      while (minDistancePriorityQueue.size() > 0) {
        const node = minDistancePriorityQueue.pop() // node can't be undefined, queue.size > 0
        for (const [targetId, weight] of node.edges) {
          const targetNode = graph.get(targetId)
          const newDistance = node.distance + weight
          if (newDistance < targetNode.distance) {
            const targetUpdate = { ...targetNode, distance: newDistance }
            graph.set(targetId, targetUpdate)
            if (minDistancePriorityQueue.contains(targetNode)) {
              minDistancePriorityQueue.replace(targetNode, targetUpdate)
            }
            else {
              minDistancePriorityQueue.push(targetUpdate)
            }
          }
        }
      }
      // check which node took longest
      let maxDistance = -1
      for (const { distance } of graph.values()) {
        if (distance > maxDistance) {
          maxDistance = distance
        }
      }
      const result = maxDistance === Infinity ? -1 : maxDistance
      return result
    }
    it("should get the correct result with the test input", () => {
      // prettier-ignore
      const input = [[15, 8, 1], [7, 10, 41], [7, 9, 34], [9, 4, 31], [12, 13, 50], [14, 3, 52], [4, 11, 99], [4, 7, 86], [10, 13, 57], [9, 6, 10], [1, 7, 51], [7, 15, 38], [1, 9, 11], [12, 7, 94], [9, 13, 34], [11, 7, 79], [7, 6, 28], [5, 3, 34], [2, 6, 97], [14, 1, 97], [6, 10, 90], [12, 10, 37], [13, 3, 73], [11, 14, 7], [15, 1, 39], [6, 5, 90], [13, 6, 43], [6, 9, 32], [4, 6, 45], [11, 10, 2], [2, 13, 4], [14, 15, 29], [1, 14, 88], [14, 6, 19], [6, 2, 29], [3, 14, 72], [1, 15, 4], [11, 5, 2], [6, 7, 56], [8, 7, 88], [13, 14, 70], [14, 12, 58], [14, 2, 86], [11, 3, 57], [5, 2, 56], [3, 10, 26], [2, 11, 21], [14, 5, 54], [5, 12, 40], [14, 4, 81], [15, 2, 99], [5, 7, 57], [13, 12, 5], [4, 9, 60], [12, 15, 48], [6, 14, 1], [9, 7, 44], [13, 7, 69], [5, 13, 42], [4, 1, 7], [11, 9, 76], [8, 1, 76], [5, 14, 29], [2, 3, 69], [7, 3, 23], [12, 14, 28], [11, 4, 85], [10, 1, 10], [15, 12, 36], [1, 11, 69], [15, 10, 96], [11, 13, 69], [7, 12, 49], [1, 2, 95], [6, 4, 46], [8, 12, 94], [12, 4, 93], [13, 5, 31], [12, 2, 60], [6, 1, 87], [4, 14, 20], [5, 11, 89], [4, 15, 88], [4, 10, 21], [1, 6, 5], [10, 8, 26], [8, 2, 51], [3, 15, 23], [7, 2, 12], [11, 1, 47], [2, 1, 75], [3, 8, 63], [8, 10, 19], [6, 8, 18], [4, 2, 55], [14, 11, 80], [10, 3, 73], [3, 5, 22], [12, 3, 61], [1, 13, 33], [9, 3, 98], [9, 12, 69], [15, 9, 6], [7, 13, 76], [11, 12, 22], [11, 15, 51], [13, 15, 46], [5, 10, 58], [1, 10, 26], [13, 4, 85], [7, 14, 58], [5, 8, 46], [11, 6, 32], [10, 9, 41], [9, 14, 35], [14, 13, 60], [3, 9, 97], [2, 5, 39], [7, 11, 19], [1, 12, 27], [7, 5, 13], [8, 4, 34], [9, 15, 25], [5, 1, 93], [15, 13, 97], [14, 9, 35], [8, 6, 67], [9, 5, 39], [13, 11, 35], [7, 4, 21], [12, 9, 64], [14, 8, 8], [10, 12, 94], [8, 9, 76], [8, 5, 71], [2, 9, 64], [10, 14, 59], [1, 4, 74], [7, 1, 69], [15, 5, 55], [6, 15, 80], [13, 8, 84], [8, 13, 63], [8, 3, 91], [10, 4, 87], [1, 5, 39], [8, 11, 0], [1, 3, 79], [4, 5, 82], [4, 12, 87], [3, 11, 29], [7, 8, 92], [10, 7, 77], [6, 12, 42], [13, 2, 40], [9, 10, 13], [4, 13, 65], [2, 4, 34], [3, 13, 44], [2, 14, 69], [3, 4, 42], [5, 15, 98], [14, 7, 6], [15, 3, 94], [10, 2, 37], [15, 11, 7], [9, 2, 15], [13, 9, 66], [4, 8, 83], [8, 15, 23], [13, 1, 50], [6, 13, 57], [2, 10, 37], [10, 6, 38], [2, 7, 45], [9, 8, 8], [3, 12, 28], [3, 2, 83], [2, 12, 75], [1, 8, 91], [4, 3, 70], [12, 6, 48], [3, 1, 13], [5, 6, 42], [6, 11, 96], [3, 6, 22], [15, 6, 34], [11, 8, 43], [15, 7, 40], [9, 11, 57], [11, 2, 11], [2, 8, 22], [9, 1, 73], [2, 15, 40], [12, 11, 10], [15, 4, 78], [12, 8, 75], [10, 15, 37], [13, 10, 44], [8, 14, 33], [3, 7, 82], [5, 4, 46], [12, 5, 79], [15, 14, 43], [10, 5, 65], [5, 9, 34], [12, 1, 54], [6, 3, 16], [14, 10, 83], [10, 11, 67]]
      const n = 15
      const k = 8
      const result = networkDelayTime(input, n, k)
      expect(result).to.eq(34)
    })
  })
})
