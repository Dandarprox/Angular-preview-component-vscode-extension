// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

interface UserConfiguration {
	openInColumn: boolean,
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function insertAtPos(baseStr: string, extraStr: string, position: number) {
	return [baseStr, '\t'.repeat(position - baseStr.length), extraStr].join('');
}
// function insertAtPos(baseStr, extraStr, position) {
// 	return baseStr.substring(0, position) + extraStr + baseStr.substring(position);
// }
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.ngPrevComponent', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Running Angular preview component');
		let lang = vscode.window.activeTextEditor!.document.languageId;
		const checkLanguages = [
			'html', 
			'typescript', 
			'scss', 
			'sass', 
			'css'
		]
		const checkExtensions = ['html', 'ts', 'scss', 'sass', 'css'];	
		let configurations: UserConfiguration = vscode.workspace.getConfiguration('ng-prev-component') as any;

		if (checkLanguages.some(clang => clang == lang)) {
			vscode.window.showInformationMessage('Looking for files...');

			let activeFile = vscode.window.activeTextEditor;
			
			if (activeFile) {
				let fileURI = (activeFile as vscode.TextEditor).document.uri;
				let workspaceFsPath = vscode.workspace.getWorkspaceFolder(fileURI)!.uri.path.toLowerCase();
				
				const FileRegex = /([a-z|\-]+)\.component\.([a-z]+)$/gi;
				let file = FileRegex.exec(activeFile.document.fileName)!;
				let fileName = file[1];
				let fileExtension = file[2];

				console.log(fileName, fileExtension, workspaceFsPath);

				let searchGlobPattern = '{';
				checkExtensions.forEach((ext, index) => {
					if (fileExtension == ext) return;
					searchGlobPattern += `**/${fileName}.component.${ext}`;

					if (index + 1 != checkExtensions.length) {
						searchGlobPattern += ',';
					}
				});
				searchGlobPattern += '}';
				
				vscode.workspace.findFiles(searchGlobPattern, '**​/node_modules/**')
					.then(uris => {
						if (uris.length == 0) vscode.window.showInformationMessage('FILES not found')

						uris.forEach(uri => {
							if (uri.path.toLowerCase().includes(workspaceFsPath)) {
								
								vscode.workspace.openTextDocument(uri)
									.then(doc => {
										let showMethod: vscode.TextDocumentShowOptions = {
											preview: false
										};

										if (configurations && configurations.openInColumn) showMethod.viewColumn = vscode.ViewColumn.Beside;
										vscode.window.showTextDocument(doc, showMethod);
									});

							}
						});

					});
			}
		} else {
			vscode.window.showInformationMessage('Current file is not valid');
		}
		
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
