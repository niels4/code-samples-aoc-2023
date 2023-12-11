import * as runner from "../lib/runner.js"
import { sum } from '../lib/iterators.js'

console.log("Solving AoC 2021 day 02")

const maxRed = 12
const maxGreen = 13
const maxBlue = 14

const redMatch = /(\d+) red/
const greenMatch = /(\d+) green/
const blueMatch = /(\d+) blue/

const parseInput = (input) => {
  const lines = input.split('\n')
  const games = lines.map((line) => {
    const grabs = line.split(';').map((section) => {
      const colorsGrabbed = {}

      const hasRed = redMatch.exec(section)
      if (hasRed) {
        colorsGrabbed.red = Number(hasRed[1])
      }

      const hasGreen = greenMatch.exec(section)
      if (hasGreen) {
        colorsGrabbed.green = Number(hasGreen[1])
      }

      const hasBlue = blueMatch.exec(section)
      if (hasBlue) {
        colorsGrabbed.blue = Number(hasBlue[1])
      }

      return colorsGrabbed
    })
    return grabs
  })
  return games
}

const part1 = (input) => {
  const games = parseInput(input)
  const scores = games.map((game, gameIndex) => {
    for (const grab of game) {
      const {red, blue, green} = grab
      if (red > maxRed || green > maxGreen || blue > maxBlue) { return 0 }
    }
    return gameIndex + 1
  })
  return sum(scores)
}

const part2 = (input) => {
  const games = parseInput(input)
  const powers = games.map((game) => {
    let minRed = 0
    let minGreen = 0
    let minBlue = 0
    for (const grab of game) {
      const {red, blue, green} = grab
      if (red > minRed) { minRed = red }
      if (green > minGreen) { minGreen = green }
      if (blue > minBlue) { minBlue = blue }
    }
    return minRed * minGreen * minBlue
  })
  return sum(powers)
}

await runner.testOutput('day02/example', '1', part1)
// await lib.printOutput('day02/test', part1)
// await lib.copyOutput('day02/test', part1)
// await lib.writeOutput('day02/test', '1', part1)
await runner.testOutput('day02/test', '1', part1)

await runner.testOutput('day02/example', '2', part2)
// await lib.printOutput('day02/test', part2)
// await lib.copyOutput('day02/test', part2)
// await lib.writeOutput('day02/test', '2', part2)
await runner.testOutput('day02/test', '2', part2)
