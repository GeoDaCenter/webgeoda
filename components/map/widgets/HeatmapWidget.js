import { useRef } from 'react';
import PropTypes from 'prop-types';
import useGetScatterData from '@webgeoda/hooks/useGetScatterData';

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
  const chartRef = useRef()
  //console.log(Plotly)
  const {
    chartData
  } = useGetScatterData({
    config: props.config,
    options: props.options,
    id: props.id
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
    console.log(Plotly)

    const data=[
        {
          x: arrayXData,
          y: arrayYData,
          type: 'histogram2d',
        }
      ]

    graphic = Plotly.newPlot('myDiv', data)
    console.log(graphic)
  })


  return (
      <div>
        {graphic}
    </div>
  );
}


export default HeatmapWidget;