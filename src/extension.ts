// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

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
	let disposable = vscode.commands.registerCommand('extension.tidyComments', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Running TIDY COMMENTS');
		const TAB_DISTANCE = 5;		
		let lang = vscode.window.activeTextEditor!.document.languageId;
		let checkLanguages = ['html', 'javascript', 'typescript', 'scss', 'sass', 'css'];


		if (lang == 'typescript' || lang == 'javascript') {
			
			let selection = vscode.window.activeTextEditor!.selection;
			let posStart = new vscode.Position(selection.start.line, 0);
			let lastLineLength =  vscode.window.activeTextEditor!.document.lineAt(selection.end.line).text.length;
			let posEnd = new vscode.Position(selection.end.line, lastLineLength);
			let selectionRange = new vscode.Range(posStart, posEnd);

			let selectedText = vscode.window.activeTextEditor!.document.getText(selectionRange);

			if (selectedText.length !== 0) {
				let splittedText = selectedText.split('\n');
				let maxSpacing = 0;
				
				splittedText.forEach(str => {
					maxSpacing = str.length > maxSpacing ? str.length : maxSpacing;
				});

				console.log("Line: ", selection.start.line);
				console.log("Text: ", selectedText);
				console.log("Max is", maxSpacing);
				vscode.window.activeTextEditor!.edit((editBuilder: vscode.TextEditorEdit) => {
					for (let i = 0; i < splittedText.length; i++) {
						splittedText[i] = splittedText	[i].replace(/[\n\r]+/g, '');
						splittedText[i] = splittedText[i].trim();

						console.log("SOCCC", splittedText[i].length );
						let dist = maxSpacing - splittedText[i].length + TAB_DISTANCE;		

						editBuilder.insert(new vscode.Position(posStart.line + i, maxSpacing + TAB_DISTANCE), 
							' '.repeat(dist) + '// Comment');
					}
				});


			}
		}

	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
