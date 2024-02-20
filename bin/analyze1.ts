import * as fs from 'fs/promises'
import * as path from 'path'

async function getPackageList(directory: string): Promise<string[]> {
    try{
        const files=await fs.readdir(directory)
        const packageDirs=await Promise.all(
            files.map(async(file)=>{
                const filePath=path.resolve(directory,file)
                const fileStat=await fs.stat(filePath)
                
            })
        )
    }
}

export async function analyze() {
  try {
    console.time('analyze')
    const nodeModulesPath = path.resolve(__dirname, '../node_modules')
    const packages = await getPackageList(nodeModulesPath)
  } catch (err) {
    console.log(err)
    return []
  }
}

analyze()
