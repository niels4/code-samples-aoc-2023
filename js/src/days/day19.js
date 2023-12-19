import { sum } from "../lib/iterators.js"
import * as runner from "../lib/runner.js"

console.log("Solving AoC 2023 day 19")

const startWorkflowName = "in"
const rejectedWorkflowName = "R"
const acceptedWorkflowName = "A"

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

  workflows.set(rejectedWorkflowName, {done: true, accepted: false})
  workflows.set(acceptedWorkflowName, {done: true, accepted: true})

  return {workflows, ratings}
}

const ratingPassesRule = (rule, rating) => {
  const {compare, prop, value} = rule
  if (compare === ">") {
    return rating[prop] > value
  } else {
    return rating[prop] < value
  }
}

const isPartAcceptable = (workflows, rating) => {
  let currentWorkflow = workflows.get(startWorkflowName)
  while (!currentWorkflow.done) {
    for (const rule of currentWorkflow) {
      if (rule.prop == null || ratingPassesRule(rule, rating)) {
        currentWorkflow = workflows.get(rule.nextState)
        break
      }
    }
  }
  return currentWorkflow.accepted
}

const getRatingScore = ({x, m, a, s}) => x + m + a + s

const part1 = (input) => {
  const {workflows, ratings} = parseInput(input)
  const acceptedRatings = ratings.filter(rating => isPartAcceptable(workflows, rating))
  const result = sum(acceptedRatings.map(getRatingScore))
  return result
}

// const part2 = (input) => {
//   return 0
// }

await runner.testOutput('day19/example', '1', part1)
// await runner.printOutput('day19/test', part1)
// await runner.copyOutput('day19/test', part1)
// await runner.writeOutput('day19/test', '1', part1)
await runner.testOutput('day19/test', '1', part1)

// await runner.testOutput('day19/example', '2', part2)
// await runner.printOutput('day19/test', part2)
// await runner.copyOutput('day19/test', part2)
// await runner.writeOutput('day19/test', '2', part2)
// await runner.testOutput('day19/test', '2', part2)
