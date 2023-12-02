import * as runner from "../lib/runner.js"
import {windows, sum} from '../lib/iterators.js'

console.log("Solving AoC 2023 day 1")

const parseInput = (input) => {
  return input.split("\n")
}

const firstDigitMatch = /^[^\d]*(\d)/
const lastDigitMatch = /(\d)[^\d]*$/

const part1 = (input) => {
  const lines = parseInput(input)
  const numbers = lines.map((line) => {
    const match1 = firstDigitMatch.exec(line)
    if (!match1) { return 0 }
    const match2 = lastDigitMatch.exec(line)
    const d1 = match1[1]
    let d2 = match2[1]
    return Number(d1 + d2)
  })
  console.log(numbers)
  return sum(numbers)
}

// const part2 = (input) => {
//   const depths = parseInput(input)
//   const depthWindows = windows(3, depths)
//   let prev = sum(depthWindows.next().value)
//   let increases = 0
//   for (const depthWindow of depthWindows) {
//     let depthTotal = sum(depthWindow)
//     if (depthTotal > prev) { increases++ }
//     prev = depthTotal
//   }
//   return increases
// }

await runner.testOutput('day01/example', '1', part1)
await runner.printOutput('day01/test', part1)
await runner.copyOutput('day01/test', part1)
// await runner.writeOutput('day01/test', '1', part1)
// await runner.testOutput('day01/test', '1', part1)

// await runner.testOutput('day01/example', '2', part2)
// await runner.printOutput('day01/test', part2)
// await runner.copyOutput('day01/test', part2)
// await runner.writeOutput('day01/test', '2', part2)
// await runner.testOutput('day01/test', '2', part2)
