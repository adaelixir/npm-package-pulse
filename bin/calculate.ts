function detectCycle(packages) {
  const graph = {}
  const indegree = {}

  //构建有向图和入度数组
  for (const pkg of packages) {
    graph[pkg.packageName] = pkg.dependencies.concat(pkg.devDependencies || [])
    indegree[pkg.packageName] = 0
  }

  //计算入度
  for (const pkg of packages) {
    for (const dep of pkg.dependencies.concat(pkg.devDependencies || [])) {
      indegree[dep]++
    }
  }

  //拓扑排序
  const queue = Object.keys(indegree).filter((pkg) => indegree[pkg] === 0)
  let count = 0

  while (queue.length) {
    const pkg = queue.shift()
    count++

    for (const dep of graph[pkg] || []) {
      indegree[dep]--
      if (indegree[dep] === 0) {
        queue.push(dep)
      }
    }
  }

  // 如果 count 小于节点总数，则存在环路
  return count !== Object.keys(indegree).length
}
