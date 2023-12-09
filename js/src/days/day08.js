import { mult } from "../lib/iterators.js"
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
const findPotentialStartingLoopTargets = (isEndKey) => (directions, nodes) => {
  const potentialStartingLoopTargets = new Map()

  ;[...nodes.values()].forEach((node) => {
    let numSteps = 1
    let currentNode = node
    for (const direction of directions) {
      currentNode = nodes.get(currentNode[direction])
      if (isEndKey(currentNode.key)) {
        potentialStartingLoopTargets.set(node, numSteps)
        return
      }
      numSteps++
    }
  })

  return potentialStartingLoopTargets
}
const isEndKeyPart1 = key => key === "ZZZ"
const findPotentialStartingLoopTargetsPart1 = findPotentialStartingLoopTargets(isEndKeyPart1)

// improve performance of part 1 to get an intuition for how to solve part 2
const part1_perf = (input) => {
  const {directions, nodes} = parseInput(input)
  const fullLoopMapping = createFullLoopMapping(directions, nodes)
  const potentialStartingLoopTargets = findPotentialStartingLoopTargetsPart1(directions, nodes)
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

const getAllStartNodes = (nodes) => {
  const startNodes = []
  for (const [nodeKey, node] of nodes) {
    if (nodeKey.endsWith("A")) {
      startNodes.push(node)
    }
  }
  return startNodes
}

const foundAllStartingLoopTargets = (potentialStartingLoopTargets, nodes) => nodes.every(node => potentialStartingLoopTargets.has(node))

const isEndKeyPart2 = key => key.endsWith("Z")
const findPotentialStartingLoopTargetsPart2 = findPotentialStartingLoopTargets(isEndKeyPart2)

const part2 = (input) => {
  const {directions, nodes} = parseInput(input)

  console.log("PART 2")
  // inspect(fullLoopMapping)
  // inspect(potentialStartingLoopTargets)

  const startNodes = getAllStartNodes(nodes)
  const cycleLengths = startNodes.map((node) => {
    let numSteps = 0
    let currentNode = node
    while (!isEndKeyPart2(currentNode.key)) {
      const nextDirection = directions[numSteps % directions.length]
      const nextNodeKey = currentNode[nextDirection]
      currentNode = nodes.get(nextNodeKey)
      numSteps++
    }
    return numSteps
  })

  cycleLengths.forEach((len) => {
    console.log("got cycleLength", len, len / directions.length)
  })

  const cycledGCD = findGCD(cycleLengths)
  const result = cycleLengths.reduce((acc, len) => {
    return acc * Math.ceil(len / cycledGCD)
  }, 1)

  return result * cycledGCD

  // let currentNodes = getAllStartNodes(nodes)
  // console.log("init loop")
  // inspect(currentNodes)

  // let numLoops = 1
  // while (!foundAllStartingLoopTargets(potentialStartingLoopTargets, currentNodes)) {
  //   currentNodes = currentNodes.map(node => fullLoopMapping.get(node))
  //   numLoops++
  // }
  // const stepsSoFar = numLoops * directions.length
  // const stepsToTheEnd = potentialStartingLoopTargets.get(currentNodes[0])
  // console.log("ENDED LOOP", numLoops, stepsSoFar, stepsToTheEnd)
  // inspect(currentNodes)
  //
  // return stepsSoFar + stepsToTheEnd
}

await runner.testOutput('day08/example', '1', part1)
await runner.testOutput('day08/example', '1', part1_perf)
await runner.testOutput('day08/example_b', '1', part1)
await runner.testOutput('day08/example_b', '1', part1_perf)
// await runner.printOutput('day08/test', part1)
// await runner.copyOutput('day08/test', part1)
// await runner.writeOutput('day08/test', '1', part1)
await runner.testOutput('day08/test', '1', part1)
await runner.testOutput('day08/test', '1', part1_perf)

await runner.testOutput('day08/example_c', '2', part2)
// await runner.printOutput('day08/test', part2)
// await runner.copyOutput('day08/test', part2)
// await runner.writeOutput('day08/test', '2', part2)
await runner.testOutput('day08/test', '2', part2)
