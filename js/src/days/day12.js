import * as runner from "../lib/runner.js"
import { sum } from '../lib/iterators.js'

console.log("Solving AoC 2023 day 12")

const workingSpring = "."
const damagedSpring = "#"
const unknownSpring = "?"

const parseInput = (input) => {
  const lines = input.split('\n')
  return lines.map((line) => {
    const [conditions, groupsStr] = line.split(' ')
    const groups = groupsStr.split(',').map(s => Number(s))
    return {
      conditions,
      groups
    }
  })
}

const isValidConfiguration = (configuration, groups) => {
  let currentGroupSize = 0
  let currentGroupIndex = 0

  const handleUndamagedSpring = () => {
    // check and see if it is a seperator adjacent to a damaged spring group
    if (currentGroupSize !== 0) {
      // return false if the group size doesn't match expected group size
      if (currentGroupSize !== groups[currentGroupIndex]) { return false }
      currentGroupSize = 0
      currentGroupIndex++
    }
    return true
  }

  for (const spring of configuration) {
    if (spring === workingSpring) {
      if (!handleUndamagedSpring()) { return false }
    } else if (spring === damagedSpring) {
      currentGroupSize++
    } else {
      throw new Error("Invalid configuration char: " + spring)
    }
  }

  if (!handleUndamagedSpring()) { return false } // treat the end of line as an undamaged spring

  // return false if we don't find the expected number of groups
  if (currentGroupIndex !== groups.length) {
    return false
  }

  // if we have the right number of groups and they are all of the correct size, we can return true
  return true
}

// brute force check by trying all possible combinations of replacements for the uknown conditions
const countValidConfigurations = (configuration, groups, currentIndex = 0) => {
  if (currentIndex === configuration.length) {
    return isValidConfiguration(configuration, groups) ? 1 : 0
  }
  const currentSpring = configuration[currentIndex]
  const nextIndex = currentIndex + 1
  if (currentSpring !== unknownSpring) {
    return countValidConfigurations(configuration, groups, nextIndex)
  }
  const startOfConfig = configuration.substring(0, currentIndex)
  const endOfConfig = configuration.substring(currentIndex + 1)
  const nextConfig1 = startOfConfig + workingSpring + endOfConfig
  const nextConfig2 = startOfConfig + damagedSpring + endOfConfig
  return countValidConfigurations(nextConfig1, groups, nextIndex) + countValidConfigurations(nextConfig2, groups, nextIndex)
}

const part1 = (input) => {
  const records = parseInput(input)

  const allCounts = records.map(({conditions, groups}) => {
    const count = countValidConfigurations(conditions, groups)
    return count
  })

  return sum(allCounts)
}

// const part2 = (input) => {
//   return 0
// }

await runner.testOutput('day12/example', '1', part1)
// await runner.printOutput('day12/test', part1)
// await runner.copyOutput('day12/test', part1)
// await runner.writeOutput('day12/test', '1', part1)
await runner.testOutput('day12/test', '1', part1)

// await runner.testOutput('day12/example', '2', part2)
// await runner.printOutput('day12/test', part2)
// await runner.copyOutput('day12/test', part2)
// await runner.writeOutput('day12/test', '2', part2)
// await runner.testOutput('day12/test', '2', part2)
