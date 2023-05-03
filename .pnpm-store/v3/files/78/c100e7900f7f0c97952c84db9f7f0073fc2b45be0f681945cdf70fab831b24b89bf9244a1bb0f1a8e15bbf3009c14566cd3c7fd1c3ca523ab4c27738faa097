import prefresh from "@prefresh/vite";
import { preactDevtoolsPlugin } from "./devtools.mjs";
import { createFilter, parseId } from "./utils.mjs";
import { transformAsync } from "@babel/core";
// Taken from https://github.com/vitejs/vite/blob/main/packages/plugin-react/src/index.ts
function preactPlugin({ devtoolsInProd, devToolsEnabled, prefreshEnabled, include, exclude, babel, } = {}) {
    var _a;
    let config;
    let babelOptions = {
        babelrc: false,
        configFile: false,
        ...babel,
    };
    babelOptions.plugins || (babelOptions.plugins = []);
    babelOptions.presets || (babelOptions.presets = []);
    babelOptions.overrides || (babelOptions.overrides = []);
    babelOptions.parserOpts || (babelOptions.parserOpts = {});
    (_a = babelOptions.parserOpts).plugins || (_a.plugins = []);
    const shouldTransform = createFilter(include || [/\.[tj]sx?$/], exclude || [/node_modules/]);
    devToolsEnabled = devToolsEnabled !== null && devToolsEnabled !== void 0 ? devToolsEnabled : true;
    prefreshEnabled = prefreshEnabled !== null && prefreshEnabled !== void 0 ? prefreshEnabled : true;
    const jsxPlugin = {
        name: "vite:preact-jsx",
        enforce: "pre",
        config() {
            return {
                optimizeDeps: {
                    include: ["preact/jsx-runtime", "preact/jsx-dev-runtime"],
                },
            };
        },
        configResolved(resolvedConfig) {
            config = resolvedConfig;
        },
        async transform(code, url) {
            // Ignore query parameters, as in Vue SFC virtual modules.
            const { id } = parseId(url);
            if (!shouldTransform(id))
                return;
            const parserPlugins = [
                "importMeta",
                // This plugin is applied before esbuild transforms the code,
                // so we need to enable some stage 3 syntax that is supported in
                // TypeScript and some environments already.
                "topLevelAwait",
                "classProperties",
                "classPrivateProperties",
                "classPrivateMethods",
                !id.endsWith(".ts") && "jsx",
                /\.tsx?$/.test(id) && "typescript",
            ].filter(Boolean);
            const result = await transformAsync(code, {
                ...babelOptions,
                ast: true,
                root: config.root,
                filename: id,
                parserOpts: {
                    ...babelOptions.parserOpts,
                    sourceType: "module",
                    allowAwaitOutsideFunction: true,
                    plugins: parserPlugins,
                },
                generatorOpts: {
                    ...babelOptions.generatorOpts,
                    decoratorsBeforeExport: true,
                },
                plugins: [
                    ...babelOptions.plugins,
                    [
                        config.isProduction
                            ? "@babel/plugin-transform-react-jsx"
                            : "@babel/plugin-transform-react-jsx-development",
                        {
                            runtime: "automatic",
                            importSource: "preact",
                        },
                    ],
                    ...(config.isProduction ? [] : ["babel-plugin-transform-hook-names"]),
                ],
                sourceMaps: true,
                inputSourceMap: false,
            });
            // NOTE: Since no config file is being loaded, this path wouldn't occur.
            if (!result)
                return;
            return {
                code: result.code || code,
                map: result.map,
            };
        },
    };
    return [
        {
            name: "preact:config",
            config() {
                return {
                    resolve: {
                        alias: {
                            "react-dom/test-utils": "preact/test-utils",
                            "react-dom": "preact/compat",
                            react: "preact/compat",
                        },
                    },
                };
            },
        },
        jsxPlugin,
        ...(devToolsEnabled
            ? [
                preactDevtoolsPlugin({
                    injectInProd: devtoolsInProd,
                    shouldTransform,
                }),
            ]
            : []),
        ...(prefreshEnabled ? [prefresh({ include, exclude })] : []),
    ];
}
export default preactPlugin;
export { preactPlugin as preact };
