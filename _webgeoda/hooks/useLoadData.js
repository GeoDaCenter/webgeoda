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

import {loadWidgets} from "../utils/widgets";

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

export default function useLoadData(dateLists = {}) {
  const geoda = useContext(GeodaContext);
  const currentData = useSelector((state) => state.currentData); // Current map data
  const datasetToLoad = useSelector((state) => state.datasetToLoad); // Set when map data needs to be loaded
  const cachedVariables = useSelector((state) => state.cachedVariables);
  const dataPresets = useSelector((state) => state.dataPresets);
  const dataParams = useSelector((state) => state.dataParams);
  const activeDatasets = useSelector((state) => state.activeDatasets);
  const storedData = useSelector((state) => state.storedData);
  const storedGeojson = useSelector((state) => state.storedGeojson);
  const [shouldRetryLoadGeoJSON, setShouldRetryLoadGeoJSON] = useState(false)
  const dispatch = useDispatch();

  useEffect(() => {
    if (datasetToLoad) {
      loadData(dataPresets, datasetToLoad).then(() => {
        dispatch({ type: "CHANGE_MAP_DATASET", payload: null });
        // TODO: Get rid of datasetToLoad. CHANGE_MAP_DATASET should
        // probably change currentData directly, and useLoadData should
        // listen for updates to currentData and load approriately (if not already loaded) to match
        // what's happening for widget datasets
      });
    }
  },[datasetToLoad])

  useEffect(() => {
    for(const dataset of activeDatasets){
      if(!(dataset in storedData) || !(dataset in storedGeojson)){ // TODO: is an entry in storedData and storedGeojson guaranteed?
        // TODO: Load data into redux state
        // However, we can't use the current loadData function or the INITIAL_LOAD action
        // since that would modify map state. Create new action to load data without
        // map side effects
      }
    }
  }, [activeDatasets]);

  useEffect(() => {
    if (shouldRetryLoadGeoJSON) {
      setTimeout(() => {
        attemptGeojsonLoad();
      }, 10000)
    }
  },[shouldRetryLoadGeoJSON])

  useEffect(() => {
    // Load default dataset on page load
    dispatch({ type: "CHANGE_MAP_DATASET", payload: dataPresets.data[0].geodata });
  },[])

  const attemptGeojsonLoad = async () => {
    const currentDataPreset = find(
      dataPresets.data,
      (o) => o.geodata === currentData
    )
    const secondMapId = await geoda.attemptSecondGeojsonLoad(`${window.location.origin}/geojson/${currentDataPreset.geodata}`) 
    setShouldRetryLoadGeoJSON(false)
  }

  const loadData = async (dataPresets, datasetToLoad) => {
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

    const bounds = mapId === null
      ? [-180,180,-70,80]
      : currentDataPreset.bounds 
      ? currentDataPreset.bounds 
      : await geoda.getBounds(mapId);

    let initialViewState =
      window !== undefined
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
    
    const tempParams = {
      ...dataParams,
      [dataParams.nIndex === null && 'nIndex']: numeratorData?.dateIndices?.length-1
    }

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
    dispatch({
      type: "INITIAL_LOAD",
      payload: {
        currentData: datasetToLoad,
        currentTable: {
          numerator: dataParams.numerator === "properties" ? "properties" : numeratorTable,
          denominator: dataParams.numerator === "properties" ? "properties" : denominatorTable,
        },
        currentTiles: currentDataPreset.tiles,
        storedGeojson: {
          [datasetToLoad]: {
            data: geojsonData,
            properties: geojsonProperties,
            order: geojsonOrder,
            id: mapId,
            weights: {}
          },
        },
        storedData: {
          [numeratorTable?.file] : numeratorData,
          [denominatorTable?.file] : denominatorData 
        },
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

    loadTables(dataPresets, datasetToLoad, dateLists, mapId).then(r => {
      loadWidgets(dataPresets.widgets, dispatch);
    })
  };

  const loadTables = async (dataPresets, datasetToLoad, dateLists) => {
    const currentDataPreset = find(
      dataPresets.data,
      (o) => o.geodata === datasetToLoad
    )
    const tablesToFetch = currentDataPreset.tables;
    const tableNames = Object.keys(tablesToFetch);
    const tableDetails = Object.values(tablesToFetch);
    const tablePromises = tableDetails.map((table) =>
      handleLoadData(table, dateLists)
    );
    const tableData = await Promise.all(tablePromises);

    const dataCollection = {};
    for (let i = 0; i < tableNames.length; i++)
      dataCollection[tableDetails[i].file] = tableData[i];

    dispatch({
      type: "ADD_TABLES",
      payload: dataCollection,
    });
  };

  return [loadData];
}
