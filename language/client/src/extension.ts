/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as path from 'path';
import { workspace, ExtensionContext } from 'vscode';
import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;

/**
 * The client stays intentionally small so all schema semantics live on the
 * server side, where they can also be tested in isolation.
 */
export function activate(context: ExtensionContext) {
	const serverModule = context.asAbsolutePath(
		path.join('server', 'out', 'server.js')
	);

	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
		}
	};

	const clientOptions: LanguageClientOptions = {
		// Untitled support matters for scratch buffers and new unsaved schema files.
		documentSelector: [
			{ scheme: 'file', language: 'idea' },
			{ scheme: 'untitled', language: 'idea' }
		],
		synchronize: {
			// Watching all Idea files lets the server refresh imported schemas when
			// related files change outside the active editor buffer.
			fileEvents: workspace.createFileSystemWatcher('**/*.idea')
		}
	};

	client = new LanguageClient(
		'ideaLanguageServer',
		'Idea Language Server',
		serverOptions,
		clientOptions
	);

	client.start();
}

/**
 * VS Code calls deactivate during shutdown or reload so the server process
 * can exit cleanly instead of hanging around as an orphan.
 */
export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
