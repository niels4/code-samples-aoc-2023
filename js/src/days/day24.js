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

const getIntersectionTime = (stone, x) => {
  return (x - stone.position.x) / stone.velocity.x
}

const getIntersection = (stoneA, stoneB) => {
  const si1 = getSlopeIntercept(stoneA)
  const si2 = getSlopeIntercept(stoneB)
  const m = si2.slope - si1.slope
  const b = si1.intercept - si2.intercept
  const x = b / m
  const y = si1.slope * x + si1.intercept
  const timeA = getIntersectionTime(stoneA, x)
  const timeB = getIntersectionTime(stoneB, x)
  return {x, y, timeA, timeB}
}

const part1 = (windowMin, windowMax) => (input) => {
  const stones = parseInput(input)

  const intersections = []
  stones.forEach((stoneA, stoneAIndex) => {
    for (let stoneBIndex = stoneAIndex + 1; stoneBIndex < stones.length; stoneBIndex++) {
      const stoneB = stones[stoneBIndex]
      intersections.push(getIntersection(stoneA, stoneB))
    }
  })

  const futureIntersectionsInWindow = intersections.filter(({x, y, timeA, timeB}) => {
    return x >= windowMin && x <= windowMax &&
           y >= windowMin && y <= windowMax &&
           timeA > 0 && timeB > 0
  })
  
  return futureIntersectionsInWindow.length
}

// const part2 = (input) => {
//   return 0
// }

await runner.testOutput('day24/example', '1', part1(7, 27))
// await runner.printOutput('day24/test', part1(200000000000000, 400000000000000))
// await runner.copyOutput('day24/test', part1(200000000000000, 400000000000000))
// await runner.writeOutput('day24/test', '1', part1(200000000000000, 400000000000000))
await runner.testOutput('day24/test', '1', part1(200000000000000, 400000000000000))

// await runner.testOutput('day24/example', '2', part2)
// await runner.printOutput('day24/test', part2)
// await runner.copyOutput('day24/test', part2)
// await runner.writeOutput('day24/test', '2', part2)
// await runner.testOutput('day24/test', '2', part2)
