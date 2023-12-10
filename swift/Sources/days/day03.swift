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

private func parseRow(rows: [Row], rowIndex: Int, line: String.SubSequence) -> Row {
    var numbers: [PartNumber] = []
    var symbols: [Symbol] = []
    var numberStart = -1
    var numberChars = ""

    func handleDigit(char: Character, column: Int) {
        if numberStart < 0 {
            numberStart = column
        }
        numberChars.append(char)
    }

    func handleNonDigit(column: Int) {
        if numberStart < 0 {
            return
        }
        let numberValue = Int(numberChars)!
        let newNumber = PartNumber(value: numberValue, start: numberStart, end: column - 1, nearSymbol: false)
        numbers.append(newNumber)
        numberStart = -1
        numberChars = ""

        func markIfNear(symbol: Symbol) {
            if symbol.column >= newNumber.start - 1, symbol.column <= newNumber.end + 1 {
                newNumber.nearSymbol = true
            }
        }
        symbols.forEach(markIfNear)
        if rowIndex > 0 {
            let previousRow: Row = rows[rowIndex - 1]
            previousRow.symbols.forEach(markIfNear)
        }
    }

    func handleSymbol(char: Character, column: Int) {
        let newSymbol = Symbol(value: char, column: column)
        symbols.append(newSymbol)

        func markIfNear(number: PartNumber) {
            if column >= number.start - 1, column <= number.end + 1 {
                number.nearSymbol = true
            }
        }
        numbers.forEach(markIfNear)
        if rowIndex > 0 {
            let previousRow: Row = rows[rowIndex - 1]
            previousRow.numbers.forEach(markIfNear)
        }
    }

    line.enumerated().forEach { column, char in
        if char.isNumber {
            handleDigit(char: char, column: column)
            return
        } else {
            handleNonDigit(column: column)
        }
        if isSymbol(char: char) {
            handleSymbol(char: char, column: column)
        }
    }

    handleNonDigit(column: line.count) // treat end of line as a non digit

    return Row(numbers: numbers, symbols: symbols)
}

private func parseInput(_ input: String) -> [Row] {
    let lines = input.split(separator: "\n")
    var rows: [Row] = []
    lines.enumerated().forEach { rowIndex, line in
        rows.append(parseRow(rows: rows, rowIndex: rowIndex, line: line))
    }
    return rows
}

private func part1(input: String) throws -> String {
    let rows = parseInput(input)
    var markedValues: [Int] = []
    rows.forEach { row in
        row.numbers.forEach { number in
            if number.nearSymbol {
                markedValues.append(number.value)
            }
        }
    }
    let result = markedValues.reduce(0, +)
    return String(result)
}

private func getAdjacentNumberValues(rows: [Row], rowIndex: Int, colIndex: Int) -> [Int] {
    var adjacent: [Int] = []
    let startRow = max(0, rowIndex - 1)
    let endRow = min(rows.count - 1, rowIndex + 1)
    for i in startRow ... endRow {
        rows[i].numbers.forEach { number in
            if colIndex >= number.start - 1, colIndex <= number.end + 1 {
                adjacent.append(number.value)
            }
        }
    }
    return adjacent
}

private func part2(input: String) throws -> String {
    let rows = parseInput(input)
    var gearRatios: [Int] = []
    rows.enumerated().forEach { rowIndex, row in
        row.symbols.forEach { symbol in
            if symbol.value == "*" {
                let adjacentValues = getAdjacentNumberValues(rows: rows, rowIndex: rowIndex, colIndex: symbol.column)
                if adjacentValues.count == 2 {
                    gearRatios.append(adjacentValues[0] * adjacentValues[1])
                }
            }
        }
    }
    let result = gearRatios.reduce(0, +)
    return String(result)
}

func day03(dayKey: String) throws {
    try testAocOutput(dayKey: dayKey, inputName: "example", partKey: "1", partSolver: part1)
    try testAocOutput(dayKey: dayKey, inputName: "test", partKey: "1", partSolver: part1)

    try testAocOutput(dayKey: dayKey, inputName: "example", partKey: "2", partSolver: part2)
    try testAocOutput(dayKey: dayKey, inputName: "test", partKey: "2", partSolver: part2)
}
