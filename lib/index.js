var TypeScriptCompiler;

module.exports = TypeScriptCompiler = (function() {
    var TypeScript = require("typescript");

    TypeScriptCompiler.prototype.brunchPlugin = true;

    TypeScriptCompiler.prototype.type = 'javascript';

    TypeScriptCompiler.prototype.extension = 'ts';

    function TypeScriptCompiler(config) {
        this.config = config;
        null;
    }

    TypeScriptCompiler.prototype.compile = function(params, callback) {
        var js = "";
        var error = null;
        var outputWriter = {
            Write: function (str) {
                js += str;
            },
            WriteLine: function (str) {
                js += str + "\n";
            },
            Close: function () {
            }
        };
        var nullWriter = {
            Write: function (str) {
            },
            WriteLine: function (str) {
            },
            Close: function () {
            }
        };

        path = path.replace(/\\/g, "/");

        console.log(path);

        // try  {
        //     TypeScriptAPI.resolve([path], function(resolved) {
        //         if (TypeScriptAPI.check(resolved)) {
        //             TypeScriptAPI.compile(resolved, function(compiled) {
        //                 if(!TypeScriptAPI.check(compiled)) {
        //                     show_diagnostics (compiled, callback);
        //                 }
        //                 else {
        //                     for (var compileUnit in compiled) {
        //                         callback(null, compiled[compileUnit].content);
        //                     }
        //                 }
        //             });
        //         }
        //         else {
        //             show_diagnostics(resolved, callback);
        //         }
        //     });
        // } 
        // catch (err) {
        //     error = err.stack;
        // }
        finally {
            callback(error, js);
        }
    };

    return TypeScriptCompiler;

})();
