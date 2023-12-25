import * as runner from "../lib/runner.js"
import nerdamer from "nerdamer"
import "nerdamer/Solve.js"

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

const variables = ['x', 'y', 'z', 'i', 'j', 'k']

const equationSolutions = {
  example: {
    url: `https://quickmath.com/webMathematica3/quickmath/equations/solve/advanced.jsp#c=solve_solveequationsadvanced&v1=%2528x%2520-%252019%2529%2520*%2520%25281%2520-%2520j%2529%2520-%2520%2528y%2520-%252013%2529%2520*%2520%2528-2%2520-%2520i%2529%2520%253D%25200%250A%2528y%2520-%252013%2529%2520*%2520%2528-2%2520-%2520k%2529%2520-%2520%2528z%2520-%252030%2529%2520*%2520%25281%2520-%2520j%2529%2520%253D%25200%250A%2528x%2520-%252018%2529%2520*%2520%2528-1%2520-%2520j%2529%2520-%2520%2528y%2520-%252019%2529%2520*%2520%2528-1%2520-%2520i%2529%2520%253D%25200%250A%2528y%2520-%252019%2529%2520*%2520%2528-2%2520-%2520k%2529%2520-%2520%2528z%2520-%252022%2529%2520*%2520%2528-1%2520-%2520j%2529%2520%253D%25200%250A%2528x%2520-%252020%2529%2520*%2520%2528-2%2520-%2520j%2529%2520-%2520%2528y%2520-%252025%2529%2520*%2520%2528-2%2520-%2520i%2529%2520%253D%25200%250A%2528y%2520-%252025%2529%2520*%2520%2528-4%2520-%2520k%2529%2520-%2520%2528z%2520-%252034%2529%2520*%2520%2528-2%2520-%2520j%2529%2520%253D%25200%250A&v2=x%250Ay%250Az%250Ai%250Aj%250Ak%250A`,
    solution: {x: 24, y: 13, z: 10, i: -3, j: 1, k: 2}
  }
}

const part2 = (equationSolutionKey) => (input) => {
  const stones = parseInput(input)

  const equations = []
  for (let i = 0; i < 3; i++) {
    const {position: p, velocity: v} = stones[i]
    const equation1 = `(x - ${p.x}) * (${v.y} - j) - (y - ${p.y}) * (${v.x} - i) = 0`
    const equation2 = `(y - ${p.y}) * (${v.z} - k) - (z - ${p.z}) * (${v.y} - j) = 0`
    equations.push(equation1)
    equations.push(equation2)
  }

  console.log("equations:")
  console.log(equations.join('\n'))
  console.log("variables:")
  console.log(variables.join('\n'))
  console.log()

  // After getting our system of equations, we can plug it into this equation solver to get the following result
  const {url, solution} = equationSolutions[equationSolutionKey]
  console.log("equation solver url:")
  console.log(url)
  console.log("solution:")
  console.log(solution)

  const {x, y, z} = solution
  const result = x + y + z

  return result
}

await runner.testOutput('day24/example', '1', part1(7, 27))
// await runner.printOutput('day24/test', part1(200000000000000, 400000000000000))
// await runner.copyOutput('day24/test', part1(200000000000000, 400000000000000))
// await runner.writeOutput('day24/test', '1', part1(200000000000000, 400000000000000))
await runner.testOutput('day24/test', '1', part1(200000000000000, 400000000000000))

await runner.testOutput('day24/example', '2', part2("example"))
// await runner.printOutput('day24/test', part2("test"))
// await runner.copyOutput('day24/test', part2)
// await runner.writeOutput('day24/test', '2', part2)
// await runner.testOutput('day24/test', '2', part2)
