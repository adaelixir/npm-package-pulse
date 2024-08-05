function detectCircularDeps_DFS(dependencies) {
    const circularDeps = [];
    for (const pkg in dependencies) {
        for (const dep in dependencies[pkg]) {
            DFS(pkg,dep.version,dependencies,circularDeps)
        }
    }
    return circularDeps
}

function DFS(pkg,version,dependencies,circularDeps,visited = new Set()) {
    const key = `${pkg}@${version}`;

    if(visited.has(key)) {
        circularDeps.push(Array.from(visited).concat(key))
        return;
    }

    visited.add(key);

    const deps = dependencies[pkg] || [];
    for (const dep of deps) {
        if (dep.parent) {
            const [parentPkg, parentVersion] = dep.parent.split('@');
            DFS(parentPkg, parentVersion, dependencies, circularDeps, new Set(visited));
        }
    }
    visited.delete(key);
}

export { detectCircularDeps_DFS };