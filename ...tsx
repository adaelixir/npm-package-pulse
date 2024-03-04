const pkgLabel = svg
  .selectAll('foreignObject')
  .data(root.leaves())
  .enter()
  .append('foreignObject')
  .attr('x', function (d: any) {
    return d.x0
  })
  .attr('y', function (d: any) {
    return d.y0
  })
  .attr('width', function (d: any) {
    return d.x1 - d.x0
  })
  .attr('height', function (d: any) {
    return d.y1 - d.y0
  })
  .append('xhtml:div')
  .classed('tree-label', true)
  .html(function (d: any) {
    const packageName = JSON.stringify(d.data)
    return `<div class="package">${packageName}</div>`
  })

import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import dependenciesList from '../../../bin/dependenciesList.json'
import './TreeGraph.css'

interface GraphProps {
  filteredData: {
    packageName: string
    dependencies: object
    devDependencies: object
    numDependencies?: number
    version: string
  }[]
}

function drawTree(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, data: any, width: number, height: number) {
  const root = d3.hierarchy({ children: data }).sum(function (d: any) {
    return +d.numDependencies || 0
  })
  console.log(root)

  d3.treemap<d3.HierarchyNode<any>>().size([width, height]).padding(2)(root as d3.HierarchyNode<any>)

  const pkgRect = svg
    .selectAll('rect')
    .data(root.leaves())
    .enter()
    .append('rect')
    .attr('x', function (d: any) {
      return d.x0
    })
    .attr('y', function (d: any) {
      return d.y0
    })
    .attr('width', function (d: any) {
      return d.x1 - d.x0
    })
    .attr('height', function (d: any) {
      return d.y1 - d.y0
    })
    .style('fill', 'white')
    .style('stroke', 'black')
    // .classed('tree-rect', true)
    // .classed('tree-rect-colored', function (d: any) {
    //   return data.some((fDep: { packageName: any }) => fDep.packageName === d.data.packageName)
    // })
    .on('click', function (d: any) {
      drawDepTree(svg, d.target.__data__.data, d.target.__data__.x1 - d.target.__data__.x0, d.target.__data__.y1 - d.target.__data__.y0)
    })
}

function drawDepTree(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, data: any, width: number, height: number) {
  const depData = Object.keys(data.dependencies).map(dep => {
    return {
      packageName: dep,
      version: data.dependencies[dep],
      type: 'dependencies'
    }
  })
  const devDepData = Object.keys(data.devDependencies).map(dep => {
    return {
      packageName: dep,
      version: data.devDependencies[dep],
      type: 'devDependencies'
    }
  })
  const combinedData = depData.concat(devDepData)

  const root = d3.hierarchy({ children: combinedData }).sum(function (d: any) {
    return +d.length || 0
  })

  console.log(root)

  d3.treemap<d3.HierarchyNode<any>>().size([width, height]).padding(2)(root as d3.HierarchyNode<any>)

  const depRect = svg
    .selectAll('rect')
    .data(root.leaves())
    .enter()
    .append('rect')
    .attr('x', function (d: any) {
      return d.x0
    })
    .attr('y', function (d: any) {
      return d.y0
    })
    .attr('width', function (d: any) {
      return d.x1 - d.x0
    })
    .attr('height', function (d: any) {
      return d.y1 - d.y0
    })
    .style('fill', 'white')
    .style('stroke', 'black')

  // const root = d3.hierarchy({ children: data.dependencies.concat(data.devDependencies) }).sum(function (d: any) {
  //   return 1
  // })
  // console.log(root)
  // d3.treemap<d3.HierarchyNode<any>>().size([width, height]).padding(2)(root as d3.HierarchyNode<any>)
  // const depRect = svg
  //   .selectAll('rect')
  //   .data(root.leaves())
  //   .enter()
  //   .append('rect')
  //   .attr('x', function (d: any) {
  //     return d.x0
  //   })
  //   .attr('y', function (d: any) {
  //     return d.y0
  //   })
  //   .attr('width', function (d: any) {
  //     return d.x1 - d.x0
  //   })
  //   .attr('height', function (d: any) {
  //     return d.y1 - d.y0
  //   })
  //   .classed('tree-rect', true)
  //   .classed('tree-rect-colored', function (d: any) {
  //     return data.some((fDep: { packageName: any }) => fDep.packageName === d.data.packageName)
  //   })
}

export default function TreeGraph({ filteredData }: GraphProps) {
  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (filteredData && svgRef.current) {
      d3.select(svgRef.current).selectAll('*').remove()
      const width = svgRef.current.clientWidth
      const height = svgRef.current.clientHeight

      const svg = d3.select(svgRef.current).attr('width', width).attr('height', height)

      const combinedData = filteredData.concat(dependenciesList.filter(dep => !filteredData.some(fDep => fDep.packageName === dep.packageName)))
      drawTree(svg, combinedData, width, height)
    }
  }, [filteredData])

  return <svg id="Graph" ref={svgRef}></svg>
}

function drawDepTree(svg: d3.Selection<SVGGElement, unknown, null, undefined>, data: any, width: number, height: number) {
  const depData = Object.keys(data.dependencies).map(dep => {
    return {
      packageName: dep,
      version: data.dependencies[dep],
      type: 'dependencies'
    }
  })
  const devDepData = Object.keys(data.devDependencies).map(dep => {
    return {
      packageName: dep,
      version: data.devDependencies[dep],
      type: 'devDependencies'
    }
  })
  const combinedData = depData.concat(devDepData)

  const root = d3.hierarchy({ children: combinedData }).sum(function (d: any) {
    return +d.numDependencies || 0
  })

  d3.treemap<d3.HierarchyNode<any>>().size([width, height]).padding(2)(root as d3.HierarchyNode<any>)

  const depRect = svg
    .selectAll('.dep-foreign-object')
    .data(root.leaves())
    .enter()
    .append('foreignObject')
    .attr('x', function (d: any) {
      return d.x0
    })
    .attr('y', function (d: any) {
      return d.y0
    })
    .attr('width', function (d: any) {
      return d.x1 - d.x0
    })
    .attr('height', function (d: any) {
      return d.y1 - d.y0
    })
    .append('xhtml:div')
    .classed('tree-label', true)
    .style('color', 'black')
    .style('background-color', 'white')
    .style('border', '1px solid black')
    .html(function (d: any) {
      const packageName = JSON.stringify(d.data)
      return `<div class="package">${packageName}</div>`
    })
}

// PKG_GROUP.on('click', function (event, clickRect: any) {
//   console.log(clickRect)

//   d3.select(this).select('foreignObject').remove()
//   d3.select(this).select('g').remove()
//   const rectSvg = d3.select(this).append('g').classed('DEP-INFO', true)
//   drawDependencyTree(rectSvg, clickRect)
// })
