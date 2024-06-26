import { sum, reverseArray, skip } from "../lib/iterators.js"
import * as runner from "../lib/runner.js"
import { intersection } from '../lib/set.js'

console.log("Solving AoC 2023 day 04")

const readColumnedNumbers = (line, startIndex, untilChar, numberLength=2, dividerLength=1) => {
  const colWidth = numberLength + dividerLength
  const endIndex = untilChar ? line.indexOf(untilChar) - dividerLength : line.length
  const numbers = new Set()
  for (let i = startIndex; i < endIndex; i += colWidth) {
    const nextNumStr = line.substring(i, i + numberLength).trim()
    const nextNum = Number(nextNumStr)
    numbers.add(nextNum)
  }
  return numbers
}

const parseInput = (input) => {
  const lines = input.split('\n')
  const cards = lines.map((line) => {
    const winningNumbersStart = line.indexOf(":") + 2
    const winningNumbers = readColumnedNumbers(line, winningNumbersStart, "|")

    const myNumbersStart = line.indexOf("|") + 2
    const myNumbers = readColumnedNumbers(line, myNumbersStart)

    const matchedNumbers = intersection(winningNumbers, myNumbers)

    return {winningNumbers, myNumbers, matchedNumbers}
  })

  return cards
}

const getCardScore = ({matchedNumbers}) => {
  return matchedNumbers.size == 0 ? 0 : 2**(matchedNumbers.size - 1)
}

const part1 = (input) => {
  const cards = parseInput(input)
  const scores = cards.map(getCardScore)
  return sum(scores)
}

const part2 = (input) => {
  const cards = parseInput(input)
  const allCardsWon = [1]

  let curIndex = 1
  for (const card of skip(1, reverseArray(cards))) {
    let currentCardsWon = 1
    const numMatched = card.matchedNumbers.size
    for (let i = 1; i <= numMatched; i++) {
      currentCardsWon += allCardsWon[curIndex - i]
    }
    allCardsWon.push(currentCardsWon)
    curIndex++
  }

  return sum(allCardsWon)
}

await runner.testOutput('day04/example', '1', part1)
// await runner.printOutput('day04/test', part1)
// await runner.copyOutput('day04/test', part1)
// await runner.writeOutput('day04/test', '1', part1)
await runner.testOutput('day04/test', '1', part1)

await runner.testOutput('day04/example', '2', part2)
// await runner.printOutput('day04/test', part2)
// await runner.copyOutput('day04/test', part2)
// await runner.writeOutput('day04/test', '2', part2)
await runner.testOutput('day04/test', '2', part2)
