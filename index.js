var TypeScriptCompiler;

module.exports = TypeScriptCompiler = (function() {

    var exec    = require('child_process'),
        sysPath = require('path');

    TypeScriptCompiler.prototype.brunchPlugin = true;

    TypeScriptCompiler.prototype.type = 'javascript';

    TypeScriptCompiler.prototype.extension = 'ts';

    function TypeScriptCompiler(config) {
        this.config = config;
        null;
    }

    TypeScriptCompiler.prototype.compile = function(params, callback) {
        var opt = (typeof this.config.plugins.brunchTypescript === 'undefined'
                    ? {} : this.config.plugins.brunchTypescript);
        console.log("config.plugins.brunchTypescript:" + JSON.stringify(opt));

        var stderr = {
            Write: function (str) {
                process.stderr.write(str);
            },
            WriteLine: function (str) {
                process.stderr.write(str + '\n');
            },
            Close: function () {
            }
        };

        var search = function(item, array){
            for (key in array) {
                if (array[key]) {
                    return key;
                }
            }

            return null;
        };

        var outFile = search(params.path, this.config.files.javascripts.joinTo);

        if (outFile != null) {
            var cmd = sysPath.join(__dirname) + '/node_modules/.bin/tsc --out '
                        + this.config.paths.public + '/' + outFile + ' ' + params.path
                        + (typeof opt.tscOption === 'undefined' ? '' : ' ' + opt.tscOption);
            console.log(cmd);

            var child = exec.exec(cmd, function (error, stdout, stderr) {
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
        }

        return callback(null, params);
    };

    return TypeScriptCompiler;

})();
