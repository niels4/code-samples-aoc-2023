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
    if let colorMatch = try? regex.firstMatch(in: string),
        let parsedCount = Int(colorMatch.1) {
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
    let scores = games.enumerated().map { gameIndex, game in
        for grab in game {
            if grab.red > maxRed || grab.green > maxGreen || grab.blue > maxBlue {
                return 0
            }
        }
        return gameIndex + 1
    }
    let result = scores.reduce(0, +)
    return String(result)
}

private func part2(_ input: String) -> String {
    let games = parseInput(input)
    let powers = games.map { game in
        var minRed = 0
        var minGreen = 0
        var minBlue = 0
        for grab in game {
            if grab.red > minRed {
                minRed = grab.red
            }
            if grab.green > minGreen {
                minGreen = grab.green
            }
            if grab.blue > minBlue {
                minBlue = grab.blue
            }
        }
        return minRed * minBlue * minGreen
    }
    let result = powers.reduce(0, +)
    return String(result)
}

func day02() throws {
    let input = try readFile("data/day02/test.input")
    let expectedOutput = try readFile("data/day02/test_1.output").trimmingCharacters(in: .whitespacesAndNewlines)
    let result = part1(input)

    if result == expectedOutput {
        print("SUCCESS: part 1 Result matches expected output!")
    } else {
        print("FAIL: part 1 Expected \(expectedOutput) but got \(result)")
    }

    let expectedOutput2 = try readFile("data/day02/test_2.output")
    let result2 = part2(input)

    if result2 == expectedOutput2 {
        print("SUCCESS: part 2 Result matches expected output!")
    } else {
        print("FAIL: part 2 Expected \(expectedOutput2) but got \(result2)")
    }
}
