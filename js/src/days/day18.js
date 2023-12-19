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

const directionChars = {
  U: "^",
  D: "v",
  L: "<",
  R: ">",
}

const buildPath = (commands) => {
  const squaresMap = new Map()
  const startSquare = {col: 0, row: 0, char: "*"}
  squaresMap.set(createSquareKey(startSquare), startSquare)
  let minCol = 0
  let maxCol = 0
  let minRow = 0
  let maxRow = 0

  let currentSquare = startSquare
  commands.forEach(({direction, magnitude}) => {
    const offset = directionOffsets[direction]
    const char = directionChars[direction]
    for (let i = 0; i < magnitude; i++) {
      const nextSquare = {col: currentSquare.col + offset.col, row: currentSquare.row + offset.row, char}
      squaresMap.set(createSquareKey(nextSquare), nextSquare)
      currentSquare = nextSquare
      if (currentSquare.col < minCol) { minCol = currentSquare.col }
      if (currentSquare.col > maxCol) { maxCol = currentSquare.col }
      if (currentSquare.row < minRow) { minRow = currentSquare.row }
      if (currentSquare.row > maxRow) { maxRow = currentSquare.row }
    }
  })

  return {squaresMap, minCol, maxCol, minRow, maxRow}
}

const getPathString = (path) => {
  const {squaresMap, minCol, maxCol, minRow, maxRow} = path
  const numRows = Math.abs(minRow) + Math.abs(maxRow) + 1
  const numCols = Math.abs(minCol) + Math.abs(maxCol) + 1
  const lines = Array.from({length: numRows}, () => [])

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const nextKey = createSquareKey({col: + col + minCol, row: row + minRow})
      const nextSquare = squaresMap.get(nextKey)
      const nextChar = nextSquare ? nextSquare.char : "."
      lines[row][col] = nextChar
    }
  }
  lines[Math.abs(minRow)][Math.abs(minCol)] = "*"
  return lines.map(line => line.join("")).join("\n")
}

const buildPolygonPoints = (commands) => {
  const polygonPoints = []
  let numBorderPoints = 0
  let currentSquare = {col: 0, row: 0} // the loop always ends on the current square so we don't need to add it to points or count it here
  commands.forEach(({direction, magnitude}) => {
    numBorderPoints += magnitude
    const offset = directionOffsets[direction]
    const nextSquare = {col: currentSquare.col + offset.col * magnitude, row: currentSquare.row + offset.row * magnitude}
    polygonPoints.push(nextSquare)
    currentSquare = nextSquare
  })
  return { polygonPoints, numBorderPoints }
}

const findInnerArea = (polygonPoints) => {
  const shoelace = polygonPoints.reduce((acc, p2, i) => {
    const p1 = polygonPoints.at(i - 1)
    return acc + p1.col * p2.row - p2.col * p1.row
  }, 0)
  return Math.abs(shoelace * 0.5)
}

const findTotalArea = (commands) => {
  const {polygonPoints, numBorderPoints} = buildPolygonPoints(commands)
  const innerArea = findInnerArea(polygonPoints)

  return innerArea + numBorderPoints / 2 + 1
}

const part1 = (input) => {
  const commands = parseInput(input)

  const path = buildPath(commands)
  console.log()
  console.log(getPathString(path))

  const result = findTotalArea(commands)
  return result
}

const directionDigitMapping = {
  "0": "R",
  "1": "D",
  "2": "L",
  "3": "U"
}

const convertCommand = ({color}) => {
  const magnitudeHex = color.substring(2, 7)
  const directionDigit = color.substring(7, 8)
  const direction = directionDigitMapping[directionDigit]
  const magnitude = Number.parseInt(magnitudeHex, 16)
  return {direction, magnitude}
}

const part2 = (input) => {
  const commands = parseInput(input)
  const convertedCommands = commands.map(convertCommand)
  const result = findTotalArea(convertedCommands)
  return result
}

await runner.testOutput('day18/example', '1', part1)
// await runner.printOutput('day18/test', part1)
// await runner.copyOutput('day18/test', part1)
// await runner.writeOutput('day18/test', '1', part1)
await runner.testOutput('day18/test', '1', part1)

await runner.testOutput('day18/example', '2', part2)
// await runner.printOutput('day18/test', part2)
// await runner.copyOutput('day18/test', part2)
// await runner.writeOutput('day18/test', '2', part2)
await runner.testOutput('day18/test', '2', part2)
