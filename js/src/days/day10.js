import * as runner from "../lib/runner.js"

console.log("Solving AoC 2023 day 10")

const startChar = "S"

const pipeTransforms = {
  "|": ["n", "s"],
  "-": ["w", "e"],
  "L": ["n", "e"],
  "J": ["n", "w"],
  "7": ["w", "s"],
  "F": ["e", "s"],
}

const directions = {
  "n": [0, -1],
  "e": [1, 0]
}

const opposites = {}

const defineOpposite = (dirKey, oppositeDirKey) => {
  const direction = directions[dirKey]
  const oppositeDiretion = direction.map(d => d * -1)
  directions[oppositeDirKey] = oppositeDiretion
  opposites[dirKey] = oppositeDirKey
  opposites[oppositeDirKey] = dirKey
}

defineOpposite("n", "s")
defineOpposite("e", "w")

const parseInput = (input) => {
  const startIndex = input.indexOf(startChar)
  const lines = input.split('\n')
  const rowLength = lines[0].length + 1 // add one to account for the newline characters
  const startRow = Math.floor(startIndex / rowLength)
  const startCol = startIndex % (rowLength)
  return {lines, startCol, startRow}
}

const doFirstStep = (lines, startCol, startRow) => {
  let currCol = startCol
  let currRow = startRow
  for (const [dirKey, [colDiff, rowDiff]] of Object.entries(directions)) {
    const nextCol = currCol + colDiff
    const nextRow = currRow + rowDiff
    const nextChar = lines[nextRow][nextCol]
    const nextCharPipeExits = pipeTransforms[nextChar]
    if (!nextCharPipeExits) { continue }
    const [from, to] = nextCharPipeExits
    const oppositeDirKey = opposites[dirKey]
    if (from === oppositeDirKey || to === oppositeDirKey) {
      return {currChar: nextChar, currCol: nextCol, currRow: nextRow, fromDir: oppositeDirKey}
    }
  }
  console.error("COULD NOT TAKE FIRST STEP")
}

const part1 = (input) => {
  const {lines, startCol, startRow} = parseInput(input)

  let {currChar, currCol, currRow, fromDir} = doFirstStep(lines, startCol, startRow)
  let loopSize = 1

  while (currChar != startChar) {
    const toDir = pipeTransforms[currChar].filter(dir => dir !== fromDir)[0]
    fromDir = opposites[toDir]
    const [colDiff, rowDiff] = directions[toDir]
    currCol += colDiff
    currRow += rowDiff
    currChar = lines[currRow][currCol]
    loopSize++
  }

  return Math.floor(loopSize / 2)
}

const part2 = (input) => {
  return 0
}

await runner.testOutput('day10/example', '1', part1)
await runner.testOutput('day10/example_b', '1', part1)
// await runner.printOutput('day10/test', part1)
// await runner.copyOutput('day10/test', part1)
// await runner.writeOutput('day10/test', '1', part1)
await runner.testOutput('day10/test', '1', part1)

await runner.testOutput('day10/example_c', '2', part2)
await runner.testOutput('day10/example_d', '2', part2)
// await runner.printOutput('day10/test', part2)
// await runner.copyOutput('day10/test', part2)
// await runner.writeOutput('day10/test', '2', part2)
// await runner.testOutput('day10/test', '2', part2)
