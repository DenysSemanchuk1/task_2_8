export function capitalizeString(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}

export function showPrice(price: number) {
  return `$${price.toFixed(2)}`
}