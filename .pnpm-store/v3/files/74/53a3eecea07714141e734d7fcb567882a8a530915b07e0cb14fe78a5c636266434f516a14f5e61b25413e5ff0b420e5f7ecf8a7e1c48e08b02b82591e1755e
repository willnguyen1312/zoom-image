### A base TSConfig for working with Svelte.

Add the package to your `"devDependencies"`:

```sh
npm install --save-dev @tsconfig/svelte
yarn add --dev @tsconfig/svelte
```

Add to your `tsconfig.json`:

```json
"extends": "@tsconfig/svelte/tsconfig.json"
```

> **NOTE**: After `@tsconfig/svelte@2.0.0`, you should add `/// <reference types="svelte" />` to a `d.ts` or a `index.ts`(entry) file to prevent typescript error.

---

The `tsconfig.json`: 

```jsonc
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "Svelte",
  "_version": "4.0.0",

  "compilerOptions": {
    "moduleResolution": "node",
    "target": "es2017",
    /**
      Svelte Preprocess cannot figure out whether you have a value or a type, so tell TypeScript
      to enforce using `import type` instead of `import` for Types.
     */
    "verbatimModuleSyntax": true,
    /**
      To have warnings/errors of the Svelte compiler at the correct position,
      enable source maps by default.
     */
    "sourceMap": true,

    "strict": false,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}

```

You can find the [code here](https://github.com/tsconfig/bases/blob/master/bases/svelte.json).
