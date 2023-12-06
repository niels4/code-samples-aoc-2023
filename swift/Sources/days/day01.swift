import Foundation

enum FileReadError: Error {
    case unableToRead
}

func readFile(_ relativePath: String) throws -> String {
    let fileManager = FileManager.default
    let currentDirectoryPath = fileManager.currentDirectoryPath
    let fileURL = URL(fileURLWithPath: currentDirectoryPath).appendingPathComponent(relativePath)

    do {
        return try String(contentsOf: fileURL, encoding: .utf8)
    } catch {
        throw FileReadError.unableToRead
    }
}

func findFirstAndLastDigit(in string: String) -> Int {
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

func day01() throws {
    let input = try readFile("data/day01/example.input")
    let expectedOutput = try readFile("data/day01/example_1.output")
    let result = part1(input)

    print("got input", input)
    if result == expectedOutput {
        print("SUCCESS: Result matches expected output!")
    } else {
        print("FAIL: Expected \(expectedOutput) but got \(result)")
    }
}
