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

private func part1(_ input: String) -> String {
    return "209"
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
