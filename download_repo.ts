import axios from "axios";
import { program } from "commander";
import AdmZip from "adm-zip";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

program
    .option("--owner <owner>", "The owner of the repository")
    .option("--repo <repo>", "The name of the repository")
    .option("--ref <ref>", "The branch, tag, or commit SHA", "main")
    .option("--dest <dest>", "The destination directory to extract to")
    .parse(process.argv);

const options = program.opts();

if (!options.owner || !options.repo) {
    console.error("Error: --owner and --repo are required.");
    process.exit(1);
}

async function downloadRepo() {
    try {
        const url = "http://103.98.213.149:8510/download-repo";
        console.log(`Downloading repository ${options.owner}/${options.repo} (ref: ${options.ref})...`);

        const response = await axios.get(url, {
            params: {
                owner: options.owner,
                repo: options.repo,
                ref: options.ref,
            },
            headers: {
                accept: "application/zip",
            },
            responseType: "arraybuffer",
        });

        console.log("Download complete. Unzipping...");

        const zip = new AdmZip(response.data);

        // Determine destination path
        // If dest is not provided, default to the repository name in the current directory
        const destPath = options.dest
            ? path.resolve(process.cwd(), options.dest)
            : path.resolve(process.cwd(), options.repo);

        // Create a temporary directory for extraction
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'repo-download-'));

        try {
            // Extract to temp dir first
            zip.extractAllTo(tempDir, true);

            // Find the top-level directory
            const files = fs.readdirSync(tempDir);
            if (files.length === 1 && fs.statSync(path.join(tempDir, files[0])).isDirectory()) {
                const topLevelDir = path.join(tempDir, files[0]);

                // Ensure destination exists
                fs.mkdirSync(destPath, { recursive: true });

                // Move contents from top-level dir to destination
                const contentFiles = fs.readdirSync(topLevelDir);
                for (const file of contentFiles) {
                    const srcPath = path.join(topLevelDir, file);
                    const dstPath = path.join(destPath, file);

                    // If destination file/dir exists, remove it first to avoid conflicts
                    if (fs.existsSync(dstPath)) {
                        fs.rmSync(dstPath, { recursive: true, force: true });
                    }

                    // Use copy and remove instead of rename to handle cross-device moves (EXDEV)
                    fs.cpSync(srcPath, dstPath, { recursive: true });
                    fs.rmSync(srcPath, { recursive: true, force: true });
                }
                console.log(`Successfully extracted contents to ${destPath}`);
            } else {
                // If structure is unexpected (no single root folder), just move everything
                fs.mkdirSync(destPath, { recursive: true });
                for (const file of files) {
                    const srcPath = path.join(tempDir, file);
                    const dstPath = path.join(destPath, file);
                    if (fs.existsSync(dstPath)) {
                        fs.rmSync(dstPath, { recursive: true, force: true });
                    }
                    // Use copy and remove instead of rename to handle cross-device moves (EXDEV)
                    fs.cpSync(srcPath, dstPath, { recursive: true });
                    fs.rmSync(srcPath, { recursive: true, force: true });
                }
                console.log(`Successfully extracted to ${destPath}`);
            }
        } finally {
            // Cleanup temp dir
            try {
                fs.rmSync(tempDir, { recursive: true, force: true });
            } catch (e) {
                console.warn("Warning: Could not clean up temporary directory.");
            }
        }
    } catch (error: any) {
        console.error(`Error downloading repo: ${error.message}`);
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            try {
                const errorData = Buffer.from(error.response.data).toString('utf8');
                console.error(`Data: ${errorData}`);
            } catch (e) {
                console.error("Could not read error response data.");
            }
        }
        process.exit(1);
    }
}

downloadRepo();
