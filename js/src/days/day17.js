import { UniqueHeap } from "../lib/data-structures/UniqueHeap.js"
import * as runner from "../lib/runner.js"

console.log("Solving AoC 2023 day 17")

const blockCompare = (l, r) => l.totalLoss < r.totalLoss

const parseInput = (input) => {
  const lines = input.split('\n')

  const rows = lines.map((line, row) => {
    return [...line].map((digit, col) => {
      const loss = Number(digit)
      const block = {loss, col, row, totalLoss: Infinity, from: null}
      return block
    })
  })

  return rows
}

const updateTotalLoss = (block, totalLoss) => {
  const updatedBlock = {...block, totalLoss}
  return updatedBlock
}

const isValidIndex = (arrayLength, index) => (index >= 0) && (index < arrayLength)

const getDirectionChar = (block, fromBlock) => {
  fromBlock = fromBlock || block.from
  if (!fromBlock) { return "*" }
  const rowOffset = block.row - fromBlock.row
  const colOffset = block.col - fromBlock.col
  if (rowOffset === 0) {
    return colOffset === -1 ? "<" : ">"
  }
  if (colOffset === 0) {
    return rowOffset === -1 ? "^" : "v"
  }
}

const maxMovementInOneDirection = 100

const canMoveToBlock = (currentBlock, nextBlock) => {
  const direction = getDirectionChar(nextBlock, currentBlock)
  let directionCount = 1
  while (currentBlock.from) {
    const prevBlock = currentBlock.from
    const prevDirection = getDirectionChar(currentBlock, prevBlock)
    if (prevDirection !== direction) { return true }
    directionCount++
    if (directionCount > maxMovementInOneDirection) {
      console.log("returning false here", directionCount)
      return false
    }
    currentBlock = currentBlock.from
  }
  return true
}

const neighborOffsets = [
  [0, -1], // up
  [0, 1], // down
  [-1, 0], // left
  [1, 0], // right
]

const getNeighbors = (rows, blocksToVisit, block) => {
  const neighbors = []

  const numRows = rows.length
  const numCols = rows[0].length

  for (const [colOffset, rowOffset] of neighborOffsets) {
    const nextRow = block.row + rowOffset
    const nextCol = block.col + colOffset
    if (!isValidIndex(numRows, nextRow) || !isValidIndex(numCols, nextCol)) { continue }
    const nextBlock = rows[nextRow][nextCol]
    if (!canMoveToBlock(block, nextBlock)) { continue }
    neighbors.push(nextBlock)
  }

  return neighbors
}

const getPathString = (rows, endBlock) => {
  const pathArray = rows.map((row) => row.map(({loss}) => loss))

  let currentBlock = endBlock
  while (currentBlock.from) {
    const directionChar = getDirectionChar(currentBlock)
    pathArray[currentBlock.row][currentBlock.col] = directionChar
    currentBlock = currentBlock.from
  }
  pathArray[0][0] = "*"

  return pathArray.map(row => row.join('')).join('\n')
}

const part1 = (input) => {
  const rows = parseInput(input)

  const seen = new Set()
  const blocksToVisit = new UniqueHeap(blockCompare)

  const startBlock = rows[0][0]
  startBlock.totalLoss = 0
  blocksToVisit.push(startBlock)

  const updatedRows = rows.map(() => [])

  while (blocksToVisit.size() > 0) {
    const currentBlock = blocksToVisit.pop()
    updatedRows[currentBlock.row][currentBlock.col] = currentBlock

    const nextBlocks = getNeighbors(rows, blocksToVisit, currentBlock)
    for (const nextBlock of nextBlocks) {
      const nextTotalLost = currentBlock.totalLoss + nextBlock.loss
      if (nextTotalLost < nextBlock.totalLoss) {
        nextBlock.from = currentBlock
        nextBlock.totalLoss = nextTotalLost
        blocksToVisit.push(nextBlock)
      }
    }
  }

  const endBlock = updatedRows.at(-1).at(-1)

  // inspect(updatedRows)
  console.log(getPathString(updatedRows, endBlock))

  return endBlock.totalLoss
}

// const part2 = (input) => {
//   return 0
// }

await runner.testOutput('day17/example', '1', part1)
// await runner.printOutput('day17/test', part1)
// await runner.copyOutput('day17/test', part1)
// await runner.writeOutput('day17/test', '1', part1)
// await runner.testOutput('day17/test', '1', part1)

// await runner.testOutput('day17/example', '2', part2)
// await runner.printOutput('day17/test', part2)
// await runner.copyOutput('day17/test', part2)
// await runner.writeOutput('day17/test', '2', part2)
// await runner.testOutput('day17/test', '2', part2)
