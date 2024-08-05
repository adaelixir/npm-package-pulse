const fs = require('fs');
const path = require('path');

function readPackageJson(dir) {
  const pkgPath = path.join(dir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    return JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  }
  return null;
}

function getSubDirectories(dir) {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

module.exports = { readPackageJson, getSubDirectories };