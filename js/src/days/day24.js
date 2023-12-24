import * as runner from "../lib/runner.js"

console.log("Solving AoC 2023 day 24")

const parseInput = (input) => {
  const lines = input.split('\n')
  return lines.map((line) => {
    const [posStr, velStr] = line.split(" @ ")
    const [px, py, pz] = posStr.split(", ").map(d => Number(d))
    const [vx, vy, vz] = velStr.split(", ").map(d => Number(d))
    const position = {x: px, y: py, z: pz}
    const velocity = {x: vx, y: vy, z: vz}
    return {position, velocity}
  })
}

const getSlopeIntercept = ({position, velocity}) => {
  const slope = velocity.y / velocity.x
  const intercept = position.y - position.x * slope
  return {slope, intercept}
}

const getIntersection = (stone1, stone2) => {
  const si1 = getSlopeIntercept(stone1)
  const si2 = getSlopeIntercept(stone2)
  const m = si2.slope - si1.slope
  const b = si1.intercept - si2.intercept
  const x = b / m
  const y = si1.slope * x + si1.intercept
  return {x, y}
}

const part1 = (input) => {
  const stones = parseInput(input)
  inspect(stones)

  const s1 = stones[0]
  const s2 = stones[1]

  const intersection = getIntersection(s1, s2)
  console.log("intersection", intersection)

  return 0
}

// const part2 = (input) => {
//   return 0
// }

await runner.testOutput('day24/example', '1', part1)
// await runner.printOutput('day24/test', part1)
// await runner.copyOutput('day24/test', part1)
// await runner.writeOutput('day24/test', '1', part1)
// await runner.testOutput('day24/test', '1', part1)

// await runner.testOutput('day24/example', '2', part2)
// await runner.printOutput('day24/test', part2)
// await runner.copyOutput('day24/test', part2)
// await runner.writeOutput('day24/test', '2', part2)
// await runner.testOutput('day24/test', '2', part2)
