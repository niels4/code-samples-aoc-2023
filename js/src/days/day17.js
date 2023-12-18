import { UniqueHeap } from "../lib/data-structures/UniqueHeap.js"
import * as runner from "../lib/runner.js"

console.log("Solving AoC 2023 day 17")

// const createBlockKey = ({row, col, direction, directionCount}) => `${row}:${col}:${direction}:${directionCount}`
const createStateKey = ({row, col, direction, directionCount}) => `${row}:${col}:${direction.row}:${direction.col}:${directionCount}`

const parseInput = (input) => {
  const lines = input.split('\n')
  const rows = lines.map((line) => {
    return [...line].map((digit) => {
      return Number(digit)
    })
  })
  return rows
}

const isValidIndex = (arrayLength, index) => (index >= 0) && (index < arrayLength)

const neighborOffsets = [
  [0, -1], // up
  [0, 1], // down
  [-1, 0], // left
  [1, 0], // right
]

const maxDirectionCount = 3

const directionsEqual = (dir1, dir2) => dir1.col === dir2.col && dir1.row === dir2.row

const directionsOpposite = (dir1, dir2) => {
  if (dir1.col === 0) {
    return dir2.col === 0 && dir1.row === -dir2.row
  }
  if (dir1.row === 0) {
    return dir2.row === 0 && dir1.col === -dir2.col
  }
}

const getNeighbors = (rows, seen, state) => {
  const numRows = rows.length
  const numCols = rows[0].length

  const neighbors = []
  
  const {col, row, direction, directionCount} = state
  for (const [colOffset, rowOffset] of neighborOffsets) {
    const nextRow = row + rowOffset
    const nextCol = col + colOffset
    if (!isValidIndex(numRows, nextRow) || !isValidIndex(numCols, nextCol)) { continue }
    const nextDirection = {row: rowOffset, col: colOffset}
    const nextDirectionCount = directionsEqual(direction, nextDirection) ? directionCount + 1 : 1
    if (nextDirectionCount > maxDirectionCount || directionsOpposite(direction, nextDirection)) { continue }
    const nextState = {col: nextCol, row: nextRow, direction: nextDirection, directionCount: nextDirectionCount}
    const nextKey = createStateKey(nextState)
    if (seen.has(nextKey)) { continue }
    neighbors.push(nextState)
  }

  return neighbors
}

const totalLossCompare = (l, r) => l.totalLoss < r.totalLoss

const part1 = (input) => {
  const rows = parseInput(input)
  const seen = new Set()

  const statesToVisit = new UniqueHeap(totalLossCompare)
  const startState = {col: 0, row: 0, totalLoss: 0, direction: {row: 0, col: 0}, directionCount: 1}
  statesToVisit.push(startState)

  while (statesToVisit.size() > 0) {
    const currentState = statesToVisit.pop()
    const currentKey = createStateKey(currentState)
    if (currentState.row === rows.length - 1 && currentState.col === rows[0].length - 1) {
      return currentState.totalLoss
    }
    seen.add(currentKey)
    const nextStates = getNeighbors(rows, seen, currentState)
    for (const nextState of nextStates) {
      nextState.totalLoss = currentState.totalLoss + rows[nextState.row][nextState.col]
      statesToVisit.push(nextState)
    }
  }

  return Infinity
}

// const part2 = (input) => {
//   return 0
// }

await runner.testOutput('day17/example', '1', part1)
await runner.printOutput('day17/test', part1)
// await runner.copyOutput('day17/test', part1)
// await runner.writeOutput('day17/test', '1', part1)
// await runner.testOutput('day17/test', '1', part1)

// await runner.testOutput('day17/example', '2', part2)
// await runner.printOutput('day17/test', part2)
// await runner.copyOutput('day17/test', part2)
// await runner.writeOutput('day17/test', '2', part2)
// await runner.testOutput('day17/test', '2', part2)
