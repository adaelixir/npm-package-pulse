import fs from 'fs';
import path from 'path';
import { readPackageJson, getSubDirectories } from './fileSystem.js'

function makeDepTree(dir) {
  const dependencies = {};

  const nodeModulesPath = path.join(dir, 'node_modules');
  traverseDeps(nodeModulesPath, null,dependencies);

  return dependencies;
}

function traverseDeps(currentDir, parentPkg,dependencies) {
    const subDirs = getSubDirectories(currentDir);
    
    subDirs.forEach(pkgName => {
      const pkgDir = path.join(currentDir, pkgName);
      const pkgJson = readPackageJson(pkgDir);

      if (pkgJson) {
        if (!dependencies[pkgName]) {
          dependencies[pkgName] = [];
        }

        dependencies[pkgName].push({
          version: pkgJson.version,
          parent: parentPkg,
          path: pkgDir
        });

        const nestedNodeModules = path.join(pkgDir, 'node_modules');
        if (fs.existsSync(nestedNodeModules)) {
            traverseDeps(nestedNodeModules, `${pkgName}@${pkgJson.version}`,dependencies);
        }
      }
    });
  }

export { makeDepTree };