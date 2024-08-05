const fs = require('fs')
const path = require('path')

function getDependencies(dir) {
    const dependencies = {}

    function traverse(currentDir, parentPkg) {
        const nodeModulesDir = path.join(currentDir, 'node_modules');
        if (!fs.esistsSync(nodeModulesDir)) return;

        fs.readdirSync(nodeModulesDir).forEach(pkgName => {
            const pkgDir = path.join(nodeModulesDir, pkgName);
            const pkgJsonPath = path.join(pkgDir, 'package.json');

            if (fs.existsSync(pkgJsonPath)) {
                const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
                const version = pkgJson.version;

                if (!dependencies[pkgName]) {
                    dependencies[pkgName] = [];
                }

                dependencies[pkgName].push({
                    version,
                    parent:parentPkg,
                    path: pkgDir
                })

                traverse(pkgDir, `${pkgName}@${version}`);
            }
        });
    }
    traverse(dir, null);
    return dependencies;
}

function detectCircularDependencies(dependencies) {
    
}