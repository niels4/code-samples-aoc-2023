import Foundation

private let firstDigitRegex1 = /(\d)/
private let lastDigitRegex1 = /(\d)[^\d]*$/

private func findFirstAndLastDigit(in string: String) -> Int {
    guard let firstMatch = try? firstDigitRegex1.firstMatch(in: string),
          let lastMatch = try? lastDigitRegex1.firstMatch(in: string),
          let number = Int(firstMatch.1 + lastMatch.1)
        else {
        return 0
    }
    return number
}

private func part1(_ input: String) -> String {
    let lines = input.split(separator: "\n")

    let values: [Int] = lines.map { line in
        return findFirstAndLastDigit(in: String(line))
    }

    let result: Int = values.reduce(0, +)
    return String(result)
}

// can use regex builder to remove repeated code
private let firstDigitRegex2 = /(\d|one|two|three|four|five|six|seven|eight|nine)/
private let lastDigitRegex2 = /.*(\d|one|two|three|four|five|six|seven|eight|nine)/

private let wordMap: [String: String] = [
    "one": "1", "two": "2", "three": "3", "four": "4", "five": "5",
    "six": "6", "seven": "7", "eight": "8", "nine": "9"
]

private func findFirstAndLastDigitWithWords(in string: String) -> Int {
    guard let firstMatch = try? firstDigitRegex2.firstMatch(in: string),
          let lastMatch = try? lastDigitRegex2.firstMatch(in: string) else {
        return 0
    }

    let firstDigit = String(firstMatch.1)
    let mappedFirstDigit = wordMap[firstDigit] ?? firstDigit

    let lastDigit = String(lastMatch.1)
    let mappedLastDigit = wordMap[lastDigit] ?? lastDigit

    return Int(mappedFirstDigit + mappedLastDigit)!
}

private func part2(_ input: String) -> String {
    let lines = input.split(separator: "\n")

    let values = lines.map { line -> Int in
        return findFirstAndLastDigitWithWords(in: String(line))
    }

    let result: Int = values.reduce(0, +)
    return String(result)
}

func day01(dayKey: String) throws {
    try testAocOutput(dayKey: dayKey, inputName: "example", partKey: "1", partSolver: part1)
    try testAocOutput(dayKey: dayKey, inputName: "test", partKey: "1", partSolver: part1)

    try testAocOutput(dayKey: dayKey, inputName: "example", partKey: "2", partSolver: part2)
    try testAocOutput(dayKey: dayKey, inputName: "test", partKey: "2", partSolver: part2)
}
