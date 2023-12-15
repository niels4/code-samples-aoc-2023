import { sum } from "../lib/iterators.js"
import * as runner from "../lib/runner.js"

console.log("Solving AoC 2023 day 15")

const parseInput = (input) => input.split(',')

const hashString = (string) => {
  let hash = 0

  for (let i = 0; i < string.length; i++) {
    const nextCode = string.charCodeAt(i)
    hash += nextCode
    hash *= 17
    hash = hash % 256
  }

  return hash
}

const part1 = (input) => {
  const sequenceStrings = parseInput(input)
  const hashes = sequenceStrings.map(hashString)
  return sum(hashes)
}

const sequenceRegex = /([a-z]+)([=-])(\d?)/

const parseSequences = (sequenceString) => {
  const [, label, operation, focalLengthStr] = sequenceRegex.exec(sequenceString)
  const focalLength = Number(focalLengthStr)
  const labelHash = hashString(label)
  return {label, labelHash, operation, focalLength}
}

const addLensToBox = (boxes, {label, labelHash, focalLength}) => {
  if (!boxes[labelHash]) {
    boxes[labelHash] = {
      size: 0,
      lenses: {}
    }
  }
  const box = boxes[labelHash]
  if (box.lenses[label]) {
    box.lenses[label].focalLength = focalLength
    return
  }
  box.lenses[label] = {
    index: box.size,
    focalLength
  }
  box.size++
}

const removeLenseFromBox = (boxes, {label, labelHash}) => {
  if (!boxes[labelHash]) { return }
  const box = boxes[labelHash]
  if (!box.lenses[label]) { return }
  const lenseIndex = box.lenses[label].index
  delete box.lenses[label]
  for (const lense of Object.values(box.lenses)) {
    if (lense.index > lenseIndex) {
      lense.index--
    }
  }
  box.size++
}

const part2 = (input) => {
  const sequenceStrings = parseInput(input)
  const sequences = sequenceStrings.map(parseSequences)
  const boxes = []
  sequences.forEach((sequence) => {
    const {operation} = sequence
    if (operation === "=") {
      addLensToBox(boxes, sequence)
    } else {
      removeLenseFromBox(boxes, sequence)
    }
  })

  const result = boxes.reduce((acc, box, boxIndex) => {
    if (!box) { return acc}
    const {lenses} = box
    const boxNumber = boxIndex + 1
    return acc + Object.values(lenses).reduce((acc, {focalLength}, lenseIndex) => {
      const lenseNumber = lenseIndex + 1
      return acc + boxNumber * lenseNumber * focalLength
    }, 0)
  }, 0)

  return result
}

await runner.testOutput('day15/example', '1', part1)
// await runner.printOutput('day15/test', part1)
// await runner.copyOutput('day15/test', part1)
// await runner.writeOutput('day15/test', '1', part1)
await runner.testOutput('day15/test', '1', part1)

await runner.testOutput('day15/example', '2', part2)
// await runner.printOutput('day15/test', part2)
// await runner.copyOutput('day15/test', part2)
// await runner.writeOutput('day15/test', '2', part2)
await runner.testOutput('day15/test', '2', part2)
