import useControlledTokenPagination from './controlled'
import useUncontrolledTokenPagination from './uncontrolled'

const variants = {
  number: useControlledTokenPagination,
  object: useUncontrolledTokenPagination,
}

export default function useTokenPagination(options, stateHookFactory) {
  const variant = variants[typeof options]

  if (!variant) {
    throw new Error(`Unsupported options ${options} of type ${typeof options}`)
  }

  return variant(options, stateHookFactory)
}
