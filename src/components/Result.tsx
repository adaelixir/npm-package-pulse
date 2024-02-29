import React, { useEffect, useState, useCallback } from 'react'
import dependenciesList from '../../bin/dependenciesList.json'
import cycleList from '../../bin/cyclePackageDependencies.json'
import duplicateList from '../../bin/duplicatePackageVersions.json'

interface ResultProps {
  onDataFiltered: (filteredData: any) => void
}

interface CycleListProps {
  calculateCycle: [packageName: string]
}

export default function Result({ onDataFiltered }: ResultProps) {
  const [data, setData] = useState<
    {
      packageName: string
      dependencies: object
      devDependencies: object
      numDependencies: number
      version: string
    }[]
  >([])

  const [searchTerm, setSearchTerm] = useState<string>('')

  useEffect(() => {
    setData(dependenciesList)
  }, [])

  const filteredData = data.filter((item) => item.packageName.toLowerCase().includes(searchTerm.toLowerCase()))

  useEffect(() => {
    const fetchData = async () => {
      // 异步操作，例如从服务器获取数据
      // ...
      // 在异步操作完成后调用 onDataFiltered
      if (onDataFiltered) {
        onDataFiltered(filteredData)
      }
    }
    fetchData()
  }, [searchTerm]) // 此处应该根据实际需要设置依赖项

  return (
    <div id='Result'>
      <input
        id='searchBox'
        type='text'
        placeholder='输入要搜索的依赖名称'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}></input>
      <pre>
        {filteredData.map((item, index) => (
          <React.Fragment key={index}>
            <span style={{ color: 'red', fontWeight: 'bold' }}>{item.packageName}</span>:{' '}
            <span style={{ color: 'red', fontWeight: 'bold' }}> {item.numDependencies}</span>
            <pre>{JSON.stringify({ ...item, packageName: undefined, numDependencies: undefined }, null, 1)}</pre>
            <br />
          </React.Fragment>
        ))}
      </pre>
    </div>
  )
}
