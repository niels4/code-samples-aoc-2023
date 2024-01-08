cmake_minimum_required(VERSION 3.5)
project(Aoc_cpp_2021)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# Set C++ standard to C++20
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# Automatically include all .cpp files in the src/days and src/lib directories
file(GLOB DAY_SOURCES "src/days/*.cpp")
file(GLOB LIB_SOURCES "src/lib/*.cpp")

# Add executable
add_executable(aoc_cpp src/main.cpp ${DAY_SOURCES} ${LIB_SOURCES})

# Include directories
include_directories(src/days)
include_directories(src/lib)
