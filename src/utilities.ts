export const prepend$ToKeys = <T>(parameter: T) =>
  Object.fromEntries(Object.entries(parameter).map(([key, value]) => [`$${key}`, value]))
