import * as runner from "../lib/runner.js"
import { union } from '../lib/set.js'

console.log("Solving AoC 2023 day 25")

const addNewNode = (nodes, nodeKey) => {
  if (nodes.has(nodeKey)) { return }
  const newNode = {subnodes: new Set([nodeKey])}
  nodes.set(nodeKey, newNode)
}

const parseInput = (input) => {
  const nodes = new Map()
  const edges = []

  const lines = input.split('\n')
  lines.forEach((line) => {
    const [componentA, connected] = line.split(": ")
    connected.split(" ").forEach((componentB) => {
      addNewNode(nodes, componentA)
      addNewNode(nodes, componentB)
      edges.push([componentA, componentB])
    })
  })

  return {nodes, edges}
}

function getRandomElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}

const collapseRandomEdge = (graph, collapsedMapping) => {
  const {nodes, edges} = graph
  const edge = getRandomElement(edges)
  const [componentA, componentB] = edge

  const nodeAKey = collapsedMapping.get(componentA) || componentA
  const nodeBKey = collapsedMapping.get(componentB) || componentB

  const nodeA = nodes.get(nodeAKey)
  const nodeB = nodes.get(nodeBKey)

  const newKey = nodeAKey + ":" + nodeBKey
  const newSubnodes = union(nodeA.subnodes, nodeB.subnodes)

  nodes.delete(nodeAKey)
  nodes.delete(nodeBKey)

  nodes.set(newKey, {subnodes: newSubnodes})

  for (const subnodeKey of newSubnodes) {
    collapsedMapping.set(subnodeKey, newKey)
  }

  graph.edges = edges.filter(([componentA, componentB]) => {
    return !newSubnodes.has(componentA) || !newSubnodes.has(componentB)
  })
}

// mutates nodes and edges until only 2 nodes remain
const collapseNodes = (graph) => {
  const {nodes} = graph
  const collapsedMapping = new Map()

  while (nodes.size > 2) {
    collapseRandomEdge(graph, collapsedMapping)
  }
}

const part1 = (input) => {
  let graph
  let cutCount

  // use karger's algorithm until we find a cut count of 3
  while (cutCount !== 3) {
    graph = parseInput(input)
    collapseNodes(graph)
    cutCount = graph.edges.length
  }
  console.log("cut edges", graph.edges)
  const [nodeA, nodeB] = [...graph.nodes.values()]
  const result = nodeA.subnodes.size * nodeB.subnodes.size
  return result
}

await runner.testOutput('day25/example', '1', part1)
// await runner.printOutput('day25/test', part1)
// await runner.copyOutput('day25/test', part1)
// await runner.writeOutput('day25/test', '1', part1)
await runner.testOutput('day25/test', '1', part1)
