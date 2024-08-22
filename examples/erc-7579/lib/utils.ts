// Display the first and last 6 characters of an address
export const splitAddress = (
  address: string,
  charDisplayed: number = 6
): string => {
  const firstPart = address.slice(0, charDisplayed)
  const lastPart = address.slice(address.length - charDisplayed)

  return `${firstPart}...${lastPart}`
}
