import Algorithms

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
    guard let headerLine = lineIterator.next() else { return nil }

    let headerCategories = headerLine.split(separator: " ").first!
    let categoriesSplit = headerCategories.split(separator: "-to-")
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

private struct CategoryMappingIterator: IteratorProtocol {
    typealias Element = CategoryMapping

    private var currentMapping: CategoryMapping?
    private var mappings: [String: CategoryMapping]

    init(mappings: [String: CategoryMapping]) {
        self.mappings = mappings
        currentMapping = mappings["seed"]
    }

    mutating func next() -> CategoryMapping? {
        guard let mapping = currentMapping else {
            return nil
        }
        currentMapping = mappings[mapping.to]
        return mapping
    }
}

private func part1(input: String) -> String {
    let parsed = parseInput(input: input)

    var currentValues = parsed.initialSeeds
    var mappingIterator = CategoryMappingIterator(mappings: parsed.mappings)

    while let nextMapping = mappingIterator.next() {
        currentValues = currentValues.map { value in
            for rangeMapping in nextMapping.ranges {
                let offset = rangeMapping.dstStart - rangeMapping.srcStart
                let srcEnd = rangeMapping.srcStart + rangeMapping.mappedSize - 1
                if value >= rangeMapping.srcStart, value <= srcEnd {
                    return value + offset
                }
            }
            return value
        }
    }
    let result = currentValues.min()!
    return String(result)
}

private struct SeedRange: CustomStringConvertible {
    let start: Int
    let end: Int
    let size: Int

    init(start: Int, size: Int) {
        self.start = start
        self.size = size
        end = start + size - 1
    }

    var description: String {
        "SeedRange(start: \(start), end: \(end), size: \(size))"
    }
}

private struct MappedRangeResult {
    let matched: Bool
    let mappedRange: SeedRange?
    let remainingRanges: [SeedRange]

    init(matched: Bool) {
        self.matched = matched
        mappedRange = nil
        remainingRanges = []
    }

    init(matched: Bool, mappedRange: SeedRange?, remainingRanges: [SeedRange]) {
        self.matched = matched
        self.mappedRange = mappedRange
        self.remainingRanges = remainingRanges
    }
}

private func mapRangeToRange(range: SeedRange, rangeMapping: RangeMapping) -> MappedRangeResult {
    // Case 1: Entire range is within the mapped source range
    if range.start >= rangeMapping.srcStart, range.end <= rangeMapping.srcStart + rangeMapping.mappedSize - 1 {
        let offset = range.start - rangeMapping.srcStart
        let newStart = rangeMapping.dstStart + offset
        let mappedRange = SeedRange(start: newStart, size: range.size)
        return MappedRangeResult(matched: true, mappedRange: mappedRange, remainingRanges: [])
    }

    // Case 2: Range entirely overlaps mapped source range
    if range.start < rangeMapping.srcStart, range.end > rangeMapping.srcStart + rangeMapping.mappedSize - 1 {
        let beforeSize = rangeMapping.srcStart - range.start
        let beforeRange = SeedRange(start: range.start, size: beforeSize)
        let withinStart = rangeMapping.dstStart
        let withinSize = rangeMapping.mappedSize
        let withinRange = SeedRange(start: withinStart, size: withinSize)
        let afterStart = rangeMapping.srcStart + rangeMapping.mappedSize
        let afterSize = range.end - afterStart + 1
        let afterRange = SeedRange(start: afterStart, size: afterSize)
        return MappedRangeResult(matched: true, mappedRange: withinRange, remainingRanges: [beforeRange, afterRange])
    }

    // Case 3: Range overlaps start of mapped source range
    if range.start < rangeMapping.srcStart, range.end >= rangeMapping.srcStart, range.end <= rangeMapping.srcStart + rangeMapping.mappedSize - 1 {
        let beforeSize = rangeMapping.srcStart - range.start
        let beforeRange = SeedRange(start: range.start, size: beforeSize)
        let mappedSize = range.end - rangeMapping.srcStart + 1
        let mappedRange = SeedRange(start: rangeMapping.dstStart, size: mappedSize)
        return MappedRangeResult(matched: true, mappedRange: mappedRange, remainingRanges: [beforeRange])
    }

    // Case 4: Range overlaps end of mapped source range
    if range.start >= rangeMapping.srcStart, range.start <= rangeMapping.srcStart + rangeMapping.mappedSize - 1, range.end > rangeMapping.srcStart + rangeMapping.mappedSize - 1 {
        let mappedSize = rangeMapping.srcStart + rangeMapping.mappedSize - range.start
        let mappedRange = SeedRange(start: rangeMapping.dstStart + (range.start - rangeMapping.srcStart), size: mappedSize)
        let afterStart = rangeMapping.srcStart + rangeMapping.mappedSize
        let afterSize = range.end - afterStart + 1
        let afterRange = SeedRange(start: afterStart, size: afterSize)
        return MappedRangeResult(matched: true, mappedRange: mappedRange, remainingRanges: [afterRange])
    }

    // Final case: no matches
    return MappedRangeResult(matched: false)
}

private func seedValuesToRanges(seedValues: [SeedValue]) -> [SeedRange] {
    seedValues.chunks(ofCount: 2).map { SeedRange(start: $0.first!, size: $0.last!) }
}

private func part2(input: String) -> String {
    let parsed = parseInput(input: input)
    var currentRanges = seedValuesToRanges(seedValues: parsed.initialSeeds)

    var mappingIterator = CategoryMappingIterator(mappings: parsed.mappings)

    while let nextMapping = mappingIterator.next() {
        var nextRanges = [SeedRange]()
        while let range = currentRanges.popLast() {
            var foundMatchingRange = false

            for rangeMapping in nextMapping.ranges {
                let mapResult = mapRangeToRange(range: range, rangeMapping: rangeMapping)
                if mapResult.matched {
                    foundMatchingRange = true
                    nextRanges.append(mapResult.mappedRange!)
                    currentRanges.append(contentsOf: mapResult.remainingRanges)
                    break
                }
            }

            if !foundMatchingRange {
                nextRanges.append(range)
            }
        }
        currentRanges = nextRanges
    }

    let result = currentRanges.map(\.start).min()!

    return String(result)
}

func day05(dayKey: String) throws {
    try testAocOutput(dayKey: dayKey, inputName: "example", partKey: "1", partSolver: part1)
    try testAocOutput(dayKey: dayKey, inputName: "test", partKey: "1", partSolver: part1)

    try testAocOutput(dayKey: dayKey, inputName: "example", partKey: "2", partSolver: part2)
    try testAocOutput(dayKey: dayKey, inputName: "test", partKey: "2", partSolver: part2)
}
