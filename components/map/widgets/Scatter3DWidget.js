import React, {useState} from 'react';
import PropTypes from 'prop-types';
import styles from './Widgets.module.css';
import DeckGL from '@deck.gl/react';
import {COORDINATE_SYSTEM, OrbitView} from '@deck.gl/core';
import {PointCloudLayer} from '@deck.gl/layers';
import {WIDGET_WIDTH} from './Widget';

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

function Scatter3DWidgetUnwrapped(props) {
  const [viewState, setViewState] = useState(DEFAULT_VIEW_STATE);

  const onDataLoad = ({header}) => {
    // Automatically scale default view to have data in frame
    // see https://github.com/visgl/deck.gl/blob/8.4-release/examples/website/point-cloud/app.js
    if(header.boundingBox){
      const [mins, maxs] = header.boundingBox;
      setViewState({
        ...DEFAULT_VIEW_STATE,
        target: [
          (mins[0] + maxs[0]) / 2,
          (mins[1] + maxs[1]) / 2,
          (mins[2] + maxs[2]) / 2
        ],
        zoom: Math.log2(WIDGET_WIDTH / (maxs[0] - mins[0])) - 1
      })
    }
  }

  const pointCloudLayer = new PointCloudLayer({
    id: "3d-scatter-layer",
    data: props.data,
    onDataLoad,
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    getNormal: [0, 1, 0],
    getColor: [0, 0, 0], // TODO: parse and use foregroundColor
    opacity: 0.5,
    pointSize: 0.5
  });
  console.log(props.data)
  return (
    <div style={{height: "90%", position: "relative"}}>
      <DeckGL
        views={new OrbitView()}
        viewState={viewState}
        controller={true}
        onViewStateChange={newViewState => setViewState(newViewState.viewState)}
        layers={[pointCloudLayer]}
      />
    </div>
  )
}

Scatter3DWidgetUnwrapped.propTypes = {
  options: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
};

const Scatter3DWidget = React.memo(Scatter3DWidgetUnwrapped);

export default Scatter3DWidget;