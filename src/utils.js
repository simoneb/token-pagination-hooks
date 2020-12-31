export function assertNumber(prop, value) {
  if (typeof value !== 'number') {
    throw new Error(`${prop} must be a number`)
  }
}
