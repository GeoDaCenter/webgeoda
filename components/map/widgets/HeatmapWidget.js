import { useRef } from 'react';
import PropTypes from 'prop-types';
import useGetScatterData from '@webgeoda/hooks/useGetScatterData';

import { OrthographicView, COORDINATE_SYSTEM } from '@deck.gl/core';
import { TextLayer, PathLayer, ScatterplotLayer } from '@deck.gl/layers';
import { HexagonLayer, GridLayer, ScreenGridLayer, HeatmapLayer, ContourLayer } from '@deck.gl/aggregation-layers';
import { SimpleMeshLayer } from '@deck.gl/mesh-layers';
import DeckGL from '@deck.gl/react';
import { Matrix4 } from 'math.gl';
import deckgl from '@deck.gl/react/dist/es5/deckgl';
//import Plot from 'react-plotly.js';
//import Plotly from 'plotly.js'
import HeatMap from "react-heatmap-grid";
import { VegaLite } from 'react-vega-lite';




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

  const spec = {
    "description": "A simple bar chart with embedded data.",
    "mark": "bar",
    "encoding": {
      "x": {"field": "a", "type": "ordinal"},
      "y": {"field": "b", "type": "quantitative"}
    }
  };
  
  const barData = {
    "values": [
      {"a": "A","b": 20}, {"a": "B","b": 34}, {"a": "C","b": 55},
      {"a": "D","b": 19}, {"a": "E","b": 40}, {"a": "F","b": 34},
      {"a": "G","b": 91}, {"a": "H","b": 78}, {"a": "I","b": 25}
    ]
  };


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

  // import("plotly.js").then(({default: Plotly}) => {
  //   console.log(Plotly)

  //   const data=[
  //       {
  //         x: arrayXData,
  //         y: arrayYData,
  //         type: 'histogram2d',
  //       }
  //     ]

  //   graphic = <div id='myDiv'>{Plotly.newPlot('myDiv', data)}</div>
  //   console.log(graphic)
  // })


  graphic = <VegaLite spec={spec} data={barData} />
  return (
      <div>
        {graphic}
    </div>
  );
}

{/* <Plot
        data={[
          {
            x: arrayXData,
            y: arrayYData,
            type: 'histogram2d',
          },
        ]}      />
    </div> */}

{/* <DeckGL
            initialViewState={{
                latitude:0,
                longitude:0,
                pitch:0,
                bearing:0,
                zoom:0,
            }}
            controller={true}
            layers={layers}
        /> */}


export default HeatmapWidget;