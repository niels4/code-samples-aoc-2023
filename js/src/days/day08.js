import { findGCD } from "../lib/math.js"
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

const findStepsUntilEndTarget = (isEndKey, directions, nodes, startNode) => {
  let currentNode = startNode
  let numSteps = 0

  while (!isEndKey(currentNode.key)) {
    const nextDirection = directions[numSteps % directions.length]
    const nextNodeKey = currentNode[nextDirection]
    currentNode = nodes.get(nextNodeKey)
    numSteps++
  }

  return numSteps
}

const isEndKeyPart1 = key => key === endNodeKey

const part1 = (input) => {
  const {directions, nodes} = parseInput(input)
  return findStepsUntilEndTarget(isEndKeyPart1, directions, nodes, nodes.get(startNodeKey))
}

const getAllStartNodes = (nodes) => {
  const startNodes = []

  for (const [nodeKey, node] of nodes) {
    if (nodeKey.endsWith("A")) {
      startNodes.push(node)
    }
  }

  return startNodes
}

const isEndKeyPart2 = key => key.endsWith("Z")

const part2 = (input) => {
  const {directions, nodes} = parseInput(input)

  const startNodes = getAllStartNodes(nodes)
  const cycleLengths = startNodes.map(node => findStepsUntilEndTarget(isEndKeyPart2, directions, nodes, node))
  const cycledGCD = findGCD(cycleLengths)
  const gcdMultiple = cycleLengths.reduce((acc, cycleLength) => {
    return acc * Math.ceil(cycleLength / cycledGCD)
  }, 1)

  return gcdMultiple * cycledGCD
}

await runner.testOutput('day08/example', '1', part1)
await runner.testOutput('day08/example_b', '1', part1)
// await runner.printOutput('day08/test', part1)
// await runner.copyOutput('day08/test', part1)
// await runner.writeOutput('day08/test', '1', part1)
await runner.testOutput('day08/test', '1', part1)

await runner.testOutput('day08/example_c', '2', part2)
// await runner.printOutput('day08/test', part2)
// await runner.copyOutput('day08/test', part2)
// await runner.writeOutput('day08/test', '2', part2)
await runner.testOutput('day08/test', '2', part2)
