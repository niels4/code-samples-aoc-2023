import { sum, windows } from "../lib/iterators.js"
import { readNumberList } from "../lib/parsing.js"
import * as runner from "../lib/runner.js"

console.log("Solving AoC 2023 day 09")

// enum for possible sequence directions
const SequenceDirections = {
  "forward": "forward",
  "backward": "backward",
}

const parseInput = (input) => input.split('\n').map(readNumberList)

const getRowDiffs = (row) => {
  const diffs = []
  for (const [l, r] of windows(2, row)) {
    diffs.push(r - l)
  }
  return diffs
}

const isAllZeros = (array) => array.every(v => v === 0)

const getRowDiffsUntilAllZeros = (row) => {
  const allDiffs = []
  let currentRow = row
  allDiffs.push(currentRow)
  while (!isAllZeros(currentRow)) {
    currentRow = getRowDiffs(currentRow)
    allDiffs.push(currentRow)
  }
  return allDiffs
}

const getNextSequenceValueFromAllDiffs = (allDiffs, direction = SequenceDirections.forward) => {
  if (allDiffs.length < 2) { return 0 }
  let lastDiffValue = 0
  for (let diffIndex = allDiffs.length - 2; diffIndex >= 0; diffIndex--) {
    if (direction === SequenceDirections.forward) {
      lastDiffValue = allDiffs[diffIndex].at(-1) + lastDiffValue
    } else {
      lastDiffValue = allDiffs[diffIndex].at(0) - lastDiffValue
    }
  }
  return lastDiffValue
}

const part1 = (input) => {
  const histories = parseInput(input)

  const nextSequenceValues = histories.map((historyRow) => {
    const allDiffs = getRowDiffsUntilAllZeros(historyRow)
    return getNextSequenceValueFromAllDiffs(allDiffs)
  })

  return sum(nextSequenceValues)
}

const part2 = (input) => {
  const histories = parseInput(input)

  const prevSequenceValues = histories.map((historyRow) => {
    const allDiffs = getRowDiffsUntilAllZeros(historyRow)
    return getNextSequenceValueFromAllDiffs(allDiffs, SequenceDirections.backward)
  })

  return sum(prevSequenceValues)
}

await runner.testOutput('day09/example', '1', part1)
// await runner.printOutput('day09/test', part1)
// await runner.copyOutput('day09/test', part1)
// await runner.writeOutput('day09/test', '1', part1)
await runner.testOutput('day09/test', '1', part1)

await runner.testOutput('day09/example', '2', part2)
// await runner.printOutput('day09/test', part2)
// await runner.copyOutput('day09/test', part2)
// await runner.writeOutput('day09/test', '2', part2)
await runner.testOutput('day09/test', '2', part2)
