import styles from '../styles/Map.module.css'
import React, { useState, useEffect, useRef, useCallback } from 'react';

// deck GL and helper function import
import DeckGL from '@deck.gl/react';
import {MapView, FlyToInterpolator} from '@deck.gl/core';
import MapboxGLMap from 'react-map-gl';

export default function MainMap(){
    const [viewState, setViewState] = useState({
        latitude: 41.8,
        longitude: -87.6,
        zoom: 8,
        bearing:0,
        pitch:0
    })
    return (
        <div className={styles.mapContainer}>
            <DeckGL
                // layers={}
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