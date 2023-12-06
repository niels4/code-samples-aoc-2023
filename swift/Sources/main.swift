private let args = CommandLine.arguments

guard args.count == 2 else {
    print("Must include day arg. EG: swift run swift-aoc 01")
    exit(1)
}

private let dayKey = "day" + args[1]

print("Running aoc 2023 solver for", dayKey)

private let daysMap: [String: () -> Void] = [
    "day01": day01,
    "day02": day02,
]

if let runner = daysMap[dayKey] {
    runner()
} else {
    print("Not a valid day to run.", dayKey)
}

