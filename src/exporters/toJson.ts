import fs from "fs-extra";

export async function exportJson<T>(rows: T[], file: string) {
await fs.writeFile(file, JSON.stringify(rows, null, 2));
}