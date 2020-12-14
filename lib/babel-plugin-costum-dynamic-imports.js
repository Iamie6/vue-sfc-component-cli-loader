module.exports = function ({ types: t }) {
	return {
		visitor: {
			ImportDeclaration(path) {
				const source = path.node.source
				const specifiers = path.node.specifiers

				// console.log('source  ', source.value)
				if (/^@mit/.test(source.value)) {
					console.log('node ....   ', path.node)
					// if (t.isImportDefaultSpecifier(specifiers[0]) ) {
					// console.log('keys ....', Object.keys(specifier))
					var declarations = specifiers.map((specifier, i) => {
						return t.ImportDeclaration(
							[t.importDefaultSpecifier(specifier.local)],
							t.StringLiteral(`@src/t.mjs`)
						)
					})
					path.replaceWithMultiple(declarations)
					// }
					// console.log('specifier  ... ',  specifier)
					// console.log('进入   source.value', source.value)
					// var declarations = [t.ImportDeclaration([],t.StringLiteral(`../../../build/bin/t.js!@src/t.js?t=${source.value}`))]
					// var declarations = t.ImportDeclaration([t.ImportDefaultSpecifier(specifier.local)],  t.StringLiteral(`@src/t.mjs`))
					// path.replaceWith(declarations)
				} else {
					// console.log('没有进入',  source.value)
				}

			}
		}
	}
}
