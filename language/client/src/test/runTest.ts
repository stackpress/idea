/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as path from 'path';
import { runTests } from '@vscode/test-electron';

/**
 * The test harness launches a real VS Code instance because the extension
 * behavior depends on the editor/runtime boundary, not just on pure functions.
 */
async function main() {
	try {
		const extensionDevelopmentPath = path.resolve(__dirname, '../../../');

		const extensionTestsPath = path.resolve(__dirname, './index');

		await runTests({ extensionDevelopmentPath, extensionTestsPath });
	} catch (err) {
		console.error('Failed to run tests');
		console.error(err);
		process.exit(1);
	}
}

main();
