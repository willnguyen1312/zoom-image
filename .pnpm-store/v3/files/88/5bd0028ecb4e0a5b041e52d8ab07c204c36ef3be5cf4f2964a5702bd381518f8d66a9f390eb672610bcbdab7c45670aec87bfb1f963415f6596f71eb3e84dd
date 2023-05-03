module.exports = function ({ types: t, template }) {
	const libs = ["preact/hooks", "preact/compat", "react"];
	const helper = template`addHookName(CALL, NAME)`;

	return {
		name: "transform-hook-names",
		visitor: {
			Program: {
				exit(path, state) {
					if (!state.helper) return;
					path.unshiftContainer(
						"body",
						template.ast`import { addHookName } from "preact/devtools";`,
					);
				},
			},
			CallExpression(path, state) {
				const callee = path.get("callee");

				if (!callee.isIdentifier()) return;
				const hookName = callee.node.name;
				if (!/^(useState|useReducer|useRef|useMemo)$/.test(hookName)) return;
				if (!libs.some(lib => callee.referencesImport(lib))) return;

				const p = path.parentPath.getOuterBindingIdentifierPaths();
				const pathKeys = Object.keys(p);
				if (!pathKeys.length) return;
				const firstBinding = p[pathKeys[0]];

				let name = firstBinding.getSource();

				// If the binding is empty than the ArrayPattern was likely
				// transpiled away. Check if this is the case
				//
				// ```js
				// // untranspiled
				// const [foo, setFoo] = useState(0)
				//
				// // transpiled
				// var _useState = useState(0),
				//   foo = _useState[0],
				//   setFoo = _useState[1];
				// ```
				if (pathKeys.length === 1) {
					if (
						t.isVariableDeclaration(path.parentPath.parentPath.node) &&
						t.isIdentifier(firstBinding.node)
					) {
						const declarations = path.parentPath.parentPath.getOuterBindingIdentifierPaths();
						const bindingKeys = Object.keys(declarations);
						const bindingName = firstBinding.node.name;

						if (
							/useState|useReducer/.test(hookName) &&
							bindingKeys.length >= 3 &&
							bindingKeys[0] === bindingName &&
							bindingKeys.slice(1, 3).every(key => {
								const decl = declarations[key];
								const init = decl.parent.init;
								return (
									t.isMemberExpression(init) &&
									t.isIdentifier(init.object) &&
									init.object.name.includes(hookName)
								);
							})
						) {
							name = bindingKeys[1];
						}
						// Still downtranspiled but it's not a `useState` or
						// `useReducer` call, so we can't make assumptions about
						// the return value. We'll fall back to the hook name
						// when this happens.
						else if (name !== hookName && name.includes(hookName)) {
							name = hookName;
						}
					}
				}
				state.helper = true;
				path.replaceWith(
					helper({
						CALL: t.clone(path.node),
						NAME: t.stringLiteral(name),
					}),
				);
			},
		},
	};
};
