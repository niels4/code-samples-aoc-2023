import * as runner from "../lib/runner.js"

console.log("Solving AoC 2023 day 11")

const emptySpaceChar = "."

const createExpansionMapping = (emptyElements) => {
  const mapping = []

  let currentOffset = 0
  emptyElements.forEach((isEmpty) => {
    if (isEmpty) { currentOffset++ }
    mapping.push(currentOffset)
  }, 0)

  return mapping
}

const parseInput = (input) => {
  const lines = input.split('\n')
  const emptyRows = lines.map(() => true)
  const emptyColumns = Array.from(lines[0], () => true)
  const galaxies = []

  lines.forEach((line, rowIndex) => {
    let emptyRow = true
    ;[...line].forEach((char, colIndex) => {
      if (char === emptySpaceChar) { return }
      emptyRow = false
      emptyColumns[colIndex] = false
      galaxies.push({row: rowIndex, col: colIndex})
    })
    emptyRows[rowIndex] = emptyRow
  })

  const expandedRowMapping = createExpansionMapping(emptyRows)
  const expandedColMapping = createExpansionMapping(emptyColumns)
  const expandedGalaxies = galaxies.map(({row, col}) => {
    return {
      row: row + expandedRowMapping[row],
      col: col + expandedColMapping[col],
    }
  })

  return {
    galaxies,
    expandedGalaxies
  }
}

const part1 = (input) => {
  const parsed = parseInput(input)
  inspect(parsed)
  return 0
}

// const part2 = (input) => {
//   return 0
// }

await runner.testOutput('day11/example', '1', part1)
// await runner.printOutput('day11/test', part1)
// await runner.copyOutput('day11/test', part1)
// await runner.writeOutput('day11/test', '1', part1)
// await runner.testOutput('day11/test', '1', part1)

// await runner.testOutput('day11/example', '2', part2)
// await runner.printOutput('day11/test', part2)
// await runner.copyOutput('day11/test', part2)
// await runner.writeOutput('day11/test', '2', part2)
// await runner.testOutput('day11/test', '2', part2)
