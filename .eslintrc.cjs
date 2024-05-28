/* eslint-env node */
module.exports = {
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:prettier/recommended",
	],
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	root: true,
	overrides: [
		{
			files: ["*.ts", "*.tsx", "*.js"],
			rules: {
				"@typescript-eslint/no-explicit-any": "off",
			},
		},
	],
};
