# Repository Tools VS Code Extension

A VS Code extension to download files and entire repositories from GitHub directly into your workspace.

## Features

- **Download Single File**: Download any file from a GitHub repository
- **Download Repository**: Download and extract entire repositories
- Works with custom API endpoint for repository access

## Usage

### Download a File

1. Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type "Repo Tools: Download File from Repository"
3. Enter:
   - Repository owner (e.g., `microsoft`)
   - Repository name (e.g., `vscode`)
   - File path (e.g., `README.md`)
   - Branch/tag/commit (default: `main`)
4. File will be downloaded to your workspace and opened

### Download a Repository

1. Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type "Repo Tools: Download Entire Repository"
3. Enter:
   - Repository owner (e.g., `microsoft`)
   - Repository name (e.g., `vscode-docs`)
   - Branch/tag/commit (default: `main`)
4. Repository will be downloaded and extracted to your workspace
5. Option to open the downloaded folder

## Installation

### For Local Use (No Marketplace)

1. Build the extension:
   ```bash
   cd vscode-extension
   npm install
   npm run compile
   ```

2. Package the extension:
   ```bash
   npm run package
   ```

3. Install the `.vsix` file:
   - In VS Code: Extensions → `...` → Install from VSIX
   - Or run: `code --install-extension repo-tools-1.0.0.vsix`

## Development

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode
npm run watch

# Package extension
npm run package
```

## API Endpoint

Uses custom API: `http://103.98.213.149:8510/`

## Requirements

- VS Code 1.80.0 or higher
- Node.js for building

## License

ISC
