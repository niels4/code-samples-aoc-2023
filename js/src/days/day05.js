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
    mappedValues: readNumberList(seedValues)
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

const part1 = (input) => {
  const mappings = parseInput(input)
  let currentItem = mappings.get("initial-seeds")
  let currentMapping = mappings.get(currentItem.to)
  while (currentMapping) {
    const {to, ranges} = currentMapping
    const nextItemValues = []
    currentItem.mappedValues.forEach((val) => {
      for (const [dstStart, srcStart, rangeLength] of ranges) {
        const srcDiff = val - srcStart
        if (srcDiff >= 0 && srcDiff < rangeLength) {
          nextItemValues.push(dstStart + srcDiff)
          return
        }
      }
      nextItemValues.push(val) // not found in any range
    })

    currentMapping.mappedValues = nextItemValues
    currentItem = currentMapping
    currentMapping = mappings.get(to)
  }

  return Math.min.apply(null, currentItem.mappedValues)
}

const initRangesToMap = (mappedValues) => {
  const rangesToMap = []
  for (let i = 0; i < mappedValues.length; i += 2) {
    rangesToMap.push([mappedValues[i], mappedValues[i + 1]])
  }
  return rangesToMap
}

let sawLoop = false
const part2 = (input) => {
  const mappings = parseInput(input)
  inspect(mappings)

  let currentItem = mappings.get("initial-seeds")
  let currentMapping = mappings.get(currentItem.to)
  while (currentMapping) {
    const {to, ranges} = currentMapping
    console.log("rangestomap")
    const nextMappedValues = []
    const rangesToMap = initRangesToMap(currentItem.mappedValues)
    let nextRangeToMap = rangesToMap.pop()
    let foundRange = false
    while (nextRangeToMap) {
      const [srcStart, srcRange] = nextRangeToMap
      const srcEnd = srcStart + srcRange
      for (const [mappedDstStart, mappedSrcStart, mappedRange] of ranges) {
        const mappedSrcEnd = mappedSrcStart + mappedRange
        // case 1, src fits entirely within dst
        if (srcStart >= mappedSrcStart && srcEnd <= mappedSrcEnd) {
          const offset = srcStart - mappedSrcStart
          nextMappedValues.push(mappedDstStart + offset, srcRange)
          foundRange = true
          break
        }
        // case 2, src overlaps start of dst range
        if (srcStart < mappedDstStart && srcEnd >= mappedDstStart && srcEnd <= mappedSrcEnd) {
          const remainingLength = mappedDstStart - srcStart - 1
          rangesToMap.push([srcStart, remainingLength])
          const mappedLength = srcEnd - mappedDstStart
          nextMappedValues.push(mappedDstStart, mappedLength)
          foundRange = true
          break
        }
        // // case 3, src overlaps end of dst range
        if (srcStart >= mappedDstStart && srcStart <= mappedSrcEnd && srcEnd > mappedSrcEnd) {
          const remainingLength = srcEnd - mappedSrcEnd - 1
          rangesToMap.push([mappedSrcEnd + 1, remainingLength])
          const mappedLength = mappedSrcEnd - srcStart
          nextMappedValues.push(srcStart, mappedLength)
          foundRange = true
          break
        }
        // case 1, src fits entirely within dst
        if (srcStart >= mappedSrcStart && srcEnd <= mappedSrcEnd) {
        }
      }
      // final case: no matches found for any dst range
      if (!foundRange) {
        nextMappedValues.push(srcStart, srcRange)
      }
      nextRangeToMap = rangesToMap.pop()
    }

    currentItem = currentMapping
    currentItem.mappedValues = nextMappedValues
    currentMapping = mappings.get(to)
  }
  inspect(mappings)
  return 0
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
