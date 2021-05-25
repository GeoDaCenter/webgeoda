import styles from '../styles/Map.module.css'
import React, { useState, useEffect, useRef, useCallback } from 'react';

// deck GL and helper function import
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import MapboxGLMap from 'react-map-gl';
import { useDispatch, useSelector } from 'react-redux';

import useLoadData from '@webgeoda/hooks/useLoadData'

import { dataPresets } from '../map-config.js'

export default function MainMap(props){
    const initialViewState = useSelector(state => state.initialViewState);
    const dataParams = useSelector(state => state.dataParams);
    const mapParams = useSelector(state => state.mapParams);
    const currentData = useSelector(state => state.currentData);
    const currentId = useSelector(state => state.currentId);
    const storedGeojson = useSelector(state => state.storedGeojson);
    const currentMapGeography = storedGeojson[currentData]?.data||[]
    const mapData = useSelector(state => state.mapData);
    const state = useSelector(state => state)
    const dispatch = useDispatch();

    const [loadData] = useLoadData(props.gdaProxy);
    // const [updateMap] = useUpdateMap();

    useEffect(() => {
        console.log(state)
    },[state])
        
    useEffect(() => {
        loadData(dataPresets)
    },[dataPresets])

    useEffect(() => {
        dispatch({type: 'UPDATE_MAP'});
    },[dataParams.variableName, mapParams.bins.breaks])

    const [viewState, setViewState] = useState({
        latitude: 0,
        longitude: 0,
        zoom: 8,
        bearing:0,
        pitch:0
    })

    useEffect(() => {
        if (initialViewState.longitude) setViewState({longitude: initialViewState.longitude,latitude: initialViewState.latitude,zoom: initialViewState.zoom*.9})
    },[initialViewState])


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
            // onHover: handleMapHover,
            // onClick: handleMapClick,  
            updateTriggers: {
                getFillColor:mapData.params
            }  
        }),
    ]

    return (
        <div className={styles.mapContainer}>
            <DeckGL
                layers={layers}
                // ref={deckRef}
                initialViewState={viewState}
                controller={true}
                // views={view}
                pickingRadius={20}
            >
                <MapboxGLMap
                    reuseMaps
                    // ref={mapRef}
                    mapStyle={'mapbox://styles/dhalpern/ckp07gekw2p2317phroaarzej'}
                    preventStyleDiffing={true}
                    mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                    >
                </MapboxGLMap >
            </DeckGL>
            {/* <MapButtonContainer 
                infoPanel={panelState.info}
            >
                <NavInlineButtonGroup>
                    <NavInlineButton
                        title="Selection Box"
                        id="boxSelect"
                        isActive={boxSelect}
                        onClick={() => handleSelectionBoxStart()}
                    >
                        {SVG.selectRect}
                    </NavInlineButton>
                </NavInlineButtonGroup>
                <NavInlineButtonGroup>
                    <NavInlineButton
                        title="Geolocate"
                        id="geolocate"
                        onClick={() => handleGeolocate()}
                    >
                        {SVG.locate}
                    </NavInlineButton>
                </NavInlineButtonGroup>
                
                <NavInlineButtonGroup>
                    <NavInlineButton
                    
                        title="Zoom In"
                        id="zoomIn"
                        onClick={() => handleZoom(0.5)}
                    >
                        {SVG.plus}
                    </NavInlineButton>
                    <NavInlineButton
                        title="Zoom Out"
                        id="zoomOut"
                        onClick={() => handleZoom(-0.5)}
                    >
                        {SVG.minus}
                    </NavInlineButton>
                    <NavInlineButton
                        title="Reset Tilt"
                        id="resetTilt"
                        tilted={deckRef.current?.deck.viewState?.MapView?.bearing !== 0 || deckRef.current?.deck.viewState?.MapView?.pitch !== 0}
                        onClick={() => resetTilt()}
                    >
                        {SVG.compass}
                    </NavInlineButton>
                </NavInlineButtonGroup>
                <NavInlineButtonGroup>
                    <NavInlineButton
                        title="Share this Map"
                        id="shareButton"
                        shareNotification={shared}
                        onClick={() => handleShare({mapParams, dataParams, currentData, coords: GetMapView(), lastDateIndex: dateIndices[currentData][dataParams.numerator]})}
                    >
                        {SVG.share}
                    </NavInlineButton>
                </NavInlineButtonGroup>
                <ShareURL type="text" value="" id="share-url" />
            </MapButtonContainer>
            <GeocoderContainer>
                <Geocoder 
                    id="Geocoder"
                    placeholder={"Search by location"}
                    API_KEY={MAPBOX_ACCESS_TOKEN}
                    onChange={handleGeocoder}
                />
            </GeocoderContainer> */}
        </div>
    )
}