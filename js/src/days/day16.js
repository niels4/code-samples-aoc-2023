import * as runner from "../lib/runner.js"

console.log("Solving AoC 2023 day 16")

const printVisited = (rows, visitedSquares) => {
  console.log()
  const visitedRows = rows.map((row, rowIndex) => {
    return [...row].map((char, colIndex) => {
      const square = {row: rowIndex, col: colIndex}
      return visitedSquares.has(createSquareKey(square)) ? "#" : char
    }).join('')
  })
  console.log(visitedRows.join("\n"))
  console.log()
}

const parseInput = (input) => input.split('\n')

const empty = "."
const rightMirror = "/"
const leftMirror = "\\"
const verticalSplitter = "|"
const horizontalSplitter = "-"

const verticalDirections = new Set(["up", "down"])

const isValidSquare = (rows, pathHistory, square, directionKey) => {
  const numRows = rows.length
  const numCols = rows[0].length
  if (square.row < 0 || square.row >= numRows ||
    square.col < 0 || square.col >= numCols) { return false }
  const historyKey = createHistoryKey(square, directionKey)
  if (pathHistory.has(historyKey)) { return false }
  return true
}

const rightMirrorMapping = {
  "up": ["right"],
  "down": ["left"],
  "right": ["up"],
  "left": ["down"],
}

const leftMirrorMapping = {
  "up": ["left"],
  "down": ["right"],
  "right": ["down"],
  "left": ["up"],
}

const beamMapping = new Map([
  [empty, (directionKey) => [directionKey]],
  [verticalSplitter, (directionKey) => verticalDirections.has(directionKey) ? [directionKey] : ["up", "down"]],
  [horizontalSplitter, (directionKey) => verticalDirections.has(directionKey) ? ["left", "right"] : [directionKey]],
  [rightMirror, (directionKey) => rightMirrorMapping[directionKey]],
  [leftMirror, (directionKey) => leftMirrorMapping[directionKey]],
])

const getBeamMapping = (directionKey, symbol) => {
  const mappingFunc = beamMapping.get(symbol)
  return mappingFunc(directionKey)
}

const createSquareKey = ({row, col}) => `${row}:${col}`
const createHistoryKey = ({row, col}, directionKey) => `${row}:${col}:${directionKey}`

const markSquareAsVisited = (visitedSquares, pathHistory, square, directionKey) => {
  visitedSquares.add(createSquareKey(square))
  pathHistory.add(createHistoryKey(square, directionKey))
}

const directionOffsets = {
  up: {row: -1, col: 0},
  down: {row: 1, col: 0},
  left: {row: 0, col: -1},
  right: {row: 0, col: 1}
}

const followDirection = (square, directionKey) => {
  const offset = directionOffsets[directionKey]
  const nextSquare = {
    row: square.row + offset.row,
    col: square.col + offset.col
  }
  return {square: nextSquare, directionKey}
}

const followPath0 = (rows, visitedSquares, pathHistory, currentSquare, directionKey) => {
  if (!isValidSquare(rows, pathHistory, currentSquare, directionKey)) { return }
  markSquareAsVisited(visitedSquares, pathHistory, currentSquare, directionKey)
  const currentSymbol = rows[currentSquare.row][currentSquare.col]
  const nextDirectionKeys = getBeamMapping(directionKey, currentSymbol)
  const nextLocations = nextDirectionKeys.map((nextDirectionKey) => followDirection(currentSquare, nextDirectionKey))
  for (const {square: nextSquare, directionKey: nextDirectionKey} of nextLocations) {
    followPath0(rows, visitedSquares, pathHistory, nextSquare, nextDirectionKey)
  }
}

const followPath = (rows, startLocation) => {
  const visitedSquares = new Set()
  const pathHistory = new Set()
  followPath0(rows, visitedSquares, pathHistory, startLocation.square, startLocation.directionKey)
  return visitedSquares.size
}

const part1 = (input) => {
  const rows = parseInput(input)
  const startSquare = {row: 0, col: 0}
  const startDirectionKey = "right"
  const visitedCount = followPath(rows, {square: startSquare, directionKey: startDirectionKey})
  return visitedCount
}

// const getStartLocations = (rows) => {
//   const startLocations = []
//   const numRows = rows.length
//   const numCols = rows[0].length
//
//   for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
//     const fromLeft = {square: [-1, rowIndex], directionKey: "right"}
//     startLocations.push(fromLeft)
//     const fromRight = {square: [numCols, rowIndex], directionKey: "left"}
//     startLocations.push(fromRight)
//   }
//
//   for (let colIndex = 0; colIndex < numCols; colIndex++) {
//     const fromTop = {square: [colIndex, -1], directionKey: "down"}
//     startLocations.push(fromTop)
//     const fromBottom = {square: [colIndex, numRows], directionKey: "up"}
//     startLocations.push(fromBottom)
//   }
//
//   return startLocations
// }
//
// const part2 = (input) => {
//   const rows = parseInput(input)
//   const startLocations = getStartLocations(rows)
//   const scores = startLocations.map(startLocation => followPath(rows, startLocation))
//   const maxScore = Math.max.apply(null, scores)
//   return maxScore
// }

// await runner.testOutput('day16/example', '1', part1)
// await runner.printOutput('day16/test', part1)
// await runner.copyOutput('day16/test', part1)
// await runner.writeOutput('day16/test', '1', part1)
await runner.testOutput('day16/test', '1', part1)

// await runner.testOutput('day16/example', '2', part2)
// await runner.printOutput('day16/test', part2)
// await runner.copyOutput('day16/test', part2)
// await runner.writeOutput('day16/test', '2', part2)
// await runner.testOutput('day16/test', '2', part2)
