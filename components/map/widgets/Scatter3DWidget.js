import React, {useState} from 'react';
// import PropTypes from 'prop-types';
// import styles from './Widgets.module.css';
import {hexToRgb} from '@webgeoda/utils/map';
import DeckGL from '@deck.gl/react';
import {COORDINATE_SYSTEM, OrbitView} from '@deck.gl/core';
import {PointCloudLayer, TextLayer} from '@deck.gl/layers';
import {SimpleMeshLayer} from '@deck.gl/mesh-layers';
import useGetScatterData from '@webgeoda/hooks/useGetScatterData';
// import {WIDGET_WIDTH} from './Widget';

const DEFAULT_VIEW_STATE = {
  target: [0, 0, 0],
  rotationX: 0,
  rotationOrbit: 0,
  orbitAxis: 'Y',
  fov: 50,
  minZoom: 0,
  maxZoom: 10,
  zoom: 1
};

export const TARGET_RANGE = 100;

function Scatter3DWidgetUnwrapped(props) {
  const [viewState, setViewState] = useState(DEFAULT_VIEW_STATE);
  const {
    xScale,
    yScale,
    zScale,
    data
  } = useGetScatterData({
    options: props.options,
    config: props.config,
    targetRange: 100
  })

  if (!data.length) return null;

  const showGridlines = "gridlinesInterval" in props.options && props.options.gridlinesInterval.length === 3;
  const xTick = showGridlines ? (xScale.scalar * props.options.gridlinesInterval[0]) : null;
  const yTick = showGridlines ? (yScale.scalar * props.options.gridlinesInterval[1]) : null;
  const zTick = showGridlines ? (zScale.scalar * props.options.gridlinesInterval[2]) : null;
  const xyBoxMesh = showGridlines ? {
    positions: new Float32Array([
      0, 0, 0,
      xTick, 0, 0,
      xTick, yTick, 0,
      0, yTick, 0,
      0, 0, 0
    ])
  } : null;
  const yzBoxMesh = showGridlines ? {
    positions: new Float32Array([
      0, 0, 0,
      0, 0, zTick,
      0, yTick, zTick,
      0, yTick, 0,
      0, 0, 0
    ])
  } : null;
  const xzBoxMesh = showGridlines ? {
    positions: new Float32Array([
      0, 0, 0,
      xTick, 0, 0,
      xTick, 0, zTick,
      0, 0, zTick,
      0, 0, 0
    ])
  } : null;

  const pointCloudLayer = new PointCloudLayer({
    id: "3d-scatter-layer",
    data,
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    getNormal: [0, 1, 0],
    getColor: hexToRgb(props.options.foregroundColor || "#000000"),
    opacity: 0.5,
    pointSize: props.options.pointSize || .5
  });
  const xyGridlinesData = [];
  const yzGridlinesData = [];
  const xzGridlinesData = [];
  const textData = [];
  if(showGridlines){
    for(let i = 0; i <= TARGET_RANGE; i += xTick)
      for(let j = 0; j <= TARGET_RANGE; j += yTick)
        xyGridlinesData.push({position: [i, j, 0]});
    for(let i = 0; i <= TARGET_RANGE; i += yTick)
      for(let j = 0; j <= TARGET_RANGE; j += zTick)
        yzGridlinesData.push({position: [0, i, j]});
    for(let i = 0; i <= TARGET_RANGE; i += xTick)
      for(let j = 0; j <= TARGET_RANGE; j += zTick)
        xzGridlinesData.push({position: [i, 0, j]});
    
    
    for(let axis = 0; axis <= 2; axis++){
      const tick = [xTick, yTick, zTick][axis];
      for(let i = 0; i <= TARGET_RANGE; i += tick){
        const position = [0, 0, 0];
        position[axis] = i;
        textData.push({
          position,
          text: parseFloat(i / [xScale,yScale,zScale][axis].scalar + [xScale,yScale,zScale][axis].min).toFixed(2)
        });
      }
    }
  }

  const axisLabels = [
    {
      position: [50, -15, 0],
      color: [255, 0, 0],
      text: props.options.xAxisLabel || "",
      angle: 0
    },
    {
      position: [-15, 50, 0],
      color: [0, 255, 0],
      text: props.options.yAxisLabel || "",
      angle: 90
    },
    {
      position: [0, -15, 50],
      color: [0, 0, 255],
      text: props.options.zAxisLabel || "",
      angle: 0
    }
  ];

  const gridlinesColor = [0, 0, 0, 15];
  const gridlinesLayers = showGridlines ? [
    new SimpleMeshLayer({
      id: "gridlines-xy",
      data: xyGridlinesData,
      mesh: xyBoxMesh,
      getColor: gridlinesColor,
      wireframe: true
    }),
    new SimpleMeshLayer({
      id: "gridlines-yz",
      data: yzGridlinesData,
      mesh: yzBoxMesh,
      getColor: gridlinesColor,
      wireframe: true
    }),
    new SimpleMeshLayer({
      id: "gridlines-xz",
      data: xzGridlinesData,
      mesh: xzBoxMesh,
      getColor: gridlinesColor,
      wireframe: true
    })
  ] : [];
  

  const textLayer = showGridlines ? new TextLayer({
    id: "axis-text",
    data: textData,
    getSize: 7
  }) : null;
  const labelsLayer = new TextLayer({
    id: "axis-labels",
    data: axisLabels,
    getSize: 12,
    getColor: i => i.color,
    getAngle: i => i.angle,
    billboard: true
  });

  return (
    <div>
      <DeckGL
        views={new OrbitView()}
        viewState={viewState}
        controller={true}
        onViewStateChange={newViewState => setViewState(newViewState.viewState)}
        layers={[pointCloudLayer, ...gridlinesLayers, showGridlines ? textLayer : null, labelsLayer]}
      />
    </div>
  )
}

// Scatter3DWidgetUnwrapped.propTypes = {
//   options: PropTypes.object.isRequired,
//   data: PropTypes.object.isRequired
// };

const Scatter3DWidget = React.memo(Scatter3DWidgetUnwrapped);

export default Scatter3DWidget;