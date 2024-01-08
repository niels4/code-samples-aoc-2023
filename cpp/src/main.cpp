#include "day01.h"
#include <iostream>
#include <map>
#include <string>

static const auto daysMap = std::map<std::string, void (*)()>{
    {"01", &day01},
};

int main(int argc, char *argv[]) { // NOLINT
    std::vector<std::string> args(argv + 1, argv + argc);

    if (args.size() != 1) {
        std::cerr << "Usage: ./aoc_cpp <day_number>" << std::endl;
        return 1;
    }

    std::string day = args[0];

    // Find the function in the map and call it

    auto funcIter = daysMap.find(day);

    if (funcIter != daysMap.end()) {
        // Function found, call it
        std::cout << "Solving day " << day << ":" << std::endl;
        void (*func)() = funcIter->second;
        func();
    } else {
        std::cerr << "Invalid day number" << std::endl;
        return 1;
    }

    return 0;
}
