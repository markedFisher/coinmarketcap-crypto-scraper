import fs from "fs-extra";

export async function exportNdjson<T>(rows: T[], file: string) {
const lines = rows.map((r) => JSON.stringify(r)).join("\n") + "\n";
await fs.writeFile(file, lines);
}