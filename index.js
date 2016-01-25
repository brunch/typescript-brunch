/*global __dirname */
'use strict';
const ts = require('typescript');
const anymatch = require('anymatch');

class TypeScriptCompiler {
  constructor(config) {
    if (!config) config = {};
    let options = config.plugins &&
      config.plugins.brunchTypescript || {};
    this.options = {};
    Object.keys(options).forEach(key => {
      if (key === 'sourceMap' || key === 'ignore') return;
      this.options[key] = options[key];
    });
    this.options.module = this.options.module || ts.ModuleKind.CommonJS;
    this.options.target = this.options.target || ts.ScriptTarget.ES5;
    this.options.emitDecoratorMetadata = this.options.emitDecoratorMetadata !== false,
    this.options.experimentalDecorators = this.options.experimentalDecorators !== false,
    this.options.sourceMap = !!config.sourceMaps;
    this.isIgnored = anymatch(options.ignore || /^(bower_components|vendor|node_modules)/);
    // if (this.options.pattern) {
    //   this.pattern = this.options.pattern;
    //   delete this.options.pattern;
    // }
  }
  
  compile(params) {
    if (this.isIgnored(params.path)) {
      return Promise.resolve(params);
    }
    let tsOptions = {
      fileName: params.path,
      compilerOptions: this.options
    }

    return new Promise((resolve, reject) => {
      let compiled;
      try {
        compiled = ts.transpileModule(params.data, tsOptions);
      } catch (err) {
        return reject(err);
      }
      const result = {data: compiled.outputText || compiled};

      // Concatenation is broken by trailing comments in files, which occur
      // frequently when comment nodes are lost in the AST from babel.
      result.data += '\n';

      if (compiled.sourceMapText) {
        result.map = JSON.stringify(compiled.sourceMapText);
      }
      resolve(result);
    });
  }
}

TypeScriptCompiler.prototype.brunchPlugin = true;
TypeScriptCompiler.prototype.type = 'javascript';
TypeScriptCompiler.prototype.extension = 'ts';
TypeScriptCompiler.prototype.pattern = /\.ts(x)?$/;

module.exports = TypeScriptCompiler;