const fs = require('fs')
const path = require('path')

function getDependencies(filePath) {
    const dependencies = {}

    const packageJsonPath = path.join(directory, 'package.json');

    if(fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath,'utf-8'))

        dependencies[packageJson.name] = packageJson.version
    }
}