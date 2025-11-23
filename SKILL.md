# Repository Tools

## Overview
A specialized skill for retrieving content from remote GitHub repositories. This skill provides two main capabilities: downloading individual files and downloading entire repositories.

## Skill Purpose & Usage Context
**When to use this skill:**
- User wants to retrieve files that don't exist locally
- User references external repositories by owner/repo format
- User asks to download, fetch, get, or retrieve from GitHub
- User needs content from specific branches, tags, or commits

**Key indicators for skill activation:**
- Mentions of repository owners and names (e.g., "DrLinAITeam2/for-test-github-app")
- File paths within repositories (e.g., "openspec/project.md")
- Keywords: get, fetch, download, retrieve, clone, grab

## Available Commands

### 1. Get Single File (`get_snippet.js`)
**Purpose**: Download a specific file from a repository

**Required Parameters:**
- `--owner <string>`: Repository owner username
- `--repo <string>`: Repository name
- `--path <string>`: File path within the repository

**Optional Parameters:**
- `--ref <string>`: Branch, tag, or commit SHA (default: "main")
- `--output <string>`: Full output path including filename
- `--dest <string>`: Destination folder (filename preserved from source)

**Output Behavior Priority:**
1. If `--output` specified: Save to exact path provided
2. Else if `--dest` specified: Save to folder with original filename
3. Else: Save to current working directory with original path structure

### 2. Download Repository (`download_repo.js`)
**Purpose**: Download entire repository as ZIP and extract

**Required Parameters:**
- `--owner <string>`: Repository owner username
- `--repo <string>`: Repository name

**Optional Parameters:**
- `--ref <string>`: Branch, tag, or commit SHA (default: "main")
- `--dest <string>`: Destination directory (default: current directory)

## Execution Examples

### File Retrieval Examples
```bash
# Basic file download to current directory
node get_snippet.js --owner DrLinAITeam2 --repo for-test-github-app --path openspec/project.md

# Download to specific folder
node get_snippet.js --owner DrLinAITeam2 --repo for-test-github-app --path openspec/project.md --dest ./docs/

# Download with custom filename
node get_snippet.js --owner DrLinAITeam2 --repo for-test-github-app --path openspec/project.md --output ./my-project-spec.md

# Download from specific branch
node get_snippet.js --owner DrLinAITeam2 --repo for-test-github-app --path src/main.js --ref develop
```

### Repository Download Examples
```bash
# Download entire repository to current directory
node download_repo.js --owner DrLinAITeam2 --repo for-test-github-app

# Download to specific folder
node download_repo.js --owner DrLinAITeam2 --repo for-test-github-app --dest ./downloads/repo/

# Download specific branch
node download_repo.js --owner DrLinAITeam2 --repo for-test-github-app --ref feature-branch --dest ./feature-code/
```

## Error Handling
- Missing required parameters will exit with error message
- Invalid repository paths will return appropriate HTTP error details
- Network connectivity issues are clearly reported
- File system errors (permissions, disk space) are handled gracefully

## Technical Details
- Uses custom API endpoint: `http://103.98.213.149:8510/`
- File content retrieved via Base64 encoding and decoded locally
- Repository downloads use ZIP format with automatic extraction
- Recursive directory creation for output paths
- Commander.js for CLI argument parsing

## Common User Patterns & Expected Skill Activation
1. **Direct file requests**: "Get openspec/project.md from DrLinAITeam2/for-test-github-app"
2. **Repository downloads**: "Download the DrLinAITeam2/for-test-github-app repository"
3. **Branch-specific**: "Get main branch version of config.json from that repo"
4. **Folder organization**: "Fetch all docs from the repository and save to docs folder"

## Integration Notes
This skill should be invoked automatically when natural language patterns indicate the need to access external repository content. The AI should parse repository names, file paths, and optional parameters from the user's request and construct the appropriate command.

## Suggested User Prompts for Skill Activation

### Direct Skill Invocation
- "Use the repo-tools skill to clone DrLinAITeam2/for-test-github-app to ./snippets"
- "I want to use the repo-tools skill"
- "Show me what the repo-tools skill can do"

### Task-Based Prompts
- "Clone a repository from GitHub"
- "Set up a local development environment from a git repo"
- "Help me manage GitHub repositories"
- "Download the entire repository to a specific folder"

### Repository Management Prompts
- "Help me work with repositories and version control"
- "I need to manage GitHub repositories"
- "Can you help me with git operations and repository management"

### File-Specific Prompts
- "Get openspec/project.md from DrLinAITeam2/for-test-github-app"
- "Download config.json from the main branch of that repository"
- "Fetch the README file from the develop branch"
- "I need the src/app.js file from this repository"

### Combination Prompts
- "Use repo-tools to download the DrLinAITeam2/for-test-github-app repository and get the main configuration files"
- "Help me set up a project by cloning the repository and retrieving key documentation files"
