#include "day05.h"
#include "runner.h"
#include <cstdint> // Include for int64_t
#include <iostream>
#include <map>
#include <sstream>
#include <stdexcept> // Include for std::runtime_error
#include <vector>

namespace {

using SeedValue = int64_t;
using Category = std::string;

struct RangeMapping {
    SeedValue dstStart;
    SeedValue srcStart;
    int64_t mappedSize;
};

struct CategoryMapping {
    Category from;
    Category to;
    std::vector<RangeMapping> ranges;
};

struct ParsedInput {
    std::vector<SeedValue> initialSeeds;
    std::map<Category, CategoryMapping> mappings;
};

std::vector<int64_t> readNumberList(const std::string &text, char separator = ' ') {
    std::vector<int64_t> numbers;
    std::istringstream stream(text);
    std::string number;
    while (std::getline(stream, number, separator)) {
        try {
            numbers.push_back(std::stoll(number));
        } catch (const std::invalid_argument &e) {
            std::cerr << "Invalid argument for stoll: " << number << std::endl;
        } catch (const std::out_of_range &e) {
            std::cerr << "Integer out of range: " << number << std::endl;
        }
    }
    return numbers;
}

std::vector<SeedValue> readSeedValues(const std::string &line) {
    auto colonPos = line.find(':');
    if (colonPos == std::string::npos) {
        throw std::runtime_error("Seed values line must contain a colon.");
    }
    std::string seedValuesPart = line.substr(colonPos + 2);
    return readNumberList(seedValuesPart);
}

CategoryMapping readNextMapping(std::istream &stream) {
    std::string headerLine;
    if (!std::getline(stream, headerLine) || headerLine.empty()) {
        throw std::runtime_error("Expected a header line for mapping.");
    }

    std::istringstream headerStream(headerLine);
    std::string firstPart;
    std::getline(headerStream, firstPart, ' ');

    size_t dashPos = firstPart.find("-to-");
    if (dashPos == std::string::npos) {
        throw std::runtime_error("Mapping line does not contain '-to-'.");
    }

    Category from = firstPart.substr(0, dashPos);
    Category to = firstPart.substr(dashPos + 4, firstPart.find(' ', dashPos) - dashPos - 4);

    std::vector<RangeMapping> ranges;
    std::string rangeLine;
    while (std::getline(stream, rangeLine) && !rangeLine.empty()) {
        auto numbers = readNumberList(rangeLine);
        ranges.push_back({static_cast<int64_t>(numbers[0]), static_cast<int64_t>(numbers[1]), numbers[2]});
    }

    return {from, to, ranges};
}

ParsedInput parseInput(const std::string &input) {
    std::istringstream stream(input);

    std::string seedLine;
    std::getline(stream, seedLine);
    auto seedValues = readSeedValues(seedLine);

    std::string blankLine;
    std::getline(stream, blankLine); // Skip the blank line

    std::map<Category, CategoryMapping> mappings;
    while (stream) {
        try {
            auto mapping = readNextMapping(stream);
            mappings[mapping.from] = mapping;
        } catch (const std::runtime_error &e) {
            break;
        }
    }

    return {seedValues, mappings};
}

std::string part1(const std::string &input) {
    ParsedInput parsed = parseInput(input);
    int result = 0;
    return std::to_string(result);
}

std::string part2(const std::string &input) {
    int result = 0;
    return std::to_string(result);
}

} // namespace

void day05() {
    testAocOutput("05", "example", "1", &part1);
    testAocOutput("05", "test", "1", &part1);
    testAocOutput("05", "example", "2", &part2);
    testAocOutput("05", "test", "2", &part2);
}
