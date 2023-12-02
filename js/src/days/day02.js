import * as lib from "../lib/runner.js"
import {sum} from '../lib/iterators.js'

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

      const hasred = redMatch.exec(section)
      if (hasred) {
        colorsGrabbed.red = Number(hasred[1])
      }

      const hasgreen = greenMatch.exec(section)
      if (hasgreen) {
        colorsGrabbed.green = Number(hasgreen[1])
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

// const part2 = (input) => {
//   return 0
// }

await lib.testOutput('day02/example', '1', part1)
// await lib.printOutput('day02/test', part1)
// await lib.copyOutput('day02/test', part1)
// await lib.writeOutput('day02/test', '1', part1)
await lib.testOutput('day02/test', '1', part1)

// await lib.testOutput('day02/example', '2', part2)
// await lib.printOutput('day02/test', part2)
// await lib.copyOutput('day02/test', part2)
// await lib.writeOutput('day02/test', '2', part2)
// await lib.testOutput('day02/test', '2', part2)
