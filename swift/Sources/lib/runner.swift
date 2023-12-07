import Foundation

private let red = "\u{001B}[31m"
private let green = "\u{001B}[32m"
private let bold = "\u{001B}[1m"
private let reset = "\u{001B}[0m"
private let checkmark = "✓"
private let cross = "✗"

private enum FileReadError: Error {
    case unableToRead
}

private func readFile(_ relativePath: String) throws -> String {
    let fileManager = FileManager.default
    let currentDirectoryPath = fileManager.currentDirectoryPath
    let fileURL = URL(fileURLWithPath: currentDirectoryPath).appendingPathComponent(relativePath)

    do {
        return try String(contentsOf: fileURL, encoding: .utf8)
    } catch {
        throw FileReadError.unableToRead
    }
}

typealias AocDayRunner = (String) throws -> Void

typealias AocPartSolver = (String) throws -> String

func testAocOutput(dayKey: String, inputName: String, partKey: String, partSolver: AocPartSolver) throws {
    let inputFilePath = "data/day\(dayKey)/\(inputName).input"
    let outputFilePath = "data/day\(dayKey)/\(inputName)_\(partKey).output"

    let input = try readFile(inputFilePath)
    let expectedOutput = try readFile(outputFilePath).trimmingCharacters(in: .whitespacesAndNewlines)

    let result = try partSolver(input)

    if result == expectedOutput {
        print("\(bold)\(green)\(checkmark) SUCCESS: Day \(dayKey) part \(partKey) \(inputName). Result matches expected output! (\(result))\(reset)")
    } else {
        print("\(bold)\(red)\(cross) FAIL: Day \(dayKey) part \(partKey) \(inputName). Expected \(expectedOutput) but got \(result)\(reset)")
    }
}
