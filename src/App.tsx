import React, { useState } from 'react'
import Result from '@/components/Result'
import Graph from '@/components/Graph'
import Control from '@/components/Control'
import '@/App.css'

function App() {
  const [filteredData, setFilteredData] = useState<any>(null)
  const handleDataFiltered = (filteredData: any) => {
    setFilteredData(filteredData)
  }

  return (
    <>
      <div id='MainView'>
        <div id='LeftView'>
          <Control />
          <Result onDataFiltered={handleDataFiltered} />
        </div>
        <Graph filteredData={filteredData} />
      </div>
    </>
  )
}
export default App
