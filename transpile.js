'use strict';
const ts = require('typescript');

const ignoredErrors = new Set([
  1208, // Cannot compile namespaces when the '--isolatedModules' flag is provided.
  2307, // Cannot find module '{0}'.
  2304, // Cannot find name '{0}'.
  2322, // Type '{0}' is not assignable to type '{1}'.
  2339  // Property '{0}' does not exist on type '{1}'.
]);
const filterErrors = err => !ignoredErrors.has(err.code);

module.exports = function transpileModule(input, transpileOptions) {
    var options = transpileOptions.compilerOptions ? ts.clone(transpileOptions.compilerOptions) : getDefaultCompilerOptions();
    options.isolatedModules = true;
    // transpileModule does not write anything to disk so there is no need to verify that there are no conflicts between input and output paths. 
    options.suppressOutputPathCheck = true;
    // Filename can be non-ts file.
    options.allowNonTsExtensions = true;
    // We are not returning a sourceFile for lib file when asked by the program,
    // so pass --noLib to avoid reporting a file not found error.
    options.noLib = true;
    // We are not doing a full typecheck, we are not resolving the whole context,
    // so pass --noResolve to avoid reporting missing file errors.
    options.noResolve = true;
    // if jsx is specified then treat file as .tsx
    var inputFileName = transpileOptions.fileName || (options.jsx ? "module.tsx" : "module.ts");
    var sourceFile = ts.createSourceFile(inputFileName, input, options.target);
    if (transpileOptions.moduleName) {
        sourceFile.moduleName = transpileOptions.moduleName;
    }
    sourceFile.renamedDependencies = transpileOptions.renamedDependencies;
    var newLine = ts.getNewLineCharacter(options);
    // Output
    var outputText;
    var sourceMapText;
    // Create a compilerHost object to allow the compiler to read and write files
    var compilerHost = {
        getSourceFile: function (fileName, target) { return fileName === ts.normalizeSlashes(inputFileName) ? sourceFile : undefined; },
        writeFile: function (name, text, writeByteOrderMark) {
            if (ts.fileExtensionIs(name, ".map")) {
                ts.Debug.assert(sourceMapText === undefined, "Unexpected multiple source map outputs for the file '" + name + "'");
                sourceMapText = text;
            }
            else {
                ts.Debug.assert(outputText === undefined, "Unexpected multiple outputs for the file: '" + name + "'");
                outputText = text;
            }
        },
        getDefaultLibFileName: function () { return "lib.d.ts"; },
        useCaseSensitiveFileNames: function () { return false; },
        getCanonicalFileName: function (fileName) { return fileName; },
        getCurrentDirectory: function () { return ""; },
        getNewLine: function () { return newLine; },
        fileExists: function (fileName) { return fileName === inputFileName; },
        readFile: function (fileName) { return ""; },
        directoryExists: function (directoryExists) { return true; }
    };
    var program = ts.createProgram([inputFileName], options, compilerHost);
    var diagnostics;
    if (transpileOptions.reportDiagnostics) {
        diagnostics = [];
        ts.addRange(/*to*/ diagnostics, /*from*/ program.getSyntacticDiagnostics(sourceFile));
        ts.addRange(/*to*/ diagnostics, /*from*/ program.getSemanticDiagnostics(sourceFile).filter(filterErrors));
        ts.addRange(/*to*/ diagnostics, /*from*/ program.getOptionsDiagnostics());
    }
    // Emit
    program.emit();
    ts.Debug.assert(outputText !== undefined, "Output generation failed");
    return { outputText: outputText, diagnostics: diagnostics, sourceMapText: sourceMapText };
}