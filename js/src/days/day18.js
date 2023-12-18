import * as runner from "../lib/runner.js"

console.log("Solving AoC 2023 day 18")

const parseInput = (input) => {
  const lines = input.split('\n')
  return lines.map((line) => {
    const [direction, magnitudeStr, color] = line.split(" ")
    const magnitude = Number(magnitudeStr)
    return {direction, magnitude, color}
  })
}

const createSquareKey = ({col, row}) => `${col}:${row}`

const directionOffsets = {
  U: {col: 0, row: -1},
  D: {col: 0, row: 1},
  L: {col: -1, row: 0},
  R: {col: 1, row: 0},
}

const buildPath = (commands) => {
  const squaresMap = new Map()
  const startSquare = {col: 0, row: 0, color: "(#000000)"}
  squaresMap.set(createSquareKey(startSquare), startSquare)
  let numCols = 1
  let numRows = 1

  let currentSquare = startSquare
  commands.forEach(({direction, magnitude, color}) => {
    const offset = directionOffsets[direction]
    for (let i = 0; i < magnitude; i++) {
      const nextSquare = {col: currentSquare.col + offset.col, row: currentSquare.row + offset.row, color}
      squaresMap.set(createSquareKey(nextSquare), nextSquare)
      currentSquare = nextSquare
      const nextNumCols = Math.abs(currentSquare.col) + 1
      if (nextNumCols > numCols) { numCols = nextNumCols }
      const nextNumRows = Math.abs(currentSquare.row) + 1
      if (nextNumRows > numRows) { numRows = nextNumRows }
    }
  })

  return {squaresMap, numCols, numRows}
}

const getPathString = (path) => {
  const {squaresMap, numRows, numCols} = path
  const lines = Array.from({length: numRows}, () => [])
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const nextKey = createSquareKey({col, row})
      const nextChar = squaresMap.has(nextKey) ? "#" : "."
      lines[row][col] = nextChar
    }
  }
  return lines.map(line => line.join("")).join("\n")
}

const part1 = (input) => {
  const commands = parseInput(input)
  const path = buildPath(commands)
  console.log("result", path.numCols, path.numRows)
  inspect(path.squaresMap)
  console.log()
  console.log(getPathString(path))
  return 0
}

// const part2 = (input) => {
//   return 0
// }

await runner.testOutput('day18/example', '1', part1)
// await runner.printOutput('day18/test', part1)
// await runner.copyOutput('day18/test', part1)
// await runner.writeOutput('day18/test', '1', part1)
// await runner.testOutput('day18/test', '1', part1)

// await runner.testOutput('day18/example', '2', part2)
// await runner.printOutput('day18/test', part2)
// await runner.copyOutput('day18/test', part2)
// await runner.writeOutput('day18/test', '2', part2)
// await runner.testOutput('day18/test', '2', part2)
