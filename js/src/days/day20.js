import { findGCD } from "../lib/math.js"
import * as runner from "../lib/runner.js"

console.log("Solving AoC 2023 day 20")

const button = "button"
const broadcaster = "broadcaster"
const flipflop = "%"
const conjunction = "&"
const low = "low"
const high = "high"
const finalModuleOutput = "rx"

const parseInput = (input) => {
  const modules = new Map()
  const inputCounts = {}

  const lines = input.split('\n')
  lines.forEach((line) => {
    const [moduleIdentifier, outputsList] = line.split(" -> ")
    let type, name
    if (moduleIdentifier === broadcaster) {
      type = broadcaster
      name = broadcaster
    } else {
      type = moduleIdentifier[0]
      name = moduleIdentifier.substring(1)
    }
    const outputs = outputsList.split(', ')
    outputs.forEach((output) => {
      const count = inputCounts[output] || 0
      inputCounts[output] = count + 1
    })
    modules.set(name, {name, type, outputs})
  })

  Object.entries(inputCounts).forEach(([to, count]) => {
    const toModule = modules.get(to)
    if (toModule) {
      toModule.inputCount = count
    }
  })

  return modules
}

const moduleHandlers = {
  [broadcaster]: ({name, outputs}, signal) => outputs.map(output => ({from: name, to: output, signal})),

  [flipflop]: (module, signal) => {
    if (signal === high) { return [] } // nothing happens for high pulse
    module.isOn = !module.isOn
    const newSignal = module.isOn ? high : low
    return module.outputs.map(to => ({from: module.name, to, signal: newSignal}))
  },

  [conjunction]: (module, signal, from) => {
    if (!module.inputHistory) { module.inputHistory = {} }
    module.inputHistory[from] = signal
    const highCount = Object.values(module.inputHistory).filter(i => i === high).length
    const newSignal = highCount === module.inputCount ? low : high
    return module.outputs.map(to => ({from: module.name, to, signal: newSignal}))
  }
}

const handlePulse = (modules, {from, to, signal}) => {
  const toModule = modules.get(to)
  if (!toModule) { return [] } // we have an untyped module, so the signal pulses end here
  const handler = moduleHandlers[toModule.type]
  return handler ? handler(toModule, signal, from) : []
}

const pressButton = (modules) => {
  let pulseCount = {low: 0, high: 0}

  const queuedPulses = [{from: button, to: broadcaster, signal: low}]
  while (queuedPulses.length > 0) {
    const pulse = queuedPulses.shift() // use unshift to act as an less efficient fifo queue
    pulseCount[pulse.signal]++
    const newPulses = handlePulse(modules, pulse)
    queuedPulses.push.apply(queuedPulses, newPulses)
  }

  return pulseCount
}

const part1LoopCount = 1000

const part1 = (input) => {
  const modules = parseInput(input)
  let totalPulseCount = {low: 0, high: 0}

  for (let i = 0; i < part1LoopCount; i++) {
    const pulseCount = pressButton(modules)
    totalPulseCount.low += pulseCount.low
    totalPulseCount.high += pulseCount.high
  }

  return totalPulseCount.low * totalPulseCount.high
}

const pressButtonPart2 = (modules, finalModuleName) => {
  let pulseCount = {}

  const queuedPulses = [{from: button, to: broadcaster, signal: low}]
  while (queuedPulses.length > 0) {
    const pulse = queuedPulses.shift() // use unshift to act as an less efficient fifo queue
    if (pulse.to === finalModuleName && pulse.signal === high) {
      pulseCount[pulse.from] = (pulseCount[pulse.from] || 0) + 1
    }
    pulseCount[pulse.signal]++
    const newPulses = handlePulse(modules, pulse)
    queuedPulses.push.apply(queuedPulses, newPulses)
  }

  return pulseCount
}

const part2 = (input) => {
  const modules = parseInput(input)
  const finalModules = [...modules.values()].filter(m => m.outputs.includes(finalModuleOutput))
  // inspect(modules)
  if (finalModules.length !== 1) { throw new Error(`Expected exactly 1 final module that outputs to ${finalModuleOutput}, instead found ${finalModules.length}`) }
  const finalModule = finalModules[0]
  if (finalModule.type !== conjunction) { throw new Error(`Expected final module to be a conjunction (&) type. Instead found ${finalModule.type}`)}
  const finalConjunctionInputs = new Set([...modules.values()].filter(m => m.outputs.includes(finalModule.name)).map(m => m.name))
  console.log("final module", finalModule)
  console.log("final inputs")
  inspect(finalConjunctionInputs)
  const foundCycles = new Map()
  let buttonPresses = 0
  while (foundCycles.size < finalConjunctionInputs.size) {
    buttonPresses++
    const pulseCount = pressButtonPart2(modules, finalModule.name)
    for (const moduleName of finalConjunctionInputs) {
      if (pulseCount[moduleName]) {
        foundCycles.set(moduleName, buttonPresses)
      }
    }
  }

  console.log("input cycles:")
  inspect(foundCycles)

  const cycleLengths = [...foundCycles.values()]
  const cycledGCD = findGCD(cycleLengths)
  const gcdMultiple = cycleLengths.reduce((acc, cycleLength) => {
    return acc * Math.ceil(cycleLength / cycledGCD)
  }, 1)

  return gcdMultiple * cycledGCD
}

await runner.testOutput('day20/example', '1', part1)
await runner.testOutput('day20/example_b', '1', part1)
// await runner.printOutput('day20/test', part1)
// await runner.copyOutput('day20/test', part1)
// await runner.writeOutput('day20/test', '1', part1)
await runner.testOutput('day20/test', '1', part1)

// await runner.testOutput('day20/example', '2', part2)
// await runner.printOutput('day20/test', part2)
// await runner.copyOutput('day20/test', part2)
// await runner.writeOutput('day20/test', '2', part2)
await runner.testOutput('day20/test', '2', part2)
