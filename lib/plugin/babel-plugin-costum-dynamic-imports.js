const spawnSync = require('child_process').spawnSync
const a = require('./getCDN.js')
module.exports = function ({ types: t }) {
	return {
		visitor: {
			ImportDeclaration (path){
				const source = path.node.source
				const specifiers = path.node.specifiers
				if (/^@mit/.test(source.path)) {
					var declarations = specifiers.map((specifier, i) => {
						return t.ImportDeclaration(
							[t.importDefaultSpecifier(specifier.local)],
							t.StringLiteral(`@root/examples/t.mjs`)
						)
					})
					path.replaceWithMultiple(declarations)
				}
			}
		}
	}
}
