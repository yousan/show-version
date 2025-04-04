import * as git from 'isomorphic-git';
import * as fs from 'fs';
import * as path from 'path';

export async function getVersion(): Promise<string> {
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
    return packageJson.version;
  } catch (error) {
    console.error('Error reading package.json:', error);
    return 'unknown';
  }
}

export const version = getVersion(); 