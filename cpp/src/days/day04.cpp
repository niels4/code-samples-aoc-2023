#import "day04.h"
#import "runner.h"
#import "string"
#include <cmath>
#include <numeric>
#include <set>
#include <sstream>
#include <vector>

namespace {

template <typename SetType> SetType intersectSets(const SetType &set1, const SetType &set2) {
    SetType result;
    std::set_intersection(set1.begin(), set1.end(), set2.begin(), set2.end(), std::inserter(result, result.begin()));
    return result;
}

struct Card {
    std::set<int> winningNumbers;
    std::set<int> myNumbers;
    std::set<int> matchedNumbers;
};

std::vector<Card> parseInput(const std::string &input) {
    std::istringstream iss(input);
    std::string line;
    std::vector<Card> cards;

    while (std::getline(iss, line)) {
        auto colonPos = line.find(':');
        auto pipePos = line.find('|');

        std::string winningNumbersStr = line.substr(colonPos + 2, pipePos - colonPos - 2);
        std::string myNumbersStr = line.substr(pipePos + 2);

        std::istringstream winNumStream(winningNumbersStr);
        std::istringstream myNumStream(myNumbersStr);

        std::set<int> winningNumbers;
        std::set<int> myNumbers;
        int num = 0;

        while (winNumStream >> num) {
            winningNumbers.insert(num);
        }

        while (myNumStream >> num) {
            myNumbers.insert(num);
        }

        std::set<int> matchedNumbers = intersectSets(winningNumbers, myNumbers);

        cards.emplace_back(Card{winningNumbers, myNumbers, matchedNumbers});
    }
    return cards;
}

int getCardScore(const std::set<int> &matchedNumbers) {
    return matchedNumbers.empty() ? 0 : static_cast<int>(std::pow(2, matchedNumbers.size() - 1));
}

std::string part1(const std::string &input) {
    auto cards = parseInput(input);
    int result = 0;
    for (const auto &card : cards) {
        result += getCardScore(card.matchedNumbers);
    }
    return std::to_string(result);
}

std::string part2(const std::string &input) {
    auto cards = parseInput(input);
    std::reverse(cards.begin(), cards.end()); // Reverse the vector to process in the correct order
    cards.erase(cards.begin());               // Drop the first element after reversing

    std::vector<int> allCardsWon;
    allCardsWon.push_back(1);

    int curIndex = 1;
    for (const auto &card : cards) {
        int currentCardsWon = 1;
        for (int i = 1; i <= card.matchedNumbers.size(); ++i) {
            currentCardsWon += allCardsWon[curIndex - i];
        }
        allCardsWon.push_back(currentCardsWon);
        curIndex++;
    }

    int result = std::accumulate(allCardsWon.begin(), allCardsWon.end(), 0);
    return std::to_string(result);
}

} // namespace

void day04() {
    testAocOutput("04", "example", "1", &part1);
    testAocOutput("04", "test", "1", &part1);
    testAocOutput("04", "example", "2", &part2);
    testAocOutput("04", "test", "2", &part2);
}
