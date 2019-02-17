import stringToArg from 'string-argv'
import argParser from 'arg'

export const parseInputAsArgs = (input, argDefinitions) => {
  try {
    const argv = stringToArg(input)
    return argParser(argDefinitions, { argv })
  } catch (err) {
    throw err.message
  }
}
