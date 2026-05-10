import * as assert from 'assert';
import { activate, getDocUri, waitForDiagnostics } from './helper';

suite('Diagnostics', () => {
	test('Reports parser errors', async () => {
		const uri = getDocUri('bad.idea');
		await activate(uri);
		// The test only asserts the user-visible contract: a broken document
		// should surface at least one meaningful parser error.
		const diagnostics = await waitForDiagnostics(uri);
		assert.ok(diagnostics.length > 0);
		assert.match(diagnostics[0].message, /Unexpected|Expecting|Invalid/i);
	});
});
