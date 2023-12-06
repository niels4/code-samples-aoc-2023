import Foundation

private func findFirstAndLastDigit(in string: String) -> Int {
    let digits = string.filter { $0.isNumber }

    guard let firstDigit = digits.first,
          let lastDigit = digits.count > 1 ? digits.last : firstDigit,
          let number = Int(String(firstDigit) + String(lastDigit)) else {
        return 0  // Return 0 if no digits or conversion fails
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

private func part2(_ input: String) -> String {
    let firstDigitRegex = try! NSRegularExpression(pattern: "(\\d|one|two|three|four|five|six|seven|eight|nine)")
    let lastDigitRegex = try! NSRegularExpression(pattern: "(\\d|one|two|three|four|five|six|seven|eight|nine).*(\\d|one|two|three|four|five|six|seven|eight|nine)")

    let wordMap: [String: String] = [
        "one": "1", "two": "2", "three": "3", "four": "4", "five": "5",
        "six": "6", "seven": "7", "eight": "8", "nine": "9"
    ]

    let lines = input.split(separator: "\n")
    let numbers = lines.map { line -> Int in
        let lineString = String(line)
        
        guard let firstMatch = firstDigitRegex.firstMatch(in: lineString, range: NSRange(lineString.startIndex..., in: lineString)),
              let range1 = Range(firstMatch.range(at: 1), in: lineString) else {
            return 0
        }

        let firstDigit = String(lineString[range1])
        let mappedFirstDigit = wordMap[firstDigit] ?? firstDigit

        var mappedLastDigit = mappedFirstDigit
        if let lastMatch = lastDigitRegex.firstMatch(in: lineString, range: NSRange(lineString.startIndex..., in: lineString)),
           let range2 = Range(lastMatch.range(at: 2), in: lineString) {
            let lastDigit = String(lineString[range2])
            mappedLastDigit = wordMap[lastDigit] ?? lastDigit
        }

        return Int(mappedFirstDigit + mappedLastDigit)!
    }
    return String(numbers.reduce(0, +))
}

func day01() throws {
    let input = try readFile("data/day01/test.input")
    let expectedOutput = try readFile("data/day01/test_1.output")
    let result = part1(input)

    if result == expectedOutput {
        print("SUCCESS: part 1 Result matches expected output!")
    } else {
        print("FAIL: part 1 Expected \(expectedOutput) but got \(result)")
    }

    let expectedOutput2 = try readFile("data/day01/test_2.output")
    let result2 = part2(input)

    if result2 == expectedOutput2 {
        print("SUCCESS: part 2 Result matches expected output!")
    } else {
        print("FAIL: part 2 Expected \(expectedOutput2) but got \(result2)")
    }
}
