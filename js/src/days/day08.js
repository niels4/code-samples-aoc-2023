import * as runner from "../lib/runner.js"

console.log("Solving AoC 2023 day 08")

const parseInput = (input) => {
  return input.split('\n')
}

const part1 = (input) => {
  const lines = parseInput(input)
  return 0
}

// const part2 = (input) => {
//   return 0
// }

await runner.testOutput('day08/example', '1', part1)
await runner.testOutput('day08/example_b', '1', part1)
// await runner.printOutput('day08/test', part1)
// await runner.copyOutput('day08/test', part1)
// await runner.writeOutput('day08/test', '1', part1)
// await runner.testOutput('day08/test', '1', part1)

// await runner.testOutput('day08/example', '2', part2)
// await runner.printOutput('day08/test', part2)
// await runner.copyOutput('day08/test', part2)
// await runner.writeOutput('day08/test', '2', part2)
// await runner.testOutput('day08/test', '2', part2)
