"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProgram = void 0;
const ts = require("typescript");
const vue = require("@volar/vue-language-core");
const vueTs = require("@volar/vue-typescript");
const shared_1 = require("./shared");
function createProgram(options) {
    if (!options.options.noEmit && !options.options.emitDeclarationOnly)
        throw toThrow('js emit is not supported');
    if (!options.options.noEmit && options.options.noEmitOnError)
        throw toThrow('noEmitOnError is not supported');
    if (options.options.extendedDiagnostics || options.options.generateTrace)
        throw toThrow('--extendedDiagnostics / --generateTrace is not supported, please run `Write Virtual Files` in VSCode to write virtual files and use `--extendedDiagnostics` / `--generateTrace` via tsc instead of vue-tsc to debug.');
    if (!options.host)
        throw toThrow('!options.host');
    let program = options.oldProgram;
    if (shared_1.state.hook) {
        program = shared_1.state.hook.program;
        program.__vue.options = options;
    }
    else if (!program) {
        const ctx = {
            projectVersion: 0,
            options,
            get languageServiceHost() {
                return vueLsHost;
            },
            get languageService() {
                return vueTsLs;
            },
        };
        const vueCompilerOptions = getVueCompilerOptions();
        const scripts = new Map();
        const vueLsHost = new Proxy({
            // avoid failed with tsc built-in fileExists
            resolveModuleNames: undefined,
            resolveModuleNameLiterals: undefined,
            writeFile: (fileName, content) => {
                if (fileName.indexOf('__VLS_') === -1) {
                    ctx.options.host.writeFile(fileName, content, false);
                }
            },
            getCompilationSettings: () => ctx.options.options,
            getVueCompilationSettings: () => vueCompilerOptions,
            getScriptFileNames: () => {
                return ctx.options.rootNames;
            },
            getScriptVersion,
            getScriptSnapshot,
            getProjectVersion: () => {
                return ctx.projectVersion.toString();
            },
            getProjectReferences: () => ctx.options.projectReferences,
            isTsc: true,
        }, {
            get: (target, property) => {
                if (property in target) {
                    return target[property];
                }
                return ctx.options.host[property];
            },
        });
        const vueTsLs = vueTs.createLanguageService(vueLsHost);
        program = vueTsLs.getProgram();
        program.__vue = ctx;
        function getVueCompilerOptions() {
            const tsConfig = ctx.options.options.configFilePath;
            if (typeof tsConfig === 'string') {
                return vue.createParsedCommandLine(ts, ts.sys, tsConfig, []).vueOptions;
            }
            return {};
        }
        function getScriptVersion(fileName) {
            return getScript(fileName)?.version ?? '';
        }
        function getScriptSnapshot(fileName) {
            return getScript(fileName)?.scriptSnapshot;
        }
        function getScript(fileName) {
            const script = scripts.get(fileName);
            if (script?.projectVersion === ctx.projectVersion) {
                return script;
            }
            const modifiedTime = ts.sys.getModifiedTime?.(fileName)?.valueOf() ?? 0;
            if (script?.modifiedTime === modifiedTime) {
                return script;
            }
            if (ctx.options.host.fileExists(fileName)) {
                const fileContent = ctx.options.host.readFile(fileName);
                if (fileContent !== undefined) {
                    const script = {
                        projectVersion: ctx.projectVersion,
                        modifiedTime,
                        scriptSnapshot: ts.ScriptSnapshot.fromString(fileContent),
                        version: ctx.options.host.createHash?.(fileContent) ?? fileContent,
                    };
                    scripts.set(fileName, script);
                    return script;
                }
            }
        }
    }
    else {
        const ctx = program.__vue;
        ctx.options = options;
        ctx.projectVersion++;
    }
    const vueCompilerOptions = program.__vue.languageServiceHost.getVueCompilationSettings();
    if (vueCompilerOptions.hooks) {
        const index = (shared_1.state.hook?.index ?? -1) + 1;
        if (index < vueCompilerOptions.hooks.length) {
            const hookPath = vueCompilerOptions.hooks[index];
            const hook = require(hookPath);
            shared_1.state.hook = {
                program,
                index,
                worker: (async () => await hook(program))(),
            };
            throw 'hook';
        }
    }
    for (const rootName of options.rootNames) {
        // register file watchers
        options.host.getSourceFile(rootName, ts.ScriptTarget.ESNext);
    }
    return program;
}
exports.createProgram = createProgram;
function toThrow(msg) {
    console.error(msg);
    return msg;
}
//# sourceMappingURL=index.js.map