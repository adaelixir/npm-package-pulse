import * as fs from 'fs/promises'
import * as path from 'path'

interface Package {
  packageName: string
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  numDependencies: number
  version: string
}

export async function calculate() {
  const pkgData = await readFile(path.resolve(__dirname, './packagesLists.json'))
  try {
    const packages = JSON.parse(pkgData)
    const cycleDeps = await detectCycleDeps(packages)
    await writeFile(path.resolve(__dirname, './cycleDeps.json'), cycleDeps)
    const duplicateDeps = await detectDuplicateDeps(packages)
    await writeFile(path.resolve(__dirname, './duplicateDeps.json'), duplicateDeps)
  } catch (err) {
    console.error('Error parsing JSON:', err)
    throw err
  }
}

async function readFile(filePath: string) {
  try {
    const data = await fs.readFile(filePath, 'utf8')
    return data
  } catch (err) {
    console.error('Error reading file:', err)
    throw err
  }
}
async function detectCycleDeps(pkgData: Package[]): Promise<string[][]> {
  const graph: Record<string, string[]> = {}
  const visited = new Set<string>()
  const cyclePaths: string[][] = []

  for (const pkg of pkgData) {
    graph[pkg.packageName] = Object.keys(pkg.dependencies || {}).concat(Object.keys(pkg.devDependencies || {}) || [])
  }

  for (const pkg of Object.keys(graph)) {
    dfs(pkg, new Set(), [])
  }

  function dfs(pkg: string, ancestors: Set<string>, currentPath: string[]) {
    if (visited.has(pkg)) return
    visited.add(pkg)
    ancestors.add(pkg)
    currentPath.push(pkg)

    for (const dep of graph[pkg] || []) {
      if (ancestors.has(dep)) {
        const startIndex = currentPath.indexOf(dep)

        if (startIndex !== -1) {
          const cyclePath = currentPath.slice(startIndex).concat(dep) // 将循环路径连接起来
          cyclePaths.push(cyclePath)
        }
        return
      }
      dfs(dep, new Set(ancestors), [...currentPath])
    }
  }

  return cyclePaths
}

async function detectDuplicateDeps(pkgData: Package[]) {
  const depVersionsMap = new Map<string, Set<string>>()

  for (const pkg of pkgData) {
    const pkgName = pkg.packageName
    for (const dependency of Object.keys(pkg.dependencies || {})) {
      const version = pkg.dependencies[dependency]
      await updateDepVersions(depVersionsMap, dependency, version)
    }
    for (const devDependency of Object.keys(pkg.devDependencies || {})) {
      const version = pkg.devDependencies[devDependency]
      await updateDepVersions(depVersionsMap, devDependency, version)
    }
  }
  const duplicateDeps: { packageName: string; versions: string[] }[] = []
  for (const [pkgName, versions] of depVersionsMap.entries()) {
    if (versions.size > 1) {
      duplicateDeps.push({
        packageName: pkgName,
        versions: Array.from(versions)
      })
    }
  }
  return duplicateDeps
}
async function updateDepVersions(depVersions: Map<string, Set<string>>, dep: string, version: string) {
  if (!depVersions.has(dep)) {
    depVersions.set(dep, new Set<string>())
  }
  const versions = depVersions.get(dep)
  versions!.add(version)
}

async function writeFile(filePath: string, data: any) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
    console.log(`Data written to: ${filePath}`)
  } catch (err) {
    console.error('Error writing file:', err)
    throw err
  }
}

calculate()
