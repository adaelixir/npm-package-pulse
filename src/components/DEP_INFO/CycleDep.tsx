import React from 'react'
import cycleDep from '../../../bin/cycleDeps.json'

export default function CycleDep() {
  return (
    <div id="InfoList">
      <pre>
        {cycleDep.map((item, index) => (
          <React.Fragment key={index}>
            <span style={{ color: 'red', fontWeight: 'bold' }}>{item[0]}</span>
            <span style={{ color: 'black', fontWeight: 'normal' }}>
              {`->`}
              {item.slice(1, item.length - 1)}
              {`->`}
            </span>
            <span style={{ color: 'red', fontWeight: 'bold' }}>{item[item.length - 1]}</span>
            <br />
          </React.Fragment>
        ))}
      </pre>
    </div>
  )
}
