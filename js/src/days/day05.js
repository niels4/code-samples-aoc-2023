import * as runner from "../lib/runner.js"

console.log("Solving AoC 2023 day 05")

const readNumberList = (string, seperator=" ") => {
  return string.trim().split(seperator).map(n => Number(n))
}

const readSeedValues = (linesIterator) => {
  const firstLine = linesIterator.next().value
  const seedValues = firstLine.substring(firstLine.indexOf(":") + 2, firstLine.length)
  return {
    to: "seed",
    values: readNumberList(seedValues)
  } 
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
    mappings.set(item1, {from: item1, to: item2, ranges})
    hasMoreLines = hasMore
  }

  return mappings
}

function* iterateMappings (mappings) {
  let nextMapping = mappings.get('seed')
  while (nextMapping) {
    yield nextMapping
    nextMapping = mappings.get(nextMapping.to)
  }
}

const part1 = (input) => {
  const mappings = parseInput(input)
  const mappedValues = new Map()
  mappedValues.set("seed", mappings.get('initial-seeds').values)

  for (const {from, to, ranges} of iterateMappings(mappings)) {
    const valuesToMap = mappedValues.get(from)
    const nextValues = []
    valuesToMap.forEach((value) => {
      for (const [dstStart, srcStart, mappedSize] of ranges) {
        const offset = dstStart - srcStart
        const srcEnd = srcStart + mappedSize - 1
        if (value >= srcStart && value <= srcEnd) {
          nextValues.push(value + offset)
          return
        }
      }
      // value doesn't fall into any mapping ranges
      nextValues.push(value)
    })
    mappedValues.set(to, nextValues)
  }

  return Math.min.apply(null, mappedValues.get('location'))
}

const mappedValuesToMappedRanges = (mappedValues) => {
  const mappedRanges = []
  for (let i = 0; i < mappedValues.length; i += 2) {
    const start = mappedValues[i]
    const size = mappedValues[i + 1]
    const end = start + size - 1 // we include each end point in the size value. A range of 1 would start and end on the same value
    mappedRanges.push({start, end, size})
  }
  return mappedRanges
}

const mapRangeToRange = (range, rangeMapping) => {
  const {start, end, size} = range
  const [mappedDstStart, mappedSrcStart, mappedSize] = rangeMapping
  const mappedSrcEnd = mappedSrcStart + mappedSize - 1
  const mappedOffset = mappedDstStart - mappedSrcStart

  // case 1, range is entirely inside mapped src
  if (start >= mappedSrcStart && end <= mappedSrcEnd) {
    return {
      matched: true,
      mappedRange: {
        start: start + mappedOffset,
        end: end + mappedOffset,
        size
      },
      additionalRanges: []
    }
  }

  return {
    matched: false
  }
}

const part2 = (input) => {
  const mappings = parseInput(input)
  const mappedRanges = new Map()
  mappedRanges.set('seed', mappedValuesToMappedRanges(mappings.get('initial-seeds').values))
  for (const {from, to, ranges} of iterateMappings(mappings)) {
    const rangesToMap = [...mappedRanges.get(from)]
    const nextRanges = []
    while (rangesToMap.length) {
      const range = rangesToMap.pop()
      let foundMatchingRange = false

      for (const rangeMapping of ranges) { // compare our value range against current mapping ranges
        const {matched, mappedRange, additionalRanges} = mapRangeToRange(range, rangeMapping)
        if (matched) {
          console.log("FOUND MATCH", mappedRange)
          foundMatchingRange = true
          nextRanges.push(mappedRange)
          rangesToMap.push.apply(rangesToMap, additionalRanges)
          break
        }
      }
      if (!foundMatchingRange) {
        nextRanges.push(range)
      }
    }
    mappedRanges.set(to, nextRanges)
  }

  inspect(mappedRanges)
  return Math.min.apply(null, mappedRanges.get('location').map(r => r.start))
}

await runner.testOutput('day05/example', '1', part1)
// await runner.printOutput('day05/test', part1)
// await runner.copyOutput('day05/test', part1)
// await runner.writeOutput('day05/test', '1', part1)
await runner.testOutput('day05/test', '1', part1)

await runner.testOutput('day05/example', '2', part2)
// await runner.printOutput('day05/test', part2)
// await runner.copyOutput('day05/test', part2)
// await runner.writeOutput('day05/test', '2', part2)
// await runner.testOutput('day05/test', '2', part2)
