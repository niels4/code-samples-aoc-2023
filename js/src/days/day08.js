import * as runner from "../lib/runner.js"

console.log("Solving AoC 2023 day 08")

const startNodeKey = "AAA"
const endNodeKey = "ZZZ"

const nodeRegex = /[A-Z]{3}/g

const parseInput = (input) => {
  const [directions, , ...nodeLines] = input.split('\n')
  const nodes = new Map()
  nodeLines.forEach((line) => {
    const [[key], [L], [R]] = [...line.matchAll(nodeRegex)]
    nodes.set(key, {L, R, key})
  })
  return {directions, nodes}
}

const part1 = (input) => {
  const {directions, nodes} = parseInput(input)

  let numSteps = 0
  let currentNode = nodes.get(startNodeKey)

  while (currentNode.key !== endNodeKey) {
    const nextDirection = directions[numSteps % directions.length]
    const nextNodeKey = currentNode[nextDirection]
    currentNode = nodes.get(nextNodeKey)
    numSteps++
  }

  return numSteps
}

// const part2 = (input) => {
//   return 0
// }

await runner.testOutput('day08/example', '1', part1)
await runner.testOutput('day08/example_b', '1', part1)
// await runner.printOutput('day08/test', part1)
// await runner.copyOutput('day08/test', part1)
// await runner.writeOutput('day08/test', '1', part1)
await runner.testOutput('day08/test', '1', part1)

// await runner.testOutput('day08/example', '2', part2)
// await runner.printOutput('day08/test', part2)
// await runner.copyOutput('day08/test', part2)
// await runner.writeOutput('day08/test', '2', part2)
// await runner.testOutput('day08/test', '2', part2)
