import { sum, windows } from "../lib/iterators.js"
import { readNumberList } from "../lib/parsing.js"
import * as runner from "../lib/runner.js"

console.log("Solving AoC 2023 day 09")

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

const SequenceDirections = {
  "forward": (rowDiffs, lastDiffValue) => rowDiffs.at(-1) + lastDiffValue,
  "backward": (rowDiffs, lastDiffValue) => rowDiffs.at(0) - lastDiffValue,
}

const getNextSequenceValueFromAllDiffs = (advanceSequence = SequenceDirections.forward) => (allDiffs) => {
  if (allDiffs.length < 2) { return 0 }
  let lastDiffValue = 0

  for (let diffIndex = allDiffs.length - 2; diffIndex >= 0; diffIndex--) {
    lastDiffValue = advanceSequence(allDiffs[diffIndex], lastDiffValue)
  }

  return lastDiffValue
}

const sumNextSequenceValues = (findNextValueFunc) => (input) => {
  const histories = parseInput(input)

  const nextSequenceValues = histories.map((historyRow) => {
    const allDiffs = getRowDiffsUntilAllZeros(historyRow)
    return findNextValueFunc(allDiffs)
  })

  return sum(nextSequenceValues)
}

const part1 = sumNextSequenceValues(getNextSequenceValueFromAllDiffs(SequenceDirections.forward))

const part2 = sumNextSequenceValues(getNextSequenceValueFromAllDiffs(SequenceDirections.backward))

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
