import fs from 'fs';
import path from 'path';

export const ROOT_DIR = path.resolve(process.cwd());

export const resolveFromRoot = (
  filePath: string,
  mustExist: boolean = false
): string => {
  const absolutePath = path.resolve(ROOT_DIR, filePath);

  if (mustExist && !fs.existsSync(absolutePath)) {
    throw new Error(`File not found at path: ${absolutePath}`);
  }

  return absolutePath;
};

export const TEST_PATHS = {
  tests: resolveFromRoot('tests'),
  testAuth: resolveFromRoot('tests/.auth'),
  testsData: resolveFromRoot('tests/data'),
  testsDataTemp: resolveFromRoot('tests/data/.temp'),
  testsDataImages: resolveFromRoot('tests/data/images'),
  testsDataMarkdown: resolveFromRoot('tests/data/markdown'),
};
