import React, { useState } from 'react'
import Control from '@/components/Control/Control'
import InfoList from '@/components/InfoList/InfoList'
import TreeMap from '@/components/TreeMap/TreeMap'
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
          <InfoList onDataFiltered={handleDataFiltered} />
        </div>
        <TreeMap filteredData={filteredData} />
      </div>
    </>
  )
}
export default App
