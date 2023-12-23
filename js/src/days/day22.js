import * as runner from "../lib/runner.js"
import { difference } from "../lib/set.js"

console.log("Solving AoC 2023 day 22")

const parseInput = (input) => {
  const lines = input.split('\n')
  const bricks = lines.map((line, brickId) => {
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

    return {brickId, x1, x2, y1, y2, z1, z2, collisions: new Set()}
  })

  return bricks
}

const bottomZ = 1

const sortByZ = (l, r) => l.z1 - r.z1

const getZSet = (zMap, zIndex) => {
  let zSet = zMap.get(zIndex)
  if (!zSet) {
    zSet = new Set()
    zMap.set(zIndex, zSet)
  }
  return zSet
}

const willBricksCollide = (b1, b2) => {
  if (b1.x1 > b2.x2) { return false }
  if (b1.x2 < b2.x1) { return false }
  if (b1.y1 > b2.y2) { return false }
  if (b1.y2 < b2.y1) { return false }
  return true
}

const moveBrickDown = (zMap, brick) => {
  const oldTopZSet = getZSet(zMap, brick.z2)
  oldTopZSet.delete(brick)
  brick.z2 -= 1
  brick.z1 -= 1
  const newBottomZSet = getZSet(zMap, brick.z1)
  newBottomZSet.add(brick)
}

const letBrickFall = (zMap, criticalBricks, brick) => {
  for (let z = brick.z1; z <= brick.z2; z++) {
    let zSet = getZSet(zMap, z)
    zSet.add(brick)
  }

  while (brick.z1 !== bottomZ && brick.collisions.size === 0) {
    const nextZ = brick.z1 - 1
    const nextBricks = zMap.get(nextZ) || []
    for (const nextBrick of nextBricks) {
      if (willBricksCollide(brick, nextBrick)) {
        brick.collisions.add(nextBrick)
      }
    }

    if (brick.collisions.size === 1) {
      criticalBricks.add(brick.collisions.values().next().value)
    } else if (brick.collisions.size === 0) {
      moveBrickDown(zMap, brick)
    }
  }
}

// let all bricks fall, return a mapping of critical bricks to the bricks they support
const settleAllBricks = (bricks) => {
  const sortedBricks = bricks.toSorted(sortByZ)
  const zMap = new Map()
  const criticalBricks = new Set()

  sortedBricks.forEach((brick) => {
    letBrickFall(zMap, criticalBricks, brick)
  })

  return {criticalBricks, zMap}
}

const part1 = (input) => {
  const bricks = parseInput(input)
  const {criticalBricks} = settleAllBricks(bricks)
  const result = bricks.length - criticalBricks.size
  return result
}

const countChainReaction = (zMap, brick) => {
  const fallenBricks = new Set()
  fallenBricks.add(brick)

  const seen = new Set()
  let aboveZ = brick.z2 + 1
  let nextBrickLevel = zMap.get(aboveZ)
  while (nextBrickLevel && nextBrickLevel.size > 0) {
    for (const nextBrick of nextBrickLevel) {
      if (seen.has(nextBrick)) { continue }
      seen.add(nextBrick)
      const remainingSupports = difference(nextBrick.collisions, fallenBricks)
      if (nextBrick.z1 !== bottomZ && remainingSupports.size === 0) {
        fallenBricks.add(nextBrick)
      }
    }
    aboveZ++
    nextBrickLevel = zMap.get(aboveZ)
  }

  return fallenBricks.size - 1 // don't count the original brick itself as a fallen brick
}

const countAllChainReactions = (zMap) => {
  // start at the bottom and work our way up
  let z = bottomZ
  let count = 0
  const seen = new Set()
  let nextBrickLevel = zMap.get(z)
  while (nextBrickLevel && nextBrickLevel.size > 0) {
    for (const nextBrick of nextBrickLevel) {
      if (seen.has(nextBrick)) { continue }
      count += countChainReaction(zMap, nextBrick)
      seen.add(nextBrick)
    }
    z++
    nextBrickLevel = zMap.get(z)
  }

  return count
}

const part2 = (input) => {
  const bricks = parseInput(input)
  const {zMap} = settleAllBricks(bricks)
  const result = countAllChainReactions(zMap)
  return result
}

await runner.testOutput('day22/example', '1', part1)
// await runner.printOutput('day22/test', part1)
// await runner.copyOutput('day22/test', part1)
// await runner.writeOutput('day22/test', '1', part1)
await runner.testOutput('day22/test', '1', part1)

await runner.testOutput('day22/example', '2', part2)
// await runner.printOutput('day22/test', part2)
// await runner.copyOutput('day22/test', part2)
// await runner.writeOutput('day22/test', '2', part2)
await runner.testOutput('day22/test', '2', part2) // 80968 is too high
