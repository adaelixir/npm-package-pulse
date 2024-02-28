const fs = require('fs');

fs.readFile('./dependenciesList.json', 'utf8', (err, data) => {
  if (err) { console.error('Error reading file:', err); return; }
  try {
    const packages = JSON.parse(data);
    const cyclePackageDependencies = detectCyclePackageDependencies(packages);
    const duplicatePackageVersions = detectDuplicatePackageVersions(packages);

    if (cyclePackageDependencies.length > 0) {
      console.log('循环依赖节点：', cyclePackageDependencies.length);
      writeToFile('cyclePackageDependencies.json', cyclePackageDependencies);
    } else { console.log('没有循环依赖。'); }

    if (duplicatePackageVersions.length > 0) {
      console.log('存在多个版本的软件包：', duplicatePackageVersions.length);
      writeToFile('duplicatePackageVersions.json', duplicatePackageVersions);
    } else { console.log('没有存在多个版本的软件包。'); }

  } catch (parseError) {
    console.error('Error parsing JSON:', parseError);
  }
});

//检测循环依赖
function detectCyclePackageDependencies(packages) {
  const graph = {}; // 存储软件包及其依赖关系的图
  const visited = new Set(); // 记录已访问的节点
  const cycleNodes = []; // 存储循环依赖的节点

  // 构建有向图
  for (const pkg of packages) {
    graph[pkg.packageName] = Object.keys(pkg.dependencies || {}).concat(Object.keys(pkg.devDependencies || {}) || []);
  }

  // 深度优先搜索每个节点
  for (const pkg of Object.keys(graph)) {
    dfs(pkg, []); // 调用深度优先搜索函数，判断是否存在循环依赖
  }

  // 深度优先搜索函数
  function dfs(pkg, ancestors) {
    if (visited.has(pkg)) { return; }
    visited.add(pkg); // 将节点标记为已访问
    ancestors.push(pkg); // 将节点添加到祖先节点数组中

    for (const dep of graph[pkg] || []) {
      if (ancestors.includes(dep)) {
        // 如果依赖节点已经在祖先节点中，说明存在循环依赖
        const startIndex = ancestors.indexOf(dep); // 获取循环起始节点在祖先节点数组中的索引
        cycleNodes.push(...ancestors.slice(startIndex)); // 将循环依赖的节点添加到 cycleNodes 数组中
        return; // 返回，结束当前路径的搜索
      }

      dfs(dep, ancestors.slice()); // 递归搜索依赖节点
    }
  }

  return cycleNodes; // 返回循环依赖的节点数组
}

//检测是否存在多个版本的软件包
function detectDuplicatePackageVersions(packages) {
  const packageVersionsMap = new Map();

  // 遍历所有软件包
  for (const pkg of packages) {
    const packageName = pkg.packageName;

    // 检查软件包的 dependencies 中的依赖
    for (const dependency of Object.keys(pkg.dependencies || {})) {
      const version = pkg.dependencies[dependency];
      updatePackageVersionMap(packageVersionsMap, dependency, version);
    }

    // 检查软件包的 devDependencies 中的依赖
    for (const dependency of Object.keys(pkg.devDependencies || {})) {
      const version = pkg.devDependencies[dependency];
      updatePackageVersionMap(packageVersionsMap, dependency, version);
    }
  }

  const duplicates = [];

  // 遍历 Map，查找存在多个版本的软件包
  for (const [packageName, versions] of packageVersionsMap.entries()) {
    if (versions.size > 1) {
      // 如果有多个版本，则将其添加到结果数组中
      duplicates.push({
        packageName,
        versions: Array.from(versions)
      });
    }
  }

  return duplicates;
}

function updatePackageVersionMap(packageVersionsMap, packageName, version) {
  // 检查软件包是否已经在 Map 中存在
  if (!packageVersionsMap.has(packageName)) {
    packageVersionsMap.set(packageName, new Set());
  }

  // 获取该软件包的所有版本，并添加到 Set 中
  const packageVersions = packageVersionsMap.get(packageName);
  packageVersions.add(version);
}

function writeToFile(fileName, data) {
  fs.writeFile(fileName, JSON.stringify(data, null, 2), (err) => {
    if (err) { console.error('Error writing to file:', err); return; }
    console.log('循环依赖数据已写入文件:', fileName);
  });
}