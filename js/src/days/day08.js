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

// solve part 1 the simple way
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

// for each node, map to the node that you end up at after following 1 loop of directions
const createFullLoopMapping = (directions, nodes) => {
  const mapping = new Map()
  for (const node of nodes.values()) {
    let currentNode = node
    for (const direction of directions) {
      currentNode = nodes.get(currentNode[direction])
    }
    mapping.set(node, currentNode)
  }
  return mapping
}

// find which nodes can lead to the end node if we are on them at the start of the direction loop
const findPotentialStartingLoopTargets = (directions, nodes) => {
  const potentialStartingLoopPoints = new Map()
  ;[...nodes.values()].forEach((node) => {
    if (node.key === endNodeKey) { return }
    let numSteps = 1
    let currentNode = node
    for (const direction of directions) {
      currentNode = nodes.get(currentNode[direction])
      if (currentNode.key === endNodeKey) {
        potentialStartingLoopPoints.set(node, numSteps)
        return
      }
      numSteps++
    }
  })
  return potentialStartingLoopPoints
}

// improve performance of part 1 to get an intuition for how to solve part 2
const part1_perf = (input) => {
  const {directions, nodes} = parseInput(input)
  const fullLoopMapping = createFullLoopMapping(directions, nodes)
  const potentialStartingLoopTargets = findPotentialStartingLoopTargets(directions, nodes)
  let currentNode = nodes.get(startNodeKey)
  let numLoops = 0
  while (!potentialStartingLoopTargets.has(currentNode)) {
    currentNode = fullLoopMapping.get(currentNode)
    numLoops++
  }
  const stepsSoFar = numLoops * directions.length
  const stepsToTheEnd = potentialStartingLoopTargets.get(currentNode)

  return stepsSoFar + stepsToTheEnd
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
await runner.testOutput('day08/example', '1', part1_perf)
await runner.testOutput('day08/example_b', '1', part1)
await runner.testOutput('day08/example_b', '1', part1_perf)
// await runner.printOutput('day08/test', part1)
// await runner.copyOutput('day08/test', part1)
// await runner.writeOutput('day08/test', '1', part1)
await runner.testOutput('day08/test', '1', part1)
await runner.testOutput('day08/test', '1', part1_perf)

// await runner.testOutput('day08/example_c', '2', part2)
// await runner.printOutput('day08/test', part2)
// await runner.copyOutput('day08/test', part2)
// await runner.writeOutput('day08/test', '2', part2)
// await runner.testOutput('day08/test', '2', part2)
