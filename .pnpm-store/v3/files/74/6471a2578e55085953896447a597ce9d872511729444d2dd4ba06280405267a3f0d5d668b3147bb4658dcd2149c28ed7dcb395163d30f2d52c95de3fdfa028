import { normalizePath } from "vite";
import path from "path";
import debug from "debug";
import * as kl from "kolorist";
import { parseId } from "./utils.mjs";
export function preactDevtoolsPlugin({ injectInProd = false, shouldTransform, }) {
    const log = debug("vite:preact-devtools");
    let entry = "";
    let config;
    let found = false;
    const plugin = {
        name: "preact:devtools",
        // Ensure that we resolve before everything else
        enforce: "pre",
        config() {
            return {
                optimizeDeps: {
                    include: ["preact/debug", "preact/devtools"],
                },
            };
        },
        configResolved(resolvedConfig) {
            config = resolvedConfig;
        },
        resolveId(url, importer = "") {
            const { id } = parseId(url);
            // Get the main entry file to inject into
            if (!found && /\.html$/.test(importer) && shouldTransform(id)) {
                found = true;
                entry = normalizePath(path.join(config.root, id));
                // TODO: Vite types require explicit return
                // undefined here. They're lacking the "void" type
                // in their declarations
                return undefined;
            }
        },
        transform(code, url) {
            const { id } = parseId(url);
            if (entry === id && (!config.isProduction || injectInProd)) {
                const source = injectInProd ? "preact/devtools" : "preact/debug";
                code = `import "${source}";\n${code}`;
                log(`[inject] ${kl.cyan(source)} -> ${kl.dim(id)}`);
                return code;
            }
        },
    };
    return plugin;
}
