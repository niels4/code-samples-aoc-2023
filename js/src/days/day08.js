import * as runner from "../lib/runner.js"

console.log("Solving AoC 2023 day 08")

const startNodeKey = "AAA"
const endNodeKey = "ZZZ"

const nodeRegex = /[A-Z0-9]{3}/g

const parseInput = (input) => {
  const [directions, , ...nodeLines] = input.split('\n')
  const nodes = new Map()
  nodeLines.forEach((line) => {
    const [[key], [L], [R]] = [...line.matchAll(nodeRegex)]
    nodes.set(key, {key, L, R})
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

// const getAllStartNodes = (nodes) => {
//   const startNodes = []
//   for (const [nodeKey, node] of nodes) {
//     if (nodeKey.endsWith("A")) {
//       startNodes.push(node)
//     }
//   }
//   return startNodes
// }

// const allNodesEnded = (nodes) => nodes.every(n => n.key.endsWith("Z"))
//
// const applyStep = (nodes, direction) => (node) => {
//   const nextKey = node[direction]
//   return nodes.get(nextKey)
// }

// const part2 = (input) => {
//   const {directions, nodes} = parseInput(input)
//
//   let numSteps = 0
//   let currentNodes = getAllStartNodes(nodes)
//   console.log(directions.length, nodes.size)
//   while (!allNodesEnded(currentNodes)) {
//     const nextDirection = directions[numSteps % directions.length]
//     currentNodes = currentNodes.map(applyStep(nodes, nextDirection))
//     numSteps++
//   }
//   return numSteps
// }

await runner.testOutput('day08/example', '1', part1)
await runner.testOutput('day08/example_b', '1', part1)
// await runner.printOutput('day08/test', part1)
// await runner.copyOutput('day08/test', part1)
// await runner.writeOutput('day08/test', '1', part1)
await runner.testOutput('day08/test', '1', part1)

// await runner.testOutput('day08/example_c', '2', part2)
// await runner.printOutput('day08/test', part2)
// await runner.copyOutput('day08/test', part2)
// await runner.writeOutput('day08/test', '2', part2)
// await runner.testOutput('day08/test', '2', part2)
