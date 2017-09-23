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
So we've talked about the first two properties: `entry` and `output`. So we know how to tell webpack where to start and where to put the bundles and how we want to create them. We can use different types of features and other types of modules inside our application. The whole goal is to allow Webpack to manage every asset even if it's not bundled together.

The way we go about doing this, is through our third core concept called `loaders`, it may not map directly to a configuration property, as you're actually defining `module` and `rules`. You may be wondering what a loader is.

In webpack we have a type of transform that takes a source and it makes some sort of transformation to it and then returns a new version of that source. Webpack leverages this concept by allowing any type of asset to be treated as a module, but in the end will be converted back to JavaScript, so webpack can add it to the dependency graph. There are 100 of different loaders for 100 of different use cases.

```js

const doSomething = require('do-something')

module.exports = function (source) {
  const newSource = doSomethingToSource(source)

  return source
}

```

I'm now going to go into why would you use a loader or a certain property for a specific scenario. So for all cases each ruleset is going to be an object and take two important properties that is required. The first one is `test`. Test tells webpack that when I come across a file, before it is going to be added to the dependency graph, match against this regex and perform a certain transform on it. And that transform is where loaders come into play. So a really common example is `babel-loader`. Any time you come across a JavaScript file in your application, you're going to be using babel-loader.


So when you think of functional transforms, it makes sense to think that they can be chained together. Loaders functionally tranform themselves from left to right.

If you had a `scss` file for example, you could add a `sass-loader` to the end of you loaders array, as you have the ability to compose these functional transforms on top of each other.
You can not only apply a single loader to your ruleset, but also an array of multiple loaders.

```js
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, './build'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'some-loader'
      },
      {
        test: /\.css$/,
        use: 'style-loader',
        use: 'css-loader' // Same as styleloader(cssloader(source))
      }
    ],
  },
}
```

### Setting loader options
Loaders also have the ability to have different types of options passed in to them, based on different scenarios. A great example of this would be if we're trying to load a jpeg and have it added to our dependency graph. The most common use case would be to leverage a loader called `url-loader`. What url-loader does is that whenever webpack comes across, i.e. in a css file, css-loader will invoke any `reference` to a background-url or another image url or a font url as a `dependency`. Therefore images like a jpeg can be `captured` with url-loader and base64-inline its value inside css. This wouldn't be great to happen everytime, therefore url-loader allows you to provide an option that if it's over a certain limit to just emit the file to your output directory. In order to add the `limit` option, you have to define the loader as an object and an options key inside the object. You can either define your loaders as strings or objects, totally up to you!

```js
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, './build'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'some-loader'
      },
      {
        test: /\.css$/,
        use: 'style-loader',
        use: 'css-loader' // Same as styleloader(cssloader(source))
      },
      {
        test: /\.jpeg$/,
        use: {loader: "url-loader", options: {
          limit: 10000
        }}
      }
    ],
  },
}


```

### Using our first loader
How webpack works is that it's going to automatically resolve the string you provided as a node module in your node_modules folder. We have added an image into our `.src` folder and in our entry we are importing this image. When we run `npm run build`, we have 2 assets created, `bundle.js` and the image. What file loader does is that whenever it comes across an asset or a module, it automatically emits that file to disk. This is perfect, because when you're ie dealing with a large image, you would never want to inline it, but you do want webpack to manage it. Because you can do awesome things on top of it.

`Image-webpack-loader` is an example of a loader that allows you to apply a bunch of different options and compression features to all of your images. This would be great as you can take all of your images and compressing them before your bundle is completed and you have CDN ready assets automatically available to you. The idea is that you want to have as many sources locally as possible, because loaders will allow you to maintain everything as part of the webpack dependency graph.

![image](https://user-images.githubusercontent.com/22747985/30777267-d83d3fc2-a0ae-11e7-9f7c-5b633d0a874a.png)


```js
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, './build'),
  },
  module: {
    rules: [
      {
        test: /\.jpe?g$/,
        use: 'file-loader',
      },
    ],
  },
}

```
