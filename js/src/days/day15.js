import { sum } from "../lib/iterators.js"
import * as runner from "../lib/runner.js"

console.log("Solving AoC 2023 day 15")

const parseInput = (input) => input.split(',')

const hashString = (string) => {
  let hash = 0

  for (let i = 0; i < string.length; i++) {
    const nextCode = string.charCodeAt(i)
    hash += nextCode
    hash *= 17
    hash = hash % 256
  }

  return hash
}

const part1 = (input) => {
  const sequenceStrings = parseInput(input)
  const hashes = sequenceStrings.map(hashString)
  return sum(hashes)
}

// const part2 = (input) => {
//   return 0
// }

await runner.testOutput('day15/example', '1', part1)
// await runner.printOutput('day15/test', part1)
// await runner.copyOutput('day15/test', part1)
// await runner.writeOutput('day15/test', '1', part1)
await runner.testOutput('day15/test', '1', part1)

// await runner.testOutput('day15/example', '2', part2)
// await runner.printOutput('day15/test', part2)
// await runner.copyOutput('day15/test', part2)
// await runner.writeOutput('day15/test', '2', part2)
// await runner.testOutput('day15/test', '2', part2)
