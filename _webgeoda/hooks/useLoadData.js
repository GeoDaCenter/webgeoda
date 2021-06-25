import { useSelector, useDispatch } from "react-redux";
import { useContext, useEffect } from 'react';
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

import { fitBounds } from "@math.gl/web-mercator";

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
  const currentData = useSelector((state) => state.currentData);
  const datasetToLoad = useSelector((state) => state.datasetToLoad);
  const dataPresets = useSelector((state) => state.dataPresets);
  const dataParams = useSelector((state) => state.dataParams);
  const dispatch = useDispatch();

  // const [isLoading, setIsLoading] = useState(false);
  // const [loadingProgress, setLoadingProgress] = useState(null);

  useEffect(() => {
    if (datasetToLoad) {
      loadData(dataPresets, datasetToLoad)
    }
  },[datasetToLoad])


  useEffect(() => {
    loadData(dataPresets, dataPresets.data[0].geojson)
  },[])

  const loadData = async (dataPresets, datasetToLoad) => {
    if (geoda === undefined) location.reload();
    const currentDataPreset = find(dataPresets.data, f => f.geojson === datasetToLoad);

    const numeratorTable =
      currentDataPreset.tables?.hasOwnProperty(dataParams.numerator) 
      && currentDataPreset.tables[dataParams.numerator];
      
    const denominatorTable =
      currentDataPreset.tables?.hasOwnProperty(dataParams.denominator) 
      && currentDataPreset.tables[dataParams.denominator];
    
    const firstLoadPromises = [
      geoda.loadGeoJSON(`${window.location.origin}/geojson/${currentDataPreset.geojson}`, currentDataPreset.id),
      numeratorTable && handleLoadData(numeratorTable),
      denominatorTable && handleLoadData(denominatorTable),
    ];

    const [
      [mapId, geojsonData], 
      numeratorData, 
      denominatorData
    ] = await Promise.all(firstLoadPromises);

    const geojsonProperties = indexGeoProps(
      geojsonData,
      currentDataPreset.id
    );

    const geojsonOrder = getIdOrder(
      geojsonData.features,
      currentDataPreset.id
    );

    const bounds = currentDataPreset.bounds 
      ? currentDataPreset.bounds 
      : await geoda.getBounds(mapId);
    
    const initialViewState =
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

    const binData = dataParams.categorical 
      ? getUniqueVals(
        numeratorData || geojsonProperties,
        dataParams)
      : parseColumnData({
        numeratorData: dataParams.numerator === "properties" ? geojsonProperties : numeratorData.data,
        denominatorData: dataParams.denominator === "properties" ? geojsonProperties : denominatorData.data,
        dataParams,
        geojsonOrder
    });

    const bins = dataParams.lisa 
      ? lisaBins
      : await getBins({
        geoda,
        dataParams,
        binData
      })    
      
    const colorScale = dataParams.lisa 
      ? lisaColors
      : getColorScale({
        dataParams,
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
        variableParams: dataParams,
        initialViewState,
        id: currentDataPreset.id,
      },
    });
    await loadTables(dataPresets, dateLists);
    loadWidgets(dataPresets);
  };

  const loadTables = async (dataPresets, datasetToLoad, dateLists) => {
    const tablesToFetch = find(
      dataPresets.data,
      (o) => o.geojson === datasetToLoad
    ).tables;

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

  const loadWidgets = async (dataPresets) => {
    const widgetSpecs = dataPresets.widgets.map((widget, i) => {
      let variable;
      if(widget.type == 'scatter'){
        variable = [widget.xVariable, widget.yVariable];
      } else if(widget.type == 'scatter3d') {
        variable = [widget.xVariable, widget.yVariable, widget.zVariable];
      } else {
        variable = widget.variable;
      }
      return {
        id: i,
        type: widget.type,
        options: widget.options,
        variable
      };
    });
    dispatch({
      type: "FORMAT_WIDGET_DATA",
      payload: {widgetSpecs}
    });
  };

  return [loadData];
}
