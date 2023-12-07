import * as runner from "../lib/runner.js"
import {sum} from "../lib/iterators.js"
import { isDigit } from "../lib/parsing.js"

console.log("Solving AoC 2023 day 03")

const isSymbol = (char) => {
  return char !== "." && !isDigit(char)
}

const parseInput = (input) => {
  const lines = input.split('\n')
  const rows = []
  lines.forEach((line, rowIndex) => {
    const numbers = []
    const symbols = []
    let numberStart = null
    let numberChars = ""

    const handleDigit = (char, i) => {
      if (numberStart == null) { numberStart = i}
      numberChars += char
    }

    const handleNonDigit = (i) => {
      if (numberStart == null) { return }
      const number = {
        start: numberStart,
        end: i - 1,
        number: Number(numberChars),
        nearSymbol: false
      }

      numbers.push(number)
      numberStart = null
      numberChars = ""

      const markIfNear = (symbol) => {
        const {col} = symbol
        if (col >= number.start - 1 && col <= number.end + 1) {
          number.nearSymbol = true
        }
      }
      symbols.forEach(markIfNear)
      if (rowIndex > 0) {
        rows[rowIndex - 1].symbols.forEach(markIfNear)
      }
    }

    const handleSymbol = (char, col) => {
      const symbol = {col, char}
      symbols.push(symbol)

      const markIfNear = (number) => {
        const {start, end} = number
        if (col >= start - 1 && col <= end + 1) {
          number.nearSymbol = true
        }
      }
      numbers.forEach(markIfNear)
      if (rowIndex > 0) {
        rows[rowIndex - 1].numbers.forEach(markIfNear)
      }
    }

    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (isDigit(char)) {
        handleDigit(char, i)
        continue
      } else {
        handleNonDigit(i)
      }
      if (isSymbol(char)) {
        handleSymbol(char, i)
      }
    } 
    handleNonDigit(line.length) // treat end of line as a non digit
    rows.push({numbers, symbols})
  })

  return rows
}

const part1 = (input) => {
  const rows = parseInput(input)
  const markedNumbers = []
  rows.forEach(({numbers}) => {
    numbers.forEach(({number, nearSymbol}) => {
      if (nearSymbol) {
        markedNumbers.push(number)
      }
    })
  })
  return sum(markedNumbers)
}

const getAdjacentNumbers = (rows, rowIndex, colIndex) => {
  const adjacent = []
  const startRow = Math.max(0, rowIndex - 1)
  const endRow = Math.min(rows.length - 1, rowIndex + 1)
  for (let i = startRow; i <= endRow; i++) {
    rows[i].numbers.forEach((number) => {
      if (colIndex >= number.start - 1 && colIndex <= number.end + 1) {
        adjacent.push(number.number)
      }
    })
  }
  return adjacent
}

const part2 = (input) => {
  const rows = parseInput(input)
  const gearRatios = []
  rows.forEach(({symbols}, rowIndex) => {
    symbols.forEach(({char, col}) => {
      if (char === "*") {
        const adjacentNumbers = getAdjacentNumbers(rows, rowIndex, col)
        if (adjacentNumbers.length === 2) {
          const [n1, n2] = adjacentNumbers
          gearRatios.push(n1 * n2)
        }
      }
    })
  })
  return sum(gearRatios)
}

await runner.testOutput('day03/example', '1', part1)
// await runner.printOutput('day03/test', part1)
// await runner.copyOutput('day03/test', part1)
// await runner.writeOutput('day03/test', '1', part1)
await runner.testOutput('day03/test', '1', part1)

await runner.testOutput('day03/example', '2', part2)
// await runner.printOutput('day03/test', part2)
// await runner.copyOutput('day03/test', part2)
// await runner.writeOutput('day03/test', '2', part2)
await runner.testOutput('day03/test', '2', part2)
