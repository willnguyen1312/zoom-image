"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectCssVars = exports.collectStyleCssClasses = void 0;
const reactivity_1 = require("@vue/reactivity");
const script_1 = require("../generators/script");
const templateGen = require("../generators/template");
const scriptRanges_1 = require("../parsers/scriptRanges");
const scriptSetupRanges_1 = require("../parsers/scriptSetupRanges");
const language_core_1 = require("@volar/language-core");
const parseCssClassNames_1 = require("../utils/parseCssClassNames");
const parseCssVars_1 = require("../utils/parseCssVars");
const sharedTypes = require("../utils/directorySharedTypes");
const plugin = ({ modules, vueCompilerOptions, compilerOptions }) => {
    const ts = modules.typescript;
    const instances = new WeakMap();
    const sharedTypesImport = sharedTypes.getImportName(compilerOptions);
    return {
        version: 1,
        getEmbeddedFileNames(fileName, sfc) {
            const tsx = useTsx(fileName, sfc);
            const fileNames = [];
            if (['js', 'ts', 'jsx', 'tsx'].includes(tsx.lang.value)) {
                fileNames.push(fileName + '.' + tsx.lang.value);
            }
            if (sfc.template) {
                fileNames.push(fileName + '.template_format.ts');
                fileNames.push(fileName + '.template_style.css');
            }
            return fileNames;
        },
        resolveEmbeddedFile(fileName, sfc, embeddedFile) {
            const _tsx = useTsx(fileName, sfc);
            const suffix = embeddedFile.fileName.replace(fileName, '');
            if (suffix === '.' + _tsx.lang.value) {
                embeddedFile.kind = language_core_1.FileKind.TypeScriptHostFile;
                embeddedFile.capabilities = {
                    ...language_core_1.FileCapabilities.full,
                    foldingRange: false,
                    documentFormatting: false,
                    documentSymbol: false,
                };
                const tsx = _tsx.tsxGen.value;
                if (tsx) {
                    embeddedFile.content = [...tsx.codes];
                    embeddedFile.mirrorBehaviorMappings = [...tsx.mirrorBehaviorMappings];
                }
            }
            else if (suffix.match(/^\.template_format\.ts$/)) {
                embeddedFile.parentFileName = fileName + '.template.' + sfc.template?.lang;
                embeddedFile.kind = language_core_1.FileKind.TextFile;
                embeddedFile.capabilities = {
                    ...language_core_1.FileCapabilities.full,
                    diagnostic: false,
                    foldingRange: false,
                    codeAction: false,
                    inlayHint: false,
                };
                if (_tsx.htmlGen.value) {
                    embeddedFile.content = [..._tsx.htmlGen.value.formatCodes];
                }
                for (const cssVar of _tsx.cssVars.value) {
                    embeddedFile.content.push('\n\n');
                    for (const range of cssVar.ranges) {
                        embeddedFile.content.push('(');
                        embeddedFile.content.push([
                            cssVar.style.content.substring(range.start, range.end),
                            cssVar.style.name,
                            range.start,
                            {},
                        ]);
                        embeddedFile.content.push(');\n');
                    }
                }
            }
            else if (suffix.match(/^\.template_style\.css$/)) {
                embeddedFile.parentFileName = fileName + '.template.' + sfc.template?.lang;
                if (_tsx.htmlGen.value) {
                    embeddedFile.content = [..._tsx.htmlGen.value.cssCodes];
                }
            }
        },
    };
    function useTsx(fileName, sfc) {
        if (!instances.has(sfc)) {
            instances.set(sfc, createTsx(fileName, sfc));
        }
        return instances.get(sfc);
    }
    function createTsx(fileName, _sfc) {
        const lang = (0, reactivity_1.computed)(() => {
            return !_sfc.script && !_sfc.scriptSetup ? 'ts'
                : _sfc.scriptSetup && _sfc.scriptSetup.lang !== 'js' ? _sfc.scriptSetup.lang
                    : _sfc.script && _sfc.script.lang !== 'js' ? _sfc.script.lang
                        : 'js';
        });
        const cssVars = (0, reactivity_1.computed)(() => collectCssVars(_sfc));
        const scriptRanges = (0, reactivity_1.computed)(() => _sfc.scriptAst
            ? (0, scriptRanges_1.parseScriptRanges)(ts, _sfc.scriptAst, !!_sfc.scriptSetup, false)
            : undefined);
        const scriptSetupRanges = (0, reactivity_1.computed)(() => _sfc.scriptSetupAst
            ? (0, scriptSetupRanges_1.parseScriptSetupRanges)(ts, _sfc.scriptSetupAst, vueCompilerOptions)
            : undefined);
        const cssModuleClasses = (0, reactivity_1.computed)(() => collectStyleCssClasses(_sfc, style => !!style.module));
        const cssScopedClasses = (0, reactivity_1.computed)(() => collectStyleCssClasses(_sfc, style => {
            const setting = vueCompilerOptions.experimentalResolveStyleCssClasses;
            return (setting === 'scoped' && style.scoped) || setting === 'always';
        }));
        const htmlGen = (0, reactivity_1.computed)(() => {
            if (!_sfc.templateAst)
                return;
            return templateGen.generate(ts, vueCompilerOptions, _sfc.template?.content ?? '', _sfc.template?.lang ?? 'html', _sfc.templateAst, hasScriptSetupSlots.value, sharedTypesImport, Object.values(cssScopedClasses.value).map(style => style.classNames).flat());
        });
        const hasScriptSetupSlots = (0, reactivity_1.shallowRef)(false); // remove when https://github.com/vuejs/core/pull/5912 merged
        const tsxGen = (0, reactivity_1.computed)(() => {
            hasScriptSetupSlots.value = !!scriptSetupRanges.value?.slotsTypeArg;
            return (0, script_1.generate)(ts, fileName, _sfc, lang.value, scriptRanges.value, scriptSetupRanges.value, cssVars.value, cssModuleClasses.value, cssScopedClasses.value, htmlGen.value, compilerOptions, vueCompilerOptions, sharedTypesImport);
        });
        return {
            lang,
            tsxGen,
            htmlGen,
            cssVars,
        };
    }
};
exports.default = plugin;
function collectStyleCssClasses(sfc, condition) {
    const result = [];
    for (let i = 0; i < sfc.styles.length; i++) {
        const style = sfc.styles[i];
        if (condition(style)) {
            const classNameRanges = [...(0, parseCssClassNames_1.parseCssClassNames)(style.content)];
            result.push({
                style: style,
                index: i,
                classNameRanges: classNameRanges,
                classNames: classNameRanges.map(range => style.content.substring(range.start + 1, range.end)),
            });
        }
    }
    return result;
}
exports.collectStyleCssClasses = collectStyleCssClasses;
function collectCssVars(sfc) {
    const result = [];
    for (let i = 0; i < sfc.styles.length; i++) {
        const style = sfc.styles[i];
        result.push({
            style,
            ranges: [...(0, parseCssVars_1.parseCssVars)(style.content)],
        });
    }
    return result;
}
exports.collectCssVars = collectCssVars;
//# sourceMappingURL=vue-tsx.js.map