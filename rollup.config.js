export default {
  input: 'src/index.js',
  output: [
    {
      dir: 'cjs',
      format: 'cjs',
      exports: 'default',
    },
    {
      dir: 'es',
      format: 'es',
    },
    {
      file: 'examples/umd.js',
      format: 'umd',
      name: 'useTokenPagination',
      globals: {
        react: 'React',
      },
    },
  ],
  external: ['react'],
}
