import { useSelector, useDispatch } from "react-redux";
import { useRef, useEffect } from "react";

import {
  getDataForBins,
  indexGeoProps,
  handleLoadData,
  find,
  fixedScales,
  fixedBreakLabels,
} from "@webgeoda/utils/data"; //getVarId
import * as colors from "@webgeoda/utils/colors";

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

export default function useLoadData(geoda, dateLists = {}) {
  const currentData = useSelector((state) => state.currentData);
  const dispatch = useDispatch();

  const loadData = async (dataPresets) => {
    if (geoda === undefined) location.reload();
    const numeratorTable =
      dataPresets.tables?.hasOwnProperty(dataPresets.variables[0].numerator) &&
      dataPresets.tables[dataPresets.variables[0].numerator];
    const denominatorTable =
      dataPresets.tables?.hasOwnProperty(
        dataPresets.variables[0].denominator
      ) && dataPresets.tables[dataPresets.variables[0].denominator];
    
    const firstLoadPromises = [
      geoda.loadGeoJSON(`${window && window.location.origin}/geojson/${dataPresets.data[0].geojson}`),
      numeratorTable && handleLoadData(numeratorTable),
      denominatorTable && handleLoadData(denominatorTable),
    ];

    const [[mapId, geojsonData], numeratorData, denominatorData] =
      await Promise.all(firstLoadPromises);
    
    const geojsonProperties = indexGeoProps(
      geojsonData,
      dataPresets.data[0].id
    );

    const geojsonOrder = getIdOrder(
      geojsonData.features,
      dataPresets.data[0].id
    );

    const bounds = await geoda.getBounds(mapId);

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

    const binData = dataPresets.variables[0].categorical 
      ? getUniqueVals(
        numeratorData || geojsonProperties,
        dataPresets.variables[0])
      : getDataForBins(
        numeratorData || geojsonProperties,
        denominatorData || geojsonProperties,
        dataPresets.variables[0]);

    let bins =
      fixedScales[dataPresets.variables[0].fixedScale] ||
      dataPresets.variables[0].fixedScale;

    if (!dataPresets.variables[0].fixedScale) {
      // calculate breaks
      let numberOfBins = Array.isArray(dataPresets.variables[0].colorscale)
        ? dataPresets.variables[0].colorscale.length
        : dataPresets.variables[0].numberOfBins || 5;

      const binParams =
        !dataPresets.variables[0].binning ||
        ["naturalBreaks", "quantileBreaks"].includes(
          dataPresets.variables[0].binning
        )
          ? [numberOfBins, binData]
          : [binData];

      const nb = await geoda[
        dataPresets.variables[0].binning || "naturalBreaks"
      ](...binParams);

      bins = {
        bins: fixedBreakLabels[dataPresets.variables[0].binning] || nb,
        breaks: nb,
      };
    }

    let colorScaleLength = dataPresets.variables[0].categorical 
      ? binData.length
      : bins.breaks.length + 1;

    if (colorScaleLength < 3) colorScaleLength = 3;

    let colorScale = Array.isArray(dataPresets.variables[0].colorscale)
      ? dataPresets.variables[0].colorScale
      : dataPresets.variables[0].colorScale[colorScaleLength];
    
    if (dataPresets.variables[0].categorical && colorScaleLength !== binData.length) colorScale = colorScale.slice(0,binData.length);

    dispatch({
      type: "INITIAL_LOAD",
      payload: {
        currentData: dataPresets.data[0].geojson,
        currentTable: {
          numerator: "properties",
          denominator: "properties",
        },
        storedGeojson: {
          [dataPresets.data[0].geojson]: {
            data: geojsonData,
            properties: geojsonProperties,
            order: geojsonOrder,
            id: mapId,
            weights: {}
          },
        },
        mapParams: {
          bins,
          colorScale: colorScale || colors.colorbrewer.YlGnBu[5],
        },
        variableParams: dataPresets.variables[0],
        initialViewState,
        id: dataPresets.data[0].id,
      },
    });
    loadTables(dataPresets, dateLists);
    // loadWidgets(dataPresets);
  };

  const loadTables = async (dataPresets, dateLists) => {
    const tablesToFetch = find(
      dataPresets.data,
      (o) => o.geojson === currentData
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
      if(widget.type == 'scatter' || widget.type == 'scatter3d'){
        variable = [widget.xVariable, widget.yVariable];
      } else {
        variable = widget.variable;
      }
      return {
        id: i,
        type: widget.type,
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
