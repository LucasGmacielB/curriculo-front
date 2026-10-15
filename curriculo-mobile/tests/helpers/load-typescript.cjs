const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const ts = require('typescript');

const projectRoot = path.resolve(__dirname, '../..');

/** Execute a pure TypeScript module in memory, without emitting build files. */
function loadTypescript(relativePath, aliases = {}) {
  const filename = path.resolve(projectRoot, relativePath);
  const source = fs.readFileSync(filename, 'utf8');
  const compiled = ts.transpileModule(source, {
    fileName: filename,
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
    },
  }).outputText;
  const sourceRequire = createRequire(filename);
  const module = { exports: {} };
  const localRequire = (specifier) => {
    if (Object.hasOwn(aliases, specifier)) return aliases[specifier];
    if (specifier.startsWith('@/')) {
      throw new Error(`Provide an explicit test alias for ${specifier}`);
    }
    return sourceRequire(specifier);
  };
  const execute = vm.runInThisContext(
    `(function (exports, require, module, __filename, __dirname) {\n${compiled}\n})`,
    { filename },
  );
  execute(module.exports, localRequire, module, filename, path.dirname(filename));
  return module.exports;
}

module.exports = { loadTypescript };
