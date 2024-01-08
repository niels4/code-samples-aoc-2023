#include "runner.h"
#include <algorithm>
#include <cctype>
#include <fstream>
#include <iostream>
#include <stdexcept>

static const std::string dataDir = "data";
static const std::string red = "\033[31m";
static const std::string green = "\033[32m";
static const std::string bold = "\033[1m";
static const std::string reset = "\033[0m";
static const std::string checkmark = "✓";
static const std::string cross = "✗";

// Trim from start (in place)
static inline void ltrim(std::string &s) {
    s.erase(s.begin(), std::find_if(s.begin(), s.end(), [](unsigned char ch) { return !std::isspace(ch); }));
}

// Trim from end (in place)
static inline void rtrim(std::string &s) {
    s.erase(std::find_if(s.rbegin(), s.rend(), [](unsigned char ch) { return !std::isspace(ch); }).base(), s.end());
}

// Trim from both ends (in place)
static inline void trim(std::string &s) {
    ltrim(s);
    rtrim(s);
}

static std::string readFile(const std::string &relativePath) {
    std::ifstream file(relativePath);
    if (!file.is_open()) {
        throw std::runtime_error("Unable to read file: " + relativePath);
    }

    std::string content((std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>());
    return content;
}

void testAocOutput(const std::string &dayKey, const std::string &inputName, const std::string &partKey,
                   const AocPartSolver &partSolver) {
    std::string inputFilePath = dataDir + "/day" + dayKey + "/" + inputName + ".input";
    std::string outputFilePath = dataDir + "/day" + dayKey + "/" + inputName + "_" + partKey + ".output";

    try {
        std::string input = readFile(inputFilePath);
        trim(input);

        std::string expectedOutput = readFile(outputFilePath);
        trim(expectedOutput);

        std::string result = partSolver(input);
        trim(result);

        if (result == expectedOutput) {
            std::cout << bold << green << checkmark << " SUCCESS: Day " << dayKey << " part " << partKey << " "
                      << inputName << ". Result matches expected output! (" << result << ")" << reset << std::endl;
        } else {
            std::cout << bold << red << cross << " FAIL: Day " << dayKey << " part " << partKey << " " << inputName
                      << ". Expected " << expectedOutput << " but got " << result << reset << std::endl;
        }
    } catch (const std::exception &e) {
        std::cerr << "Error: " << e.what() << std::endl;
    }
}
