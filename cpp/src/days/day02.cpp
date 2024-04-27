#include "day02.h"
#include "runner.h"
#include "string"
#include <regex>
#include <sstream>
#include <vector>

namespace {

const int maxRed = 12;
const int maxGreen = 13;
const int maxBlue = 14;

const std::regex redRegex("(\\d+) red");
const std::regex greenRegex("(\\d+) green");
const std::regex blueRegex("(\\d+) blue");

struct Grab {
    int red = 0;
    int green = 0;
    int blue = 0;
};

using Game = std::vector<Grab>;

int parseColorCount(const std::string &string, const std::regex &regex) {
    std::smatch match;
    if (std::regex_search(string, match, regex)) {
        return std::stoi(match[1].str());
    }
    return 0;
}

std::vector<Game> parseInput(const std::string &input) {
    std::vector<Game> games;
    std::istringstream iss(input);
    std::string line;

    while (std::getline(iss, line)) {
        std::istringstream lineStream(line);
        std::string grabSection;
        Game game;

        while (std::getline(lineStream, grabSection, ';')) {
            int redCount = parseColorCount(grabSection, redRegex);
            int greenCount = parseColorCount(grabSection, greenRegex);
            int blueCount = parseColorCount(grabSection, blueRegex);

            game.push_back(Grab{redCount, greenCount, blueCount});
        }

        games.push_back(game);
    }

    return games;
}

std::string part1(const std::string &input) {
    auto games = parseInput(input);
    size_t sum = 0;

    for (size_t i = 0; i < games.size(); ++i) {
        const auto &game = games[i];
        bool valid = true;

        for (const auto &grab : game) {
            if (grab.red > maxRed || grab.green > maxGreen || grab.blue > maxBlue) {
                valid = false;
                break;
            }
        }

        if (valid) {
            sum += i + 1;
        }
    }

    return std::to_string(sum);
}

std::string part2(const std::string &input) {
    auto games = parseInput(input);
    int sum = 0;

    for (const auto &game : games) {
        int minRed = 0, minGreen = 0, minBlue = 0;

        for (const auto &grab : game) {
            minRed = std::max(minRed, grab.red);
            minGreen = std::max(minGreen, grab.green);
            minBlue = std::max(minBlue, grab.blue);
        }

        sum += minRed * minGreen * minBlue;
    }

    return std::to_string(sum);
}

} // namespace

void day02() {
    testAocOutput("02", "example", "1", &part1);
    testAocOutput("02", "test", "1", &part1);
    testAocOutput("02", "example", "2", &part2);
    testAocOutput("02", "test", "2", &part2);
}
