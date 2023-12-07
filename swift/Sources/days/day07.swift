private typealias CardCounts = [Character: Int]

private extension Dictionary where Key == Character, Value == Int {
    init(cardChars: String) {
        self.init()
        for char in cardChars {
            self[char, default: 0] += 1
        }
    }
}

private enum HandType: Comparable {
    case HighCard
    case OnePair
    case TwoPair
    case ThreeOfAKind
    case FullHouse
    case FourOfAKind
    case FiveOfAKind

    static func from(cardCounts: CardCounts) -> HandType {
        let maxCount = cardCounts.values.max() ?? 0

        switch (maxCount, cardCounts.count) {
        case (5, _):
            return .FiveOfAKind
        case (4, _):
            return .FourOfAKind
        case (3, 2):
            return .FullHouse
        case (3, _):
            return .ThreeOfAKind
        case (2, 3):
            return .TwoPair
        case (2, _):
            return .OnePair
        default:
            return .HighCard
        }
    }
}

private struct Hand {
    let cardChars: [Character]
    let bid: Int
    let cardCounts: CardCounts
    let type: HandType
}

private enum ParseInputError: Error {
    case unableToParseInput
}

private func parseIntput(_ input: String) throws -> [Hand] {
    let lines = input.split(separator: "\n")
    return try lines.map { line in
        let handData = line.split(separator: " ")
        guard handData.count == 2,
            handData[0].count == 5,
            let bid = Int(handData[1]) else {
            throw ParseInputError.unableToParseInput
        }
        let cardChars = String(handData[0])
        let cardCounts = CardCounts(cardChars: cardChars)
        let handType = HandType.from(cardCounts: cardCounts)
        return Hand(cardChars: Array(cardChars), bid: bid, cardCounts: cardCounts, type: handType)
    }
}

private typealias CardStrengths = [Character: Int]

private let cardOrderPart1: [Character] = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"]
private let cardStrengthsPart1: CardStrengths = Dictionary(uniqueKeysWithValues: zip(cardOrderPart1, 0..<cardOrderPart1.count))

private func compareHandStrengths(hand1: Hand, hand2: Hand) -> Bool {
    if hand1.type != hand2.type {
        return hand1.type < hand2.type
    }
    for cardIndex in 0..<hand1.cardChars.count {
        if let card1Strength = cardStrengthsPart1[hand1.cardChars[cardIndex]],
           let card2Strength = cardStrengthsPart1[hand2.cardChars[cardIndex]] {
            if card1Strength != card2Strength {
                return card1Strength < card2Strength
            }
        }
    }
    return true
}

private func part1(input: String) throws -> String {
    let hands = try parseIntput(input)
    let sortedHands = hands.sorted(by: compareHandStrengths)
    var totalSoFar = 0
    let winnings = sortedHands.enumerated().map { rankIndex, hand in
        let rank = rankIndex + 1
        let winning = rank * hand.bid
        totalSoFar += winning
        return winning
    }
    let result = winnings.reduce(0, +)
    return String(result)
}

func day07(dayKey: String) throws {
        try testAocOutput(dayKey: dayKey, inputName: "example", partKey: "1", partSolver: part1)
        try testAocOutput(dayKey: dayKey, inputName: "test", partKey: "1", partSolver: part1)

        // try testAocOutput(dayKey: dayKey, inputName: "example", partKey: "2", partSolver: part2)
        // try testAocOutput(dayKey: dayKey, inputName: "test", partKey: "2", partSolver: part2)
}
