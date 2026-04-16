import * as vscode from 'vscode';
import { VConData, VConValidator } from './vconValidator';

export class VConViewerProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'vconViewer.view';

    private _view?: vscode.WebviewView;
    private _currentVCon: VConData | null = null;
    private _currentFileName: string = '';

    constructor(
        private readonly _extensionUri: vscode.Uri,
    ) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        _context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                this._extensionUri
            ]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        webviewView.webview.onDidReceiveMessage(data => {
            switch (data.type) {
                case 'playAudio':
                    this._playAudio(data.url);
                    break;
                case 'downloadAttachment':
                    this._downloadAttachment(data.attachment);
                    break;
                case 'exportVCon':
                    this._exportVCon(data.format);
                    break;
            }
        });
    }

    public showViewer() {
        if (this._view) {
            this._view.show(true);
        } else {
            vscode.commands.executeCommand('vconViewer.view.focus');
        }
    }

    public loadVCon(content: string, fileName: string) {
        const validator = new VConValidator();
        const vconData = validator.parseVCon(content);
        
        if (vconData) {
            this._currentVCon = vconData;
            this._currentFileName = fileName;
            
            if (this._view) {
                this._view.webview.postMessage({
                    type: 'loadVCon',
                    data: vconData,
                    fileName: fileName
                });
            }
        } else {
            const errors = validator.getValidationErrors(JSON.parse(content));
            vscode.window.showErrorMessage(`Invalid vCon file: ${errors.join(', ')}`);
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
        const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));

        return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>vCon Viewer</title>
                <link href="${styleResetUri}" rel="stylesheet">
                <link href="${styleVSCodeUri}" rel="stylesheet">
                <style>
                    body {
                        padding: 0;
                        color: var(--vscode-foreground);
                        font-family: var(--vscode-font-family);
                        font-size: var(--vscode-font-size);
                        background-color: var(--vscode-editor-background);
                    }
                    .container {
                        padding: 20px;
                        max-width: 1200px;
                        margin: 0 auto;
                    }
                    .header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 20px;
                        padding-bottom: 10px;
                        border-bottom: 1px solid var(--vscode-panel-border);
                    }
                    .section {
                        margin-bottom: 30px;
                        background: var(--vscode-editor-background);
                        border: 1px solid var(--vscode-panel-border);
                        border-radius: 6px;
                        overflow: hidden;
                    }
                    .section-header {
                        background: var(--vscode-panel-background);
                        padding: 10px 15px;
                        font-weight: bold;
                        border-bottom: 1px solid var(--vscode-panel-border);
                    }
                    .section-content {
                        padding: 15px;
                    }
                    .party-card {
                        background: var(--vscode-list-hoverBackground);
                        border: 1px solid var(--vscode-panel-border);
                        border-radius: 4px;
                        padding: 10px;
                        margin-bottom: 10px;
                    }
                    .dialog-item {
                        background: var(--vscode-list-hoverBackground);
                        border: 1px solid var(--vscode-panel-border);
                        border-radius: 4px;
                        padding: 15px;
                        margin-bottom: 15px;
                    }
                    .dialog-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 10px;
                    }
                    .dialog-type {
                        background: var(--vscode-badge-background);
                        color: var(--vscode-badge-foreground);
                        padding: 2px 8px;
                        border-radius: 12px;
                        font-size: 12px;
                    }
                    .dialog-body {
                        background: var(--vscode-input-background);
                        border: 1px solid var(--vscode-input-border);
                        border-radius: 4px;
                        padding: 10px;
                        margin-top: 10px;
                        white-space: pre-wrap;
                        font-family: var(--vscode-editor-font-family);
                    }
                    .attachment-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 10px;
                        border: 1px solid var(--vscode-panel-border);
                        border-radius: 4px;
                        margin-bottom: 10px;
                    }
                    .btn {
                        background: var(--vscode-button-background);
                        color: var(--vscode-button-foreground);
                        border: none;
                        padding: 8px 16px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                    }
                    .btn:hover {
                        background: var(--vscode-button-hoverBackground);
                    }
                    .btn-secondary {
                        background: var(--vscode-button-secondaryBackground);
                        color: var(--vscode-button-secondaryForeground);
                    }
                    .btn-secondary:hover {
                        background: var(--vscode-button-secondaryHoverBackground);
                    }
                    .metadata {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 10px;
                        margin-bottom: 20px;
                    }
                    .metadata-item {
                        background: var(--vscode-list-hoverBackground);
                        padding: 10px;
                        border-radius: 4px;
                    }
                    .metadata-label {
                        font-weight: bold;
                        color: var(--vscode-descriptionForeground);
                        font-size: 12px;
                    }
                    .metadata-value {
                        margin-top: 5px;
                        word-break: break-all;
                    }
                    .no-data {
                        text-align: center;
                        color: var(--vscode-descriptionForeground);
                        padding: 40px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>vCon Viewer</h1>
                        <div>
                            <button class="btn btn-secondary" onclick="exportVCon('json')">Export JSON</button>
                            <button class="btn btn-secondary" onclick="exportVCon('txt')">Export Text</button>
                        </div>
                    </div>
                    
                    <div id="no-data" class="no-data">
                        <h3>No vCon file loaded</h3>
                        <p>Open a vCon JSON file to view its contents</p>
                    </div>
                    
                    <div id="vcon-content" style="display: none;">
                        <div class="section">
                            <div class="section-header">Metadata</div>
                            <div class="section-content">
                                <div class="metadata" id="metadata"></div>
                            </div>
                        </div>
                        
                        <div class="section">
                            <div class="section-header">Parties</div>
                            <div class="section-content" id="parties"></div>
                        </div>
                        
                        <div class="section">
                            <div class="section-header">Dialog</div>
                            <div class="section-content" id="dialog"></div>
                        </div>
                        
                        <div class="section">
                            <div class="section-header">Attachments</div>
                            <div class="section-content" id="attachments"></div>
                        </div>
                        
                        <div class="section">
                            <div class="section-header">Analysis</div>
                            <div class="section-content" id="analysis"></div>
                        </div>
                        
                        <div class="section">
                            <div class="section-header">Jumps</div>
                            <div class="section-content" id="jumps"></div>
                        </div>
                        
                        <div class="section">
                            <div class="section-header">Groups</div>
                            <div class="section-content" id="groups"></div>
                        </div>
                        
                        <div class="section">
                            <div class="section-header">Signing</div>
                            <div class="section-content" id="signing"></div>
                        </div>
                        
                        <div class="section">
                            <div class="section-header">Encryption</div>
                            <div class="section-content" id="encryption"></div>
                        </div>
                    </div>
                </div>
                
                <script src="${scriptUri}"></script>
            </body>
            </html>`;
    }

    private _playAudio(url: string) {
        // This would open the audio in a new tab or use VSCode's built-in audio player
        vscode.env.openExternal(vscode.Uri.parse(url));
    }

    private _downloadAttachment(attachment: { filename?: string; uuid: string }) {
        // This would trigger a download of the attachment
        vscode.window.showInformationMessage(`Downloading ${attachment.filename || attachment.uuid}`);
    }

    private _exportVCon(format: string) {
        if (!this._currentVCon) {
            vscode.window.showErrorMessage('No vCon data to export');
            return;
        }

        if (format === 'json') {
            const content = JSON.stringify(this._currentVCon, null, 2);
            vscode.workspace.openTextDocument({
                content: content,
                language: 'json'
            }).then(doc => vscode.window.showTextDocument(doc));
        } else if (format === 'txt') {
            const content = this._formatVConAsText(this._currentVCon);
            vscode.workspace.openTextDocument({
                content: content,
                language: 'plaintext'
            }).then(doc => vscode.window.showTextDocument(doc));
        }
    }

    private _formatVConAsText(vcon: VConData): string {
        let text = `vCon: ${vcon.vcon}\n`;
        text += `UUID: ${vcon.uuid}\n`;
        text += `Created: ${vcon.created}\n`;
        if (vcon.updated) text += `Updated: ${vcon.updated}\n`;
        if (vcon.subject) text += `Subject: ${vcon.subject}\n`;
        text += '\n';

        if (vcon.parties && vcon.parties.length > 0) {
            text += 'PARTIES:\n';
            vcon.parties.forEach((party, index) => {
                text += `${index + 1}. ${party.name || 'Unknown'} (${party.uuid})\n`;
                if (party.tel) text += `   Tel: ${party.tel}\n`;
                if (party.email) text += `   Email: ${party.email}\n`;
                text += '\n';
            });
        }

        if (vcon.dialog && vcon.dialog.length > 0) {
            text += 'DIALOG:\n';
            vcon.dialog.forEach((dialog, index) => {
                text += `${index + 1}. ${dialog.type} (${dialog.uuid})\n`;
                if (dialog.start) text += `   Start: ${dialog.start}\n`;
                if (dialog.end) text += `   End: ${dialog.end}\n`;
                if (dialog.duration) text += `   Duration: ${dialog.duration}s\n`;
                if (dialog.body) text += `   Content: ${dialog.body}\n`;
                text += '\n';
            });
        }

        return text;
    }
}

