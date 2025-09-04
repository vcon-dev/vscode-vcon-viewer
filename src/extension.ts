import * as vscode from 'vscode';
import { VConViewerProvider } from './vconViewerProvider';
import { VConValidator } from './vconValidator';

export function activate(context: vscode.ExtensionContext) {
    console.log('vCon Viewer extension is now active!');

    // Register the vCon viewer provider
    const vconViewerProvider = new VConViewerProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            VConViewerProvider.viewType,
            vconViewerProvider
        )
    );

    // Register command to open vCon viewer
    let disposable = vscode.commands.registerCommand('vcon-viewer.openViewer', () => {
        vconViewerProvider.showViewer();
    });
    context.subscriptions.push(disposable);

    // Register document change listener for auto-detection
    const validator = new VConValidator();
    let documentChangeListener = vscode.workspace.onDidChangeTextDocument((event) => {
        const config = vscode.workspace.getConfiguration('vconViewer');
        if (config.get('autoDetect') && event.document.languageId === 'json') {
            const content = event.document.getText();
            if (validator.isVConFile(content)) {
                vscode.window.showInformationMessage('vCon file detected! Use "Open vCon Viewer" to view.');
            }
        }
    });
    context.subscriptions.push(documentChangeListener);

    // Register file open listener
    let fileOpenListener = vscode.workspace.onDidOpenTextDocument((document) => {
        if (document.languageId === 'json') {
            const content = document.getText();
            if (validator.isVConFile(content)) {
                vconViewerProvider.loadVCon(content, document.fileName);
            }
        }
    });
    context.subscriptions.push(fileOpenListener);
}

export function deactivate() {}

