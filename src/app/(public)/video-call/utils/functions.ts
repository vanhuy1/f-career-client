export const isEmpty = (object: any) => {
  if (object === null || object === undefined) return true
  return Object.keys(object).length === 0
}

export const getWindowDimensions = () => {
  try {
    const { innerWidth: width, innerHeight: height } = window
    return { width, height }
  } catch (error) {
    return { width: 0, height: 0 }
  }
}

export const isLink = (text: string) => {
  const linkRegex = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i",
  )

  return !!linkRegex.test(text)
}

export const hasKeyWordInWarning = (message: string) => {
  return message.includes("componentWillUpdate")
}
