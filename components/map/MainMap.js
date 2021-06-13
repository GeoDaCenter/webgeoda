import styles from './MainMap.module.css'
import React, { useState, useEffect, useRef, useCallback } from 'react';

// deck GL and helper function import
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import MapboxGLMap from 'react-map-gl';
import { useDispatch, useSelector } from 'react-redux';

import useLoadData from '@webgeoda/hooks/useLoadData'
import useUpdateBins from '@webgeoda/hooks/useUpdateBins'

import { dataPresets } from '../../map-config.js'

import Legend from './Legend'
import MapControls from './MapControls'

export default function MainMap(props){
    const initialViewState = useSelector(state => state.initialViewState);
    const dataParams = useSelector(state => state.dataParams);
    const mapParams = useSelector(state => state.mapParams);
    const currentData = useSelector(state => state.currentData);
    const currentId = useSelector(state => state.currentId);
    const currentHoverId = useSelector(state => state.currentHoverTarget.id);
    const storedGeojson = useSelector(state => state.storedGeojson);
    const currentMapGeography = storedGeojson[currentData]?.data||[]
    const mapData = useSelector(state => state.mapData);
    const state = useSelector(state => state);
    const dispatch = useDispatch();

    const [loadData] = useLoadData(props.geoda);
    const [updateBins] = useUpdateBins(props.geoda);
        
    useEffect(() => {
        loadData(dataPresets)
    },[dataPresets])

    useEffect(() => {
        updateBins()
    },[dataParams.variable])

    useEffect(() => {
        dispatch({type: 'UPDATE_MAP'});
    },[mapParams.bins.breaks])

    const [viewState, setViewState] = useState({
        latitude: 0,
        longitude: 0,
        zoom: 8,
        bearing:0,
        pitch:0
    })

    const deckRef = useRef({
        deck: {
            viewState: {
                MapView: {
                    ...viewState
                }
            }
        }
    });

    const mapRef = useRef()

    useEffect(() => {
        if (initialViewState.longitude) setViewState({longitude: initialViewState.longitude,latitude: initialViewState.latitude,zoom: initialViewState.zoom*.9})
    },[initialViewState])

    const handleMapHover = (e) => dispatch({
        type:'SET_HOVER_OBJECT', 
        payload: {
            id: e.object?.properties[currentId],
            x: e.x,
            y: e.y
        }
    })

    const layers = [
        new GeoJsonLayer({
            id: 'choropleth',
            data: currentMapGeography,
            getFillColor: d => mapData.data[d.properties[currentId]].color,
            // getElevation: d => currentMapData[d.properties.GEOID].height,
            pickable: true,
            stroked: false,
            filled: true,
            // wireframe: mapParams.vizType === '3D',
            // extruded: mapParams.vizType === '3D',
            // opacity: mapParams.vizType === 'dotDensity' ? mapParams.dotDensityParams.backgroundTransparency : 0.8,
            material:false,
            onHover: handleMapHover,
            // onClick: handleMapClick,  
            updateTriggers: {
                getFillColor:mapData.params
            }  
        }),
        new GeoJsonLayer({
            id: 'choropleth-hover',
            data: currentMapGeography,
            getFillColor: [255,255,255],
            getLineColor: d => [0, 0, 0, 255*(d.properties[currentId]===currentHoverId)],
            lineWidthScale: 1,
            lineWidthMinPixels: 1,
            getLineWidth: 5,
            pickable: false,
            stroked: true,
            filled: false,
            updateTriggers: {
                getLineColor:[mapData.params, currentHoverId],
                // opacity: currentHoverTarget
            }  
        }),
    ]

    return (
        <div className={styles.mapContainer}>
            <DeckGL
                layers={layers}
                ref={deckRef}
                initialViewState={viewState}
                controller={true}
                pickingRadius={20}
            >
                <MapboxGLMap
                    reuseMaps
                    ref={mapRef}
                    mapStyle={'mapbox://styles/dhalpern/ckp07gekw2p2317phroaarzej'}
                    preventStyleDiffing={true}
                    mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                    >
                </MapboxGLMap >
            </DeckGL>
            <Legend 
                bins={mapParams.bins.bins}
                colors={mapParams.colorScale}
                variableName={dataParams.variable}
            />
            <MapControls 
                deck={deckRef}
                viewState={viewState}
                setViewState={setViewState}
            />
        </div>
    )
}