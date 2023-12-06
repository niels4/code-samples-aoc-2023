export const isDigit = c => c >= "0" && c <= "9"

export const readNumberList = (str) => {
  const numberList = []
  let currentNum = ""

  const parseCurrentNum = () => {
    if (currentNum.length > 0) {
      numberList.push(Number(currentNum))
      currentNum = ""
    }
  }

  for (const char of str) {
    if (isDigit(char)) {
      currentNum += char
    } else {
      parseCurrentNum()
    }
  }
  parseCurrentNum()

  return numberList
}
