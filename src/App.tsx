import React, { useState } from 'react'
import Result from '@/components/Result'
import TreeGraph from '@/components/TreeGraph/TreeGraph'
import Control from '@/components/Control'
import '@/App.css'

function App() {
  const [filteredData, setFilteredData] = useState<any>(null)
  const handleDataFiltered = (filteredData: any) => {
    setFilteredData(filteredData)
  }

  return (
    <>
      <div id="MainView">
        <div id="LeftView">
          <Control />
          <Result onDataFiltered={handleDataFiltered} />
        </div>
        <TreeGraph filteredData={filteredData} />
      </div>
    </>
  )
}
export default App
