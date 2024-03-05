import React, { useState } from 'react'
import Control from '@/components/Control/Control'
import PKGList from '@/components/PKG_INFO/PKGList'
import TreeMap from '@/components/TREE_GRAPH/TreeMap'
import '@/App.css'
import CycleDep from './components/DEP_INFO/CycleDep'
import DulipDep from './components/DEP_INFO/DulipDep'

function App() {
  const [filteredData, setFilteredData] = useState<any>(null)
  const handleDataFiltered = (filteredData: any) => {
    setFilteredData(filteredData)
  }

  const [selectedType, setSelectedType] = useState<string>('pkg')
  const handleControlClick = (type: string) => {
    setSelectedType(type)
  }

  return (
    <>
      <div id="MainView">
        <div id="LeftView">
          <Control onControlClick={handleControlClick} />
          {selectedType === 'pkg' && <PKGList onDataFiltered={handleDataFiltered} selectedType={selectedType} />}
          {selectedType === 'cycle' && <CycleDep />}
          {selectedType === 'duplicate' && <DulipDep />}
        </div>
        <TreeMap filteredData={filteredData} />
      </div>
    </>
  )
}
export default App
