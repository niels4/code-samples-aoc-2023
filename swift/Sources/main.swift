private let daysMap: [String: AocDayRunner] = [
    "01": day01,
    "02": day02,
]

private let args = CommandLine.arguments

guard args.count == 2 else {
    print("Must include day arg. EG: swift run swift-aoc 01")
    exit(1)
}

private let dayKey = args[1]

print("Running aoc 2023 solver for day \(dayKey)")

if let runner = daysMap[dayKey] {
    do {
        try runner(dayKey)
    } catch {
        print("An error occurred while calling runner: \(error)")
    }
} else {
    print("Not a valid day to run: \(dayKey)")
}
