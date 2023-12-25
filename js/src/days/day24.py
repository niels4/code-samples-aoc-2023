# example input for part 2
from sympy import *
init_printing()


x, y, z, i, j, k = symbols('x y z i j k')

equations = []

equations.append((x - 19) * (1 - j) - (y - 13) * (-2 - i))
equations.append((y - 13) * (-2 - k) - (z - 30) * (1 - j))
equations.append((x - 18) * (-1 - j) - (y - 19) * (-1 - i))
equations.append((y - 19) * (-2 - k) - (z - 22) * (-1 - j))
equations.append((x - 20) * (-2 - j) - (y - 25) * (-2 - i))
equations.append((y - 25) * (-4 - k) - (z - 34) * (-2 - j))

# get all solutions
allSolutions = solve(equations)
print(allSolutions)

# get solutions containing only integer results
intSolutions = [sol for sol in solve(equations) if all (x % 1 == 0 for x in sol.values())]
print(intSolutions)

# test input for part 2
from sympy import *
init_printing()

x, y, z, i, j, k = symbols('x y z i j k')

equations = []

equations.append((x - 225415405941969) * (-204 - j) - (y - 400648127977931) * (23 - i))
equations.append((y - 400648127977931) * (617 - k) - (z - 79201130433258) * (-204 - j))
equations.append((x - 353783687623292) * (156 - j) - (y - 138575899489956) * (-80 - i))
equations.append((y - 138575899489956) * (21 - k) - (z - 318416438572569) * (156 - j))
equations.append((x - 215751176267772) * (126 - j) - (y - 376619563956940) * (-120 - i))
equations.append((y - 376619563956940) * (-352 - k) - (z - 230133299986253) * (126 - j))

# get all solutions
allSolutions = solve(equations)
print(allSolutions)

# get solutions containing only integer results
intSolutions = [sol for sol in solve(equations) if all (x % 1 == 0 for x in sol.values())]
print(intSolutions)
