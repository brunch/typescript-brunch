'use strict';

const ts = require('typescript');

const ignoredErrors = new Set([
  1208, // Cannot compile namespaces when the '--isolatedModules' flag is provided.
  2307, // Cannot find module '{0}'.
  2304, // Cannot find name '{0}'.
  2322, // Type '{0}' is not assignable to type '{1}'.
  2339, // Property '{0}' does not exist on type '{1}'.
]);

const filterErrors = err => !ignoredErrors.has(err.code);

const transpileModule = (input, transpileOptions) => {
  const options = ts.clone(transpileOptions.compilerOptions);

  options.isolatedModules = true;
  // transpileModule does not write anything to disk so there is no need to
  // verify that there are no conflicts between input and output paths.
  options.suppressOutputPathCheck = true;
  // Filename can be non-ts file.
  options.allowNonTsExtensions = true;
  // We are not doing a full typecheck, we are not resolving the whole context,
  // so pass --noResolve to avoid reporting missing file errors.
  options.noResolve = true;
  // We do want to emit here, so specifically enable it.
  options.noEmit = false;
  // if jsx is specified then treat file as .tsx
  const inputFileName = transpileOptions.fileName ||
    (options.jsx ? 'module.tsx' : 'module.ts');

  const sourceFile = ts.createSourceFile(inputFileName, input, options.target);

  if (transpileOptions.moduleName) {
    sourceFile.moduleName = transpileOptions.moduleName;
  }

  sourceFile.renamedDependencies = transpileOptions.renamedDependencies;

  // Output
  let outputText;
  let sourceMapText;

  // Create a default compiler host object.
  const compilerHost = ts.createCompilerHost(options);

  // Setup our own getSourceFile() function.
  const origGetSourceFile = compilerHost.getSourceFile;
  compilerHost.getSourceFile = (fileName, languageVersion, onError) => {
    // If the compiler is asking for the file we're compiling, return the
    // sourceFile we prepared above.
    if (fileName === ts.normalizeSlashes(inputFileName)) {
      return sourceFile;
    }
    // Otherwise, handoff to the default getSourceFile function.
    return origGetSourceFile(fileName, languageVersion, onError);
  };

  // Setup our own writeFile() function to capture the compiled ouput and
  // source map.
  compilerHost.writeFile = (name, text /* writeByteOrderMark */) => {
    if (ts.fileExtensionIs(name, '.map')) {
      ts.Debug.assert(sourceMapText === undefined, `Unexpected multiple source map outputs for the file '${name}'`);
      sourceMapText = text;
    } else {
      ts.Debug.assert(outputText === undefined, `Unexpected multiple outputs for the file: '${name}'`);
      outputText = text;
    }
  };

  const program = ts.createProgram([inputFileName], options, compilerHost);

  let diagnostics;
  if (transpileOptions.reportDiagnostics) {
    diagnostics = [];
    ts.addRange(/* to */ diagnostics, /* from */ program.getSyntacticDiagnostics(sourceFile));
    ts.addRange(/* to */ diagnostics, /* from */ program.getSemanticDiagnostics(sourceFile).filter(filterErrors));
    ts.addRange(/* to */ diagnostics, /* from */ program.getOptionsDiagnostics());
  }

  // Emit
  program.emit();
  ts.Debug.assert(outputText !== undefined, 'Output generation failed');

  return {outputText, diagnostics, sourceMapText};
};

module.exports = transpileModule;
