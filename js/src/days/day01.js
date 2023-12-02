import * as runner from "../lib/runner.js"
import {windows, sum} from '../lib/iterators.js'

console.log("Solving AoC 2023 day 1")

const parseInput = (input) => {
  return input.split("\n").map(n => Number.parseInt(n))
}

const part1 = (input) => {
  const depths = parseInput(input).values()
  let increases = 0
  let prev = depths.next().value
  for (const depth of depths) {
    if (depth > prev) { increases++ }
    prev = depth
  }
  return increases
}

const part2 = (input) => {
  const depths = parseInput(input)
  const depthWindows = windows(3, depths)
  let prev = sum(depthWindows.next().value)
  let increases = 0
  for (const depthWindow of depthWindows) {
    let depthTotal = sum(depthWindow)
    if (depthTotal > prev) { increases++ }
    prev = depthTotal
  }
  return increases
}

await runner.testOutput('day01/example', '1', part1)
// await runner.printOutput('day01/test', part1)
// await runner.copyOutput('day01/test', part1)
// await runner.writeOutput('day01/test', '1', part1)
// await runner.testOutput('day01/test', '1', part1)

await runner.testOutput('day01/example', '2', part2)
// await runner.printOutput('day01/test', part2)
// await runner.copyOutput('day01/test', part2)
// await runner.writeOutput('day01/test', '2', part2)
// await runner.testOutput('day01/test', '2', part2)
