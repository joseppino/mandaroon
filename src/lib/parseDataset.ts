import { readFile } from 'fs/promises';
import { parse } from 'csv-parse/sync';

export default async (filename: string) => {
  try {
    const fileContent = await readFile(filename);
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });
    return records;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse CSV: ${error.message}`);
    } else {
      throw new Error('Failed to parse CSV: Unknown error');
    }
  }
};

