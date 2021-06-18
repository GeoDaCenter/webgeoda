import { useSelector } from "react-redux";

import {
  getDataForBins,
  find,
} from "@webgeoda/utils/data";
import { bin as d3bin } from "d3-array";

export default function useGetWidgetData(variableName, widgetType='histogram'){
  const currentData = useSelector((state) => state.currentData);
  const dataPresets = useSelector((state) => state.dataPresets);
  const storedGeojson = useSelector((state) => state.storedGeojson);  
  const storedData = useSelector((state) => state.storedData);

  // Finds the first reference to the table name in the data presets
  // for use if table name not present in currently used dataset,
  // in the case of multiple datasets being used
  const findFirstTable = (tableName, presets) => {
    for (let i=0; i<presets.length; i++){
      if (presets[i]?.tables.hasOwnProperty(tableName)) {
        return storedData[presets[i]?.tables[tableName].file].data
      }
    }
  }

  // Based on variable specs, finds and returns data tables
  const getTables = (variableSpec) => {
    // destructure properties needed
    const {nIndex, nProperty, dIndex, dProperty} = variableSpec;

    // declare return object
    let returnTables = {
      numeratorData:null,
      denominatorData:null
    }
    // find current tables attached to dataset    
    const currentTables = find(
      dataPresets.data,
      (o) => o.geojson === currentData
    )?.tables;
    // look for numerator table
    if (nIndex === undefined && nProperty === undefined) { // default properties indicator
      returnTables.numeratorData = storedGeojson[currentData].properties
    } else {  
      if (currentTables && currentTables.hasOwnProperty(variableSpec.numerator)) {
        returnTables.numeratorData = storedData[currentTables[variableSpec.numerator].file]?.data
      } else {
        returnTables.numeratorData = findFirstTable(variableSpec.numerator, dataPresets)
      }
    }
    // look for denominator table
    if (dIndex === undefined && dProperty === undefined) {
      returnTables.denominatorData = storedGeojson[currentData].properties
    } else {
      if (currentTables && currentTables.hasOwnProperty(variableSpec.denominator)) {
        returnTables.denominatorData = storedData[currentTables[variableSpec.denominator].file]?.data
      } else {
        returnTables.denominatorData = findFirstTable(variableSpec.denominator, dataPresets)
      }
    }
    return returnTables
  }

  const getColumnData = (variableSpec, returnKeys=false) => {
    if (!storedGeojson[currentData]) return []
    const {numeratorData, denominatorData} = getTables(variableSpec);
    const columnData = getDataForBins(
      numeratorData,
      denominatorData,
      variableSpec
    )

    if (returnKeys) return [columnData, Object.keys(numeratorData)]
    return [columnData]
  }

  const formatData = (variableName, widgetType) => {
      if (widgetType === "histogram"){
        const variableSpec = find(
            dataPresets.variables,
            (o) => o.variable === variableName
        )
        const [data] = getColumnData(variableSpec)
        if (!data) return []
        const binned = d3bin().thresholds(40)(data)
        let formattedData = []
        for (let i=0; i<binned.length; i++) {
            formattedData.push({
                name: `${binned[i].x0}-${binned[i].x1}`,
                val: binned[i].length,
                label: binned[i].length
            })
        }
        return formattedData
    }

      if (widgetType === "scatter"){
        let xData;
        let yData;
        let idKeys;

        for (let i=0;i<2;i++){
            const variableSpec = find(
                dataPresets.variables,
                (o) => o.variable === variableName
            )

            const [data, keys] = getColumnData(variableSpec, true)
            if (!data) return []
            if (i===0) {
                idKeys = keys;
                xData = data
            } else {
                yData = data
            }
        }
        let formattedData = []

        for (let i=0; i<xData.length; i++){
            formattedData.push({
                x: xData[i],
                y: yData[i],
                id: idKeys[i]
            })
        }
        
        return formattedData
      }
  }

  return formatData(variableName, widgetType)
}