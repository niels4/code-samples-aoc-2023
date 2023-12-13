import * as runner from "../lib/runner.js"
import { sum } from '../lib/iterators.js'

console.log("Solving AoC 2023 day 12")

const workingSpring = "."
const damagedSpring = "#"
const unknownSpring = "?"

const isValidConfiguration = (configuration, groups) => {
  let currentGroupSize = 0
  let currentGroupIndex = 0
  for (const spring of configuration) {
    if (spring === workingSpring) {
      if (currentGroupSize !== 0) {
        if (currentGroupSize !== groups[currentGroupIndex]) { return false }
        currentGroupSize = 0
        currentGroupIndex++
      }
    } else if (spring === damagedSpring) {
      currentGroupSize++
    } else {
      throw new Error("Invalid configuration char: " + spring)
    }
  }
  if (currentGroupSize !== 0 && currentGroupSize !== groups[currentGroupIndex]) {
    return false
  }
  return true
}

const parseInput = (input) => {
  const lines = input.split('\n')
  return lines.map((line) => {
    const [conditions, groupsStr] = line.split(' ')
    const groups = groupsStr.split(',').map(s => Number(s))
    const damagedSprintsCount = sum(groups)
    const workingSpringsCount = conditions.length - damagedSprintsCount
    return {
      conditions,
      conditionsCount: conditions.length,
      groups,
      workingSpringsCount
    }
  })
}

const countCombinationsWithRepitions = (n, r) => {
  if (r === 0) { return {numerator: 1, denominator: 1, result: 1} }
  const numeratorFactorial = n + r - 1
  const denominatorFactorials = [r, numeratorFactorial - r].sort()
  const numeratorLastMultiple = denominatorFactorials[1] + 1
  console.log("numeratorFactorial:", numeratorFactorial, r, denominatorFactorials[1], numeratorLastMultiple)
  let numerator = 1
  for (let i = numeratorLastMultiple; i <= numeratorFactorial; i++) {
    numerator *= i
  }
  let denominator = 1
  for (let i = 1; i <= denominatorFactorials[0]; i++) {
    denominator *= i
  }
  const result = numerator / denominator
  return {numerator, denominator, result}
}

const part1 = (input) => {
  const records = parseInput(input)
  inspect(records)
  let totalCombinationsCount = 0
  records.forEach(({conditionsCount, workingSpringsCount, groups}, i) => {
    const groupsCount = groups.length
    const combinationsCount = countCombinationsWithRepitions(groupsCount + 1, workingSpringsCount - (groupsCount - 1))
    totalCombinationsCount += combinationsCount.result
    console.log(`row ${i}: ${combinationsCount.result}`)
  })

  const valid1 = isValidConfiguration("#.#.###", [1,1,3])
  console.log("isvalid", valid1)
  return totalCombinationsCount
}

// const part2 = (input) => {
//   return 0
// }

await runner.testOutput('day12/example', '1', part1)
// await runner.printOutput('day12/test', part1)
// await runner.copyOutput('day12/test', part1)
// await runner.writeOutput('day12/test', '1', part1)
// await runner.testOutput('day12/test', '1', part1)

// await runner.testOutput('day12/example', '2', part2)
// await runner.printOutput('day12/test', part2)
// await runner.copyOutput('day12/test', part2)
// await runner.writeOutput('day12/test', '2', part2)
// await runner.testOutput('day12/test', '2', part2)
