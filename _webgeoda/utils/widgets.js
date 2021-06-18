import {
  getDataForBins,
  find,
} from "./data";

import { bin as d3bin } from "d3-array";

const findFirstTable = (tableName, storedData, dataPresets) => {
    for (let i=0; i<dataPresets.length; i++){
        if (dataPresets[i]?.tables.hasOwnProperty(tableName)) {
            return storedData[dataPresets[i]?.tables[tableName].file].data
        }
    }
}

// Finds the first reference to the table name in the data presets
// for use if table name not present in currently used dataset,
// in the case of multiple datasets being used

// Based on variable specs, finds and returns data tables
const getTables = (variableSpec, state) => {
    const {storedGeojson, storedData, dataPresets, currentData} = state;
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
            returnTables.numeratorData = findFirstTable(variableSpec.numerator, storedData, dataPresets)
        }
    }
    // look for denominator table
    if (dIndex === undefined && dProperty === undefined) {
        returnTables.denominatorData = storedGeojson[currentData].properties
    } else {
        if (currentTables && currentTables.hasOwnProperty(variableSpec.denominator)) {
            returnTables.denominatorData = storedData[currentTables[variableSpec.denominator].file]?.data
        } else {
            returnTables.denominatorData = findFirstTable(variableSpec.denominator, storedData, dataPresets)
        }
    }
    return returnTables
}

const getColumnData = (variableSpec, state, returnKeys=false) => {
    const {storedGeojson, currentData} = state;
    if (!storedGeojson[currentData]) return []
    const {numeratorData, denominatorData} = getTables(variableSpec, state);
    const columnData = getDataForBins(
      numeratorData,
      denominatorData,
      variableSpec
    )

    if (returnKeys) return [columnData, Object.keys(numeratorData)]
    return [columnData]
}

export const formatWidgetData = (variableName, state, widgetType) => {
    const dataPresets = state.dataPresets

    if (widgetType === "histogram"){
        const variableSpec = find(
            dataPresets.variables,
            (o) => o.variable === variableName
        )
        if (!variableSpec) return []
        const [data] = getColumnData(variableSpec, state)
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

            if (!variableSpec) return []
            const [data, keys] = getColumnData(variableSpec, storedData, dataPresets, true)
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