private class PartNumber {
    let value: Int
    let start: Int
    let end: Int
    var nearSymbol = false

    init(value: Int, start: Int, end: Int, nearSymbol: Bool) {
        self.value = value
        self.start = start
        self.end = end
        self.nearSymbol = nearSymbol
    }
}

private struct Symbol {
    let value: Character
    let column: Int
}

private struct Row {
    let numbers: [PartNumber]
    let symbols: [Symbol]
}

private func isSymbol(char: Character) -> Bool {
    return char != "." && !char.isNumber
}

private func parseInput(_ input: String) -> [Row] {
    let lines = input.split(separator: "\n")
    return lines.map { line in
        var numbers: [PartNumber] = []
        var symbols: [Symbol] = []
        var numberStart = -1
        var numberChars = ""

        func handleDigit(char: Character, index: Int) {
            if numberStart < 0 {
                numberStart = index
            }
            numberChars.append(char)
        }

        func handleNonDigit(index: Int) {
            if numberStart < 0 {
                return
            }
            let numberValue = Int(numberChars)!
            let newNumber = PartNumber(value: numberValue, start: numberStart, end: index - 1, nearSymbol: false)
            numbers.append(newNumber)
            numberStart = -1
            numberChars = ""
        }

        func handleSymbol(char: Character, index: Int) {
            let newSymbol = Symbol(value: char, column: index)
            symbols.append(newSymbol)
        }

        line.enumerated().forEach { i, char in
            if char.isNumber {
                handleDigit(char: char, index: i)
                return
            } else {
                handleNonDigit(index: i)
            }
            if isSymbol(char: char) {
                handleSymbol(char: char, index: i)
            }
        }

        handleNonDigit(index: line.count) // treat end of line as a non digit

        return Row(numbers: numbers, symbols: symbols)
    }
}

private func part1(input: String) throws -> String {
    let rows = parseInput(input)
    let result = rows.count
    return String(result)
}


func day03(dayKey: String) throws {
    try testAocOutput(dayKey: dayKey, inputName: "example", partKey: "1", partSolver: part1)
    // try testAocOutput(dayKey: dayKey, inputName: "test", partKey: "1", partSolver: part1)

    // try testAocOutput(dayKey: dayKey, inputName: "example", partKey: "2", partSolver: part2)
    // try testAocOutput(dayKey: dayKey, inputName: "test", partKey: "2", partSolver: part2)
}
