# @preact/preset-vite

An all in one preset for writing Preact apps with the [vite](https://github.com/vitejs/vite) bundler.

Features:

- Sets up Hot Module Replacement via [prefresh](https://github.com/JoviDeCroock/prefresh/tree/main/packages/vite)
- Enables [Preact Devtools](https://preactjs.github.io/preact-devtools/) bridge during development
- Aliases React to `preact/compat`

## Installation

First intall the preset package from npm:

```bash
npm install --save-dev @preact/preset-vite
# or
yarn add -D @preact/preset-vite
```

Enhance your vite config with the Preact preset plugin in your `vite.config.ts` or `vite.config.js`:

```js
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

export default defineConfig({
  plugins: [preact()]
});
```

## Options

Options can be passed to our preset plugin via the first argument:

```js
export default defineConfig({
  plugins: [
    preact({ devtoolsInProd: true })
  ]
});
```

### Available options

| Option | Type | Default | Description |
|---|---|---|---|
| `devToolsEnabled` | `boolean` | `true` | Inject devtools bridge |
| `prefreshEnabled` | `boolean` | `true` | Inject [Prefresh](https://github.com/preactjs/prefresh) for HMR |
| `devtoolsInProd` | `boolean` | `false` | Inject devtools bridge in production bundle instead of only in development mode |

### Babel configuration

The `babel` option lets you add plugins, presets, and [other configuration](https://babeljs.io/docs/en/options) to the Babel transformation performed on each JSX/TSX file.

```js
preact({
  babel: {
    presets: [...],
    // Your plugins run before any built-in transform (eg: Fast Refresh)
    plugins: [...],
    // Use .babelrc files
    babelrc: true,
    // Use babel.config.js files
    configFile: true,
  }
})
```

## License

MIT, see [the license file](./LICENSE).
