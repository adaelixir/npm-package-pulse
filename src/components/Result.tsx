import React, { useEffect, useState } from 'react'
import dependenciesList from '../../bin/dependenciesList.json'

interface ResultProps {
  onDataFiltered: (filteredData: any) => void
}

export default function Result({ onDataFiltered }: ResultProps) {
  const [data, setData] = useState<
    {
      packageName: string
      dependencies: string[]
      devDependencies: string[]
      numDependencies: number
    }[]
  >([])

  const [searchTerm, setSearchTerm] = useState<string>('')

  useEffect(() => {
    setData(dependenciesList)
  }, [])

  const filteredData = data.filter((item) => item.packageName.toLowerCase().includes(searchTerm.toLowerCase()))

  useEffect(() => {
    if (onDataFiltered) {
      onDataFiltered(filteredData)
    }
  }, [filteredData, onDataFiltered])

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
