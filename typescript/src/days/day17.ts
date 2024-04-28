import { UniqueHeap } from "../lib/UniqueHeap.js"
import * as runner from "../lib/runner.js"
console.log("Solving AoC 2023 day 17. Be patient this one takes a little while...")

interface Direction {
  col: number
  row: number
}

interface PathState {
  row: number
  col: number
  totalLoss: number
  direction: Direction
  directionCount: number
}

const createStateKey = ({ row, col, direction, directionCount }: PathState): string =>
  `${col}:${row}:${direction.col}:${direction.row}:${directionCount}`

const parseInput = (input: string): number[][] => {
  const lines = input.split("\n")
  const rows = lines.map((line) => [...line].map(Number))
  return rows
}

const isValidIndex = (arrayLength: number, index: number): boolean => index >= 0 && index < arrayLength

const neighborOffsets: [number, number][] = [
  [0, -1], // up
  [0, 1], // down
  [-1, 0], // left
  [1, 0], // right
]

const directionsEqual = (dir1: Direction, dir2: Direction): boolean =>
  dir1.col === dir2.col && dir1.row === dir2.row

const directionsOpposite = (dir1: Direction, dir2: Direction): boolean =>
  dir1.row === -dir2.row && dir1.col === -dir2.col

const totalLossCompare = (l: PathState, r: PathState): boolean => l.totalLoss < r.totalLoss

const walkPath = (rows: number[][], maxDirectionCount: number, minDirectionCount: number = 0): number => {
  const numRows = rows.length
  const numCols = rows[0].length

  const seen = new Set<string>()
  const statesToVisit = new UniqueHeap<PathState>(totalLossCompare)
  const startState: PathState = {
    col: 0,
    row: 0,
    totalLoss: 0,
    direction: { col: 0, row: 0 },
    directionCount: 4,
  }
  statesToVisit.push(startState)

  while (statesToVisit.size() > 0) {
    const currentState = statesToVisit.pop()!
    const currentKey = createStateKey(currentState)
    if (seen.has(currentKey)) continue

    if (
      currentState.row === numRows - 1 &&
      currentState.col === numCols - 1 &&
      currentState.directionCount >= minDirectionCount
    ) {
      return currentState.totalLoss
    }

    seen.add(currentKey)

    for (const [colOffset, rowOffset] of neighborOffsets) {
      const nextRow = currentState.row + rowOffset
      const nextCol = currentState.col + colOffset
      if (!isValidIndex(numRows, nextRow) || !isValidIndex(numCols, nextCol)) continue
      const nextLoss = rows[nextRow][nextCol]
      const nextTotalLoss = currentState.totalLoss + nextLoss
      const nextDirection: Direction = { col: colOffset, row: rowOffset }
      if (directionsOpposite(currentState.direction, nextDirection)) continue
      const nextDirectionCount = directionsEqual(currentState.direction, nextDirection)
        ? currentState.directionCount + 1
        : 1
      if (nextDirectionCount > maxDirectionCount) continue
      if (nextDirectionCount === 1 && currentState.directionCount < minDirectionCount) continue
      const nextState: PathState = {
        col: nextCol,
        row: nextRow,
        totalLoss: nextTotalLoss,
        direction: nextDirection,
        directionCount: nextDirectionCount,
      }
      statesToVisit.push(nextState)
    }
  }

  return Infinity
}

const part1 = (input: string): number => {
  const rows = parseInput(input)
  return walkPath(rows, 3)
}

const part2 = (input: string): number => {
  const rows = parseInput(input)
  return walkPath(rows, 10, 4)
}

runner.testOutput("day17/example", "1", part1)
runner.testOutput("day17/test", "1", part1)

runner.testOutput("day17/example", "2", part2)
runner.testOutput("day17/example_b", "2", part2)
// runner.testOutput("day17/test", "2", part2)
