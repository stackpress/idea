/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as vscode from 'vscode';
import * as assert from 'assert';
import {
	activate,
	getCompletionLabels,
	getDocUri,
	setTestContent
} from './helper';

suite('Should do completion', () => {
	const docUri = getDocUri('completion.idea');

	test('Completes top-level keywords in idea file', async () => {
		await activate(docUri);
		// An empty scratch document is the clearest way to prove the top-level
		// keyword suggestions are not leaking in from fixture content.
		await setTestContent('');
		const labels = await getCompletionLabels(docUri, new vscode.Position(0, 0));
		assert.ok(labels.includes('model'));
		assert.ok(labels.includes('use'));
	});

	test('Completes built in types for columns', async () => {
		// Partial type names verify type-ahead behavior, not just exact matches.
		await setTestContent('model User {\n  role Str\n}\n');
		const labels = await getCompletionLabels(docUri, new vscode.Position(1, 10));
		assert.ok(labels.includes('String'));
	});

	test('Completes attributes after a column type', async () => {
		// A trailing `@` is the edit shape most likely to regress if the context
		// classifier starts preferring type completions too aggressively.
		await setTestContent('model User {\n  role String @\n}\n');
		const labels = await getCompletionLabels(docUri, new vscode.Position(1, 15));
		assert.ok(labels.includes('@label'));
		assert.ok(labels.includes('@field.input'));
	});
});
