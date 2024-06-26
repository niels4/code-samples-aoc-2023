import { sum } from "../lib/iterators.js"
import * as runner from "../lib/runner.js"

console.log("Solving AoC 2023 day 07")

const evaluateHandType = (cardCounts) => {
  const maxCount = Math.max.apply(null, [...cardCounts.values()])
  // 5 of a kind
  if (maxCount === 5) { return 6 }
  // 4 of a kind
  if (maxCount === 4) { return 5 }
  // full house
  if (maxCount === 3 && cardCounts.size === 2) { return 4 }
  // 3 of a kind
  if (maxCount === 3 && cardCounts.size > 2) { return 3 }
  // two pair
  if (maxCount === 2 && cardCounts.size === 3) { return 2 }
  // one pair
  if (maxCount === 2 && cardCounts.size > 3) { return 1 }
  // high card
  return 0
}

const parseInput = (input) => {
  const lines = input.split('\n')
  return lines.map((line) => {
    const [handString, bidStr] = line.split(" ")
    const bid = Number(bidStr)
    const cardCounts = new Map()
    for (const cardChar of handString) {
      const currentCount = cardCounts.get(cardChar) || 0
      cardCounts.set(cardChar, currentCount + 1)
    }
    const handType = evaluateHandType(cardCounts)
    return {handString, bid, cardCounts, handType}
  })
}

const compareHandStrengths0 = (cardStrengths) => (hand1, hand2) => {
  const typeDifference = hand1.handType - hand2.handType
  if (typeDifference !== 0) { return typeDifference }
  for (let i = 0; i < hand1.handString.length; i++) {
    const card1Strength = cardStrengths[hand1.handString[i]]
    const card2Strength = cardStrengths[hand2.handString[i]]
    if (card1Strength > card2Strength) { return 1 }
    if (card1Strength < card2Strength) { return -1 }
  }
  console.error("its a tie!", hand1.handString === hand2.handString, hand1.handString, hand2.handString)
  return 0
}

const cardStrengthsOrderPart1 = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"]
const cardStrengthsPart1 = cardStrengthsOrderPart1.reduce((acc, cardChar, i) => {
  acc[cardChar] = i
  return acc
}, {})

const compareHandStrengthsPart1 = compareHandStrengths0(cardStrengthsPart1)

const part1 = (input) => {
  const hands = parseInput(input)
  const sortedHands = hands.toSorted(compareHandStrengthsPart1)
  const winnings = sortedHands.map((hand, rankIndex) => {
    const rank = rankIndex + 1
    return hand.bid * rank
  })
  return sum(winnings)
}

const cardStrengthsOrderPart2 = ["J", "2", "3", "4", "5", "6", "7", "8", "9", "T", "Q", "K", "A"]
const cardStrengthsPart2 = cardStrengthsOrderPart2.reduce((acc, cardChar, i) => {
  acc[cardChar] = i
  return acc
}, {})

const compareHandStrengthsPart2 = compareHandStrengths0(cardStrengthsPart2)

// mutates hand cardCounts and cardType in place
const applyWildCards = (hand) => {
  const jokerCount = hand.cardCounts.get("J") || 0
  if (jokerCount === 0) { return }

  const newCounts = new Map()
  let maxCardCount = 0
  let maxCardChar = "A" // in the event of 5 jokers, we'll end up with a hand of 5 aces
  for (const [cardChar, cardCount] of hand.cardCounts) {
    if (cardChar === "J") { continue }
    newCounts.set(cardChar, cardCount)
    if (cardCount > maxCardCount) {
      maxCardCount = cardCount
      maxCardChar = cardChar
    }
  }
  newCounts.set(maxCardChar, maxCardCount + jokerCount) // add the joker count to whichever card currently has the highest count

  hand.cardCounts = newCounts
  hand.handType = evaluateHandType(newCounts)
}

const part2 = (input) => {
  const hands = parseInput(input)
  hands.forEach(applyWildCards)
  const sortedHands = hands.toSorted(compareHandStrengthsPart2)
  const winnings = sortedHands.map((hand, rankIndex) => {
    const rank = rankIndex + 1
    return hand.bid * rank
  })
  return sum(winnings)
}

await runner.testOutput('day07/example', '1', part1)
// await runner.printOutput('day07/test', part1)
// await runner.copyOutput('day07/test', part1)
// await runner.writeOutput('day07/test', '1', part1)
await runner.testOutput('day07/test', '1', part1)

await runner.testOutput('day07/example', '2', part2)
// await runner.printOutput('day07/test', part2)
// await runner.copyOutput('day07/test', part2)
// await runner.writeOutput('day07/test', '2', part2)
await runner.testOutput('day07/test', '2', part2)
