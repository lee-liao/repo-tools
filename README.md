# Repository Tools - Testing Guide

## Build Status
✅ **Successfully built!**

The project has been recovered and compiled. All TypeScript files have been built to the `dist/` directory.

## Available Commands

### 1. Get Single File (`get_snippet.js`)
Downloads a specific file from a repository.

**Test Command:**
```bash
node deploy/get_snippet.js --owner microsoft --repo vscode --path README.md --dest ./test-output
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
node deploy/download_repo.js --owner microsoft --repo vscode-docs --dest ./test-repo
```

**Parameters:**
- `--owner <string>`: Repository owner (required)
- `--repo <string>`: Repository name (required)
- `--ref <string>`: Branch/tag/commit (default: "main")
- `--dest <string>`: Destination directory (default: current directory)

## Project Structure

```
repo-tools/
├── deploy/                  # Deployment-ready bundled files
│   ├── download_repo.js     # Bundled (643 KB, all dependencies included)
│   ├── get_snippet.js       # Bundled (546 KB, all dependencies included)
│   ├── SKILL.md             # Skill documentation
│   └── README.md            # Deployment instructions
├── dist/                    # Build output (ignored by git)
│   ├── download_repo.js     # Bundled version
│   ├── get_snippet.js       # Bundled version
│   └── *.d.ts, *.map        # TypeScript artifacts
├── download_repo.ts         # TypeScript source
├── get_snippet.ts           # TypeScript source
├── index.ts                 # MCP server source (optional)
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── .gitignore               # Ignores node_modules/ and dist/
├── SKILL.md                 # Skill documentation
├── README.md                # This file
└── RECOVERY_COMPLETE.md     # Recovery process documentation
```

## NPM Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run bundle` - Create bundled standalone JS files with esbuild
- `npm run prepare-deploy` - Bundle and copy to deploy/ folder
- `npm run deploy` - Deploy to Claude skills directory


## Testing Steps

1. **Test Single File Download:**
   ```bash
   node deploy/get_snippet.js --owner DrLinAITeam2 --repo for-test-github-app --path openspec/project.md
   ```

2. **Test Repository Download:**
   ```bash
   node deploy/download_repo.js --owner DrLinAITeam2 --repo for-test-github-app --dest ./test-download
   ```

3. **Deploy to Claude Skills:**
   ```bash
   npm run deploy
   ```

## API Endpoint
- Base URL: `http://103.98.213.149:8510/`
- Endpoints:
  - `/contents` - Get single file
  - `/download-repo` - Download repository as ZIP

## Recovery Notes
This project was successfully recovered from Git objects after a `git reset --hard`. All source files have been restored and the project builds successfully.
