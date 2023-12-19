import * as runner from "../lib/runner.js"

console.log("Solving AoC 2023 day 19")

const parseInput = (input) => {
  const [workflowLines, ratingLines] = input.split('\n\n')
  const workflows = workflowLines.split("\n").map((line) => {
    const rulesStart = line.indexOf('{')
    const name = line.substring(0, rulesStart)
    const rulesLine = line.substring(rulesStart + 1, line.length - 1)
    console.log("parsing rules", name, rulesLine)
    return {name}
  })
  return {workflows}
}

const part1 = (input) => {
  const {workflows} = parseInput(input)
  inspect(workflows)
  return 0
}

// const part2 = (input) => {
//   return 0
// }

await runner.testOutput('day19/example', '1', part1)
// await runner.printOutput('day19/test', part1)
// await runner.copyOutput('day19/test', part1)
// await runner.writeOutput('day19/test', '1', part1)
// await runner.testOutput('day19/test', '1', part1)

// await runner.testOutput('day19/example', '2', part2)
// await runner.printOutput('day19/test', part2)
// await runner.copyOutput('day19/test', part2)
// await runner.writeOutput('day19/test', '2', part2)
// await runner.testOutput('day19/test', '2', part2)
