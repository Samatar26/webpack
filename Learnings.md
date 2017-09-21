Webpack looks for a configuration file in the root of your project by default. It's not the only way to use webpack, there's a node api and any cli flag can map to one of these configuration properties. But using a webpack.config.js is one of the most common usages.

Webpack tries to require the file by default and read the properties that are exported. We're therefore going to create a module and export an object that tells webpack how to bundle our application.

### Configuration Properties
The first and most important property that's required is _*entry*_. It's the first file in your _*dependency graph*_ or the first piece of code that kicks off your application.

Another property that's required is _*output/output.filename*_. This tells webpack where to actually create and what the name of your bundle is going to be. When we run webpack now, a bundle gets created with your filename. If you take a look at the code you'll be surprised to see a lot of additional code on top of the module we've created. The purpose of this is to allow modules to be run in the browser. It's considered the _*webpack runtime/webpackBootstrap code*_.