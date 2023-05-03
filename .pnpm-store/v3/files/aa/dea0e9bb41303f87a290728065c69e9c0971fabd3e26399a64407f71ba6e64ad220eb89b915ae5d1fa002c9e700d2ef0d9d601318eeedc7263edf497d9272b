"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveVueCompilerOptions = exports.createParsedCommandLine = exports.createParsedCommandLineByJson = void 0;
const path = require("path");
function createParsedCommandLineByJson(ts, parseConfigHost, rootDir, json, extraFileExtensions) {
    const tsConfigPath = path.join(rootDir, 'jsconfig.json');
    const proxyHost = proxyParseConfigHostForExtendConfigPaths(parseConfigHost);
    const content = ts.parseJsonConfigFileContent(json, proxyHost.host, rootDir, {}, tsConfigPath, undefined, extraFileExtensions);
    let vueOptions = {};
    for (const extendPath of proxyHost.extendConfigPaths.reverse()) {
        try {
            vueOptions = {
                ...vueOptions,
                ...getVueCompilerOptions(ts, ts.readJsonConfigFile(extendPath, proxyHost.host.readFile)),
            };
        }
        catch (err) { }
    }
    return {
        ...content,
        vueOptions,
    };
}
exports.createParsedCommandLineByJson = createParsedCommandLineByJson;
function createParsedCommandLine(ts, parseConfigHost, tsConfigPath, extraFileExtensions) {
    try {
        const proxyHost = proxyParseConfigHostForExtendConfigPaths(parseConfigHost);
        const config = ts.readJsonConfigFile(tsConfigPath, proxyHost.host.readFile);
        const content = ts.parseJsonSourceFileConfigFileContent(config, proxyHost.host, path.dirname(tsConfigPath), {}, tsConfigPath, undefined, extraFileExtensions);
        // fix https://github.com/johnsoncodehk/volar/issues/1786
        // https://github.com/microsoft/TypeScript/issues/30457
        // patching ts server broke with outDir + rootDir + composite/incremental
        content.options.outDir = undefined;
        let vueOptions = {};
        for (const extendPath of proxyHost.extendConfigPaths.reverse()) {
            try {
                vueOptions = {
                    ...vueOptions,
                    ...getVueCompilerOptions(ts, ts.readJsonConfigFile(extendPath, proxyHost.host.readFile)),
                };
            }
            catch (err) { }
        }
        return {
            ...content,
            vueOptions,
        };
    }
    catch (err) {
        console.warn('Failed to resolve tsconfig path:', tsConfigPath, err);
        return {
            fileNames: [],
            options: {},
            vueOptions: {},
            errors: [],
        };
    }
}
exports.createParsedCommandLine = createParsedCommandLine;
function proxyParseConfigHostForExtendConfigPaths(parseConfigHost) {
    const extendConfigPaths = [];
    const host = new Proxy(parseConfigHost, {
        get(target, key) {
            if (key === 'readFile') {
                return (fileName) => {
                    if (!fileName.endsWith('/package.json') && !extendConfigPaths.includes(fileName)) {
                        extendConfigPaths.push(fileName);
                    }
                    return target.readFile(fileName);
                };
            }
            return target[key];
        }
    });
    return {
        host,
        extendConfigPaths,
    };
}
function getVueCompilerOptions(ts, tsConfigSourceFile) {
    const folder = path.dirname(tsConfigSourceFile.fileName);
    const obj = ts.convertToObject(tsConfigSourceFile, []);
    const rawOptions = obj?.vueCompilerOptions ?? {};
    const result = {
        ...rawOptions,
    };
    const target = rawOptions.target ?? 'auto';
    if (target === 'auto') {
        const resolvedPath = resolvePath('vue/package.json');
        if (resolvedPath) {
            const vuePackageJson = require(resolvedPath);
            const versionNumbers = vuePackageJson.version.split('.');
            result.target = Number(versionNumbers[0] + '.' + versionNumbers[1]);
        }
        else {
            // console.warn('Load vue/package.json failed from', folder);
        }
    }
    else {
        result.target = target;
    }
    if (rawOptions.plugins) {
        const plugins = rawOptions.plugins
            .map((pluginPath) => {
            try {
                const resolvedPath = resolvePath(pluginPath);
                if (resolvedPath) {
                    return require(resolvedPath);
                }
            }
            catch (error) {
                console.warn('Load plugin failed', pluginPath, error);
            }
        })
            .filter((plugin) => !!plugin);
        result.plugins = plugins;
    }
    if (rawOptions.hooks) {
        result.hooks = rawOptions.hooks
            .map(resolvePath)
            .filter((hook) => !!hook);
    }
    if (rawOptions.experimentalAdditionalLanguageModules) {
        result.experimentalAdditionalLanguageModules = rawOptions.experimentalAdditionalLanguageModules
            .map(resolvePath)
            .filter((module) => !!module);
    }
    return result;
    function resolvePath(scriptPath) {
        try {
            if (require?.resolve) {
                return require.resolve(scriptPath, { paths: [folder] });
            }
            else {
                // console.warn('failed to resolve path:', scriptPath, 'require.resolve is not supported in web');
            }
        }
        catch (error) {
            // console.warn(error);
        }
    }
}
function resolveVueCompilerOptions(vueOptions) {
    const target = vueOptions.target ?? 3.3;
    const lib = vueOptions.lib || (target < 2.7 ? '@vue/runtime-dom' : 'vue');
    return {
        ...vueOptions,
        target,
        extensions: vueOptions.extensions ?? ['.vue'],
        lib,
        jsxSlots: vueOptions.jsxSlots ?? false,
        strictTemplates: vueOptions.strictTemplates ?? false,
        skipTemplateCodegen: vueOptions.skipTemplateCodegen ?? false,
        dataAttributes: vueOptions.dataAttributes ?? [],
        htmlAttributes: vueOptions.htmlAttributes ?? ['aria-*'],
        optionsWrapper: vueOptions.optionsWrapper ?? (target >= 2.7
            ? [`(await import('${lib}')).defineComponent(`, `)`]
            : [`(await import('vue')).default.extend(`, `)`]),
        macros: vueOptions.macros ?? {
            defineProps: ['defineProps'],
            defineSlots: ['defineSlots'],
            defineEmits: ['defineEmits'],
            defineExpose: ['defineExpose'],
            withDefaults: ['withDefaults'],
        },
        plugins: vueOptions.plugins ?? [],
        hooks: vueOptions.hooks ?? [],
        // experimental
        experimentalDefinePropProposal: vueOptions.experimentalDefinePropProposal ?? false,
        experimentalAdditionalLanguageModules: vueOptions.experimentalAdditionalLanguageModules ?? [],
        experimentalResolveStyleCssClasses: vueOptions.experimentalResolveStyleCssClasses ?? 'scoped',
        // https://github.com/vuejs/vue-next/blob/master/packages/compiler-dom/src/transforms/vModel.ts#L49-L51
        // https://vuejs.org/guide/essentials/forms.html#form-input-bindings
        experimentalModelPropName: vueOptions.experimentalModelPropName ?? {
            '': {
                input: true
            },
            value: {
                input: { type: 'text' },
                textarea: true,
                select: true
            }
        },
        experimentalUseElementAccessInTemplate: vueOptions.experimentalUseElementAccessInTemplate ?? false,
    };
}
exports.resolveVueCompilerOptions = resolveVueCompilerOptions;
//# sourceMappingURL=ts.js.map