import * as runner from "../lib/runner.js"
import {sum} from '../lib/iterators.js'

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
  return sum(numbers)
}

const firstDigitMatch2 = /(\d|one|two|three|four|five|six|seven|eight|nine)/
const lastDigitMatch2 = /(\d|one|two|three|four|five|six|seven|eight|nine).*(\d|one|two|three|four|five|six|seven|eight|nine)/

const wordMap = {
  "one": 1,
  "two": 2,
  "three": 3,
  "four": 4,
  "five": 5,
  "six": 6,
  "seven": 7,
  "eight": 8,
  "nine": 9,
}

const part2 = (input) => {
  const lines = parseInput(input)
  const numbers = lines.map((line) => {
    const match1 = firstDigitMatch2.exec(line)
    if (!match1) { return 0 }
    let match2 = lastDigitMatch2.exec(line)
    if (!match2) { match2 = {} }
    let d1 = match1[1]
    d1 = wordMap[d1] || d1
    let d2 = match2[2]
    d2 = wordMap[d2] || d2
    if (d2 == null) { d2 = d1 }
    return Number(String(d1) + String(d2))
  })
  return sum(numbers)
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
await runner.testOutput('day01/test', '2', part2)
