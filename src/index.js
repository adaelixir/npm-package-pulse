import fs from 'fs';
import path from 'path';
import { makeDepTree } from './utils/makeDepTree.js';
import { detectDiamondDeps } from './diamondDeps/diamondDep.js';
import { detectCircularDeps_DFS } from './circularDeps/circularDepsDFS.js';
import { detectMultipleVersions } from './multiVersionDeps/multipleVersion.js';

export function packagePulse(dir) {

  const dependencyTree = makeDepTree(dir);
  const diamondDependencies = detectDiamondDeps(dependencyTree);
  const circularDependencies = detectCircularDeps_DFS(dependencyTree);
  const multipleVersionDependencies = detectMultipleVersions(dependencyTree);

  fs.writeFileSync(path.join(dir, 'dependencyTree.json'), JSON.stringify(dependencyTree, null, 2));
  fs.writeFileSync(path.join(dir, 'diamondDependencies.json'), JSON.stringify(diamondDependencies, null, 2));
  fs.writeFileSync(path.join(dir, 'circularDependencies.json'), JSON.stringify(circularDependencies, null, 2));
  fs.writeFileSync(path.join(dir, 'multipleVersionDependencies.json'), JSON.stringify(multipleVersionDependencies, null, 2));
}