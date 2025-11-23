# Installing the Repository Tools Extension

## Quick Install

The extension has been packaged as: `repo-tools-1.0.0.vsix`

### Method 1: Install via VS Code UI
1. Open VS Code or Antigravity
2. Go to Extensions (Ctrl+Shift+X)
3. Click the `...` menu → "Install from VSIX..."
4. Select `repo-tools-1.0.0.vsix`
5. Reload/Restart the editor

### Method 2: Install via Command Line
```bash
code --install-extension repo-tools-1.0.0.vsix
```

## Usage

### Download a File
1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type: "Repo Tools: Download File from Repository"
3. Follow the prompts:
   - Enter repository owner (e.g., `microsoft`)
   - Enter repository name (e.g., `vscode`)
   - Enter file path (e.g., `README.md`)
   - Enter branch/tag (default: `main`)
4. File will be downloaded and opened in your editor

### Download a Repository
1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type: "Repo Tools: Download Entire Repository"
3. Follow the prompts:
   - Enter repository owner
   - Enter repository name
   - Enter branch/tag (default: `main`)
4. Repository will be downloaded to your workspace
5. Option to open the downloaded folder

## Features

✅ Download individual files from any repository
✅ Download entire repositories
✅ Automatic extraction and folder cleanup
✅ Works in both VS Code and Antigravity
✅ No marketplace registration needed
✅ Fully local installation

## Uninstall

To remove the extension:
1. Go to Extensions
2. Find "Repository Tools"
3. Click Uninstall

Or via command line:
```bash
code --uninstall-extension local.repo-tools
```

## Troubleshooting

If the extension doesn't appear:
1. Restart VS Code/Antigravity
2. Check Extensions view to verify it's installed
3. Look for any error messages in the Output panel

## Package Info

- **File**: `repo-tools-1.0.0.vsix`
- **Size**: ~6.66 KB
- **Version**: 1.0.0
- **Publisher**: local (not on marketplace)
