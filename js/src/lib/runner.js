import path from "node:path"
import { readFile, writeFile } from "node:fs/promises"
import { spawn } from 'node:child_process'
import { inspect } from "node:util"

global.inspect = (obj) => {
  console.log(inspect(obj, {depth: null, colors: true}))
}

const COPY_BIN = "pbcopy"
const DATA_DIR = "data"
const inputFilePath = (input) => path.join(DATA_DIR, `${input}.input`)
const outputFilePath = (input, part) => path.join(DATA_DIR, `${input}_${part}.output`)

const red = "\u{001B}[31m"
const green = "\u{001B}[32m"
const bold = "\u{001B}[1m"
const reset = "\u{001B}[0m"
const checkmark = "✓"
const cross = "✗"

// testOutput: (testKey: string, solveFunc: (input: string) -> string)
export const testOutput = async (inputFile, part, solveFunc) => {
  const [inputData, outputData] = await Promise.all([
    readFile(inputFilePath(inputFile)),
    readFile(outputFilePath(inputFile, part)),
  ])

  const expected = outputData.toString().trim()
  const input = inputData.toString().trim()
  const result = String(solveFunc(input)).trim()

  if (result === expected) {
    console.log(`${green}${bold}${checkmark} Actual output matches expected output for data '${inputFile}' part ${part}${reset}`)
  } else {
    console.error(`${red}${bold}${cross} Actual output did not match expected output for data '${inputFile}' part ${part}${reset}`)
    console.log("Expected:")
    console.log(expected)
    console.log("Got:")
    console.log(result)
  }
}

export const printOutput = async (inputFile, solveFunc) => {
  const inputData = await readFile(inputFilePath(inputFile))
  const input = inputData.toString().trim()
  const result = String(solveFunc(input)).trim()
  console.log(`Result for input ${inputFile}:`)
  console.log(result)
}

export const writeOutput = async (inputFile, part, solveFunc) => {
  const inputData = await readFile(inputFilePath(inputFile))
  const input = inputData.toString().trim()
  const result = String(solveFunc(input)).trim()
  await writeFile(outputFilePath(inputFile, part), result)
  console.log(`Writing result for input ${inputFile} part ${part} to file`)
}

// This currently only works on macOS
export const copyOutput = async (inputFile, solveFunc) => {
  const inputData = await readFile(inputFilePath(inputFile))
  const input = inputData.toString().trim()
  const result = String(solveFunc(input)).trim()

  return new Promise((resolve, reject) => {
    const copyProcess = spawn(COPY_BIN)

    copyProcess.on('exit', (code) => {
      if (code === 0) {
        console.log(`The output for key ${inputFile} has been copied to the clipboard`)
        resolve()
      } else {
        reject(new Error(`Error copying output for ${inputFile}`))
      }
    })

    copyProcess.stdin.end(result)
  })
}
