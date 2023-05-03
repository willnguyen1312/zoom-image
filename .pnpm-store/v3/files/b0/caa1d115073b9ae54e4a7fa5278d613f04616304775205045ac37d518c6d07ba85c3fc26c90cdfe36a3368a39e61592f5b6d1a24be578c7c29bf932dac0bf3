"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultVueLanguagePlugins = void 0;
const useHtmlFilePlugin = require("./plugins/file-html");
const useMdFilePlugin = require("./plugins/file-md");
const useVueFilePlugin = require("./plugins/file-vue");
const useVueSfcCustomBlocks = require("./plugins/vue-sfc-customblocks");
const useVueSfcScriptsFormat = require("./plugins/vue-sfc-scripts");
const useVueSfcStyles = require("./plugins/vue-sfc-styles");
const useVueSfcTemplate = require("./plugins/vue-sfc-template");
const useHtmlTemplatePlugin = require("./plugins/vue-template-html");
const vue_tsx_1 = require("./plugins/vue-tsx");
const CompilerDOM = require("@vue/compiler-dom");
const CompilerVue2 = require("./utils/vue2TemplateCompiler");
function getDefaultVueLanguagePlugins(ts, compilerOptions, vueCompilerOptions) {
    const plugins = [
        useMdFilePlugin,
        useHtmlFilePlugin,
        useVueFilePlugin,
        useHtmlTemplatePlugin,
        useVueSfcStyles,
        useVueSfcCustomBlocks,
        useVueSfcScriptsFormat,
        useVueSfcTemplate,
        vue_tsx_1.default,
        ...vueCompilerOptions.plugins,
    ];
    const pluginCtx = {
        modules: {
            '@vue/compiler-dom': vueCompilerOptions.target < 3 ? CompilerVue2 : CompilerDOM,
            typescript: ts,
        },
        compilerOptions,
        vueCompilerOptions,
    };
    const pluginInstances = plugins
        .map(plugin => plugin(pluginCtx))
        .sort((a, b) => {
        const aOrder = a.order ?? 0;
        const bOrder = b.order ?? 0;
        return aOrder - bOrder;
    });
    return pluginInstances.filter((plugin) => {
        const valid = plugin.version >= 1 && plugin.version < 2;
        if (!valid) {
            console.warn(`Plugin ${JSON.stringify(plugin.name)} API version incompatible, expected 1.x but got ${JSON.stringify(plugin.version)}`);
        }
        return valid;
    });
}
exports.getDefaultVueLanguagePlugins = getDefaultVueLanguagePlugins;
//# sourceMappingURL=plugins.js.map