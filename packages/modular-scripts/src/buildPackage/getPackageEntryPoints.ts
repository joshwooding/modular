import getPackageMetadata from '../utils/getPackageMetadata';
import * as path from 'path';
import * as fse from 'fs-extra';
import getModularRoot from '../utils/getModularRoot';

export async function getPackageEntryPoints(
  packagePath: string,
  includePrivate: boolean,
): Promise<{
  main: string;
}> {
  const modularRoot = getModularRoot();
  const { packageJsonsByPackagePath } = await getPackageMetadata();

  const packageJson = packageJsonsByPackagePath[packagePath];

  let main: string | undefined;

  if (packageJson.main) {
    main = packageJson.main;
  } else {
    throw new Error(
      `package.json at ${packagePath} does not have a "main" field, bailing...`,
    );
  }

  if (!packageJson) {
    throw new Error(`no package.json in ${packagePath}, bailing...`);
  }
  if (!includePrivate && packageJson.private === true) {
    throw new Error(`${packagePath} is marked private, bailing...`);
  }

  if (!fse.existsSync(path.join(modularRoot, packagePath, main))) {
    throw new Error(
      `package.json at ${packagePath} does not have a main file that points to an existing source file, bailing...`,
    );
  }

  if (!packageJson.name) {
    throw new Error(
      `package.json at ${packagePath} does not have a valid "name", bailing...`,
    );
  }

  if (!packageJson.version) {
    throw new Error(
      `package.json at ${packagePath} does not have a valid "version", bailing...`,
    );
  }

  if (packageJson.module) {
    throw new Error(
      `package.json at ${packagePath} shouldn't have a "module" field, bailing...`,
    );
  }

  if (packageJson.typings) {
    throw new Error(
      `package.json at ${packagePath} shouldn't have a "typings" field, bailing...`,
    );
  }

  return { main };
}
