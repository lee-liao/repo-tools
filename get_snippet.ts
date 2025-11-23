import axios from "axios";
import { program } from "commander";
import * as fs from "fs";
import * as path from "path";

program
    .option("--owner <owner>", "The owner of the repository")
    .option("--repo <repo>", "The name of the repository")
    .option("--path <path>", "The path to the file within the repository")
    .option("--ref <ref>", "The branch, tag, or commit SHA", "main")
    .option("--output <output>", "Full output path including filename")
    .option("--dest <dest>", "Destination folder (filename preserved from source)")
    .parse(process.argv);

const options = program.opts();

if (!options.owner || !options.repo || !options.path) {
    console.error("Error: --owner, --repo, and --path are required.");
    process.exit(1);
}

async function getSnippet() {
    try {
        const url = "http://103.98.213.149:8510/contents";
        console.log(`Fetching ${options.path} from ${options.owner}/${options.repo} (ref: ${options.ref})...`);

        const response = await axios.get(url, {
            params: {
                owner: options.owner,
                repo: options.repo,
                path: options.path,
                ref: options.ref,
            },
            headers: {
                accept: "application/json",
            },
        });

        const data = response.data;

        if (!data.content) {
            console.error("Error: No content found in response.");
            process.exit(1);
        }

        // Decode base64 content
        const decodedContent = Buffer.from(data.content, "base64").toString("utf-8");

        // Determine output path based on priority
        let outputPath: string;

        if (options.output) {
            // Priority 1: Use exact output path provided
            outputPath = path.resolve(process.cwd(), options.output);
        } else if (options.dest) {
            // Priority 2: Use dest folder with original filename
            const filename = path.basename(options.path);
            outputPath = path.resolve(process.cwd(), options.dest, filename);
        } else {
            // Priority 3: Save to current directory with original path structure
            outputPath = path.resolve(process.cwd(), options.path);
        }

        // Ensure the directory exists
        const outputDir = path.dirname(outputPath);
        fs.mkdirSync(outputDir, { recursive: true });

        // Write the file
        fs.writeFileSync(outputPath, decodedContent, "utf-8");
        console.log(`Successfully saved to ${outputPath}`);
    } catch (error: any) {
        console.error(`Error fetching snippet: ${error.message}`);
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Data: ${JSON.stringify(error.response.data)}`);
        }
        process.exit(1);
    }
}

getSnippet();
