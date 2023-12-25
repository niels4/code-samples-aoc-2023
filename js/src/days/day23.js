import * as runner from "../lib/runner.js"

console.log("Solving AoC 2023 day 23")

const path = "."
const forest = "#"
const slopes = {
  "^": {col: 0, row: -1},
  "v": {col: 0, row: 1},
  "<": {col: -1, row: 0},
  ">": {col: 1, row: 0},
}

const createLocationKey = ({col, row}) => `${col}:${row}`

const parseInput = (input) => {
  const rows = input.split('\n')
  const startColumn = rows[0].indexOf(path)
  const startLocation = {col: startColumn, row: 0, steps: 0, seen: new Set()}
  startLocation.seen.add(createLocationKey(startLocation))
  const endColumn = rows.at(-1).indexOf(path)
  const endLocation = {col: endColumn, row: rows.length - 1}
  return {rows, startLocation, endLocation}
}

const isValidLocation = (rows, location) => {
  if (location.row < 0 || location.row >= rows.length || location.col < 0 || location.col >= rows[0].length) { return false }
  const symbol = rows[location.row][location.col]
  if (symbol === forest) { return false }
  return true
}

const getNextOffsetsPart1 = (currentSymbol) => {
  if (slopes[currentSymbol]) { return [slopes[currentSymbol]] }
  return Object.values(slopes)
}

const getNextLocations = (getNextOffsets, rows, location) => {
  const nextLocations = []
  const currentSymbol = rows[location.row][location.col]

  const nextOffsets = getNextOffsets(currentSymbol)

  for (const offset of nextOffsets) {
    const nextLocation = {col: location.col + offset.col, row: location.row + offset.row}
    const nextLocationKey = createLocationKey(nextLocation)
    if (!location.seen.has(nextLocationKey) && isValidLocation(rows, nextLocation)) {
      nextLocation.steps = location.steps + 1
      nextLocation.seen = new Set(location.seen) // clone the seen state for this new location
      nextLocation.seen.add(nextLocationKey)
      nextLocations.push(nextLocation)
    }
  }

  return nextLocations
}

const findMaxPath = (getNextOffsets, input) => {
  const {rows, endLocation, startLocation} = parseInput(input)

  const pathStepCounts = []
  const nextLocations = [startLocation]

  while (nextLocations.length > 0) {
    const currentLocation = nextLocations.pop()
    if (currentLocation.row === endLocation.row) {
      pathStepCounts.push(currentLocation.steps)
      continue
    }

    nextLocations.push.apply(nextLocations, getNextLocations(getNextOffsets, rows, currentLocation))
  }

  return Math.max.apply(null, pathStepCounts)
}

const part1 = (input) => {
  return findMaxPath(getNextOffsetsPart1, input)
}

const getNextOffsetsPart2 = () => {
  return Object.values(slopes)
}

const part2_simple = (input) => {
  return findMaxPath(getNextOffsetsPart2, input)
}

const part2 = (input) => {
  const {rows, endLocation, startLocation} = parseInput(input)

  const decisionPoints = [startLocation, endLocation]

  rows.forEach((rowChars, row) => {
    [...rowChars].forEach((symbol, col) => {
      if (symbol === forest) { return }
      let pathCount = 0
      getNextOffsetsPart2().forEach((offset) => {
        const newLocation = {col: col + offset.col, row: row + offset.row}
        if (isValidLocation(rows, newLocation)) {
          pathCount++
        }
      })
      if (pathCount > 2) {
        decisionPoints.push({col, row: rowChars})
      }
    })
  })

  console.log("decision decisionPoints", decisionPoints, decisionPoints.length)

  return 0
}

await runner.testOutput('day23/example', '1', part1)
// await runner.printOutput('day23/test', part1)
// await runner.copyOutput('day23/test', part1)
// await runner.writeOutput('day23/test', '1', part1)
// await runner.testOutput('day23/test', '1', part1)

await runner.testOutput('day23/example', '2', part2_simple)
// await runner.testOutput('day23/example', '2', part2)
// await runner.printOutput('day23/test', part2)
// await runner.copyOutput('day23/test', part2)
// await runner.writeOutput('day23/test', '2', part2)
// await runner.testOutput('day23/test', '2', part2)
