class ExamplePlugin {
  apply(compiler) {
    compiler.plugin('run', (compiler, callback) => {
      console.log('Webpack is Running')
      callback()
    })
  }
}

module.exports = ExamplePlugin
