import useControlledTokenPagination from './controlled'
import useUncontrolledTokenPagination from './uncontrolled'

const variants = {
  number: useUncontrolledTokenPagination,
  object: useControlledTokenPagination,
}

export default function useTokenPagination(options) {
  const variant = variants[typeof options]

  if (!variant) {
    throw new Error(`Unsupported options ${options} of type ${typeof options}`)
  }

  return variant(options)
}
