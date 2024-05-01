import Foundation

private struct Card {
    var winningNumbers: Set<Int>
    var myNumbers: Set<Int>
    var matchedNumbers: Set<Int>
}

private func parseInput(input: String) -> [Card] {
    let lines = input.split(separator: "\n")
    return lines.map { line in
        let lineStr = String(line)

        let colonIndex = lineStr.firstIndex(of: ":")!
        let pipeIndex = lineStr.firstIndex(of: "|")!

        let winningNumbersStart = lineStr.index(colonIndex, offsetBy: 2)
        let winningNumbersEnd = lineStr.index(pipeIndex, offsetBy: -1)

        let winningNumbersList = lineStr[winningNumbersStart ... winningNumbersEnd]
            .split(separator: " ")
            .compactMap { Int($0.trimmingCharacters(in: .whitespacesAndNewlines)) }

        let myNumbersStart = lineStr.index(pipeIndex, offsetBy: 2)

        let myNumbersList = lineStr[myNumbersStart...]
            .split(separator: " ")
            .compactMap { Int($0.trimmingCharacters(in: .whitespacesAndNewlines)) }

        let winningNumbers = Set(winningNumbersList)
        let myNumbers = Set(myNumbersList)
        let matchedNumbers = winningNumbers.intersection(myNumbers)
        return Card(winningNumbers: winningNumbers, myNumbers: myNumbers, matchedNumbers: matchedNumbers)
    }
}

private func getCardScore(matchedNumbers: Set<Int>) -> Int {
    matchedNumbers.isEmpty ? 0 : Int(pow(2.0, Double(matchedNumbers.count - 1)))
}

private func part1(input: String) throws -> String {
    let cards = parseInput(input: input)
    let scores = cards.map { getCardScore(matchedNumbers: $0.matchedNumbers) }
    let result = scores.reduce(0, +)
    return String(result)
}

private func part2(input: String) throws -> String {
    let cards = parseInput(input: input).reversed().dropFirst()
    var allCardsWon = [1]

    var curIndex = 1
    for card in cards {
        var currentCardsWon = 1
        for i in stride(from: 1, through: card.matchedNumbers.count, by: 1) {
            currentCardsWon += allCardsWon[curIndex - i]
        }
        allCardsWon.append(currentCardsWon)
        curIndex += 1
    }

    let result = allCardsWon.reduce(0, +)
    return String(result)
}

func day04(dayKey: String) throws {
    try testAocOutput(dayKey: dayKey, inputName: "example", partKey: "1", partSolver: part1)
    try testAocOutput(dayKey: dayKey, inputName: "test", partKey: "1", partSolver: part1)

    try testAocOutput(dayKey: dayKey, inputName: "example", partKey: "2", partSolver: part2)
    try testAocOutput(dayKey: dayKey, inputName: "test", partKey: "2", partSolver: part2)
}
