## brunch-typescript
Adds TypeScript support to [brunch](http://brunch.io).

## Usage
Install the plugin via npm with `npm install --save brunch-typescript`.

Or, do manual install:

* Add `"brunch-typescript": "x.y.z"` to `package.json` of your brunch app.
  Pick a plugin version that corresponds to your minor (y) brunch version. Use version 2.y.z if you are using the latest version of Brunch.
* If you want to use git version of plugin, add
`"brunch-typescript": "git+ssh://git@github.com:baptistedonaux/brunch-typescript.git"`.

## brunch-config
Add any options for the TypeScript compiler to brunch-config.js as follows. These would be anything that you might put in your `tsconfig.json` file.

```js
exports.config = {
  plugins: {
    brunchTypescript: {
      removeComments: true
    }
  }
}
```

This plugin will default to the following:

```js
{
  target: "es5",
  module: "commonjs",
  emitDecoratorMetadata: true,
  experimentalDecorators: true
}
```

## Contributors

* [baptistedonaux](https://github.com/baptistedonaux "Baptiste Donaux")
* [xtity](https://github.com/xtity "xtity")
* [kripod](https://github.com/kripod "Kristóf Poduszló")
* [colinbate](https://github.com/colinbate "Colin Bate")


## License

The MIT License (MIT)

Copyright (c) 2015 Baptiste Donaux (http://www.baptiste-donaux.fr)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
