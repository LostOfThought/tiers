import fs from 'node:fs/promises';
import path from 'node:path';

const checkFileExists = async (filePath: string): Promise<boolean> => {
  // eslint-disable-next-line functional/no-try-statements -- No functional way to do this
  try {
    // eslint-disable-next-line functional/no-expression-statements -- No functional way to do this
    await fs.access(filePath);

    return true;
  }
  catch {
    return false;
  }
};

const stagingDirectory = path.resolve(import.meta.dirname, '../staging');
const entryPoints: readonly string[] = [
  'control/control.lua',
  'data/data-final-fixes.lua',
  'data/data-updates.lua',
  'data/data.lua',
  'settings/settings-final-fixes.lua',
  'settings/settings-updates.lua',
  'settings/settings.lua',
].map((filePath): string => path.resolve(stagingDirectory, filePath));

const existingEntryPoints: readonly boolean[] = await Promise.all(
  // eslint-disable-next-line code-complete/no-late-variable-usage -- Late, but fine
  entryPoints.map(checkFileExists),
);
const entryPointsToGenerate: readonly string[]
  // eslint-disable-next-line code-complete/no-late-variable-usage, security/detect-object-injection -- Late, but fine
  = entryPoints.filter((filePath, index): boolean => existingEntryPoints[index]);

// eslint-disable-next-line functional/no-expression-statements -- File generation
await Promise.allSettled(entryPointsToGenerate.map(async (filePath): Promise<void> => {
  const parts: readonly string[] = filePath.split('/');
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- omit group foldername
  const targetFilePath = [...parts.slice(0, -2), ...parts.slice(-1)].join('/');
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- folder name
  const targetSubDirectory = parts.at(-2) ?? '';
  const targetFileName = (parts.at(-1) ?? '').replace(/\.lua$/v, '');

  // eslint-disable-next-line functional/no-expression-statements, security/detect-non-literal-fs-filename -- File generation
  await fs.writeFile(
    targetFilePath,
    `require("${targetSubDirectory}.${targetFileName}")
`,
  );
  // eslint-disable-next-line security-node/detect-crlf -- Logging
  console.log(`Generated stub for ${filePath}`);
}));
