import { useSelector } from 'react-redux';
import { useRef } from 'react';
import PropTypes from 'prop-types';
import useGetScatterData from '@webgeoda/hooks/useGetScatterData';
import * as ss from 'simple-statistics'

// import { OrthographicView, COORDINATE_SYSTEM } from '@deck.gl/core';
// import { TextLayer, PathLayer, ScatterplotLayer } from '@deck.gl/layers';
// import { HexagonLayer, GridLayer, ScreenGridLayer, HeatmapLayer, ContourLayer } from '@deck.gl/aggregation-layers';
// import { SimpleMeshLayer } from '@deck.gl/mesh-layers';
// import DeckGL from '@deck.gl/react';
// import { Matrix4 } from 'math.gl';
// import deckgl from '@deck.gl/react/dist/es5/deckgl';
// //import Plot from 'react-plotly.js';
// //import Plotly from 'plotly.js'
// import HeatMap from "react-heatmap-grid";
// import { VegaLite } from 'react-vega-lite';




function HeatmapWidget(props) {
  const boxFilterGeoids = useSelector((state) => state.boxFilterGeoids)
  //console.log(Plotly)
  const {
    chartData
  } = useGetScatterData({
    config: props.config,
    options: props.options,
    id: props.id,
    geoids: boxFilterGeoids
  })

  let arrayXData = [];
  let arrayYData = [];



  if (chartData.datasets[0]?.data[0]?.x === undefined || chartData.datasets[0]?.data[0]?.y === undefined) return null;

  for (let i = 0; i < chartData.datasets[0].data.length; i++) {
    arrayXData.push(chartData.datasets[0].data[i].x);
    arrayYData.push(chartData.datasets[0].data[i].y)
  }

  // const layers = [
  //   new HeatmapLayer({
  //       coordinateOrigin: [0,0, 0], 
  //       id: 'heatmp-layer',
  //       pickable: false,
  //       getPosition: d => [d.x*10, -1*d.y/10],
  //       getWeight: d => 1,
  //       radiusPixels:20,
  //       intensity:1,
  //       threshold:0.05,
  //   }),
  //   new GridLayer({
  //       id: 'screen-grid-layer',
  //       data: chartData.datasets[0].data,
  //       pickable: false,
  //       opacity: 0.8,
  //       radius:1,
  //       cellSize: 2,
  //       colorRange: [
  //           [0, 25, 0, 25],
  //           [0, 85, 0, 85],
  //           [0, 127, 0, 127],
  //           [0, 170, 0, 170],
  //           [0, 190, 0, 190],
  //           [0, 255, 0, 255]
  //       ],
  //       getPosition: d => [d.x*10, -1*d.y/10]
  //   }),
  //     new ScatterplotLayer({
  //         coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
  //         coordinateOrigin: [0,0, 0], 
  //         id:'scatterplot-layer',
  //         data: chartData.datasets[0].data,
  //         getPosition: d => [d.x*100, -1*d.y/10],
  //         getRadius:10,
  //   })
  // ]

  let graphic = null;

  // import('react-plotly.js').then((Plot) => {
  //   console.log(Plot)
    // graphic = <Plot
    //   data={[
    //     {
    //       x: [1, 2, 3],
    //       y: [4, 5, 6],
    //       type: 'scatter',
    //     },
    //   ]}
    //   layout={{ width: 320, height: 240, title: 'A Fancy Plot' }}
    // />
  //   console.log(graphic)
  // })

  import("plotly.js").then(({default: Plotly}) => {
    // console.log(arrayYData)


    const yMin = ss.median(arrayYData) - 1.5*ss.interquartileRange(arrayYData)
    const yMax = ss.median(arrayYData) + 1.5*ss.interquartileRange(arrayYData)

    const xMin = ss.median(arrayXData) - 1.5*ss.interquartileRange(arrayXData)
    const xMax = ss.median(arrayXData) + 1.5*ss.interquartileRange(arrayXData)

    const data=[
        {
          x: arrayXData,
          y: arrayYData,
          autobinx: false,
          xbins: {
            start: xMin,
            end: xMax,
            size: Math.floor((xMax-xMin)/40)
          },
          autobiny: false,
          ybins: {
            start: yMin,
            end: yMax,
            size: Math.floor((yMax-yMin)/40)
          },
           colorscale: [['0', 'rgb(255, 255, 217)'], ['0.25', 'rgb(199, 233, 180)'], ['0.5', 'rgb(65, 182, 196)'], ['0.75', 'rgb(34, 94, 168)'], ['1', 'rgb(8, 29, 88)']],

          //colorscale: [['0', 'rgb(250,250,250)'], ['0.25', 'rgb(210,210,210)'], ['0.5', 'rgb(140,140,140)'], ['0.75', 'rgb(100,100,100)'], ['1', 'rgb(50,50,50)']],
          type: 'histogram2d',
        }
      ]

      const layout = { width: 370, height: 200, margin: {
        l: 40,
        r: 0,
        b: 30,
        t: 30,
        pad: 1
      },}

    graphic = Plotly.newPlot('myDiv', data, layout)
  })


  return (
      <div>
        {graphic}
    </div>
  );
}


export default HeatmapWidget;