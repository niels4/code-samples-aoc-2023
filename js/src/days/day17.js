import { UniqueHeap } from "../lib/data-structures/UniqueHeap.js"
import * as runner from "../lib/runner.js"

console.log("Solving AoC 2023 day 17. Be patient this one takes a couple minutes...")

// const createBlockKey = ({row, col, direction, directionCount}) => `${row}:${col}:${direction}:${directionCount}`
const createStateKey = ({row, col, direction, directionCount}) => `${col}:${row}:${direction.col}:${direction.row}:${directionCount}`

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

const directionsEqual = (dir1, dir2) => dir1.col === dir2.col && dir1.row === dir2.row

const directionsOpposite = (dir1, dir2) => dir1.row === -dir2.row && dir1.col === -dir2.col

const totalLossCompare = (l, r) => l.totalLoss < r.totalLoss

const walkPath = (rows, maxDirectionCount) => {
  const numRows = rows.length
  const numCols = rows[0].length

  const seen = new Set()
  const statesToVisit = new UniqueHeap(totalLossCompare)
  const startState = {col: 0, row: 0, totalLoss: 0, direction: {col: 0, row: 0}, directionCount: 1}
  statesToVisit.push(startState)

  while (statesToVisit.size() > 0) {
    const currentState = statesToVisit.pop()
    const currentKey = createStateKey(currentState)
    if (seen.has(currentKey)) { continue }

    if (currentState.row === rows.length - 1 && currentState.col === rows[0].length - 1) {
      return currentState.totalLoss
    }

    seen.add(currentKey)

    for (const [colOffset, rowOffset] of neighborOffsets) {
      const nextRow = currentState.row + rowOffset
      const nextCol = currentState.col + colOffset
      if (!isValidIndex(numRows, nextRow) || !isValidIndex(numCols, nextCol)) { continue }
      const nextLoss = rows[nextRow][nextCol]
      const nextTotalLoss = currentState.totalLoss + nextLoss
      const nextDirection = {col: colOffset, row: rowOffset}
      if (directionsOpposite(currentState.direction, nextDirection)) { continue }
      const nextDirectionCount = directionsEqual(currentState.direction, nextDirection) ? currentState.directionCount + 1 : 1
      if (nextDirectionCount > maxDirectionCount) { continue }
      const nextState = {col: nextCol, row: nextRow, totalLoss: nextTotalLoss, direction: nextDirection, directionCount: nextDirectionCount}
      statesToVisit.push(nextState)
    }
  }

  return Infinity
}

const part1 = (input) => {
  const rows = parseInput(input)
  return walkPath(rows, 3)
}

const walkPathPart2 = (rows, maxDirectionCount, minDirectionCount) => {
  const numRows = rows.length
  const numCols = rows[0].length

  const seen = new Set()
  const statesToVisit = new UniqueHeap(totalLossCompare)
  const startState = {col: 0, row: 0, totalLoss: 0, direction: {col: 0, row: 0}, directionCount: 4}
  statesToVisit.push(startState)

  while (statesToVisit.size() > 0) {
    const currentState = statesToVisit.pop()
    const currentKey = createStateKey(currentState)
    if (seen.has(currentKey)) { continue }

    if (currentState.row === rows.length - 1 && currentState.col === rows[0].length - 1 && currentState.directionCount >= minDirectionCount) {
      return currentState.totalLoss
    }

    seen.add(currentKey)

    for (const [colOffset, rowOffset] of neighborOffsets) {
      const nextRow = currentState.row + rowOffset
      const nextCol = currentState.col + colOffset
      if (!isValidIndex(numRows, nextRow) || !isValidIndex(numCols, nextCol)) { continue }
      const nextLoss = rows[nextRow][nextCol]
      const nextTotalLoss = currentState.totalLoss + nextLoss
      const nextDirection = {col: colOffset, row: rowOffset}
      if (directionsOpposite(currentState.direction, nextDirection)) { continue }
      const nextDirectionCount = directionsEqual(currentState.direction, nextDirection) ? currentState.directionCount + 1 : 1
      if (nextDirectionCount > maxDirectionCount) { continue }
      if (nextDirectionCount === 1 && currentState.directionCount < minDirectionCount) { continue }
      const nextState = {col: nextCol, row: nextRow, totalLoss: nextTotalLoss, direction: nextDirection, directionCount: nextDirectionCount}
      statesToVisit.push(nextState)
    }
  }

  return Infinity
}

const part2 = (input) => {
  const rows = parseInput(input)
  return walkPathPart2(rows, 10, 4)
}

await runner.testOutput('day17/example', '1', part1)
// await runner.printOutput('day17/test', part1)
// await runner.copyOutput('day17/test', part1)
// await runner.writeOutput('day17/test', '1', part1)
await runner.testOutput('day17/test', '1', part1)

await runner.testOutput('day17/example', '2', part2)
await runner.testOutput('day17/example_b', '2', part2)
// await runner.printOutput('day17/test', part2)
// await runner.copyOutput('day17/test', part2)
// await runner.writeOutput('day17/test', '2', part2)
await runner.testOutput('day17/test', '2', part2)
