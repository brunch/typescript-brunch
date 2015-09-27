var TypeScriptCompiler;

module.exports = TypeScriptCompiler = (function() {

    var exec    = require('child_process'),
        sysPath = require('path'),
        mapping = {};

    TypeScriptCompiler.prototype.brunchPlugin = true;
    TypeScriptCompiler.prototype.type = 'javascript';
    TypeScriptCompiler.prototype.extension = 'ts';
    TypeScriptCompiler.prototype.pattern = /\.ts(x)?$/;

    function TypeScriptCompiler(config) {
        this.config = config;
    }

    TypeScriptCompiler.prototype.preCompile = function(callback, params) {
        var opt = (
            typeof this.config.plugins.brunchTypescript === 'undefined' ?
            {} :
            this.config.plugins.brunchTypescript
        );

        for (outFile in mapping) {
            var cmd = [];

            cmd.push(
                sysPath.join(__dirname) + '/node_modules/.bin/tsc --out ' +
                this.config.paths.public + '/' + outFile;
            );

            for (var i = mapping[outFile].length - 1; i >= 0; i--) {
                cmd.push(mapping[outFile][i]);
            };

            // Initialize options as a string
            if (typeof opt.tscOption === 'undefined') {
                opt.tscOption = '';
            }

            // Add support for React JSX files by default
            if (opt.tscOption.indexOf('--jsx') < 0) {
                cmd.push('--jsx react');
            }

            cmd.push(opt.tscOption);

            var child = exec.exec(cmd.join(' '), function(error, stdout, stderr) {
                if (error !== null) {
                    // if (error !== null) {
                    //     console.log(error);
                    // }

                    if (stdout !== null) {
                        console.log(stdout);
                    }

                    // if (stderr !== null) {
                    //     console.log(stderr);
                    // }
                }
            });
        };

        return callback(null, params);
    }

    TypeScriptCompiler.prototype.compile = function(params, callback) {
        if (typeof this.config.files.javascripts !== 'undefined' && typeof this.config.files.javascripts.joinTo !== 'undefined') {
            var search = function(item, array) {
                for (key in array) {
                    if (array[key]) {
                        return key;
                    }
                }

                return null;
            };

            var outFile = search(params.path, this.config.files.javascripts.joinTo);
            if (typeof mapping[outFile] === 'undefined') {
                mapping[outFile] = new Array();
            }
            mapping[outFile][mapping[outFile].length] = params.path;
        }

        return callback(null, params);
    }

    return TypeScriptCompiler;

})();
