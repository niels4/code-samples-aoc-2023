import * as runner from "../lib/runner.js"

console.log("Solving AoC 2023 day 03")

const zeroCode = ("0").codePointAt(0)
const nineCode = ("9").codePointAt(0)

const isDigit = (char) => {
  const code = char.codePointAt(0)
  return code >= zeroCode && code <= nineCode
}

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
      if (numberStart != null) {
        numbers.push({
          start: numberStart,
          end: i,
          number: Number(numberChars),
          nearSymbol: false
        })
        numberStart = null
        numberChars = ""
      }
    }

    const handleSymbol = (char, col) => {
      symbols.push({ col, char })

      const markIfNear = (number) => {
        const {start, end} = number
        if (col >= start && col <= end) {
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
      } else if (isSymbol(char)) {
        handleNonDigit(i)
        handleSymbol(char, i)
      } else {
        handleNonDigit(i)
      }
    } 
    rows.push({numbers, symbols})
  })

  return rows
}

const part1 = (input) => {
  const rows = parseInput(input)
  console.log("got rows")
  global.inspect(rows)
  return 0
}

// const part2 = (input) => {
//   return 0
// }

await runner.testOutput('day03/example', '1', part1)
// await runner.printOutput('day03/test', part1)
// await runner.copyOutput('day03/test', part1)
// await runner.writeOutput('day03/test', '1', part1)
// await runner.testOutput('day03/test', '1', part1)

// await runner.testOutput('day03/example', '2', part2)
// await runner.printOutput('day03/test', part2)
// await runner.copyOutput('day03/test', part2)
// await runner.writeOutput('day03/test', '2', part2)
// await runner.testOutput('day03/test', '2', part2)
