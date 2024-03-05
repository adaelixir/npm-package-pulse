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
  const pkgData = await readFile(path.resolve(__dirname, './dependenciesList.json'))
  try {
    const packages = JSON.parse(pkgData)
    const cycleDependencies = await detectCycleDependencies(packages)
    await writeFile(path.resolve(__dirname, './cycleDependencies.json'), cycleDependencies)
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
async function detectCycleDependencies(pkgData: Package[]) {
  const graph: Record<string, string[]> = {}
  const visited = new Set<string>()
  const cyclePaths: string[][] = []

  for (const pkg of pkgData) graph[pkg.packageName] = Object.keys(pkg.dependencies || {}).concat(Object.keys(pkg.devDependencies || {}) || [])
  for (const pkg of Object.keys(graph)) dfs(pkg, new Set(), [])

  function dfs(pkg: string, ancestors: Set<string>, currentPath: string[]) {
    if (visited.has(pkg)) return
    visited.add(pkg)
    ancestors.add(pkg)
    currentPath.push(pkg)

    for (const dep of graph[pkg] || []) {
      if (ancestors.has(dep)) {
        const startIndex = currentPath.indexOf(dep)
        const cyclePath = currentPath.slice(startIndex)
        cyclePaths.push([`${pkg} -> ${dep} -> ${pkg}`])

        return
      }
      dfs(dep, new Set(ancestors), [...currentPath])
    }
  }
  return cyclePaths
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
