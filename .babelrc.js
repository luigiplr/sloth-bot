module.exports = {
  presets: [
    [
      '@babel/preset-env',
      { targets: { node: 'current' } }
    ]
  ],
  plugins: [
    'add-module-exports'
  ],
  ignore: ['node_modules', 'build']
}
