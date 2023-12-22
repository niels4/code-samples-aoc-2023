import * as runner from "../lib/runner.js"

console.log("Solving AoC 2023 day 21")

const createPositionKey = (x, y) => `${x}:${y}`

const parseInput = (input) => {
  const rockPositions = new Set()
  const numCols = input.indexOf("\n")
  const numRows = (input.length + 1) / (numCols + 1)
  const startIndex = input.indexOf("S")
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
      if (input[index] === "#") {
        rockPositions.add(createPositionKey(x, y))
      }
    }
  }

  return {startPosition, rockPositions, numRows, numCols}
}

const part1 = (numSteps) => (input) => {
  const {startPosition, rockPositions, numRows, numCols} = parseInput(input)
  console.log(`rows:${numRows}, cols:${numCols}, startPos:`, startPosition)
  inspect(rockPositions)
  return 0
}

// const part2 = (input) => {
//   return 0
// }

await runner.testOutput('day21/example', '1', part1(6))
console.log()
// await runner.printOutput('day21/test', part1(64))
// await runner.copyOutput('day21/test', part1)
// await runner.writeOutput('day21/test', '1', part1)
// await runner.testOutput('day21/test', '1', part1)

// await runner.testOutput('day21/example', '2', part2)
// await runner.printOutput('day21/test', part2)
// await runner.copyOutput('day21/test', part2)
// await runner.writeOutput('day21/test', '2', part2)
// await runner.testOutput('day21/test', '2', part2)
