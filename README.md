# Repository Tools - Testing Guide

## Build Status
✅ **Successfully built!**

The project has been recovered and compiled. All TypeScript files have been built to the `dist/` directory.

## Available Commands

### 1. Get Single File (`get_snippet.js`)
Downloads a specific file from a repository.

**Test Command:**
```bash
node dist/get_snippet.js --owner microsoft --repo vscode --path README.md --dest ./test-output
```

**Parameters:**
- `--owner <string>`: Repository owner (required)
- `--repo <string>`: Repository name (required)
- `--path <string>`: File path within repository (required)
- `--ref <string>`: Branch/tag/commit (default: "main")
- `--output <string>`: Full output path including filename
- `--dest <string>`: Destination folder (preserves filename)

### 2. Download Repository (`download_repo.js`)
Downloads and extracts an entire repository.

**Test Command:**
```bash
node dist/download_repo.js --owner microsoft --repo vscode-docs --dest ./test-repo
```

**Parameters:**
- `--owner <string>`: Repository owner (required)
- `--repo <string>`: Repository name (required)
- `--ref <string>`: Branch/tag/commit (default: "main")
- `--dest <string>`: Destination directory (default: current directory)

## Project Structure

```
repo-tools/
├── dist/                    # Compiled JavaScript files
│   ├── download_repo.js
│   ├── get_snippet.js
│   └── index.js            # MCP server
├── download_repo.ts         # TypeScript source
├── get_snippet.ts           # TypeScript source
├── index.ts                 # MCP server source
├── package.json
├── tsconfig.json
├── SKILL.md                 # Skill documentation
└── README.md               # This file
```

## Testing Steps

1. **Test Single File Download:**
   ```bash
   node dist/get_snippet.js --owner DrLinAITeam2 --repo for-test-github-app --path openspec/project.md
   ```

2. **Test Repository Download:**
   ```bash
   node dist/download_repo.js --owner DrLinAITeam2 --repo for-test-github-app --dest ./test-download
   ```

3. **Test MCP Server (for Claude Desktop):**
   - The MCP server is in `dist/index.js`
   - Configure in Claude Desktop's `claude_desktop_config.json`

## API Endpoint
- Base URL: `http://103.98.213.149:8510/`
- Endpoints:
  - `/contents` - Get single file
  - `/download-repo` - Download repository as ZIP

## Recovery Notes
This project was successfully recovered from Git objects after a `git reset --hard`. All source files have been restored and the project builds successfully.
