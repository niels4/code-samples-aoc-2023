import * as runner from "../lib/runner.js"

console.log("Solving AoC 2023 day 20")

const broadcaster = "broadcaster"
const flipflop = "%"
const conjunction = "&"

const parseInput = (input) => {
  const lines = input.split('\n')
  const modules = new Map()
  lines.forEach((line) => {
    const [moduleIdentifier, outputsList] = line.split(" -> ")
    let type, name
    if (moduleIdentifier === broadcaster) {
      type = broadcaster
      name = broadcaster
    } else {
      type = moduleIdentifier[0]
      name = moduleIdentifier.substring(1)
    }
    const outputs = outputsList.split(',')
    modules.set(name, {type, outputs})
  })
  return modules
}

const part1 = (input) => {
  const modules = parseInput(input)
  inspect(modules)
  return 0
}

// const part2 = (input) => {
//   return 0
// }

await runner.testOutput('day20/example', '1', part1)
await runner.testOutput('day20/example_b', '1', part1)
// await runner.printOutput('day20/test', part1)
// await runner.copyOutput('day20/test', part1)
// await runner.writeOutput('day20/test', '1', part1)
// await runner.testOutput('day20/test', '1', part1)

// await runner.testOutput('day20/example', '2', part2)
// await runner.printOutput('day20/test', part2)
// await runner.copyOutput('day20/test', part2)
// await runner.writeOutput('day20/test', '2', part2)
// await runner.testOutput('day20/test', '2', part2)
