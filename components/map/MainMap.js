import styles from "./MainMap.module.css";
import React, { useEffect, useRef } from "react";

// deck GL and helper function import
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import {MVTLayer} from '@deck.gl/geo-layers';
import MapboxGLMap from "react-map-gl";
import { useDispatch, useSelector } from "react-redux";

import Loader from "../layout/Loader";

import { useViewport, useSetViewport } from '@webgeoda/contexts';
import useLoadData from "@webgeoda/hooks/useLoadData";
import useUpdateMap from "@webgeoda/hooks/useUpdateMap";

import Legend from "./Legend";
import MapControls from "./MapControls";

export default function MainMap() {
  const initialViewState = useSelector((state) => state.initialViewState);
  const dataParams = useSelector((state) => state.dataParams);
  const mapParams = useSelector((state) => state.mapParams);
  const currentData = useSelector((state) => state.currentData);
  const currentTiles = useSelector((state) => state.currentTiles);
  const currentId = useSelector((state) => state.currentId);
  const currentHoverId = useSelector((state) => state.currentHoverTarget.id);
  const storedGeojson = useSelector((state) => state.storedGeojson);
  const currentMapGeography = storedGeojson[currentData]?.data || [];
  const mapData = useSelector((state) => state.mapData);
  const isLoading = useSelector((state) => state.isLoading);
  const dispatch = useDispatch();

  // eslint-disable-next-line no-empty-pattern
  const [] = useLoadData();
  // eslint-disable-next-line no-empty-pattern
  const [] = useUpdateMap();
  // eslint-disable-next-line no-empty-pattern
  const viewport = useViewport();
  // eslint-disable-next-line no-empty-pattern
  const setViewport = useSetViewport();

  const deckRef = useRef();
  const mapRef = useRef();
  
  useEffect(() => {
    if (initialViewState.longitude)
      setViewport({
        longitude: initialViewState.longitude,
        latitude: initialViewState.latitude,
        zoom: initialViewState.zoom * 0.9,
      });
  }, [initialViewState]);

  const handleMapHover = (e) => {
    if (e.object) {
      dispatch({
        type: "SET_HOVER_OBJECT",
        payload: {
          id: e.object?.properties[currentId],
          x: e.x,
          y: e.y,
        },
      })
    } else {
      dispatch({
        type: 'SET_HOVER_OBJECT',
        payload: {
          id: null,
          x: null,
          y: null
        }
      })
    }
  };

  const layers = !mapData.params.includes(currentData)
    ? []
    : currentData.includes('tiles')
    ? [new MVTLayer({
         // eslint-disable-next-line no-undef
        data: `https://api.mapbox.com/v4/${currentTiles}/{z}/{x}/{y}.mvt?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`,
        getFillColor: (d) => mapData.data[d.properties[currentId]]?.color||[0,0,0,0],
        updateTriggers: {
          getFillColor: mapData.params,
        },
      })]  
    : [
      new GeoJsonLayer({
        id: "choropleth",
        data: currentMapGeography,
        getFillColor: (d) => mapData.data[d.properties[currentId]]?.color,
        // getElevation: d => currentMapData[d.properties.GEOID].height,
        pickable: true,
        stroked: false,
        filled: true,
        // wireframe: mapParams.vizType === '3D',
        // extruded: mapParams.vizType === '3D',
        // opacity: mapParams.vizType === 'dotDensity' ? mapParams.dotDensityParams.backgroundTransparency : 0.8,
        material: false,
        onHover: handleMapHover,
        // onClick: handleMapClick,
        updateTriggers: {
          getFillColor: mapData.params,
        },
        transitions: {
          getFillColor: dataParams.nIndex === undefined ? 250 : 0
        }
      }),
      new GeoJsonLayer({
        id: "choropleth-hover",
        data: currentMapGeography,
        getFillColor: [255, 255, 255],
        getLineColor: (d) => [
          0,
          0,
          0,
          255 * (d.properties[currentId] === currentHoverId),
        ],
        lineWidthScale: 1,
        lineWidthMinPixels: 1,
        getLineWidth: 5,
        pickable: false,
        stroked: true,
        filled: false,
        updateTriggers: {
          getLineColor: [mapData.params, currentHoverId],
          // opacity: currentHoverTarget
        },
      })];

    // h
  return (
    <div className={styles.mapContainer}>
      
      {isLoading && <div className={styles.preLoader}><Loader globe={true} /></div>}
      <DeckGL
        layers={layers}
        ref={deckRef}
        initialViewState={viewport}
        controller={true}
        pickingRadius={20}
        onViewStateChange={({viewState}) => setViewport(viewState)}
      >
        <MapboxGLMap
          reuseMaps
          ref={mapRef}
          mapStyle={"mapbox://styles/dhalpern/ckp07gekw2p2317phroaarzej"}
          preventStyleDiffing={true}
          // eslint-disable-next-line no-undef
          mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        ></MapboxGLMap>
      </DeckGL>
      <Legend
        bins={mapParams.bins.bins}
        colors={mapParams.colorScale}
        variableName={dataParams.variable}
        ordinal={dataParams.categorical||dataParams.lisa}
      />
      <MapControls
        deck={deckRef}
      />
    </div>
  );
}
