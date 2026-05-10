/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as vscode from 'vscode';
import * as path from 'path';
import * as assert from 'assert';

export let doc: vscode.TextDocument;
export let editor: vscode.TextEditor;
export let documentEol: string;
export let platformEol: string;

/**
 * Tests activate the extension through a real editor open so the language
 * server lifecycle matches what users do in VS Code.
 */
export async function activate(docUri: vscode.Uri) {
	const ext = vscode.extensions.getExtension('stackpress.idea-schema')!;
	await ext.activate();
	try {
		doc = await vscode.workspace.openTextDocument(docUri);
		editor = await vscode.window.showTextDocument(doc);
		// A short delay keeps the tests black-box oriented by waiting for the
		// server the same way a user would, instead of poking internal events.
		await sleep(2000);
	} catch (e) {
		console.error(e);
	}
}

/**
 * Polling-based waits are good enough here because the integration suite is
 * validating editor-visible behavior rather than micro-benchmarking latency.
 */
async function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fixtures live outside the compiled `out` directory so path resolution is
 * anchored relative to the test source layout.
 */
export const getDocPath = (p: string) => {
	return path.resolve(__dirname, '../../testFixture', p);
};

export const getDocUri = (p: string) => {
	return vscode.Uri.file(getDocPath(p));
};

/**
 * Replacing the full document keeps completion/definition tests compact and
 * avoids creating a new fixture file for every single editing scenario.
 */
export async function setTestContent(content: string): Promise<boolean> {
	const all = new vscode.Range(
		doc.positionAt(0),
		doc.positionAt(doc.getText().length)
	);
	const applied = await editor.edit(eb => eb.replace(all, content));
	// The follow-up pause lets the LSP server digest the edit before the test
	// asks for completions or diagnostics.
	await sleep(300);
	return applied;
}

/**
 * Diagnostics are asynchronous, so tests wait until the expected minimum
 * appears instead of assuming the server responded immediately.
 */
export async function waitForDiagnostics(uri: vscode.Uri, minimum = 1) {
	for (let attempt = 0; attempt < 20; attempt++) {
		const diagnostics = vscode.languages.getDiagnostics(uri);
		if (diagnostics.length >= minimum) {
			return diagnostics;
		}
		await sleep(200);
	}
	return vscode.languages.getDiagnostics(uri);
}

/**
 * Some completion tests temporarily introduce incomplete text, so this helper
 * waits until the document has settled back into a clean state first.
 */
export async function waitForNoDiagnostics(uri: vscode.Uri) {
	for (let attempt = 0; attempt < 20; attempt++) {
		const diagnostics = vscode.languages.getDiagnostics(uri);
		if (diagnostics.length === 0) {
			return diagnostics;
		}
		await sleep(200);
	}
	return vscode.languages.getDiagnostics(uri);
}

/**
 * Tests only care about the visible labels because the user-facing list is
 * what confirms the context classifier is doing the right thing.
 */
export async function getCompletionLabels(uri: vscode.Uri, position: vscode.Position) {
	const completionList = await vscode.commands.executeCommand<vscode.CompletionList>(
		'vscode.executeCompletionItemProvider',
		uri,
		position
	);
	return (completionList?.items || []).map(item => item.label.toString());
}

/**
 * Definitions can return either direct locations or location links, so the
 * helper leaves that distinction to the individual assertion.
 */
export async function getDefinitions(uri: vscode.Uri, position: vscode.Position) {
	return await vscode.commands.executeCommand<(vscode.Location | vscode.LocationLink)[]>(
		'vscode.executeDefinitionProvider',
		uri,
		position
	) || [];
}

/**
 * Searching by text keeps the tests readable because the fixture itself
 * shows the navigation target without hard-coded line numbers.
 */
export function positionOf(search: string) {
	const index = doc.getText().indexOf(search);
	assert.ok(index >= 0, `Expected fixture to contain "${search}"`);
	return doc.positionAt(index);
}
