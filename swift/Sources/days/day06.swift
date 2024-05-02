import Foundation

private func readNumberList(from line: Substring) -> [Int] {
    line.split(separator: " ").compactMap { Int($0) }
}

private func parseInput(_ input: String) -> (times: [Int], distances: [Int]) {
    let lines = input.split(separator: "\n")
    let timesLine = lines[0].split(separator: ":")[1]
    let distancesLine = lines[1].split(separator: ":")[1]
    let times = readNumberList(from: timesLine)
    let distances = readNumberList(from: distancesLine)
    return (times, distances)
}

// Function to calculate the number of ways to win based on given times and distances
private func solveProblem(_ input: String) -> Int {
    let (times, distances) = parseInput(input)
    let numWaysToWinList = zip(times, distances).map { time, distance -> Int in
        let halfTime = Double(time) / 2.0
        let sqrtComponent = sqrt(halfTime * halfTime - Double(distance))
        let minPush = halfTime - sqrtComponent
        let maxPush = halfTime + sqrtComponent
        let floorMin = Int(floor(minPush))
        let ceilMax = Int(ceil(maxPush))
        var numWays = time - 1 // the last time push value will never win
        numWays -= floorMin // subtract the low push values that won't win
        numWays -= (time - ceilMax) // subtract the high push values that won't win
        return numWays
    }
    return numWaysToWinList.reduce(1, *)
}

private func part1(_ input: String) -> String {
    let result = solveProblem(input)
    return String(result)
}

private func part2(_ input: String) -> String {
    let fixedInput = input.replacingOccurrences(of: " ", with: "")
    let result = solveProblem(fixedInput)
    return String(result)
}

func day06(dayKey: String) throws {
    try testAocOutput(dayKey: dayKey, inputName: "example", partKey: "1", partSolver: part1)
    try testAocOutput(dayKey: dayKey, inputName: "test", partKey: "1", partSolver: part1)

    try testAocOutput(dayKey: dayKey, inputName: "example", partKey: "2", partSolver: part2)
    try testAocOutput(dayKey: dayKey, inputName: "test", partKey: "2", partSolver: part2)
}
