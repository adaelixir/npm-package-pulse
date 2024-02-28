const fs = require('fs');

fs.readFile('./dependenciesList.json', 'utf8', (err, data) => {
  if (err) { console.error('Error reading file:', err); return; }
  try {
    // 假设已经从文件中读取了数据并检测了循环依赖
    const packages = JSON.parse(data);
    const cycleNodes = detectCycleWithNodes(packages);
    // const duplicatePackageDependencies = detectDuplicatePackageDependencies(packages);
    const duplicatePackageVersions = detectDuplicatePackageVersions(packages);
    // const duplicateDependencies = detectDuplicateDependencies(packages);

    if (cycleNodes.length > 0) {
      console.log('循环依赖节点：', cycleNodes.length);
      writeToFile('cycleNodes.json', cycleNodes);
    } else {
      console.log('没有循环依赖。');
    }

    if (duplicatePackageVersions.length > 0) {
      console.log('存在多个版本的软件包：', duplicatePackageVersions);
      writeToFile('duplicatePackageVersions.json', duplicatePackageVersions);
    } else {
      console.log('没有存在多个版本的软件包。');
    }

    // if (duplicatePackageDependencies.length > 0) {
    //   console.log('被多次依赖的软件包：', duplicatePackageDependencies.length);
    //   writeToFile('duplicatePackageDependencies.json', duplicatePackageDependencies);
    // } else {
    //   console.log('没有被多次依赖的软件包。');
    // }

    // if (duplicateDependencies.length > 0) {
    //   console.log('依赖了同一个依赖多次的软件包：', duplicateDependencies);
    // } else {
    //   console.log('没有依赖了同一个依赖多次的软件包。');
    // }

  } catch (parseError) {
    console.error('Error parsing JSON:', parseError);
  }
});

//判断循环依赖
function detectCycleWithNodes(packages) {
  const graph = {}; // 存储软件包及其依赖关系的图
  const visited = new Set(); // 记录已访问的节点
  const cycleNodes = []; // 存储循环依赖的节点

  // 构建有向图
  for (const pkg of packages) {
    graph[pkg.packageName] = pkg.dependencies.concat(pkg.devDependencies || []);
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

function detectDuplicatePackageVersions(packages) {
  const packageVersionsMap = new Map();

  // 遍历所有软件包
  for (const pkg of packages) {
    const packageName = pkg.packageName;

    // 检查软件包是否已经在 Map 中存在
    if (!packageVersionsMap.has(packageName)) {
      packageVersionsMap.set(packageName, new Set());
    }

    // 获取该软件包的所有版本，并添加到 Set 中
    const packageVersions = packageVersionsMap.get(packageName);
    packageVersions.add(pkg.version);
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


// 判断一个软件包是否被多次依赖
function detectDuplicatePackageDependencies(packages) {
  const dependencyMap = new Map();

  for (const pkg of packages) {
    const dependencies = pkg.dependencies.concat(pkg.devDependencies || []);

    for (const dependency of dependencies) {
      if (!dependencyMap.has(dependency)) {
        dependencyMap.set(dependency, new Set());
      }
      dependencyMap.get(dependency).add(pkg.packageName);
    }
  }

  const duplicates = [];
  for (const [dependency, dependents] of dependencyMap.entries()) {
    if (dependents.size > 1) {
      duplicates.push({
        dependency,
        dependents: Array.from(dependents)
      });
    }
  }

  return duplicates;
}

// 判断一个软件包是否依赖了同一个依赖多次
function detectDuplicateDependencies(packages) {
  const dependencyMap = new Map();

  for (const pkg of packages) {
    const dependencies = pkg.dependencies.concat(pkg.devDependencies || []);

    for (const dependency of dependencies) {
      if (!dependencyMap.has(pkg.packageName)) {
        dependencyMap.set(pkg.packageName, new Set());
      }
      dependencyMap.get(pkg.packageName).add(dependency);
    }
  }

  const duplicates = [];
  for (const [packageName, dependencies] of dependencyMap.entries()) {
    for (const dependency of dependencies) {
      const count = packages.filter(pkg =>
        pkg.packageName === packageName &&
        (pkg.dependencies.includes(dependency) || (pkg.devDependencies && pkg.devDependencies.includes(dependency)))
      ).length;
      if (count > 1) {
        duplicates.push({
          packageName,
          dependency
        });
      }
    }
  }

  return duplicates;
}


function writeToFile(fileName, data) {
  fs.writeFile(fileName, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error('Error writing to file:', err);
      return;
    }
    console.log('循环依赖数据已写入文件:', fileName);
  });
}