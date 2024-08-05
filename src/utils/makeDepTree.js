const path = require('path');
const { readPackageJson, getSubDirectories } = require('./fileSystem');

function makeDepTree(dir) {
  const nodeModulesPath = path.join(dir, 'node_modules');
  const dependencies = {};
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

module.exports = { makeDepTree };