Webpack looks for a configuration file in the root of your project by default. It's not the only way to use webpack, there's a node api and any cli flag can map to one of these configuration properties. But using a webpack.config.js is one of the most common usages.

Webpack tries to require the file by default and read the properties that are exported. We're therefore going to create a module and export an object that tells webpack how to bundle our application.

### Configuration Properties
The first and most important property that's required is _*entry*_. It's the first file in your _*dependency graph*_ or the first piece of code that kicks off your application.

Another property that's required is _*output/output.filename*_. This tells webpack where to actually create and what the name of your bundle is going to be. When we run webpack now, a bundle gets created with your filename. If you take a look at the code you'll be surprised to see a lot of additional code on top of the module we've created. The purpose of this is to allow modules to be run in the browser. It's considered the _*webpack runtime/webpackBootstrap code*_.

### Changing output of your bundle
In most cases you're not going to want a bundle.js to be created in the root of your project, a special folder, namely a _*public*_, _*dist*_, _*build*_ folder. We can do this by adding a property called _*path*_ to our output configuration option. You can't use the relative path, the path property is always going to look for an absolute path. We can use the path module in the following two ways to create the absolute path:

```js
path.join(__dirname, "build")
path.resolve("build")
```

### Dependency graph
Webpack is different from tools like Grunt and Gulp. They have you manually specify a large collection of JS files that are going to be concatenated together. The way webpack works, we use a term called the _*dependency graph*_. Webpack starts at the entry point and after it's resolved it's going to parse the entire file and look for statements like _*import*_, _*export*_, _*export default*_, _*require*_. It then marks those paths that are being referenced as dependencies and then webpack goes through each of these dependencies and creates modules and repeats that process through your entire application.

### Watch mode
Running webpack with the --watch cli flag allows webpack to constantly be watching any of the files in the dependencies that are referenced.
![image](https://user-images.githubusercontent.com/22747985/30708145-abe1f3f6-9ef5-11e7-82d7-33fd295f2e6f.png)

If we break the code by specifying a file which doesn't exist when importing `foo.js`, webpack will error but it will not quit watchmode! Therefore it's very beneficial as it will automatically only update the files you have changed and do that very quickly!
![image](https://user-images.githubusercontent.com/22747985/30708188-dda4f208-9ef5-11e7-90b8-3bec995adb62.png)

We have a file called `bar-cjs.js` and it's a `commonjs` module and we're exporting it in the same way as foo.

You can add as many modules to your dependency graph by simply importing them into different files that lead to your entry point. This is the main principle of webpack in that everything is surrounded with the dependency graph and allows us to have incremental builds. Also allows us to use modules and lets them run in the browser.

### Loaders and rules
So we've talked about the first two properties: _*entry*_ and _*output*_. So we know how to tell webpack where to start and where to put the bundles and how we want to create them. We can use different types of features and other types of modules inside our application. The whole goal is to allow Webpack to manage every asset even if it's not bundled together.

The way we go about doing this, is through our third core concept called _*loaders*_, it may not map directly to a configuration property, as you're actually defining _*module*_ and _*rules*_. You may be wondering what a loader is.

In webpack we have a type of transform that takes a source and it makes some sort of transformation to it and then returns a new version of that source. Webpack leverages this concept by allowing any type of asset to be treated as a module, but in the end will be converted back to JavaScript, so webpack can add it to the dependency graph. There are 100 of different loaders for 100 of different use cases.

```js

const doSomething = require('do-something')

module.exports = function (source) {
  const newSource = doSomethingToSource(source)

  return source
}

```