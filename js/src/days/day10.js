import * as runner from "../lib/runner.js"
import { setsAreEqual } from "../lib/set.js"

console.log("Solving AoC 2023 day 10")

const startChar = "S"

const pipeTransforms = {
  "|": new Set(["n", "s"]),
  "-": new Set(["w", "e"]),
  "L": new Set(["n", "e"]),
  "J": new Set(["n", "w"]),
  "7": new Set(["w", "s"]),
  "F": new Set(["e", "s"]),
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

  console.log("do start", currChar, currCol, currRow, fromDir)
  while (currChar != startChar) {
    const toDir = [...pipeTransforms[currChar]].filter(dir => dir !== fromDir)[0]
    fromDir = opposites[toDir]
    const [colDiff, rowDiff] = directions[toDir]
    currCol += colDiff
    currRow += rowDiff
    currChar = lines[currRow][currCol]
    loopSize++
  }

  return Math.floor(loopSize / 2)
}

const printMap = (map) => {
  console.log()
  map.forEach((row) => {
    console.log(row.join(""))
  })
  console.log()
}

const emptyPointChar = "."
const internalPointChar = "I"

const getStartCharReplacement = (filteredMap, startCol, startRow) => {
  let currCol = startCol
  let currRow = startRow
  const exits = new Set()
  for (const [dirKey, [colDiff, rowDiff]] of Object.entries(directions)) {
    const nextCol = currCol + colDiff
    const nextRow = currRow + rowDiff
    const nextChar = filteredMap[nextRow][nextCol]
    const nextCharExits = pipeTransforms[nextChar]
    if (nextCharExits && nextCharExits.has(opposites[dirKey])) {
      exits.add(dirKey)
    }
  }
  const [replacementSymbol] = Object.entries(pipeTransforms).find(([, directions]) => {
    return setsAreEqual(exits, directions)
  })

  return replacementSymbol
}

const fromLeftInsidePoints = {
  "|": [1, 0],
  "F": [1, 1],
  "L": [1, -1]
}

// we iterate right to left and top to bottom. The only possible type of pipe we can run into from the top along the 
// far left column is the F shape
const fromTopInsidePoints = {
  "F": [1, 1]
}

const findFirstInsidePoint = (symbol, colIndex, rowIndex) => {
  const insidePointMapping = colIndex === 0 ? fromTopInsidePoints : fromLeftInsidePoints
  const [colDiff, rowDiff] = insidePointMapping[symbol]
  return {colIndex: colIndex + colDiff, rowIndex: rowIndex + rowDiff}
}

// start at the outside and find a boundary of the loop so we can orient ourselves which side is the outside and which is the inside
const findLoopFromOutside = (filteredMap) => {
  let colIndex
  let rowIndex = 0
  for (const row of filteredMap) {
    colIndex = 0
    for (const symbol of row) {
      if (symbol !== emptyPointChar) {
        console.log("found first point", symbol)
        const loopPoint = {colIndex, rowIndex}
        const insidePoint = findFirstInsidePoint(symbol, colIndex, rowIndex)
        return {loopPoint, insidePoint}
      }
      colIndex++
    }
    rowIndex++
  }
  throw new Error("Could not find any pipe elements")
}

const getSurroundingPoints = (colIndex, rowIndex) => {
  return Object.values(directions).map(([colDiff, rowDiff]) => {
    return {colIndex: colIndex + colDiff, rowIndex: rowIndex + rowDiff}
  })
}

const fillInternalArea = (filteredMap, internalPoint) => {
  let {colIndex, rowIndex} = internalPoint
  let currentSymbol = filteredMap[rowIndex][colIndex]
  if (currentSymbol !== emptyPointChar) { return 0 }

  let pointsFilled = 1
  filteredMap[rowIndex][colIndex] = internalPointChar
  const pointsToCheck = getSurroundingPoints(colIndex, rowIndex)

  while (pointsToCheck.length > 0) {
    const nextPoint = pointsToCheck.pop()
    const nextSymbol = filteredMap[nextPoint.rowIndex][nextPoint.colIndex]
    if (nextSymbol !== emptyPointChar) { continue }

    pointsFilled++
    filteredMap[nextPoint.rowIndex][nextPoint.colIndex] = internalPointChar
    pointsToCheck.push.apply(pointsToCheck, getSurroundingPoints(nextPoint.colIndex, nextPoint.rowIndex))
  }

  return pointsFilled
}

const part2 = (input) => {
  const {lines, startCol, startRow} = parseInput(input)
  let filteredMap = lines.map(line => Array.from(line, () => emptyPointChar))

  filteredMap[startRow][startCol] = startChar
  printMap(filteredMap)

  let {currChar, currCol, currRow, fromDir} = doFirstStep(lines, startCol, startRow)

  while (currChar != startChar) {
    filteredMap[currRow][currCol] = currChar
    const toDir = [...pipeTransforms[currChar]].filter(dir => dir !== fromDir)[0]
    fromDir = opposites[toDir]
    const [colDiff, rowDiff] = directions[toDir]
    currCol += colDiff
    currRow += rowDiff
    currChar = lines[currRow][currCol]
  }

  printMap(filteredMap)
  filteredMap[startRow][startCol] = getStartCharReplacement(filteredMap, startRow, startCol)
  printMap(filteredMap)

  let internalPointsCount = 0
  const {loopPoint, insidePoint} = findLoopFromOutside(filteredMap)
  console.log("got start points", loopPoint, insidePoint)
  internalPointsCount += fillInternalArea(filteredMap, insidePoint)
  printMap(filteredMap)

  return internalPointsCount
}

await runner.testOutput('day10/example', '1', part1)
await runner.testOutput('day10/example_b', '1', part1)
// await runner.printOutput('day10/test', part1)
// await runner.copyOutput('day10/test', part1)
// await runner.writeOutput('day10/test', '1', part1)
await runner.testOutput('day10/test', '1', part1)

// await runner.testOutput('day10/example_c', '2', part2)
// await runner.testOutput('day10/example_d', '2', part2)
await runner.testOutput('day10/example_e', '2', part2)
// await runner.printOutput('day10/test', part2)
// await runner.copyOutput('day10/test', part2)
// await runner.writeOutput('day10/test', '2', part2)
// await runner.testOutput('day10/test', '2', part2)
