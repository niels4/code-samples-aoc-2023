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

const markSquareAsVisited = (squaresVisited, square) => {
  const key = square.join(":")
  if (!squaresVisited.has(key)) {
    squaresVisited.set(key, 1)
    return
  }
  squaresVisited.set(key, squaresVisited.get(key) + 1)
}
const createSquareKey = (square) => square.join(":")

const isValidSquare = (rows, squaresVisited, square) => {
  if (square[1] < 0 || square[1] >= rows.length ||
    square[0] < 0 || square[0] >= rows[0].length) { return false }
  const nextSymbol = rows[square[1]][square[0]]
  const visitCount = squaresVisited.get(createSquareKey(square))
  if (nextSymbol !== empty && visitCount != null && visitCount > 1) { return false }
  return true
}

const handleHorizontalMovement = (rows, squaresVisited, nextSquare, nextSymbol, directionKey) => {
  if (nextSymbol === empty || nextSymbol === horizontalSplitter) {
    followPath0(rows, squaresVisited, nextSquare, directionKey)
    return
  }
  if (nextSymbol === verticalSplitter) {
    Object.keys(verticalDirections).forEach((nextDirectionKey) => {
      followPath0(rows, squaresVisited, nextSquare, nextDirectionKey)
    })
    return
  }
  if (nextSymbol === leftMirror) {
    if (directionKey === "right") {
      followPath0(rows, squaresVisited, nextSquare, "down")
    } else {
      followPath0(rows, squaresVisited, nextSquare, "up")
    }
    return
  }
  if (nextSymbol === rightMirror) {
    if (directionKey === "right") {
      followPath0(rows, squaresVisited, nextSquare, "up")
    } else {
      followPath0(rows, squaresVisited, nextSquare, "down")
    }
  }
}

const handleVerticalMovement = (rows, squaresVisited, nextSquare, nextSymbol, directionKey) => {
  if (nextSymbol === empty || nextSymbol === verticalSplitter) {
    followPath0(rows, squaresVisited, nextSquare, directionKey)
    return
  }
  if (nextSymbol === horizontalSplitter) {
    Object.keys(horizontalDirections).forEach((nextDirectionKey) => {
      followPath0(rows, squaresVisited, nextSquare, nextDirectionKey)
    })
    return
  }
  if (nextSymbol === leftMirror) {
    if (directionKey === "down") {
      followPath0(rows, squaresVisited, nextSquare, "right")
    } else {
      followPath0(rows, squaresVisited, nextSquare, "left")
    }
    return
  }
  if (nextSymbol === rightMirror) {
    if (directionKey === "down") {
      followPath0(rows, squaresVisited, nextSquare, "left")
    } else {
      followPath0(rows, squaresVisited, nextSquare, "right")
    }
  }
}

const printVisited = (rows, squaresVisited) => {
  console.log()
  const visitedRows = rows.map((row, rowIndex) => {
    return [...row].map((char, colIndex) => {
      return squaresVisited.has(`${colIndex}:${rowIndex}`) ? "#" : char
    }).join('')
  })
  console.log(visitedRows.join("\n"))
  console.log()
}

let followCount = 0
const followPath0 = (rows, squaresVisited, currentSquare, directionKey) => {
  followCount++
  if (followCount > 89) {
    process.exit(98)
  }
  printVisited(rows, squaresVisited)
  console.log("size", squaresVisited.size)
  const direction = directions[directionKey]
  const nextSquare = currentSquare.map((coord, i) => coord + direction[i])
  if (!isValidSquare(rows, squaresVisited, nextSquare)) { return }
  markSquareAsVisited(squaresVisited, nextSquare)
  const nextSymbol = rows[nextSquare[1]][nextSquare[0]]
  if (horizontalDirections[directionKey]) {
    handleHorizontalMovement(rows, squaresVisited, nextSquare, nextSymbol, directionKey)
  } else {
    handleVerticalMovement(rows, squaresVisited, nextSquare, nextSymbol, directionKey)
  }
}

const followPath = (rows) => {
  const squaresVisited = new Map()
  const startSquare = [0, 0]
  markSquareAsVisited(squaresVisited, startSquare)
  followPath0(rows, squaresVisited, startSquare, "right")
  return squaresVisited
}

const part1 = (input) => {
  const rows = parseInput(input)
  const squaresVisited = followPath(rows)
  return squaresVisited.size
}

// const part2 = (input) => {
//   return 0
// }

await runner.testOutput('day16/example', '1', part1)
// await runner.printOutput('day16/test', part1)
// await runner.copyOutput('day16/test', part1)
// await runner.writeOutput('day16/test', '1', part1)
// await runner.testOutput('day16/test', '1', part1)

// await runner.testOutput('day16/example', '2', part2)
// await runner.printOutput('day16/test', part2)
// await runner.copyOutput('day16/test', part2)
// await runner.writeOutput('day16/test', '2', part2)
// await runner.testOutput('day16/test', '2', part2)
