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

// memoized version of countValidConfigurations
const countValidConfigurationsPart2Memo = (memo, configuration, groups) => {
  if (configuration.length === 0) {
    // if we are at the end of our string and we have no more groups left to process, return 1 because we found a valid configuration
    // else if we still have groups left to process, return 0 as this did not lead to a valid configuration
    return groups.length === 0 ? 1 : 0
  }

  if (groups.length === 0) {
    // if we are found all of the damaged groups but still have damaged springs left in the configuration, then we don't have a valid config and should return 0
    // else return 1 if we processed all groups and have no damaged springs as this is a valid configuariation and any remaining unknown springs must be undamaged
    return configuration.includes(damagedSpring) ? 0 : 1
  }

  const memoKey = `${configuration}:${groups.length}`
  if (memo.has(memoKey)) {
    return memo.get(memoKey)
  }

  let validCount = 0

  // move on to the next character
  const handleWorkingSpring = () => validCount += countValidConfigurationsPart2Memo(memo, configuration.substring(1), groups)

  // check if we have a valid position for the current damaged group
  const handleDamagedSpring = () => {
    const currentDamagedGroup = groups[0]
    if (currentDamagedGroup <= configuration.length // if we have enough room to contain the current damaged group
      && !configuration.substring(0, currentDamagedGroup).includes(workingSpring) // and there are no working springs within the length of the damaged group
      && (currentDamagedGroup === configuration.length || configuration[currentDamagedGroup] !== damagedSpring)) { // and the damaged group is either at the end of the configuration or is seperated by a non damaged spring
      // Then we have a valid position for our current group. Add to the valid count all the cases where we assume the block to go here
      const nextConfigurationSubstring = configuration.substring(currentDamagedGroup + 1) // start one character after our group size because we know for sure the next character will have to be undamaged. Or we are at the end, and substring returns an empty string if you give it a value past the last index
      const [, ...nextGroupsSublist] = groups // remove the group we just placed and move on to the next group
      validCount += countValidConfigurationsPart2Memo(memo, nextConfigurationSubstring, nextGroupsSublist)
    }
  }

  const nextSpring = configuration[0]
  switch (nextSpring) {
  case workingSpring:
    handleWorkingSpring()
    break
  case damagedSpring:
    handleDamagedSpring()
    break
  case unknownSpring: // if the spring is unknown, we add up all the cases where its valid to place a damaged or a working spring
    handleWorkingSpring()
    handleDamagedSpring()
    break
  default:
    throw new Error("Invalid character in configuration")
  }

  memo.set(memoKey, validCount)

  return validCount
}

// create function to kick off the recursive function by initializing an empty map for the memo cache
const countValidConfigurationsPart2 = (configuration, groups) => {
  const memo = new Map()
  return countValidConfigurationsPart2Memo(memo, configuration, groups)
}

const unfoldMultiplier = 5

const unfoldRecord = ({conditions, groups}) => ({
  conditions: Array.from({length: unfoldMultiplier}, () => conditions).join(unknownSpring),
  groups: Array.from({length: unfoldMultiplier}, () => groups).flatMap(g => g)
})

const part2 = (input) => {
  const records = parseInput(input)

  const allCounts = records.map(unfoldRecord).map(({conditions, groups}) => {
    const count = countValidConfigurationsPart2(conditions, groups)
    return count
  })

  return sum(allCounts)
}

await runner.testOutput('day12/example', '1', part1)
// await runner.printOutput('day12/test', part1)
// await runner.copyOutput('day12/test', part1)
// await runner.writeOutput('day12/test', '1', part1)
await runner.testOutput('day12/test', '1', part1)

await runner.testOutput('day12/example', '2', part2)
// await runner.printOutput('day12/test', part2)
// await runner.copyOutput('day12/test', part2)
// await runner.writeOutput('day12/test', '2', part2)
await runner.testOutput('day12/test', '2', part2)
