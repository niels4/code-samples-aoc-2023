#ifndef RUNNER_H
#define RUNNER_H

#include <functional>
#include <string>

// Function type for AoC part solvers
using AocPartSolver = std::function<std::string(const std::string &)>;

// Declaration of testAocOutput function
void testAocOutput(const std::string &dayKey, const std::string &inputName, const std::string &partKey,
                   const AocPartSolver &partSolver);

#endif // RUNNER_H
