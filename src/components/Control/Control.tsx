import React from 'react'
import dependenciesList from '../../../bin/packagesLists.json'
import cycleList from '../../../bin/cycleDeps.json'
import duplicateList from '../../../bin/duplicateDeps.json'
import './Control.css'

export default function Control({ onControlClick }: { onControlClick: (type: string) => void }) {
  const pkgNum = dependenciesList.length
  const cycleNum = cycleList.length
  const duplicateNum = duplicateList.length

  return (
    <div id="Control">
      <h2>PackagePulse-v2</h2>
      <div className="controlList" id="pkg" onClick={() => onControlClick('pkg')}>
        =={'>'}当前项目依赖数量:
        <span style={{ color: 'red', fontWeight: 'bold' }}>{pkgNum}</span>
      </div>
      <div className="controlList" id="cycle" onClick={() => onControlClick('cycle')}>
        =={'>'}出现循环的依赖链路:
        <span style={{ color: 'red', fontWeight: 'bold' }}>{cycleNum}</span>
      </div>
      <div className="controlList" id="duplicate" onClick={() => onControlClick('duplicate')}>
        =={'>'}存在多个版本的依赖:
        <span style={{ color: 'red', fontWeight: 'bold' }}>{duplicateNum}</span>
      </div>
    </div>
  )
}
