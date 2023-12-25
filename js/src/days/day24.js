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

const variables = ['x', 'y', 'z', 'i', 'j', 'k']

const getSymbolLine = () => `${variables.join(", ")} = symbols('${variables.join(" ")}')`

const getEquationLine = equation => `equations.append(${equation})`

const sympyShellUrl = "https://live.sympy.org/"
const equationSolutions = {
  example: {
    solution: {x: 24, y: 13, z: 10, i: -3, j: 1, k: 2}
  },
  test: {
    solution: {x: 192863257090212, y: 406543399029824, z: 181983899642349, i: 150, j: -227, k: 216}
  }
}

const part2 = (equationSolutionKey) => (input) => {
  const stones = parseInput(input)

  const equations = []
  for (let i = 0; i < 3; i++) {
    const {position: p, velocity: v} = stones[i]
    const equation1 = `(x - ${p.x}) * (${v.y} - j) - (y - ${p.y}) * (${v.x} - i)`
    const equation2 = `(y - ${p.y}) * (${v.z} - k) - (z - ${p.z}) * (${v.y} - j)`
    equations.push(equation1)
    equations.push(equation2)
  }

  console.log("symbols:")
  console.log(getSymbolLine())
  console.log("equations:")
  console.log(equations.map(getEquationLine).join('\n'))
  console.log()

  // After getting our system of equations, we can plug it into this sympy shell and get our solution
  const {solution} = equationSolutions[equationSolutionKey]
  console.log("sympy shell url:")
  console.log(sympyShellUrl)
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
// await runner.copyOutput('day24/test', part2("test"))
// await runner.writeOutput('day24/test', '2', part2("test"))
await runner.testOutput('day24/test', '2', part2("test"))
