import * as runner from "../lib/runner.js"

console.log("Solving AoC 2023 day 05")

const readNumberList = (string, seperator=" ") => {
  return string.trim().split(seperator).map(n => Number(n))
}

const readSeedValues = (linesIterator) => {
  const firstLine = linesIterator.next().value
  const seedValues = firstLine.substring(firstLine.indexOf(":") + 2, firstLine.length)
  return readNumberList(seedValues)
}

const readNextMapping = (linesIterator) => {
  const firstLine = linesIterator.next().value
  const [mapping] = firstLine.split(" ")
  const [item1, item2] = mapping.split("-to-")
  let ranges = []
  let hasMore = null
  do  {
    const nextLine = linesIterator.next()
    if (nextLine.done) {
      hasMore = false
      break
    }
    if (nextLine.value === "") {
      hasMore = true
      break
    }
    ranges.push(readNumberList(nextLine.value))
  } while (hasMore === null)
  return [item1, item2, ranges, hasMore]
}

const parseInput = (input) => {
  const linesIterator = input.split('\n').values()
  const mappings = new Map()
  mappings.set('initial-seeds', readSeedValues(linesIterator))
  linesIterator.next() // skip next empty line

  let hasMoreLines = true
  while (hasMoreLines) {
    const [item1, item2, ranges, hasMore] = readNextMapping(linesIterator)
    mappings.set(item1, {to: item2, ranges})
    hasMoreLines = hasMore
  }

  return mappings
}

const part1 = (input) => {
  const mappings = parseInput(input)
  inspect(mappings)
  return 0
}

// const part2 = (input) => {
//   return 0
// }

await runner.testOutput('day05/example', '1', part1)
// await runner.printOutput('day05/test', part1)
// await runner.copyOutput('day05/test', part1)
// await runner.writeOutput('day05/test', '1', part1)
// await runner.testOutput('day05/test', '1', part1)

// await runner.testOutput('day05/example', '2', part2)
// await runner.printOutput('day05/test', part2)
// await runner.copyOutput('day05/test', part2)
// await runner.writeOutput('day05/test', '2', part2)
// await runner.testOutput('day05/test', '2', part2)
