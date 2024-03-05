import React from 'react'
import dulipDep from '../../../bin/duplicateDeps.json'

export default function DulipDep() {
  return (
    <div id="InfoList">
      <pre>
        {dulipDep.map((item, index) => (
          <React.Fragment key={index}>
            <span style={{ color: 'red', fontWeight: 'bold' }}>{item.packageName}</span>
            <br />
            <span style={{ color: 'black', fontWeight: 'normal' }}>{item.versions.join('||')}</span>
            <br />
          </React.Fragment>
        ))}
      </pre>
    </div>
  )
}
