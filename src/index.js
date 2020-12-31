import useControlledTokenPagination from './controlled'
import useUncontrolledTokenPagination from './uncontrolled'
import * as persisters from './persisters'

const variants = {
  number: useControlledTokenPagination,
  object: useUncontrolledTokenPagination,
}

export default function useTokenPagination(options) {
  const variant = variants[typeof options]

  if (!variant) {
    throw new Error(`Unsupported options ${options} of type ${typeof options}`)
  }

  return variant(options)
}

Object.assign(useTokenPagination, persisters)
