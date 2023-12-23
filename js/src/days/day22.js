import * as runner from "../lib/runner.js"

console.log("Solving AoC 2023 day 22")

const parseInput = (input) => {
  const lines = input.split('\n')
  const bricks = lines.map((line) => {
    const [dim1Str, dim2Str] = line.split("~")
    const [x1, y1, z1] = dim1Str.split(",").map(d => Number(d))
    const [x2, y2, z2] = dim2Str.split(",").map(d => Number(d))

    // check our assumptions
    // - all bricks are a 1 dimensional line of blocks
    // - the dimensions come sorted such that all the dimensions in brick 1 are less than or equal to their corresponding dimension in brick 2
    let equalDimensions = 0
    if (x1 == x2) { equalDimensions++}
    if (y1 == y2) { equalDimensions++}
    if (z1 == z2) { equalDimensions++}
    if (equalDimensions < 2) { throw new Error("not a 1 dimensional brick: " + equalDimensions) }
    if (x1 > x2) { throw new Error("x1 > x2") }
    if (y1 > y2) { throw new Error("y1 > y2") }
    if (z1 > z2) { throw new Error("z1 > z2") }

    return {x1, x2, y1, y2, z1, z2}
  })
  return bricks
}

const indexBricks = (bricks) => {
  const bricksByZIndex = new Map()
  bricks.forEach((brick) => {
    const {x1, x2, y1, y2, z1, z2} = brick
    const minZ = Math.min(z1, z2)
    const maxZ = Math.max(z1, z2)
  })
  return bricksByZIndex
}

const part1 = (input) => {
  const bricks = parseInput(input)
  console.log("got bricks")
  console.log(bricks)
  const indexedBricks = indexBricks(bricks)
  inspect(indexedBricks)
  return 0
}

// const part2 = (input) => {
//   return 0
// }

await runner.testOutput('day22/example', '1', part1)
await runner.printOutput('day22/test', part1)
// await runner.copyOutput('day22/test', part1)
// await runner.writeOutput('day22/test', '1', part1)
// await runner.testOutput('day22/test', '1', part1)

// await runner.testOutput('day22/example', '2', part2)
// await runner.printOutput('day22/test', part2)
// await runner.copyOutput('day22/test', part2)
// await runner.writeOutput('day22/test', '2', part2)
// await runner.testOutput('day22/test', '2', part2)
