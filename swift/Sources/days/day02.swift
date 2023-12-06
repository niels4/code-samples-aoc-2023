private let maxRed = 12
private let maxGreen = 13
private let maxBlue = 14

private let redRegex = /(\d+) red/
private let greenRegex = /(\d+) green/
private let blueRegex = /(\d+) blue/

private struct Grab {
    var red = 0
    var green = 0
    var blue = 0
}

private typealias Game = [Grab]

private func parseColorCount(in string: Substring, using regex: Regex<(Substring, Substring)>) -> Int {
    var colorCount = 0
    if let redMatch = try? regex.firstMatch(in: string),
        let parsedCount = Int(redMatch.1) {
        colorCount = parsedCount
    }
    return colorCount
}

private func parseInput(_ input: String) -> [Game] {
    let lines = input.split(separator: "\n")
    return lines.map { line in
        let grabSections = line.split(separator: ";")
        return grabSections.map { grabSection in
            let redCount = parseColorCount(in: grabSection, using: redRegex)
            let greenCount = parseColorCount(in: grabSection, using: greenRegex)
            let blueCount = parseColorCount(in: grabSection, using: blueRegex)
            return Grab(red: redCount, green: greenCount, blue: blueCount)
        }
    }
}

private func part1(_ input: String) -> String {
    let games = parseInput(input)
    print("Got some games")
    print("\(games)")
    return "0"
}

func day02() throws {
    let input = try readFile("data/day02/example.input")
    let expectedOutput = try readFile("data/day02/example_1.output")
    let result = part1(input)

    if result == expectedOutput {
        print("SUCCESS: part 1 Result matches expected output!")
    } else {
        print("FAIL: part 1 Expected \(expectedOutput) but got \(result)")
    }
}
