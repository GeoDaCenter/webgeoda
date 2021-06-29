// DELETE ME
import TEMP_DATA from "../../TEMP_time-series-data.json";

import {
    parseColumnData,
    find,
} from "./data";
import {TARGET_RANGE} from "../../components/map/widgets/Scatter3DWidget";

import { bin as d3bin } from "d3-array";
import {linearRegression, linearRegressionLine} from "simple-statistics";

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
    const {numerator, denominator, nIndex, nProperty, dIndex, dProperty} = variableSpec;

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
    if (numerator === "properties") { // default properties indicator
        returnTables.numeratorData = storedGeojson[currentData].properties
    } else {  
        if (currentTables && currentTables.hasOwnProperty(variableSpec.numerator)) {
            returnTables.numeratorData = storedData[currentTables[variableSpec.numerator].file]?.data
        } else {
            returnTables.numeratorData = findFirstTable(variableSpec.numerator, storedData, dataPresets)
        }
    }
    // look for denominator table
    if (denominator === "properties") {
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
    const columnData = parseColumnData({
        numeratorData,
        denominatorData,
        dataParams: variableSpec
    });

    if (returnKeys) return [columnData, Object.keys(numeratorData)]
    return [columnData]
}

export const formatWidgetData = (variableName, state, widgetType, options) => {
    const dataPresets = state.dataPresets

    if (widgetType === "histogram"){
        const variableSpec = find(
            dataPresets.variables,
            (o) => o.variable === variableName
        )
        if (!variableSpec) return []
        const [data] = getColumnData(variableSpec, state)
        if (!data) return []
        const binned = d3bin().thresholds(options.thresholds || 40)(data)
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
        let isLisa = false;
        let variableSpecs = [];
        for (let i = 0; i < 2; i++){
            if(i == 1 && variableName[i] === "LISA"){
                variableSpecs.push(null);
                yData = null;
                isLisa = true;
                continue;
            }
            const variableSpec = find(
                dataPresets.variables,
                (o) => o.variable === variableName[i]
            );
            if (!variableSpec){
                console.warn("Scatter plot: could not find variableSpec for " + variableName[i]);
                return null;
            }
            variableSpecs.push(variableSpec);
            const [data, keys] = getColumnData(variableSpec, state, true);
            if (!data){
                console.warn("Scatter plot: could not find column data for " + variableName[i]);
                return null;
            }
            if (i===0) {
                idKeys = keys;
                xData = data;
            } else {
                yData = data;
            }
        }
        if(xData.length == 0){
            console.warn("Scatter plot: xData length is 0");
            return null;
        }
        let min = xData[0];
        let max = xData[0];
        const formattedData = [];
        const regressionFormattedData = [];
        for(let i = 0; i < idKeys.length; i++){
            if(xData[i] < min) min = xData[i];
            if(xData[i] > max) max = xData[i];
            formattedData.push({
                x: xData[i],
                y: isLisa ? null : yData[i],
                id: idKeys[i]
            });
            if(options.showBestFitLine === true && xData[i] !== 0 && yData[i] !== 0){
                // TODO: Find a smarter way to remove zero values
                regressionFormattedData.push([
                    xData[i], yData[i]
                ])
            }
        }
        let fittedLine = null;
        let fittedLineEquation = null;
        if(options.showBestFitLine === true){
            const bestFitInfo = linearRegression(regressionFormattedData);
            const bestFit = linearRegressionLine(bestFitInfo);
            fittedLine = [ // Provide two points spanning entire domain instead of m & b to match chart.js data type
                {x: min, y: bestFit(min)},
                {x: max, y: bestFit(max)}
            ];
            fittedLineEquation = `y = ${bestFitInfo.m.toFixed(4)}x + ${bestFitInfo.b.toFixed(4)}`
        }
        return {
            data: formattedData,
            fittedLine,
            fittedLineEquation,
            variableSpecs,
            isLisa
        };
    }

    if (widgetType === "scatter3d"){
        let xData;
        let yData;
        let zData;
        let idKeys;
        for (let i=0;i<3;i++){
            const variableSpec = find(
                dataPresets.variables,
                (o) => o.variable === variableName[i]
            )
            if (!variableSpec) return []
            const [data, keys] = getColumnData(variableSpec, state, true)
            if (!data) return []
            if (i===0) {
                idKeys = keys;
                xData = data;
            } else if(i === 1) {
                yData = data;
            } else if(i === 2) {
                zData = data;
            }
        }
        const scaleAxis = (data) => {
            const min = Math.min(...data);
            const max = Math.max(...data);
            const range = max - min;
            const scaled = data.map(i => {
                i -= min;
                i *= TARGET_RANGE / range;
                return i;
            })
            return {data: scaled, min, max, scalar: TARGET_RANGE / range};
        }
        const scaledX = scaleAxis(xData);
        const scaledY = scaleAxis(yData);
        const scaledZ = scaleAxis(zData);

        const formattedData = idKeys.map((id, i) => {
            return {
                position: [
                    scaledX.data[i], scaledY.data[i], scaledZ.data[i]
                ]
            };
        })
        return {
            data: formattedData,
            axesInfo: [scaledX, scaledY, scaledZ]
        };
    }

    if(widgetType === "line"){
        console.log(TEMP_DATA);
        const data = TEMP_DATA.data.map((val, i) => {
            return val.count;
        });
        const labels = TEMP_DATA.data.map((val, i) => {
            return val.date;
        })
        return {data, labels};
    }
}