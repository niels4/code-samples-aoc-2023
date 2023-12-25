import * as runner from "../lib/runner.js"

console.log("Solving AoC 2023 day 25")

const addConnection = (graph, componentA, componentB) => {
  if (!graph[componentA]) {
    graph[componentA] = new Set()
  }
  if (!graph[componentB]) {
    graph[componentB] = new Set()
  }
  graph[componentA].add(componentB)
  graph[componentB].add(componentA)
}

const parseInput = (input) => {
  const graph = {}

  const lines = input.split('\n')
  lines.forEach((line) => {
    const [componentA, connected] = line.split(": ")
    connected.split(" ").forEach((componentB) => {
      addConnection(graph, componentA, componentB)
    })
  })

  return graph
}

const part1 = (input) => {
  const graph = parseInput(input)
  return 0
}

// const part2 = (input) => {
//   return 0
// }

await runner.testOutput('day25/example', '1', part1)
// await runner.printOutput('day25/test', part1)
// await runner.copyOutput('day25/test', part1)
// await runner.writeOutput('day25/test', '1', part1)
// await runner.testOutput('day25/test', '1', part1)

// await runner.testOutput('day25/example', '2', part2)
// await runner.printOutput('day25/test', part2)
// await runner.copyOutput('day25/test', part2)
// await runner.writeOutput('day25/test', '2', part2)
// await runner.testOutput('day25/test', '2', part2)
