private let daysMap: [String: AocDayRunner] = [
    "01": day01,
    "02": day02,
    "03": day03,
    "04": day04,
    "05": day05,
    "07": day07,
]

private let args = CommandLine.arguments

guard args.count == 2 else {
    print("Must include day arg. EG: swift run swift-aoc 01")
    exit(1)
}

private let dayKey = args[1]

print("Running aoc 2023 solver for day \(dayKey)")

guard let runner = daysMap[dayKey] else {
    print("Not a valid day to run: \(dayKey)")
    exit(1)
}

do {
    try runner(dayKey)
} catch {
    print("An error occurred while calling runner: \(error)")
}
