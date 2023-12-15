import { sum } from "../lib/iterators.js"
import * as runner from "../lib/runner.js"

console.log("Solving AoC 2023 day 14")

const roundedRock = "O"
const squareRock = "#"
const empty = "."

const parseInput = (input) => input.split('\n').map(line => [...line])

const printPlatform = (platformRows) => {
  console.log(platformRows.map(line => line.join('')).join("\n"))
}

const tiltPlatformPart1 = (platformRows) => {
  const tiltedPlatform = platformRows.map(() => [])

  const numCols = platformRows[0].length
  for (let colIndex = 0; colIndex < numCols; colIndex++) {
    let currentRollIndex = 0
    for (let rowIndex = 0; rowIndex < platformRows.length; rowIndex++) {
      switch (platformRows[rowIndex][colIndex]) {
      case roundedRock:
        tiltedPlatform[rowIndex][colIndex] = empty
        tiltedPlatform[currentRollIndex][colIndex] = roundedRock
        currentRollIndex++
        break
      case squareRock:
        tiltedPlatform[rowIndex][colIndex] = squareRock
        currentRollIndex = rowIndex + 1
        break
      default:
        tiltedPlatform[rowIndex][colIndex] = empty
      }
    }
  }

  return tiltedPlatform
}

const getPlatformScore = (platformRows) => {
  const rowScores = platformRows.map((row, rowIndex) => {
    const multiplier = platformRows.length - rowIndex
    return sum(row.map((char) => char === roundedRock ? 1 : 0).map(s => s * multiplier))
  })
  return sum(rowScores)
}

const part1 = (input) => {
  const platformRows = parseInput(input)
  const tiltedPlatform = tiltPlatformPart1(platformRows)

  return getPlatformScore(tiltedPlatform)
}

const tiltPlatform = (platformRows, by, direction) => {
  const tiltedPlatform = platformRows.map(() => [])

  const numCols = platformRows[0].length
  const numRows = platformRows.length

  let outerIterator = {start: 0, length: numCols, direction}
  let innerIterator = {start: 0, length: numRows, direction}
  if (by === "row") {
    [innerIterator, outerIterator] = [outerIterator, innerIterator]
  }

  let colIndex, rowIndex

  for (let outerIndex = 0; outerIndex < outerIterator.length; outerIndex++) {
    if (by === "row") {
      rowIndex = outerIndex
    } else {
      colIndex = outerIndex
    }
    let currentRollIndex = innerIterator.start
    for (let innerIndex = 0; innerIndex < innerIterator.length; innerIndex++) {
      if (by === "row") {
        colIndex = innerIndex
      } else {
        rowIndex = innerIndex
      }
      switch (platformRows[rowIndex][colIndex]) {
      case roundedRock:
        tiltedPlatform[rowIndex][colIndex] = empty
        if (by === "row") {
          tiltedPlatform[rowIndex][currentRollIndex] = roundedRock
        } else {
          tiltedPlatform[currentRollIndex][colIndex] = roundedRock
        }
        currentRollIndex++
        break
      case squareRock:
        tiltedPlatform[rowIndex][colIndex] = squareRock
        currentRollIndex = innerIndex + 1
        break
      default:
        tiltedPlatform[rowIndex][colIndex] = empty
      }
    }
  }

  return tiltedPlatform
}

const part2 = (input) => {
  const platformRows = parseInput(input)
  printPlatform(platformRows)
  let tiltedPlatform = tiltPlatform(platformRows, "row", -1)
  console.log()
  printPlatform(tiltedPlatform)

  return getPlatformScore(tiltedPlatform)
}

await runner.testOutput('day14/example', '1', part1)
// await runner.printOutput('day14/test', part1)
// await runner.copyOutput('day14/test', part1)
// await runner.writeOutput('day14/test', '1', part1)
await runner.testOutput('day14/test', '1', part1)

await runner.testOutput('day14/example', '2', part2)
// await runner.printOutput('day14/test', part2)
// await runner.copyOutput('day14/test', part2)
// await runner.writeOutput('day14/test', '2', part2)
// await runner.testOutput('day14/test', '2', part2)
