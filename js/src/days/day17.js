import * as runner from "../lib/runner.js"

console.log("Solving AoC 2023 day 17")

const parseInput = (input) => input.split('\n').map((line, row) =>
  [...line].map((char, col) => ({ col, row, char })))

const getNeighbors = (currSquare, prevSquare) => {

}

const part1 = (input) => {
  const rows = parseInput(input)
  const start = rows[0][0]
  inspect(rows)
  console.log(start)
  return 0
}

// const part2 = (input) => {
//   return 0
// }

await runner.testOutput('day17/example', '1', part1)
// await runner.printOutput('day17/test', part1)
// await runner.copyOutput('day17/test', part1)
// await runner.writeOutput('day17/test', '1', part1)
// await runner.testOutput('day17/test', '1', part1)

// await runner.testOutput('day17/example', '2', part2)
// await runner.printOutput('day17/test', part2)
// await runner.copyOutput('day17/test', part2)
// await runner.writeOutput('day17/test', '2', part2)
// await runner.testOutput('day17/test', '2', part2)
