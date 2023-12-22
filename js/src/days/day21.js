import * as runner from "../lib/runner.js"

console.log("Solving AoC 2023 day 21")

const startChar = "S"
const rockChar = "#"

const createPositionKey = ({x, y}) => `${x}:${y}`

const parseInput = (input) => {
  const rockPositions = new Map()
  const numCols = input.indexOf("\n")
  const numRows = (input.length + 1) / (numCols + 1)
  const startIndex = input.indexOf(startChar)
  const startCol = startIndex % (numCols + 1)
  const startRow = Math.floor(startIndex / (numCols + 1))
  const startPosition = {x: startCol, y: startRow}
  if (startRow !== (numRows - 1) / 2) {
    throw new Error("Assumption invalid: start position not in center row")
  }
  if (startCol !== (numCols - 1) / 2) {
    throw new Error("Assumption invalid: start position not in center column")
  }

  for (let y = 0; y < numRows; y++) {
    for (let x = 0; x < numCols; x++) {
      const index = y * (numCols + 1) + x
      if (input[index] === rockChar) {
        const rockPos = {x, y}
        rockPositions.set(createPositionKey(rockPos), rockPos)
      }
    }
  }

  return {startPosition, rockPositions, numCols, numRows}
}

const nextPositions = [
  {x: 0, y: -1}, // up
  {x: 0, y: 1}, // down
  {x: -1, y: 0}, // left
  {x: 1, y: 0}, // right
]

const takeStep = (numCols, numRows, rockPositions, currentPositions) => {
  const newPositions = new Map()
  for (const position of currentPositions.values()) {
    for (const offset of nextPositions) {
      const nextX = position.x + offset.x
      const nextY = position.y + offset.y
      let rockX = nextX % numCols
      if (rockX < 0) { rockX = numCols + rockX}
      let rockY = nextY % numRows
      if (rockY < 0) { rockY = numRows + rockY}
      if (rockPositions.has(createPositionKey({x: rockX, y: rockY}))) { continue }
      const nextPosition = {x: nextX, y: nextY}
      const nextKey = createPositionKey(nextPosition)
      newPositions.set(nextKey, nextPosition)
    }
  }
  return newPositions
}

const part1 = (numSteps) => (input) => {
  const {startPosition, rockPositions, numCols, numRows} = parseInput(input)

  let currentPositions = new Map()
  currentPositions.set(createPositionKey(startPosition), startPosition)
  for (let i = 0; i < numSteps; i++) {
    currentPositions = takeStep(numCols, numRows, rockPositions, currentPositions)
  }

  return currentPositions.size
}

// const part2Steps = 26501365
//
// const part2 = (input) => {
//   const {startPosition, rockPositions} = parseInput(input)
//   console.log("start pos", startPosition)
//   return 0
// }

await runner.testOutput('day21/example', '1', part1(6))
// await runner.printOutput('day21/test', part1(64))
// await runner.copyOutput('day21/test', part1(64))
// await runner.writeOutput('day21/test', '1', part1(64))
await runner.testOutput('day21/test', '1', part1(64))

await runner.testOutput('day21/example', '2', part1(10))
await runner.testOutput('day21/example', '3', part1(50))
await runner.testOutput('day21/example', '4', part1(100))
// await runner.testOutput('day21/example', '5', part1(500))
// await runner.testOutput('day21/example', '6', part1(1000))

// await runner.printOutput('day21/test', part2)
// await runner.copyOutput('day21/test', part2)
// await runner.writeOutput('day21/test', '2', part2)
// await runner.testOutput('day21/test', '2', part2)
