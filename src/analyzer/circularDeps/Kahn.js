const { Queue } = require('queue');

function detectCircularDeps_Kahn(dependencies) {
    const circularDeps = []

    const graph = buildGraph(dependencies);
    const inDegree = ComputeInDegrees(graph);
    const zeroInDegreeQueue = new Queue()
   
    for (const pkg in graph) {
        if (inDegree[pkg] === 0) {
            zeroInDegreeQueue.enqueue(pkg);
        }
    }

    let processedCount = 0;
    while (!zeroInDegreeQueue.isEmpty()) {
        const pkg = zeroInDegreeQueue.dequeue();
        processedCount++;

        for (const dep of graph[pkg]) {
            inDegree[dep]--;
            if (inDegree[dep] === 0) {
              zeroInDegreeQueue.enqueue(dep);
            }
          }
    }

    if (processedCount !== Object.keys(graph).length) {
        circularDeps.push('Cycle detected in dependencies');
      }
    
    return circularDeps;
}

function buildGraph(dependencies) {
    const graph = {};
    for (const pkg in dependencies) {
      graph[pkg] = dependencies[pkg].map(dep => dep.parent.split('@')[0]);
    }
    return graph;
}

function ComputeInDegrees(graph) {
    const inDegree = {};
    for (const pkg in graph) {
      inDegree[pkg] = 0;
    }
  
    for (const pkg in graph) {
      for (const dep of graph[pkg]) {
        inDegree[dep] = (inDegree[dep] || 0) + 1;
      }
    }
  
    return inDegree;
}

module.exports = { detectCircularDeps_Kahn };