import { useSelector, useDispatch } from "react-redux";
import { useState, useContext, useEffect } from 'react';
import { GeodaContext } from "../contexts";

import {
  parseColumnData,
  indexGeoProps,
  handleLoadData,
  find
} from "../utils/data"; //getVarId

import {
  getColorScale,
  getBins
} from "../utils/geoda-helpers";

import * as colors from "../utils/colors";

import { fitBounds, zoomToScale } from "@math.gl/web-mercator";

// Main data loader
// This functions asynchronously accesses the Geojson data and CSVs
//   then performs a join and loads the data into the store
const getIdOrder = (features, idProp) => {
  let returnArray = [];
  for (let i=0; i<features.length; i++) {
    returnArray.push(features[i].properties[idProp])
  }
  return returnArray
};

const lisaBins = {
  breaks: [
    'Not significant',
    'High-High',
    'Low-Low',
    'High-Low',
    'Low-High',
    'Undefined',
    'Isolated'
  ],
  bins: [
    'Not significant',
    'High-High',
    'Low-Low',
    'High-Low',
    'Low-High',
    'Undefined',
    'Isolated'
  ]
}

const lisaColors = [
  [
    238,
    238,
    238
  ],
  [
    255,
    0,
    0
  ],
  [
    0,
    0,
    255
  ],
  [
    167,
    173,
    249
  ],
  [
    244,
    173,
    168
  ],
  [
    70,
    70,
    70
  ],
  [
    153,
    153,
    153
  ]
]

export default function useLoadData() {
  const geoda = useContext(GeodaContext);
  const currentData = useSelector((state) => state.currentData); // Current map data
  const datasetToLoad = useSelector((state) => state.datasetToLoad); // Set when map data needs to be loaded
  const cachedVariables = useSelector((state) => state.cachedVariables);
  const dataPresets = useSelector((state) => state.dataPresets);
  const dataParams = useSelector((state) => state.dataParams);
  const dispatch = useDispatch();

  useEffect(() => {
    if (datasetToLoad) {
      loadDataForMap(dataPresets, datasetToLoad).then(() => {
        dispatch({ type: "CHANGE_MAP_DATASET", payload: null });
        // TODO: Get rid of datasetToLoad. CHANGE_MAP_DATASET should
        // probably change currentData directly, and useLoadData should
        // listen for updates to currentData and load approriately (if not already loaded) to match
        // what's happening for widget datasets
      });
    }
  },[datasetToLoad])


  useEffect(() => loadDataForMap(dataPresets, currentData), [])

  /**
   * @async
   * @function loadDataForMap - Performs an initial load of a default variable and geospatial data
   * @param  {Object} dataPresets - A collection of data presets, typically found in the state or loaded in from config
   * @param  {String} datasetToLoad - a name of a geojson or geodata dataset to load
   */
  const loadDataForMap = async (dataPresets, datasetToLoad) => {
    if (geoda === undefined) location.reload();
    const notTiles = !datasetToLoad.includes('tiles')
    const currentDataPreset = find(dataPresets.data, f => f.geodata === datasetToLoad);
    
    const numeratorTable =
      currentDataPreset.tables?.hasOwnProperty(dataParams.numerator) 
      && currentDataPreset.tables[dataParams.numerator];
      
    const denominatorTable =
      currentDataPreset.tables?.hasOwnProperty(dataParams.denominator) 
      && currentDataPreset.tables[dataParams.denominator];
      
    const firstLoadPromises = [
      notTiles ? geoda.loadGeoJSON(`${window.location.origin}/geojson/${currentDataPreset.geodata}`, currentDataPreset.id) : [false, false],
      numeratorTable && handleLoadData(numeratorTable),
      denominatorTable && handleLoadData(denominatorTable),
    ];
    
    const [
      [mapId, geojsonData], 
      numeratorData, 
      denominatorData
    ] = await Promise.all(firstLoadPromises);
    
    if (mapId === null) setShouldRetryLoadGeoJSON(true)

    const geojsonProperties = notTiles 
      ? indexGeoProps(geojsonData,currentDataPreset.id)
      : false;

    const geojsonOrder = notTiles 
      ? getIdOrder(geojsonData.features,currentDataPreset.id) 
      : false;
    
    const tempParams = {
      ...dataParams,
      [dataParams.nIndex === null && 'nIndex']: numeratorData?.dateIndices?.length-1
    }

    const storedGeojson = {
      [datasetToLoad]: {
        data: geojsonData,
        properties: geojsonProperties,
        order: geojsonOrder,
        id: mapId,
        weights: {}
      },
    };

    const storedData = {
      [numeratorTable?.file] : numeratorData,
      [denominatorTable?.file] : denominatorData 
    };

    const binData = cachedVariables.hasOwnProperty(currentData) && 
        cachedVariables[currentData].hasOwnProperty(tempParams.variable)
      ? Object.values(cachedVariables[currentData][tempParams.variable])
      : tempParams.categorical 
      ? getUniqueVals(
        numeratorData || geojsonProperties,
        tempParams)
      : parseColumnData({
        numeratorData: tempParams.numerator === "properties" ? geojsonProperties : numeratorData.data,
        denominatorData: tempParams.denominator === "properties" ? geojsonProperties : denominatorData.data,
        dataParams: tempParams,
        fixedOrder: geojsonOrder
    });
    const bins = tempParams.lisa 
      ? lisaBins
      : await getBins({
        geoda,
        dataParams: tempParams,
        binData
      })
    const colorScale = tempParams.lisa 
      ? lisaColors
      : getColorScale({
        dataParams: tempParams,
        bins
      })

    const bounds = mapId === null
      ? [-180,180,-70,80]
      : currentDataPreset.bounds 
      ? currentDataPreset.bounds 
      : await geoda.getBounds(mapId);

    let initialViewState = window !== undefined
      ? fitBounds({
          width: window.innerWidth,
          height: window.innerHeight,
          bounds: [
            [bounds[0], bounds[2]],
            [bounds[1], bounds[3]],
          ],
        })
      : null;

    if (!notTiles && initialViewState.zoom < 4) initialViewState.zoom = 4;

    dispatch({
      type: "INITIAL_LOAD",
      payload: {
        storedGeojson,
        storedData,
        currentData: datasetToLoad,
        currentTable: {
          numerator: dataParams.numerator === "properties" ? "properties" : numeratorTable,
          denominator: dataParams.numerator === "properties" ? "properties" : denominatorTable,
        },
        currentTiles: currentDataPreset.tiles,
        mapParams: {
          bins,
          colorScale: colorScale || colors.colorbrewer.YlGnBu[5],
        },
        variableParams: tempParams,
        initialViewState,
        id: currentDataPreset.id,
        cachedVariable: {
          variable: dataParams.variable,
          data: binData,
          geoidOrder: geojsonOrder
        }
      }
    });
  };

  /**
   * @async
   * @function loadTables - loads all tables associated with a particular dataset
   * @param  {Object} dataPresets - A collection of data presets, typically found in the state or loaded in from config
   * @param  {String} datasetToLoad - a name of a geojson or geodata dataset to load
   */
   const loadTables = async (dataPresets, datasetToLoad) => {
    const currentDataPreset = find(
      dataPresets.data,
      (o) => o.geodata === datasetToLoad
    )
    const tablesToFetch = currentDataPreset.tables;
    const tableDetails = Object.values(tablesToFetch);
    for (let i=0; i<tableDetails; i++){ // intentionally lazy load
      const tableData = await handleLoadData(tableDetails[i])
      dispatch({
        type: "ADD_TABLES",
        payload: {
          [tableDetails[i].file]: tableData
        },
      });
    }
  };

  /**
   * @async
   * @function loadTable - load a table
   * @param  {Object} tableInfo - the file name, join column, and type of data to be loaded into the state
   */
  const loadTable = async (tableInfo) => {
    const tableData = await handleLoadData(tableInfo)
    dispatch({
      type: "ADD_TABLES",
      payload: {
        [tableInfo.file]: tableData
      },
    });
  };

  return [loadDataForMap, loadTable];
}
