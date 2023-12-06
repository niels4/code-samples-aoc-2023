import { mult } from "../lib/iterators.js"
import { readNumberList } from "../lib/parsing.js"
import * as runner from "../lib/runner.js"

console.log("Solving AoC 2023 day 06")

const parseInput = (input) => {
  const lines = input.split('\n')
  const times = readNumberList(lines[0])
  const distances = readNumberList(lines[1])
  return {times, distances}
}

const part1 = (input) => {
  const {times, distances} = parseInput(input)
  const numWaysToWinList = times.map((time, i) => {
    const targetDistance = distances[i]
    const halfTime = time / 2
    const sqrtComponent = Math.sqrt(halfTime**2 - targetDistance)
    const minPush = halfTime - sqrtComponent
    let floorMin = Math.floor(minPush)
    const maxPush = halfTime + sqrtComponent
    let ceilMax = Math.ceil(maxPush)
    let numWays = time - 1 // the last time push value will never win
    numWays -= floorMin // subtract the low push values that wont win
    numWays -= (time - ceilMax) // subtract the high push values that wont win
    return numWays
  })
  return mult(numWaysToWinList)
}

// const part2 = (input) => {
//   return 0
// }

await runner.testOutput('day06/example', '1', part1)
// await runner.printOutput('day06/test', part1)
// await runner.copyOutput('day06/test', part1)
// await runner.writeOutput('day06/test', '1', part1)
await runner.testOutput('day06/test', '1', part1)

// await runner.testOutput('day06/example', '2', part2)
// await runner.printOutput('day06/test', part2)
// await runner.copyOutput('day06/test', part2)
// await runner.writeOutput('day06/test', '2', part2)
// await runner.testOutput('day06/test', '2', part2)
