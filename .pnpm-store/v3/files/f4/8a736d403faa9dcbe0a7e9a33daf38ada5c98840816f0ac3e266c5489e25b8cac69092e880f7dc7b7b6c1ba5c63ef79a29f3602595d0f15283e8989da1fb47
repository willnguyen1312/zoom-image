"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLanguageModules = void 0;
const path_1 = require("path");
const plugins_1 = require("./plugins");
const sourceFile_1 = require("./sourceFile");
const sharedTypes = require("./utils/directorySharedTypes");
function createLanguageModules(ts, compilerOptions, vueCompilerOptions) {
    patchResolveModuleNames(ts, vueCompilerOptions);
    const vueLanguagePlugin = (0, plugins_1.getDefaultVueLanguagePlugins)(ts, compilerOptions, vueCompilerOptions);
    const sharedTypesSnapshot = ts.ScriptSnapshot.fromString(sharedTypes.getTypesCode(vueCompilerOptions));
    const languageModule = {
        createFile(fileName, snapshot, languageId) {
            if (languageId === 'vue'
                || (!languageId
                    && vueCompilerOptions.extensions.some(ext => fileName.endsWith(ext)))) {
                return new sourceFile_1.VueFile(fileName, snapshot, ts, vueLanguagePlugin);
            }
        },
        updateFile(sourceFile, snapshot) {
            sourceFile.update(snapshot);
        },
        proxyLanguageServiceHost(host) {
            return {
                fileExists(fileName) {
                    const basename = path_1.posix.basename(fileName);
                    if (basename === sharedTypes.baseName) {
                        return true;
                    }
                    return host.fileExists(fileName);
                },
                getScriptFileNames() {
                    const fileNames = host.getScriptFileNames();
                    return [
                        ...getSharedTypesFiles(fileNames),
                        ...fileNames,
                    ];
                },
                getScriptVersion(fileName) {
                    const basename = path_1.posix.basename(fileName);
                    if (basename === sharedTypes.baseName) {
                        return '';
                    }
                    return host.getScriptVersion(fileName);
                },
                getScriptSnapshot(fileName) {
                    const basename = path_1.posix.basename(fileName);
                    if (basename === sharedTypes.baseName) {
                        return sharedTypesSnapshot;
                    }
                    return host.getScriptSnapshot(fileName);
                },
            };
        },
    };
    return [
        languageModule,
        ...vueCompilerOptions.experimentalAdditionalLanguageModules?.map(module => require(module)) ?? [],
    ];
    function getSharedTypesFiles(fileNames) {
        const moduleFiles = fileNames.filter(fileName => vueCompilerOptions.extensions.some(ext => fileName.endsWith(ext)));
        const moduleFileDirs = [...new Set(moduleFiles.map(path_1.posix.dirname))];
        return moduleFileDirs.map(dir => path_1.posix.join(dir, sharedTypes.baseName));
    }
}
exports.createLanguageModules = createLanguageModules;
function patchResolveModuleNames(ts, vueCompilerOptions) {
    try {
        // from https://github.com/johnsoncodehk/volar/pull/1543
        if (!(ts.__vuePatchResolveModuleNames)) {
            ts.__vuePatchResolveModuleNames = true;
            const resolveModuleNames = ts.resolveModuleName;
            ts.resolveModuleName = (...args) => {
                if (args[6] === ts.ModuleKind.ESNext && vueCompilerOptions.extensions.some(ext => args[0].endsWith(ext))) {
                    args[6] = ts.ModuleKind.CommonJS;
                }
                return resolveModuleNames(...args);
            };
        }
    }
    catch (e) {
        // console.warn('[volar] patchResolveModuleNames failed', e);
    }
}
//# sourceMappingURL=languageModule.js.map