#include "day01.h"
#include "runner.h"
#include <map>
#include <regex>
#include <sstream>
#include <string>

static const std::regex firstDigitRegex1("(\\d)");
static const std::regex lastDigitRegex1("(\\d)\\D*$");

static int findFirstAndLastDigit(const std::string &input) {
    std::smatch firstMatch, lastMatch;
    if (!std::regex_search(input, firstMatch, firstDigitRegex1) ||
        !std::regex_search(input, lastMatch, lastDigitRegex1)) {
        return 0;
    }

    std::string concatenatedDigits = firstMatch[1].str() + lastMatch[1].str();

    // Parsing the concatenated string as an integer
    return std::stoi(concatenatedDigits);
}

static std::string part1(const std::string &input) {
    std::istringstream iss(input);
    std::string line;
    int sum = 0;

    while (std::getline(iss, line)) {
        sum += findFirstAndLastDigit(line);
    }

    return std::to_string(sum);
}

static const std::map<std::string, std::string> wordMap = {{"one", "1"},   {"two", "2"},   {"three", "3"},
                                                           {"four", "4"},  {"five", "5"},  {"six", "6"},
                                                           {"seven", "7"}, {"eight", "8"}, {"nine", "9"}};

enum class MatchMode { CaptureFirst, CaptureLast };

static std::regex buildDigitCaptureRegex(MatchMode mode) {
    std::ostringstream regexStream;
    if (mode == MatchMode::CaptureLast) {
        regexStream << ".*";
    }
    regexStream << "(\\d|";

    auto it = wordMap.begin();
    if (it != wordMap.end()) {
        regexStream << it->first;
        ++it;
    }

    for (; it != wordMap.end(); ++it) {
        regexStream << "|" << it->first;
    }

    regexStream << ")";
    return std::regex(regexStream.str());
}

static std::string resolveDigit(const std::string &digit) {
    auto it = wordMap.find(digit);
    return it != wordMap.end() ? it->second : digit;
}

static std::string part2(const std::string &input) {
    std::istringstream iss(input);
    std::string line;
    int sum = 0;

    std::regex firstDigitRegex = buildDigitCaptureRegex(MatchMode::CaptureFirst);
    std::regex lastDigitRegex = buildDigitCaptureRegex(MatchMode::CaptureLast);

    while (std::getline(iss, line)) {
        std::smatch match1, match2;
        if (!std::regex_search(line, match1, firstDigitRegex)) {
            continue; // No match found, skip to next line
        }
        std::regex_search(line, match2, lastDigitRegex); // Match last digit/word

        std::string d1 = resolveDigit(match1[1]);
        std::string d2 = resolveDigit(match2[1]);

        sum += std::stoi(d1 + d2);
    }

    return std::to_string(sum);
}

void day01() {
    testAocOutput("01", "example", "1", &part1);
    testAocOutput("01", "test", "1", &part1);
    testAocOutput("01", "example", "2", &part2);
    testAocOutput("01", "test", "2", &part2);
}
