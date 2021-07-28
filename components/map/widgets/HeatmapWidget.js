import {useRef} from 'react';
import PropTypes from 'prop-types';
import useGetScatterData from '@webgeoda/hooks/useGetScatterData';

import DeckGL from '@deck.gl/react';
import {OrthographicView, COORDINATE_SYSTEM} from '@deck.gl/core';
import {TextLayer, PathLayer, ScatterplotLayer} from '@deck.gl/layers';
import {HexagonLayer, GridLayer, ScreenGridLayer,HeatmapLayer, ContourLayer} from '@deck.gl/aggregation-layers';
import {HeatmapLayer} from '@deck.gl/aggregation-layers';

import {SimpleMeshLayer} from '@deck.gl/mesh-layers';
import {Matrix4} from 'math.gl';
import deckgl from '@deck.gl/react/dist/es5/deckgl';

function HeatmapWidget(props) {
  const {
    chartData
  } = useGetScatterData({
    config: props.config,
    options: props.options,
    id: props.id
  })
  
  if (chartData.datasets[0]?.data[0]?.x === undefined || chartData.datasets[0]?.data[0]?.y === undefined) return null;
  
  const layers = [
    new HeatmapLayer({
        coordinateOrigin: [0,0, 0], 
        id: 'heatmp-layer',
        pickable: false,
        getPosition: d => [d.x*10, -1*d.y/10],
        getWeight: d => 1,
        radiusPixels:20,
        intensity:1,
        threshold:0.05,
    }),
    new GridLayer({
        id: 'screen-grid-layer',
        data: chartData.datasets[0].data,
        pickable: false,
        opacity: 0.8,
        radius:1,
        cellSize: 2,
        colorRange: [
            [0, 25, 0, 25],
            [0, 85, 0, 85],
            [0, 127, 0, 127],
            [0, 170, 0, 170],
            [0, 190, 0, 190],
            [0, 255, 0, 255]
        ],
        getPosition: d => [d.x*10, -1*d.y/10]
    }),
//     new ScatterplotLayer({
//         coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
//         coordinateOrigin: [0,0, 0], 
//         id:'scatterplot-layer',
//         data: chartData.datasets[0].data,
//         getPosition: d => [d.x*100, -1*d.y/10],
//         getRadius:10,
//   })
]


  return (
    <div>
        <DeckGL
            initialViewState={{
                latitude:0,
                longitude:0,
                pitch:0,
                bearing:0,
                zoom:0,
            }}
            controller={true}
            layers={layers}
        />
    </div>
  );
}


export default HeatmapWidget;