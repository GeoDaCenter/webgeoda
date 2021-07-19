// DELETE ME
import TEMP_DATA from "../../TEMP_time-series-data.json";

import {
    parseColumnData,
    find,
} from "./data";
import {TARGET_RANGE} from "../../components/map/widgets/Scatter3DWidget";

import { bin as d3bin } from "d3-array";
import useLisa from '@webgeoda/hooks/useLisa';
import useGetScatterplotLisa from '@webgeoda/hooks/useGetScatterplotLisa';
import {linearRegression, linearRegressionLine, kMeansCluster, min, max, standardDeviation, median, mean} from "simple-statistics";

const findFirstTable = (tableName, storedData, dataPresets) => {
    for (let i=0; i<dataPresets.length; i++){
        if (dataPresets[i]?.tables.hasOwnProperty(tableName)) {
            const dataset = dataPresets[i]?.tables[tableName].file;
            return {
                data: dataset == null ? null : storedData[dataset].data,
                dataset
            };
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
        denominatorData:null,
        dataset: null
    }
    // find current tables attached to dataset    
    const currentTables = find(
        dataPresets.data,
        (o) => o.geodata === currentData
    )?.tables;
    // look for numerator table
    if (numerator === "properties") { // default properties indicator
        returnTables.numeratorData = storedGeojson[currentData].properties
        returnTables.dataset = "properties";
    } else {  
        if (currentTables && currentTables.hasOwnProperty(variableSpec.numerator)) {
            returnTables.numeratorData = storedData[currentTables[variableSpec.numerator].file]?.data;
            returnTables.dataset = currentTables[variableSpec.numerator].file;
        } else {
            const data = findFirstTable(variableSpec.numerator, storedData, dataPresets);
            returnTables.numeratorData = data.data;
            returnTables.dataset = data.dataset;
        }
    }
    // look for denominator table
    if (denominator === "properties") {
        returnTables.denominatorData = storedGeojson[currentData].properties
    } else {
        if (currentTables && currentTables.hasOwnProperty(variableSpec.denominator)) {
            returnTables.denominatorData = storedData[currentTables[variableSpec.denominator].file]?.data;
        } else {
            const data = findFirstTable(variableSpec.denominator, storedData, dataPresets);
            returnTables.denominatorData = data?.data;
        }
    }
    return returnTables
}

export const getColumnData = (variableSpec, state, returnKeys=false, returnDataset=false) => {
    const {storedGeojson, currentData, cachedVariables} = state;
    if (!storedGeojson[currentData]) return []
    const {numeratorData, denominatorData, dataset} = getTables(variableSpec, state);
    const columnData = (cachedVariables.hasOwnProperty(currentData) 
        && cachedVariables[currentData].hasOwnProperty(variableSpec.variable))
        ? Object.values(cachedVariables[currentData][variableSpec.variable])
        : parseColumnData({
            numeratorData,
            denominatorData,
            dataParams: variableSpec,
            fixedOrder: storedGeojson[currentData].order
        });
    const ret = {
        data: columnData
    };
    if (returnKeys) ret.keys = Object.keys(storedGeojson[currentData].order);
    if(returnDataset) ret.dataset = dataset;
    return ret;
}

export const formatWidgetData = (variableName, state, widgetType, options) => {
    const dataPresets = state.dataPresets
    if (widgetType === "histogram"){
        const variableSpec = find(
            dataPresets.variables,
            (o) => o.variable === variableName
        )
        if (!variableSpec) return []
        console.log(getColumnData(variableSpec, state, false, true))
        const {data, dataset} = getColumnData(variableSpec, state, false, true);
        if (!data) return []
        const binned = d3bin().thresholds(options.thresholds || 40)(data)
        let formattedData = [];
        let labels = [];
        let binBounds = [];
        for (let i=0; i<binned.length; i++) {
            formattedData.push(binned[i].length);
            labels.push(`${binned[i].x0}-${binned[i].x1}`);
            binBounds.push([binned[i].x0, binned[i].x1]);
        }
        return {
            data: formattedData,
            dataset,
            labels,
            binBounds,
            variableToCache: [{
                data,
                order: state.storedGeojson[state.currentData].order,
                variable: variableName
            }]
        }
    }

    if (widgetType === "scatter"){
        const isCluster = options.foregroundColor === "cluster";
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
            const {data, keys} = getColumnData(variableSpec, state, true);
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
        const statisticsFormattedData = [];
        for(let i = 0; i < idKeys.length; i++){

            // TODO: Find a smarter way to remove zero values
            //if(options.removeZeroValues === true && (xData[i] === 0 || yData[i] === 0)) continue;
            if(xData[i] < min) min = xData[i];
            if(xData[i] > max) max = xData[i];
            formattedData.push({
                x: xData[i],
                y: isLisa ? null : yData[i],
                id: idKeys[i]
            });
            if(options.showBestFitLine === true || isCluster){
                statisticsFormattedData.push([
                    xData[i], yData[i]
                ])
            }
        }
        let fittedLine = null;
        let fittedLineEquation = null;
        if(options.showBestFitLine === true){
            // TODO: Zero values influence k-means cluster algo, but need to be
            // excluded in a way that preserves OG indices of data
            const bestFitInfo = linearRegression(statisticsFormattedData);
            const bestFit = linearRegressionLine(bestFitInfo);
            fittedLine = [ // Provide two points spanning entire domain instead of m & b to match chart.js data type
                {x: min, y: bestFit(min)},
                {x: max, y: bestFit(max)}
            ];
            fittedLineEquation = `y = ${bestFitInfo.m.toFixed(4)}x + ${bestFitInfo.b.toFixed(4)}`
        }
        let clusterLabels = null;
        if(isCluster){
            try {
                clusterLabels = kMeansCluster(statisticsFormattedData, options.numClusters || 2).labels;
            } catch(e) {
                console.warn(e);
                return;
            }
        }
        return {
            data: formattedData,
            fittedLine,
            fittedLineEquation,
            variableSpecs,
            isLisa,
            clusterLabels,
            isCluster,
            variableToCache: [{
                data: xData,
                order: state.storedGeojson[state.currentData].order,
                variable: variableName[0]
            },{
                data: yData,
                order: state.storedGeojson[state.currentData].order,
                variable: variableName[1]
            }]
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
            const {data, keys} = getColumnData(variableSpec, state, true)
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
            axesInfo: [scaledX, scaledY, scaledZ],
            variableToCache: [{
                data: xData,
                order: state.storedGeojson[state.currentData].order,
                variable: variableName[0]
            },{
                data: yData,
                order: state.storedGeojson[state.currentData].order,
                variable: variableName[1]
            },{
                data: zData,
                order: state.storedGeojson[state.currentData].order,
                variable: variableName[2]
            }]
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

    if(widgetType === "summary"){
        const variableSpec = find(
            dataPresets.variables,
            (o) => o.variable === variableName
        )
        if (!variableSpec) return []
        const {data, keys} = getColumnData(variableSpec, state, true);
        if (!data) return []
        return {
            median: median(data).toFixed(3),
            mean: mean(data).toFixed(3),
            stdev: standardDeviation(data).toFixed(3),
            min: min(data).toFixed(3),
            max: max(data).toFixed(3),
        }
    }

    if (widgetType === "lisaW"){
        
        const variableSpec = find(
            dataPresets.variables,
            (o) => o.variable === state.lisaVariable
        )
        if (!variableSpec) return []
        const {data, keys} = getColumnData(variableSpec, state, true)
        if (!data) return []


        return {
            dataColumn: data,
            mean: mean(data).toFixed(3),
            stdev: standardDeviation(data).toFixed(3),
            variable: variableSpec,
        }
    }
    if (widgetType === "lisaScatter"){

        //const isCluster = options.foregroundColor === "cluster";
        let xData;
        let yData;
        let idKeys;
        //let isLisa = false;
        const lisaData = state.cachedLisaScatterplotData;
        const variableSpec = find(
            dataPresets.variables,
            (o) => o.variable === state.lisaVariable
        );
        if (!variableSpec){
            console.warn("Scatter plot: could not find variableSpec for " + variableName[i]);
            return null;
        }
        const {data, keys} = getColumnData(variableSpec, state, true);
        if (!data){
            console.warn("Scatter plot: could not find column data for " + variableName[i]);
        return null;
        }
        idKeys = keys;
        xData = data;
        yData = data;
        if(xData.length == 0){
            console.warn("Scatter plot: xData length is 0");
            return null;
        }
        const formattedData = [];
        const statisticsFormattedData = [];
        for(let i = 0; i < idKeys.length; i++){

            // TODO: Find a smarter way to remove zero values
            if (options.removeZeroValues === true && (xData[i] === 0 || yData[i] === 0)) continue;
            formattedData.push({
                x: xData[i],
                y: yData[i],
                id: idKeys[i]
            });
            if (options.showBestFitLine === true) {
                statisticsFormattedData.push([
                    xData[i], yData[i]
                ])
            }
        }
       

        return {
            data: formattedData,
            variableSpec,
            variableToCache: [{
                data: xData,
                order: state.storedGeojson[state.currentData].order,
                variable: variableName[0]
            },{
                data: yData,
                order: state.storedGeojson[state.currentData].order,
                variable: variableName[1]
            }]
        };
    }
}

export const getWidgetSpec = (widget, i) => {
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
};

export const updateLisaVariable = async (newLisa, dispatch) => {
    dispatch({
        type: "SET_LISA_VARIABLE",
        payload: newLisa
    })
}

export const loadWidget = async (widgetConfig, widgetIndex, dispatch) => {
    const config = widgetConfig[widgetIndex];
    const widgetSpec = getWidgetSpec(config, widgetIndex);
    dispatch({
        type: "FORMAT_WIDGET_DATA",
        payload: {widgetSpec}
    })
}

export const loadWidgets = async (widgetConfig, dispatch) => {
    const widgetSpecs = widgetConfig.map(getWidgetSpec);
    dispatch({
        type: "FORMAT_WIDGET_DATA",
        payload: {widgetSpecs}
    });
};