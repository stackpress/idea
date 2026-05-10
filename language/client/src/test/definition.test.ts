import * as assert from 'assert';
import { activate, getDefinitions, getDocUri, positionOf } from './helper';

suite('Definitions', () => {
	test('Resolves imported type definitions', async () => {
		const uri = getDocUri('schema.idea');
		await activate(uri);
		const position = positionOf('Company?');
		const definitions = await getDefinitions(uri, position);
		assert.ok(definitions.length > 0);
		// Definition providers may return either Location or LocationLink,
		// depending on how VS Code chooses to surface the result.
		const targetUri = 'uri' in definitions[0]
			? definitions[0].uri
			: definitions[0].targetUri;
		assert.match(targetUri.fsPath, /another\.idea$/);
	});

	test('Resolves package-style imports through packages directory', async () => {
		const uri = getDocUri('pkg-import.idea');
		await activate(uri);
		// Package-style imports are a Stackpress-specific layout expectation,
		// so the test locks that lookup behavior in place.
		const position = positionOf('Shared');
		const definitions = await getDefinitions(uri, position);
		assert.ok(definitions.length > 0);
		const targetUri = 'uri' in definitions[0]
			? definitions[0].uri
			: definitions[0].targetUri;
		assert.match(targetUri.fsPath, /packages\/foo\/shared\.idea$/);
	});

	test('Resolves plugin package targets through packages directory', async () => {
		const uri = getDocUri('plugin-package.idea');
		await activate(uri);
		// Plugin strings should navigate like package references, not like inert
		// string literals, because that is how authors verify plugin targets.
		const position = positionOf('demo-plugin');
		const definitions = await getDefinitions(uri, position);
		assert.ok(definitions.length > 0);
		const targetUri = 'uri' in definitions[0]
			? definitions[0].uri
			: definitions[0].targetUri;
		assert.match(targetUri.fsPath, /packages\/demo-plugin\/package\.json$/);
	});
});
