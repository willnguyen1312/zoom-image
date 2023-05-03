import type { Plugin } from "vite";
import type { FilterPattern } from "@rollup/pluginutils";
import type { ParserOptions } from "@babel/parser";
import type { TransformOptions } from "@babel/core";
export declare type BabelOptions = Omit<TransformOptions, "ast" | "filename" | "root" | "sourceFileName" | "sourceMaps" | "inputSourceMap">;
export interface PreactPluginOptions {
    /**
     * Inject devtools bridge in production bundle instead of only in development mode.
     * @default false
     */
    devtoolsInProd?: boolean;
    /**
     * Whether to use Preact devtools
     * @default true
     */
    devToolsEnabled?: boolean;
    /**
     * Whether to use prefresh HMR
     * @default true
     */
    prefreshEnabled?: boolean;
    /**
     * RegExp or glob to match files to be transformed
     */
    include?: FilterPattern;
    /**
     * RegExp or glob to match files to NOT be transformed
     */
    exclude?: FilterPattern;
    /**
     * Babel configuration applied in both dev and prod.
     */
    babel?: BabelOptions;
}
export interface PreactBabelOptions extends BabelOptions {
    plugins: Extract<BabelOptions["plugins"], any[]>;
    presets: Extract<BabelOptions["presets"], any[]>;
    overrides: Extract<BabelOptions["overrides"], any[]>;
    parserOpts: ParserOptions & {
        plugins: Extract<ParserOptions["plugins"], any[]>;
    };
}
declare function preactPlugin({ devtoolsInProd, devToolsEnabled, prefreshEnabled, include, exclude, babel, }?: PreactPluginOptions): Plugin[];
export default preactPlugin;
export { preactPlugin as preact };
