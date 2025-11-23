import * as vscode from 'vscode';
import axios from 'axios';
import AdmZip from 'adm-zip';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export function activate(context: vscode.ExtensionContext) {
    console.log('Repository Tools extension is now active');

    // Register get snippet command
    let getSnippetCmd = vscode.commands.registerCommand('repo-tools.getSnippet', async () => {
        await getSnippet();
    });

    // Register download repo command
    let downloadRepoCmd = vscode.commands.registerCommand('repo-tools.downloadRepo', async () => {
        await downloadRepo();
    });

    context.subscriptions.push(getSnippetCmd, downloadRepoCmd);
}

async function getSnippet() {
    try {
        // Get repository owner
        const owner = await vscode.window.showInputBox({
            prompt: 'Repository owner (e.g., microsoft)',
            placeHolder: 'owner'
        });
        if (!owner) return;

        // Get repository name
        const repo = await vscode.window.showInputBox({
            prompt: 'Repository name (e.g., vscode)',
            placeHolder: 'repo'
        });
        if (!repo) return;

        // Get file path
        const filePath = await vscode.window.showInputBox({
            prompt: 'File path within repository (e.g., README.md)',
            placeHolder: 'path/to/file'
        });
        if (!filePath) return;

        // Get ref (optional)
        const ref = await vscode.window.showInputBox({
            prompt: 'Branch/tag/commit (default: main)',
            placeHolder: 'main',
            value: 'main'
        });

        // Show progress
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Downloading ${filePath} from ${owner}/${repo}...`,
            cancellable: false
        }, async (progress) => {
            const url = 'http://103.98.213.149:8510/contents';

            const response = await axios.get(url, {
                params: {
                    owner,
                    repo,
                    path: filePath,
                    ref: ref || 'main'
                },
                headers: {
                    accept: 'application/json'
                }
            });

            if (!response.data.content) {
                throw new Error('No content found in response');
            }

            // Decode base64 content
            const decodedContent = Buffer.from(response.data.content, 'base64').toString('utf-8');

            // Get workspace folder or ask for destination
            let destPath: string;
            const workspaceFolders = vscode.workspace.workspaceFolders;

            if (workspaceFolders && workspaceFolders.length > 0) {
                const workspaceRoot = workspaceFolders[0].uri.fsPath;
                destPath = path.join(workspaceRoot, path.basename(filePath));
            } else {
                const uri = await vscode.window.showSaveDialog({
                    defaultUri: vscode.Uri.file(path.basename(filePath)),
                    filters: { 'All Files': ['*'] }
                });
                if (!uri) return;
                destPath = uri.fsPath;
            }

            // Write file
            fs.writeFileSync(destPath, decodedContent, 'utf-8');

            vscode.window.showInformationMessage(`File saved to ${destPath}`);

            // Open the file
            const doc = await vscode.workspace.openTextDocument(destPath);
            await vscode.window.showTextDocument(doc);
        });

    } catch (error: any) {
        vscode.window.showErrorMessage(`Error downloading file: ${error.message}`);
    }
}

async function downloadRepo() {
    try {
        // Get repository owner
        const owner = await vscode.window.showInputBox({
            prompt: 'Repository owner (e.g., microsoft)',
            placeHolder: 'owner'
        });
        if (!owner) return;

        // Get repository name
        const repo = await vscode.window.showInputBox({
            prompt: 'Repository name (e.g., vscode-docs)',
            placeHolder: 'repo'
        });
        if (!repo) return;

        // Get ref (optional)
        const ref = await vscode.window.showInputBox({
            prompt: 'Branch/tag/commit (default: main)',
            placeHolder: 'main',
            value: 'main'
        });

        // Get destination folder
        const workspaceFolders = vscode.workspace.workspaceFolders;
        let destPath: string;

        if (workspaceFolders && workspaceFolders.length > 0) {
            const workspaceRoot = workspaceFolders[0].uri.fsPath;
            destPath = path.join(workspaceRoot, repo);
        } else {
            const uri = await vscode.window.showOpenDialog({
                canSelectFiles: false,
                canSelectFolders: true,
                canSelectMany: false,
                openLabel: 'Select Destination Folder'
            });
            if (!uri || uri.length === 0) return;
            destPath = path.join(uri[0].fsPath, repo);
        }

        // Show progress
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Downloading repository ${owner}/${repo}...`,
            cancellable: false
        }, async (progress) => {
            const url = 'http://103.98.213.149:8510/download-repo';

            progress.report({ message: 'Downloading...' });

            const response = await axios.get(url, {
                params: {
                    owner,
                    repo,
                    ref: ref || 'main'
                },
                headers: {
                    accept: 'application/zip'
                },
                responseType: 'arraybuffer'
            });

            progress.report({ message: 'Extracting...' });

            const zip = new AdmZip(response.data);
            const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'repo-download-'));

            try {
                // Extract to temp dir
                zip.extractAllTo(tempDir, true);

                // Find top-level directory
                const files = fs.readdirSync(tempDir);
                if (files.length === 1 && fs.statSync(path.join(tempDir, files[0])).isDirectory()) {
                    const topLevelDir = path.join(tempDir, files[0]);

                    // Create destination
                    fs.mkdirSync(destPath, { recursive: true });

                    // Move contents
                    const contentFiles = fs.readdirSync(topLevelDir);
                    for (const file of contentFiles) {
                        const srcPath = path.join(topLevelDir, file);
                        const dstPath = path.join(destPath, file);

                        if (fs.existsSync(dstPath)) {
                            fs.rmSync(dstPath, { recursive: true, force: true });
                        }

                        fs.cpSync(srcPath, dstPath, { recursive: true });
                    }
                } else {
                    // No single root folder
                    fs.mkdirSync(destPath, { recursive: true });
                    for (const file of files) {
                        const srcPath = path.join(tempDir, file);
                        const dstPath = path.join(destPath, file);

                        if (fs.existsSync(dstPath)) {
                            fs.rmSync(dstPath, { recursive: true, force: true });
                        }

                        fs.cpSync(srcPath, dstPath, { recursive: true });
                    }
                }

                // Cleanup
                fs.rmSync(tempDir, { recursive: true, force: true });

                vscode.window.showInformationMessage(`Repository downloaded to ${destPath}`);

                // Ask to open folder
                const openFolder = await vscode.window.showInformationMessage(
                    'Repository downloaded successfully. Open folder?',
                    'Yes', 'No'
                );

                if (openFolder === 'Yes') {
                    await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(destPath), false);
                }

            } catch (error) {
                fs.rmSync(tempDir, { recursive: true, force: true });
                throw error;
            }
        });

    } catch (error: any) {
        vscode.window.showErrorMessage(`Error downloading repository: ${error.message}`);
    }
}

export function deactivate() { }
