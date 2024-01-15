import React, { useState } from 'react'
import Result from '@/components/Result'
import Graph from '@/components/Graph'
import '@/App.css'

function App() {
  const [filteredData, setFilteredData] = useState<any>(null)
  const handleDataFiltered = (filteredData: any) => {
    setFilteredData(filteredData)
  }

  return (
    <>
      <div id='MainView'>
        <Result onDataFiltered={handleDataFiltered} />
        <Graph filteredData={filteredData} />
      </div>
    </>
  )
}
export default App
