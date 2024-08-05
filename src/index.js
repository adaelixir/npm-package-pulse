import fs from 'fs';
import path from 'path';
import { makeDepTree } from './utils/makeDepTree.js';
import { detectDiamondDeps } from './diamondDeps/diamondDep.js';
import { detectCircularDeps_DFS } from './circularDeps/circularDepsDFS.js';
import { detectMultipleVersions } from './multiVersionDeps/multipleVersion.js';

export function packagePulse(dir) {

  const dataDir = path.join(dir, 'NPMPulse');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  const dependencyTree = makeDepTree(dir);
  const diamondDependencies = detectDiamondDeps(dependencyTree);
  const circularDependencies = detectCircularDeps_DFS(dependencyTree);
  const multipleVersionDependencies = detectMultipleVersions(dependencyTree);

  fs.writeFileSync(path.join(dataDir, 'dependencyTree.json'), JSON.stringify(dependencyTree, null, 2));
  fs.writeFileSync(path.join(dataDir, 'diamondDependencies.json'), JSON.stringify(diamondDependencies, null, 2));
  fs.writeFileSync(path.join(dataDir, 'circularDependencies.json'), JSON.stringify(circularDependencies, null, 2));
  fs.writeFileSync(path.join(dataDir, 'multipleVersionDependencies.json'), JSON.stringify(multipleVersionDependencies, null, 2));

  return "Dependency analysis is complete, please view the results in the folder 'NPMPulse'"
}