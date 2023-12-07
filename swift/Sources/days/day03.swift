private struct PartNumber {
    let value = 0
    let start = 0
    let end = 0
    var nearSymbol = false
}

private struct Symbol {
    let value = ""
    let column = 0
}

private struct Row {
    let numbers: [PartNumber]
    let symbols: [Symbol]
}

private func part1(input: String) throws -> String {
    return "0"
}


func day03(dayKey: String) throws {
    try testAocOutput(dayKey: dayKey, inputName: "example", partKey: "1", partSolver: part1)
    // try testAocOutput(dayKey: dayKey, inputName: "test", partKey: "1", partSolver: part1)

    // try testAocOutput(dayKey: dayKey, inputName: "example", partKey: "2", partSolver: part2)
    // try testAocOutput(dayKey: dayKey, inputName: "test", partKey: "2", partSolver: part2)
}
