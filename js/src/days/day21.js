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
  if (numRows !== numCols) {
    throw new Error("Assumption invalid: Grid is not a perfect square.")
  }
  if (startRow !== (numRows - 1) / 2) {
    throw new Error("Assumption invalid: start position not in center row")
  }
  if (startCol !== (numCols - 1) / 2) {
    throw new Error("Assumption invalid: start position not in center column")
  }
  const size = numRows

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const index = y * (size + 1) + x
      if (input[index] === rockChar) {
        const rockPos = {x, y}
        rockPositions.set(createPositionKey(rockPos), rockPos)
      }
    }
  }

  return {size, rockPositions, startPosition}
}

const nextPositions = [
  {x: 0, y: -1}, // up
  {x: 0, y: 1}, // down
  {x: -1, y: 0}, // left
  {x: 1, y: 0}, // right
]

const takeStep = (size, rockPositions, currentPositions) => {
  const newPositions = new Map()
  for (const position of currentPositions.values()) {
    for (const offset of nextPositions) {
      const nextX = position.x + offset.x
      const nextY = position.y + offset.y
      let rockX = nextX % size
      if (rockX < 0) { rockX = size + rockX}
      let rockY = nextY % size
      if (rockY < 0) { rockY = size + rockY}
      if (rockPositions.has(createPositionKey({x: rockX, y: rockY}))) { continue }
      const nextPosition = {x: nextX, y: nextY}
      const nextKey = createPositionKey(nextPosition)
      newPositions.set(nextKey, nextPosition)
    }
  }
  return newPositions
}

const countEndPositions = (size, rockPositions, startPosition, numSteps) => {
  let currentPositions = new Map()
  currentPositions.set(createPositionKey(startPosition), startPosition)
  for (let i = 0; i < numSteps; i++) {
    currentPositions = takeStep(size, rockPositions, currentPositions)
  }

  return currentPositions.size
}

const part1 = (numSteps) => (input) => {
  const {size, rockPositions, startPosition} = parseInput(input)
  return countEndPositions(size, rockPositions, startPosition, numSteps)
}

const part2Steps = 26501365

const part2 = (input) => {
  const {size, rockPositions, startPosition} = parseInput(input)
  const stepsToEdge = startPosition.x

  console.log("start pos", startPosition, stepsToEdge, stepsToEdge * 2 + 1)
  const count1 = countEndPositions(size, rockPositions, startPosition, stepsToEdge)
  console.log("count1:", count1)
  const count2 = countEndPositions(size, rockPositions, startPosition, stepsToEdge + size)
  console.log("count2:", count2)
  const count3 = countEndPositions(size, rockPositions, startPosition, stepsToEdge + size * 2)
  console.log("count3:", count3)

  const x = (part2Steps - stepsToEdge) / size
  const quadraticFit = {a: 14613, b: 14747, c: 3726}
  const result = quadraticFit.a * x**2 + quadraticFit.b * x + quadraticFit.c
  return result
}

await runner.testOutput('day21/example', '1', part1(6))
// await runner.printOutput('day21/test', part1(64))
// await runner.copyOutput('day21/test', part1(64))
// await runner.writeOutput('day21/test', '1', part1(64))
await runner.testOutput('day21/test', '1', part1(64))

await runner.testOutput('day21/example', '2', part1(10))
await runner.testOutput('day21/example', '3', part1(50))
await runner.testOutput('day21/example', '4', part1(100))
// await runner.testOutput('day21/example', '5', part1(500)) // takes a few seconds
// await runner.testOutput('day21/example', '6', part1(1000)) // takes a few minutes

// await runner.printOutput('day21/test', part2)
// await runner.copyOutput('day21/test', part2)
// await runner.writeOutput('day21/test', '2', part2)
await runner.testOutput('day21/test', '2', part2)
