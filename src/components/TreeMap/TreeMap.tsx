import React, { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import './TreeMap.css'
import dependenciesList from '../../../bin/dependenciesList.json'

interface GraphProps {
  filteredData: {
    packageName: string
    dependencies: object
    devDependencies: object
    numDependencies?: number
    version: string
  }[]
}

function drawPKG(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, data: any, width: number, height: number) {
  const root = d3.hierarchy({ children: data }).sum((d: any) => +d.numDependencies || 0)
  d3.treemap<d3.HierarchyNode<any>>().size([width, height]).padding(6)(root as d3.HierarchyNode<any>)

  const PKG_GROUP = svg
    .selectAll('.PKG_GROUP')
    .data(root.leaves())
    .enter()
    .append('g')
    .classed('PKG_GROUP', true)
    .attr('transform', (d: any) => `translate(${d.x0 - 2},${d.y0})`)

  const PKG_RECT = PKG_GROUP.append('rect')
    .classed('PKG_RECT', true)
    .attr('width', (d: any) => d.x1 - d.x0)
    .attr('height', (d: any) => d.y1 - d.y0)

  const PKG_LABEL = PKG_GROUP.append('foreignObject')
    .classed('PKG_LABEL', true)
    .attr('width', (d: any) => d.x1 - d.x0)
    .attr('height', (d: any) => d.y1 - d.y0)
    .append('xhtml:div')
    .style('pointer-events', 'none')
    .html((d: any) => d.data.packageName + '<br>' + d.data.version)
}

function drawDEP(rectSvg: any, clickRect: any) {
  const rectData = clickRect.data
  const depData = Object.keys(rectData.dependencies).map(dep => {
    return {
      packageName: dep,
      version: rectData.dependencies[dep],
      type: 'dependencies',
      value: 1
    }
  })
  const devDepData = Object.keys(rectData.devDependencies).map(dep => {
    return {
      packageName: dep,
      version: rectData.devDependencies[dep],
      type: 'devDependencies',
      value: 1
    }
  })
  const combinedData = depData.concat(devDepData)

  const root = d3.hierarchy({ children: combinedData }).sum((d: any) => d.value)

  d3
    .treemap<d3.HierarchyNode<any>>()
    .size([clickRect.x1 - clickRect.x0, clickRect.y1 - clickRect.y0])
    .padding(0)(root as d3.HierarchyNode<any>)

  const depRect = rectSvg
    .selectAll('.dep-foreign-object')
    .data(root.leaves())
    .enter()
    .append('rect')
    .classed('DEP_RECT', true)
    .attr('x', (d: any) => d.x0)
    .attr('y', (d: any) => d.y0)
    .attr('width', (d: any) => d.x1 - d.x0)
    .attr('height', (d: any) => d.y1 - d.y0)
    .style('fill', (d: any) => (d.data.type === 'dependencies' ? 'lightred' : 'lightblue'))
    .style('opacity', 0)

  const depText = rectSvg
    .selectAll('.dep-text')
    .data(root.leaves())
    .enter()
    .append('foreignObject')
    .classed('DEP_LABEL', true)
    .attr('x', (d: any) => d.x0)
    .attr('y', (d: any) => d.y0)
    .attr('width', (d: any) => d.x1 - d.x0)
    .attr('height', (d: any) => d.y1 - d.y0)
    .append('xhtml:div')
    .html((d: any) => `<div class="depName">${d.data.packageName}</div>` + `<div class="depVersion">${d.data.version}</div>`)
    .style('opacity', 0)

  depRect
    .transition()
    .duration(800)
    .delay((_d: any, i: number) => i * 20)
    .style('opacity', 0.5)

  depText
    .transition()
    .duration(800)
    .delay((_d: any, i: number) => i * 20)
    .style('opacity', 1)
}

function TreeMap({ filteredData }: GraphProps) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [visibleRects, setVisibleRects] = useState<any[]>([])
  const previousVisibleRects = useRef<any[]>([])

  useEffect(() => {
    if (filteredData && svgRef.current) {
      d3.select(svgRef.current).selectAll('*').remove()
      const width = svgRef.current.clientWidth
      const height = svgRef.current.clientHeight

      const svg = d3.select(svgRef.current).attr('width', width).attr('height', height)

      const combinedData = filteredData.concat(dependenciesList.filter(dep => !filteredData.some(fDep => fDep.packageName === dep.packageName)))
      drawPKG(svg, combinedData, width, height)
    }
  }, [filteredData])

  useEffect(() => {
    const handleScroll = () => {
      const svg = svgRef.current
      if (!svg) return

      const windowHeight = window.innerHeight || document.documentElement.clientHeight

      const newVisibleRects = []
      for (const child of svg.children) {
        const childRect = child.getBoundingClientRect()
        if (childRect.top < windowHeight && childRect.bottom > 0) {
          newVisibleRects.push(d3.select(child).datum())
        }
      }

      const newRectsToDraw: any[] = newVisibleRects.filter(
        (rect: any) => !previousVisibleRects.current.some((vRect: any) => vRect.data.packageName === rect.data.packageName)
      )

      for (const rectNew of newRectsToDraw) {
        d3.select(svg).selectAll('.PKG_LABEL').remove()
        const rectSvg = d3
          .select(svg)
          .select(`g[transform="translate(${rectNew.x0 - 2},${rectNew.y0})"]`)
          .append('g')
          .classed('DEP-INFO', true)

        drawDEP(rectSvg, rectNew)
      }

      setVisibleRects(newVisibleRects)
      previousVisibleRects.current = newVisibleRects
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [visibleRects, previousVisibleRects])

  return <svg id="Graph" ref={svgRef}></svg>
}

export default TreeMap
