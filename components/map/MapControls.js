import styles from "./MainMap.module.css";
import { FlyToInterpolator } from "@deck.gl/core";
import Tooltip from "@reach/tooltip";
import "@reach/tooltip/styles.css";
const GetMapView = (props) => {
  try {
    const currView = props.deckRef?.current?.deck?.viewState?.MapView;
    return currView || { ...props.viewState };
  } catch {
    return { ...props.viewState };
  }
};

// const handleGeolocate = async (callback) => {
//   navigator.geolocation.getCurrentPosition((position) => {
//     callback({
//       longitude: position.coords.longitude,
//       latitude: position.coords.latitude,
//       zoom: 7,
//       transitionDuration: 1000,
//       transitionInterpolator: new FlyToInterpolator(),
//     });
//   });
// };

const handleZoom = (zoom, props, callback) => {
  const currMapView = GetMapView(props);
  callback({
    ...currMapView,
    zoom: currMapView.zoom + zoom,
    transitionDuration: 250,
    transitionInterpolator: new FlyToInterpolator(),
  });
};

const resetTilt = (props, callback) => {
  const currMapView = GetMapView(props);
  callback({
    ...currMapView,
    bearing: 0,
    pitch: 0,
    transitionDuration: 250,
    transitionInterpolator: new FlyToInterpolator(),
  });
};

export default function MapControls(props) {
  return (
    <div className={styles.mapButtonContainer}>
      <Tooltip label="Zoom In">
        <button
          className={styles.mapButton}
          title="Zoom In"
          id="zoomIn"
          onClick={() => handleZoom(0.5, props, props.setViewState)}
        >
          +
        </button>
      </Tooltip>
      <Tooltip label="Zoom Out">
        <button
          className={styles.mapButton}
          title="Zoom Out"
          id="zoomOut"
          onClick={() => handleZoom(-0.5, props, props.setViewState)}
        >
          -
        </button>
      </Tooltip>
      <Tooltip label="Reset Tilt">
        <button
          className={styles.mapButton}
          title="Reset Tilt"
          id="Reset Tilt"
          onClick={() => resetTilt(props, props.setViewState)}
        >
          {`*`}
        </button>
      </Tooltip>
    </div>
  );
}
