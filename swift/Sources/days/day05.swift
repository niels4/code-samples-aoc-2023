typealias SeedValue = Int
typealias Category = String

private struct RangeMapping {
    var dstStart: SeedValue
    var srcStart: SeedValue
    var mappedSize: Int
}

private struct CategoryMapping {
    var from: Category
    var to: Category
    var ranges: [RangeMapping]
}

private struct ParsedInput {
    var initialSeeds: [SeedValue]
    var mappings: [Category: CategoryMapping]
}

private func readNumberList(from text: some StringProtocol, separator: Character = " ") -> [Int] {
    text.split(separator: separator)
        .compactMap { Int($0) }
}

private func readSeedValues(from line: some StringProtocol) -> [SeedValue] {
    guard let colonIndex = line.firstIndex(of: ":") else {
        fatalError("Seed values line must contain a colon.")
    }
    let startIndex = line.index(after: colonIndex)
    let seedValuesPart = line[startIndex...].trimmingCharacters(in: .whitespaces)
    let seedValues = readNumberList(from: seedValuesPart)
    return seedValues
}

private func readNextMapping(lineIterator: inout IndexingIterator<[Substring]>) -> CategoryMapping? {
    guard let headerLine = lineIterator.next() else {
        return nil
    }

    let headerCategories = headerLine.split(separator: " ").first!
    let categoriesSplit = headerCategories.split(separator: "-to-")
    guard categoriesSplit.count == 2 else { return nil }
    let from = String(categoriesSplit[0])
    let to = String(categoriesSplit[1])
    var ranges = [RangeMapping]()

    while let rangeLine = lineIterator.next(), !rangeLine.isEmpty {
        let rangeLineSplit = readNumberList(from: rangeLine)
        ranges.append(RangeMapping(dstStart: rangeLineSplit[0], srcStart: rangeLineSplit[1], mappedSize: rangeLineSplit[2]))
    }

    return CategoryMapping(from: from, to: to, ranges: ranges)
}

private func parseInput(input: String) -> ParsedInput {
    let lines = input.split(separator: "\n", omittingEmptySubsequences: false)
    var lineIterator = lines.makeIterator()

    let seedValues = readSeedValues(from: lineIterator.next()!)
    _ = lineIterator.next() // skip blank line

    var mappings: [Category: CategoryMapping] = [:]
    while let nextMapping = readNextMapping(lineIterator: &lineIterator) {
        mappings[nextMapping.from] = nextMapping
    }

    return ParsedInput(initialSeeds: seedValues, mappings: mappings)
}

private func part1(input: String) throws -> String {
    let parsed = parseInput(input: input)
    print("parsed: \(parsed.initialSeeds), \(parsed.mappings)")
    return "0"
}

func day05(dayKey: String) throws {
    try testAocOutput(dayKey: dayKey, inputName: "example", partKey: "1", partSolver: part1)
    // try testAocOutput(dayKey: dayKey, inputName: "test", partKey: "1", partSolver: part1)

    // try testAocOutput(dayKey: dayKey, inputName: "example", partKey: "2", partSolver: part2)
    // try testAocOutput(dayKey: dayKey, inputName: "test", partKey: "2", partSolver: part2)
}
