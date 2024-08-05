const { makeDepTree } = require('./utils/makeDepTree');
const depAnalyzer = require('./analyzer')

function analyzeDependencies(dir) {
    const dependencyTree = makeDepTree(dir);

    return {
        circularDependencies: depAnalyzer.detectCircularDeps_DFS(dependencyTree),
        circularDependencies2:depAnalyzer.detectCircularDeps_Kahn(dependencyTree)
    }
}

module.exports = { analyzeDependencies }