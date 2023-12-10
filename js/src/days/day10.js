import * as runner from "../lib/runner.js"

console.log("Solving AoC 2023 day 10")

const pipeTransforms = {
  "|": [0, 1],
  "-": [1, 0],
  "L": [1, 1],
  "J": [1, -1],
  "7": [1, -1],
  "F": [0, -1],
}

const applyPipeTransform = (pipeChar, col, row) => {
  const [colDiff, rowDiff] = pipeTransforms[pipeChar]
  return [col + colDiff, row + rowDiff]
}
  
const parseInput = (input) => {
  const startIndex = input.indexOf("S")
  const lines = input.split('\n')
  const rowLength = lines[0].length
  const startRow = Math.floor(startIndex / rowLength)
  const startCol = startIndex - (startRow * rowLength) - 1
  return {lines, startCol, startRow}
}

const part1 = (input) => {
  const {lines, startCol, startRow} = parseInput(input)
  let currCol = startCol
  let currRow = startRow
  let loopSize = 1
  return 0
}

// const part2 = (input) => {
//   return 0
// }

await runner.testOutput('day10/example', '1', part1)
// await runner.printOutput('day10/test', part1)
// await runner.copyOutput('day10/test', part1)
// await runner.writeOutput('day10/test', '1', part1)
// await runner.testOutput('day10/test', '1', part1)

// await runner.testOutput('day10/example', '2', part2)
// await runner.printOutput('day10/test', part2)
// await runner.copyOutput('day10/test', part2)
// await runner.writeOutput('day10/test', '2', part2)
// await runner.testOutput('day10/test', '2', part2)
