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
    std::shared_ptr<std::map<Category, CategoryMapping>> mappings; // Use shared_ptr here
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

    auto mappings = std::make_shared<std::map<Category, CategoryMapping>>(); // Create shared_ptr
    while (stream) {
        try {
            auto mapping = readNextMapping(stream);
            (*mappings)[mapping.from] = mapping;
        } catch (const std::runtime_error &e) {
            break;
        }
    }

    return {seedValues, mappings};
}

class CategoryMappingIterator {
    std::shared_ptr<const std::map<std::string, CategoryMapping>> mappings;
    std::optional<CategoryMapping> currentMapping;
    bool firstCall = true;

  public:
    CategoryMappingIterator(std::shared_ptr<const std::map<std::string, CategoryMapping>> mappings)
        : mappings(mappings) {
        auto it = mappings->find("seed");
        if (it != mappings->end()) {
            currentMapping = it->second;
        }
    }

    std::optional<CategoryMapping> next() {
        if (!currentMapping.has_value()) {
            return std::nullopt;
        }
        if (firstCall) {
            firstCall = false;
            return currentMapping;
        }
        auto it = mappings->find(currentMapping->to);
        if (it != mappings->end()) {
            currentMapping = it->second;
            return currentMapping;
        }
        currentMapping.reset();
        return std::nullopt;
    }
};

std::vector<SeedValue> transformValues(const std::vector<SeedValue> &values, const CategoryMapping &mapping) {
    std::vector<SeedValue> transformedValues = values;
    for (auto &value : transformedValues) {
        for (const auto &rangeMapping : mapping.ranges) {
            SeedValue srcEnd = rangeMapping.srcStart + rangeMapping.mappedSize - 1;
            if (value >= rangeMapping.srcStart && value <= srcEnd) {
                SeedValue offset = rangeMapping.dstStart - rangeMapping.srcStart;
                value += offset;
                break; // Assuming each value only matches one range
            }
        }
    }
    return transformedValues;
}

std::string part1(const std::string &input) {
    ParsedInput parsed = parseInput(input);
    std::vector<SeedValue> currentValues = parsed.initialSeeds;
    CategoryMappingIterator mappingIterator(parsed.mappings); // Pass shared_ptr to the iterator

    while (auto nextMapping = mappingIterator.next()) {
        currentValues = transformValues(currentValues, *nextMapping);
    }

    auto minIt = std::min_element(currentValues.begin(), currentValues.end());
    return std::to_string(minIt != currentValues.end() ? *minIt : 0);
}

} // namespace

void day05() {
    testAocOutput("05", "example", "1", &part1);
    testAocOutput("05", "test", "1", &part1);
}
