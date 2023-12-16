import * as runner from "../lib/runner.js"

console.log("Solving AoC 2023 day 16")

const parseInput = (input) => input.split('\n')

const empty = "."
const rightMirror = "/"
const leftMirror = "\\"
const verticalSplitter = "|"
const horizontalSplitter = "-"

const directions = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
}

const verticalDirections = {
  up: directions.up,
  down: directions.down
}

const horizontalDirections = {
  left: directions.left,
  right: directions.right
}

const createSquareKey = (square) => square.join(":")
const createHistoryKey = (squareKey, directionKey) => `${squareKey}:${directionKey}`

const markSquareAsVisited = (visitCount, pathHistory, square, directionKey) => {
  const squareKey = createSquareKey(square)
  const historyKey = createHistoryKey(squareKey, directionKey)
  pathHistory.add(historyKey)
  if (!visitCount.has(squareKey)) {
    visitCount.set(squareKey, 1)
    return
  }
  visitCount.set(squareKey, visitCount.get(squareKey) + 1)
}

const isValidSquare = (rows, pathHistory, square, directionKey) => {
  if (square[1] < 0 || square[1] >= rows.length ||
    square[0] < 0 || square[0] >= rows[0].length) { return false }
  const historyKey = createHistoryKey(createSquareKey(square), directionKey)
  if (pathHistory.has(historyKey)) { return false }
  return true
}

const handleHorizontalMovement = (rows, visitCount, pathHistory, nextSquare, nextSymbol, directionKey) => {
  if (nextSymbol === empty || nextSymbol === horizontalSplitter) {
    followPath0(rows, visitCount, pathHistory, nextSquare, directionKey)
    return
  }
  if (nextSymbol === verticalSplitter) {
    Object.keys(verticalDirections).forEach((nextDirectionKey) => {
      followPath0(rows, visitCount, pathHistory, nextSquare, nextDirectionKey)
    })
    return
  }
  if (nextSymbol === leftMirror) {
    if (directionKey === "right") {
      followPath0(rows, visitCount, pathHistory, nextSquare, "down")
    } else {
      followPath0(rows, visitCount, pathHistory, nextSquare, "up")
    }
    return
  }
  if (nextSymbol === rightMirror) {
    if (directionKey === "right") {
      followPath0(rows, visitCount, pathHistory, nextSquare, "up")
    } else {
      followPath0(rows, visitCount, pathHistory, nextSquare, "down")
    }
  }
}

const handleVerticalMovement = (rows, visitCount, pathHistory, nextSquare, nextSymbol, directionKey) => {
  if (nextSymbol === empty || nextSymbol === verticalSplitter) {
    followPath0(rows, visitCount, pathHistory, nextSquare, directionKey)
    return
  }
  if (nextSymbol === horizontalSplitter) {
    Object.keys(horizontalDirections).forEach((nextDirectionKey) => {
      followPath0(rows, visitCount, pathHistory, nextSquare, nextDirectionKey)
    })
    return
  }
  if (nextSymbol === leftMirror) {
    if (directionKey === "down") {
      followPath0(rows, visitCount, pathHistory, nextSquare, "right")
    } else {
      followPath0(rows, visitCount, pathHistory, nextSquare, "left")
    }
    return
  }
  if (nextSymbol === rightMirror) {
    if (directionKey === "down") {
      followPath0(rows, visitCount, pathHistory, nextSquare, "left")
    } else {
      followPath0(rows, visitCount, pathHistory, nextSquare, "right")
    }
  }
}

const printVisited = (rows, visitCount) => {
  console.log()
  const visitedRows = rows.map((row, rowIndex) => {
    return [...row].map((char, colIndex) => {
      return visitCount.has(`${colIndex}:${rowIndex}`) ? "#" : char
    }).join('')
  })
  console.log(visitedRows.join("\n"))
  console.log()
}

let loopCount = 0
const followPath0 = (rows, visitCount, pathHistory, currentSquare, directionKey) => {
  // printVisited(rows, visitCount)
  // console.log("size", visitCount.size, )
  // loopCount++
  // if (loopCount > 50) { process.exit(98)}
  const direction = directions[directionKey]
  const nextSquare = currentSquare.map((coord, i) => coord + direction[i])
  if (!isValidSquare(rows, pathHistory, nextSquare, directionKey)) { return }
  markSquareAsVisited(visitCount, pathHistory, nextSquare, directionKey)
  const nextSymbol = rows[nextSquare[1]][nextSquare[0]]
  if (horizontalDirections[directionKey]) {
    handleHorizontalMovement(rows, visitCount, pathHistory, nextSquare, nextSymbol, directionKey)
  } else {
    handleVerticalMovement(rows, visitCount, pathHistory, nextSquare, nextSymbol, directionKey)
  }
}

const followPath = (rows) => {
  const visitCount = new Map()
  const pathHistory = new Set()
  const startSquare = [-1, 0]
  const startDirecton = "right"
  followPath0(rows, visitCount, pathHistory, startSquare, startDirecton)
  return visitCount
}

const part1 = (input) => {
  const rows = parseInput(input)
  const visitCount = followPath(rows)
  // printVisited(rows, visitCount)
  return visitCount.size
}

// const part2 = (input) => {
//   return 0
// }

await runner.testOutput('day16/example', '1', part1)
// await runner.printOutput('day16/test', part1)
// await runner.copyOutput('day16/test', part1)
// await runner.writeOutput('day16/test', '1', part1)
await runner.testOutput('day16/test', '1', part1)

// await runner.testOutput('day16/example', '2', part2)
// await runner.printOutput('day16/test', part2)
// await runner.copyOutput('day16/test', part2)
// await runner.writeOutput('day16/test', '2', part2)
// await runner.testOutput('day16/test', '2', part2)
