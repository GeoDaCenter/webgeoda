import { useSelector } from "react-redux";

import {
  getDataForBins,
  find,
} from "@webgeoda/utils/data";

export default function useGetDataColumn(variableSpec, widgetType='histogram'){
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

  // TODO: different return based on widget type needs
  const getColumnData = (variableSpec, widgetType='histogram') => {
    if (!storedGeojson[currentData]) return []
    const {numeratorData, denominatorData} = getTables(variableSpec);
    const columnData = getDataForBins(
      numeratorData,
      denominatorData,
      variableSpec
    )
    return columnData
  }

  return getColumnData(variableSpec, widgetType)

}