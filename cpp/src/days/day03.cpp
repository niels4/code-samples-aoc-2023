#import "day03.h"
#import "runner.h"
#import "string"
#include <sstream>

namespace {

class PartNumber {
  public:
    int value;
    int start;
    int end;
    bool nearSymbol;

    PartNumber(int value, int start, int end, bool nearSymbol)
        : value(value), start(start), end(end), nearSymbol(nearSymbol) {}
};

struct Symbol {
    char value;
    int column;
};

struct Row {
    std::vector<PartNumber> numbers;
    std::vector<Symbol> symbols;
};

bool isSymbol(char ch) { return ch != '.' && !std::isdigit(ch); }

Row parseRow(std::vector<Row> &rows, int rowIndex, const std::string &line) {
    std::vector<PartNumber> numbers;
    std::vector<Symbol> symbols;
    int numberStart = -1;
    std::string numberChars;

    auto handleDigit = [&](char ch, int column) {
        if (numberStart < 0) {
            numberStart = column;
        }
        numberChars.push_back(ch);
    };

    auto handleNonDigit = [&](int column) {
        if (numberStart >= 0) {
            int numberValue = std::stoi(numberChars);
            PartNumber newNumber(numberValue, numberStart, column - 1, false);

            // Check for nearby symbols in the current row
            for (const auto &symbol : symbols) {
                if (symbol.column >= newNumber.start - 1 && symbol.column <= newNumber.end + 1) {
                    newNumber.nearSymbol = true;
                }
            }

            // Check for nearby symbols in the previous row
            if (rowIndex > 0) {
                for (const auto &prevSymbol : rows[rowIndex - 1].symbols) {
                    if (prevSymbol.column >= newNumber.start - 1 && prevSymbol.column <= newNumber.end + 1) {
                        newNumber.nearSymbol = true;
                    }
                }
            }

            numbers.push_back(newNumber);
            numberStart = -1;
            numberChars.clear();
        }
    };

    auto handleSymbol = [&](char ch, int column) {
        Symbol newSymbol{ch, column};
        symbols.push_back(newSymbol);

        // Mark nearby numbers as having a near symbol in the current row
        for (auto &number : numbers) {
            if (column >= number.start - 1 && column <= number.end + 1) {
                number.nearSymbol = true;
            }
        }

        // Check the previous row
        if (rowIndex > 0) {
            for (auto &prevNumber : rows[rowIndex - 1].numbers) {
                if (column >= prevNumber.start - 1 && column <= prevNumber.end + 1) {
                    prevNumber.nearSymbol = true;
                }
            }
        }
    };

    for (int column = 0; column < static_cast<int>(line.length()); ++column) {
        char ch = line[column];
        if (std::isdigit(ch)) {
            handleDigit(ch, column);
        } else {
            handleNonDigit(column);
            if (isSymbol(ch)) {
                handleSymbol(ch, column);
            }
        }
    }

    // Finalize the last number in the line if any
    handleNonDigit(static_cast<int>(line.length()));
    return Row{numbers, symbols};
}

std::vector<Row> parseInput(const std::string &input) {
    std::vector<Row> rows;
    std::istringstream iss(input);
    std::string line;
    int rowIndex = 0;

    while (std::getline(iss, line)) {
        rows.push_back(parseRow(rows, rowIndex, line));
        rowIndex++;
    }

    return rows;
}

std::string part1(const std::string &input) {
    auto rows = parseInput(input);
    int result = 0;

    for (const auto &row : rows) {
        for (const auto &number : row.numbers) {
            if (number.nearSymbol) {
                result += number.value;
            }
        }
    }

    return std::to_string(result);
}

std::vector<int> getAdjacentNumberValues(const std::vector<Row> &rows, int rowIndex, int colIndex) {
    std::vector<int> adjacent;
    // Check the current row and optionally one row above and below
    int startRow = std::max(0, rowIndex - 1);
    int endRow = std::min(static_cast<int>(rows.size()) - 1, rowIndex + 1);

    for (int i = startRow; i <= endRow; ++i) {
        for (const auto &number : rows[i].numbers) {
            if (colIndex >= number.start - 1 && colIndex <= number.end + 1) {
                adjacent.push_back(number.value);
            }
        }
    }

    return adjacent;
}

std::string part2(const std::string &input) {
    auto rows = parseInput(input);
    int result = 0;

    for (size_t rowIndex = 0; rowIndex < rows.size(); ++rowIndex) {
        for (const auto &symbol : rows[rowIndex].symbols) {
            if (symbol.value == '*') {
                auto adjacentValues = getAdjacentNumberValues(rows, static_cast<int>(rowIndex), symbol.column);
                if (adjacentValues.size() == 2) {
                    result += adjacentValues[0] * adjacentValues[1];
                }
            }
        }
    }

    return std::to_string(result);
}

} // namespace

void day03() {
    testAocOutput("03", "example", "1", &part1);
    testAocOutput("03", "test", "1", &part1);
    testAocOutput("03", "example", "2", &part2);
    testAocOutput("03", "test", "2", &part2);
}
