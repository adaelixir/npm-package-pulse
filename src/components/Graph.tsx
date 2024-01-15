import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import dependenciesList from '../../bin/dependenciesList.json'

interface GraphProps {
  filteredData: {
    packageName: string
    dependencies: string[]
    devDependencies: string[]
    numDependencies?: number
  }[]
}

export default function Graph({ filteredData }: GraphProps) {
  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (filteredData && svgRef.current) {
      d3.select(svgRef.current).selectAll('*').remove()
      const width = svgRef.current.clientWidth
      const height = svgRef.current.clientHeight
      const svg = d3.select(svgRef.current).attr('width', width).attr('height', height)

      const combinedData = filteredData.concat(
        dependenciesList.filter((dep) => !filteredData.some((fDep) => fDep.packageName === dep.packageName))
      )

      const root = d3.hierarchy({ children: combinedData }).sum(function (d: any) {
        return +d.numDependencies || 0
      })

      d3.treemap<d3.HierarchyNode<any>>().size([width, height]).padding(2)(root as d3.HierarchyNode<any>)

      svg
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
        .style('stroke', 'black')
        .style('stroke-width', '0.5px')
        .style('fill', function (d: any) {
          return filteredData.some((fDep) => fDep.packageName === d.data.packageName) ? '#fad7dc' : 'white'
        })

      svg
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
        .style('width', '100%')
        .style('height', '100%')
        .style('overflow', 'auto')
        .append('xhtml:div')
        .text(function (d: any) {
          return d.data.packageName
        })
        .style('font-size', '10px')
        .style('color', 'black')
    }
  }, [filteredData])

  return (
    <svg
      id='Graph'
      ref={svgRef}></svg>
  )
}
