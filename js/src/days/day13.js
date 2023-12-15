import { sum, windows } from "../lib/iterators.js"
import * as runner from "../lib/runner.js"
import { setsAreEqual, symmetricDifference } from "../lib/set.js"

console.log("Solving AoC 2023 day 13")

const rockChar = "#"

const parseInput = (input) => {
  const sections = input.split('\n\n')
  const patterns = sections.map((section, patternIndex) => {
    const lines = section.split('\n')
    const rows = Array.from(lines, () => new Set)
    const cols = Array.from(lines[0], () => new Set)
    lines.forEach((line, rowIndex) => {
      [...line].forEach((char, colIndex) => {
        if (char === rockChar) {
          rows[rowIndex].add(colIndex)
          cols[colIndex].add(rowIndex)
        }
      })
    })
    return {lines, rows, cols, patternIndex}
  })
  return patterns
}

const findMirrorIndexInOneDimension = (listOfRockIndexSets) => {
  const endIndex = listOfRockIndexSets.length - 1
  let reflectIndex = 1
  for (const [set1, set2] of windows(2, listOfRockIndexSets)) {
    if (setsAreEqual(set1, set2)) {
      const reflectCount = Math.min(reflectIndex, endIndex + 1 - reflectIndex)
      let isReflection = true
      for (let forwardOffset = 0; forwardOffset < reflectCount; forwardOffset++) {
        const backwardOffset = forwardOffset + 1
        const set1 = listOfRockIndexSets[reflectIndex - backwardOffset]
        const set2 = listOfRockIndexSets[reflectIndex + forwardOffset]
        if (!setsAreEqual(set1, set2)) {
          isReflection = false
          break
        }
      }
      if (isReflection) { return reflectIndex }
    }
    reflectIndex++
  }
  return 0
}

const findPatternScore = (pattern) => {
  let mirrorIndex = findMirrorIndexInOneDimension(pattern.cols)
  let scoreMultiplier = 1
  if (mirrorIndex === 0) {
    mirrorIndex = findMirrorIndexInOneDimension(pattern.rows)
    scoreMultiplier = 100
  }
  return mirrorIndex * scoreMultiplier
}

const part1 = (input) => {
  const patterns = parseInput(input)
  const patternScores = patterns.map(findPatternScore)
  return sum(patternScores)
}

const findMirrorIndexInOneDimensionPart2 = (listOfRockIndexSets) => {
  const endIndex = listOfRockIndexSets.length - 1
  let reflectIndex = 1
  for (const [set1, set2] of windows(2, listOfRockIndexSets)) {
    let numSmudges = 0
    if (symmetricDifference(set1, set2).size <= 1) {
      const reflectCount = Math.min(reflectIndex, endIndex + 1 - reflectIndex)
      for (let forwardOffset = 0; forwardOffset < reflectCount; forwardOffset++) {
        const backwardOffset = forwardOffset + 1
        const set1 = listOfRockIndexSets[reflectIndex - backwardOffset]
        const set2 = listOfRockIndexSets[reflectIndex + forwardOffset]
        numSmudges += symmetricDifference(set1, set2).size
      }
      if (numSmudges === 1) { return reflectIndex }
    }
    reflectIndex++
  }
  return 0
}

const findPatternScorePart2 = (pattern, patternIndex) => {
  let mirrorIndex = findMirrorIndexInOneDimensionPart2(pattern.cols)
  let scoreMultiplier = 1
  if (mirrorIndex === 0) {
    mirrorIndex = findMirrorIndexInOneDimensionPart2(pattern.rows)
    scoreMultiplier = 100
  }
  if (mirrorIndex === 0) {
    console.log("DID NOT FIND MIRROR INDEX", patternIndex)
    console.log(pattern.lines.join('\n'))
    process.exit(99)
  }
  return mirrorIndex * scoreMultiplier
}

const part2 = (input) => {
  const patterns = parseInput(input)
  const patternScores = patterns.map(findPatternScorePart2)
  return sum(patternScores)
}
await runner.testOutput('day13/example', '1', part1)
// await runner.printOutput('day13/test', part1)
// await runner.copyOutput('day13/test', part1)
// await runner.writeOutput('day13/test', '1', part1)
await runner.testOutput('day13/test', '1', part1)

await runner.testOutput('day13/example', '2', part2)
// await runner.printOutput('day13/test', part2)
// await runner.copyOutput('day13/test', part2)
// await runner.writeOutput('day13/test', '2', part2)
await runner.testOutput('day13/test', '2', part2)
