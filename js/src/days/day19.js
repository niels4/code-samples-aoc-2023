import * as runner from "../lib/runner.js"

console.log("Solving AoC 2023 day 19")

const parseInput = (input) => {
  const [workflowLines, ratingLines] = input.split('\n\n')
  const workflows = new Map()
  workflowLines.split("\n").forEach((line) => {
    const rulesStart = line.indexOf('{')
    const name = line.substring(0, rulesStart)
    const rulesLine = line.substring(rulesStart + 1, line.length - 1)
    const rules = rulesLine.split(",").map((ruleStr) => {
      const valueSeparatorIndex = ruleStr.indexOf(":")
      if (valueSeparatorIndex < 0) {
        return {nextState: ruleStr, prop: null}
      }

      const prop = ruleStr[0]
      const compare = ruleStr[1]
      const value = Number(ruleStr.substring(2, valueSeparatorIndex))
      const nextState = ruleStr.substring(valueSeparatorIndex + 1, ruleStr.length)
      return {prop, compare, value, nextState}
    })

    workflows.set(name, rules)
  })

  const ratings = ratingLines.split("\n").map((line) => {
    const propValuesPairs = line.substring(1, line.length - 1).split(",")
    const rating = {}
    propValuesPairs.forEach((propValuePair) => {
      const [prop, value] = propValuePair.split("=")
      rating[prop] = Number(value)
    })
    return rating
  })

  return {workflows, ratings}
}

const isPartAcceptable = (rating) => {
  
}

const part1 = (input) => {
  const {workflows, ratings} = parseInput(input)
  inspect(workflows)
  console.log("ratings", ratings)
  return 0
}

// const part2 = (input) => {
//   return 0
// }

await runner.testOutput('day19/example', '1', part1)
// await runner.printOutput('day19/test', part1)
// await runner.copyOutput('day19/test', part1)
// await runner.writeOutput('day19/test', '1', part1)
// await runner.testOutput('day19/test', '1', part1)

// await runner.testOutput('day19/example', '2', part2)
// await runner.printOutput('day19/test', part2)
// await runner.copyOutput('day19/test', part2)
// await runner.writeOutput('day19/test', '2', part2)
// await runner.testOutput('day19/test', '2', part2)
