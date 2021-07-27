import { useMemo } from 'react';
import useGetVariable from './useGetVariable';
import useGetLisa from './useGetLisa';
import { useDispatch, useSelector } from 'react-redux';
import {linearRegression, linearRegressionLine, kMeansCluster} from "simple-statistics";
import { config } from '@fortawesome/fontawesome-svg-core';
import usePanMap from './usePanMap';

const formatScatterData = ({
    xData,
    yData,
    zData={},
    clusters=[],
    colorScheme=[],
    idKeys,
    options,
    config
}) => {
    let min = xData[0];
    let max = xData[0];
    let formattedData = [];
    const statisticsFormattedData = [];
    let fittedLine = null;
    let fittedLineEquation = null;
    let clusterLabels = null;
    if (!idKeys || !idKeys.length) return {
        formattedData,
        fittedLine,
        fittedLineEquation,
        clusterLabels,
        isCluster: options.isCluster
    }
    
    const statsLoopFunction = options.showBestFitLine || options.isCluster
        ? (x,y) => statisticsFormattedData.push([x,y])
        : () => {}

    const lisaLoopFunction = config.type === 'lisaScatter'
        ? (color, i) => formattedData[i].fillColor = color
        : () => {}

    const formatDataFunction = config.type === 'scatter3d'
        ? (x,y,z,id) => formattedData.push({x,y,z,id})
        : (x,y,z,id) => formattedData.push({x,y,id})

    for(let i = 0; i < idKeys.length; i++){
        // TODO: Find a smarter way to remove zero values
        if(options.removeZeroValues === true && (xData[i] === 0 || yData[i] === 0)) continue;
        if(xData[i] < min) min = xData[i];
        if(xData[i] > max) max = xData[i];
        formatDataFunction(xData[i], yData[i], zData[i], idKeys[i])
        statsLoopFunction(xData[i],yData[i])
        lisaLoopFunction(colorScheme[clusters[i]], i)
    }

    if(options.isCluster){
        try {
            clusterLabels = kMeansCluster(statisticsFormattedData, options.numClusters || 2).labels;
        } catch(e) {
            console.warn(e);
            return;
        }
    }
    
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

    return {
        formattedData,
        fittedLine,
        fittedLineEquation,
        clusterLabels,
        isCluster: options.isCluster,
    }
}

const formatChart = ({
    options,
    formattedData,
    fittedLine,
    fittedLineEquation,
    filterCallback,
    clickCallback
}) => {
    let chartData = {
        datasets: [
            {
                type: "scatter",
                label: options.header,
                data: formattedData
            }
        ]
    }

    if (options.showBestFitLine) {
        chartData.datasets.push({
            type: "line",
                    label: "Best fit: " + fittedLineEquation,
                    data: fittedLine,
                    borderColor: "#000000"
        })
    }
    
    let chartOptions = {
            events: ["click", "touchstart", "touchmove", "mousemove", "mouseout"],
            maintainAspectRatio: false,
            animation: false,
            elements: {
                point: {
                    radius: options.pointSize || 0.1
                }
            },
            onClick: (e, items) => {
                if(items.length == 0) return;
                clickCallback(formattedData[items[0].index]?.id);
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        filter: (legend) => legend.datasetIndex !== 0 // hide scatter label
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (tooltipItem) => { //data
                            const point = formattedData[tooltipItem.dataIndex];
                            return `${point.id} (${point.x}, ${point.y})`; // TODO: point.y is null for LISA scatterplots
                        }
                    }
                },
                boxselect: {
                    select: {
                        enabled: true,
                        direction: 'xy'
                    },
                    callbacks: {
                        beforeSelect: () => true,
                        afterSelect: filterCallback
                    }
                }
            },
            scales: { // TODO: Support gridlinesInterval option
                x: {
                    title: {
                    display: "xAxisLabel" in options,
                    text: options.xAxisLabel || config.xVariable || ''
                    }
                },
                y: {
                    title: {
                    display: "yAxisLabel" in options,
                    text: options.yAxisLabel || config.yVariable || ""
                    }
                }
            }
        }

    return {
        chartData,
        chartOptions
    }
}

const scaleAxis = (data, targetRange) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    return {min, max, range, scalar: targetRange/range};
}

const scaleAxes = (x, y, z, targetRange) => { return { 
    xScale: scaleAxis(x, targetRange),
    yScale: scaleAxis(y, targetRange),
    zScale: scaleAxis(z, targetRange),
}}

const zipAndScale = (x, y, z, targetRange) => {
    console.log(x,y,z)
    if (!x.length || !y.length || !z.length){
        return {
            xScale:{},
            yScale:{},
            zScale:{},
            data:[]
        }
    }
    const {
        xScale,
        yScale,
        zScale
    } = scaleAxes(x,y,z,targetRange)
    let data = [];
    for (let i=0; i<x.length;i++){
        data.push({
            position: [
                (x[i]-xScale.min)*xScale.scalar,
                (y[i]-yScale.min)*yScale.scalar,
                (z[i]-zScale.min)*zScale.scalar
            ]
        })
    }
    return {
        data,
        xScale,
        yScale,
        zScale
    }
}

export default function useGetScatterData({
    dataset=false,
    options={},
    config={},
    id=0,
    targetRange=100
}){
    const currentData = useSelector((state) => state.currentData)
    const currentDataset = useSelector((state) => state.storedGeojson[dataset||currentData]);
    const idKeys = currentDataset?.order||[];
    const dispatch = useDispatch();
    const panToGeoid = usePanMap();
    const xData = useGetVariable({
        variable: config.type === 'lisaScatter'
            ? false
            : config.xVariable,
        dataset
    });

    const yData = useGetVariable({
        variable: config.type === 'lisaScatter'
            ? false
            : config.yVariable,
        dataset
    });

    const zData = useGetVariable({
        variable: config.type === 'scatter3d'
            ? config.zVariable
            : false,
        dataset
    });

    const lisaData = useGetLisa({
        variable: config.type === 'lisaScatter'
            ? config.variable
            : false,
        dataset,
        getScatterPlot: true
    })

    if (config.type === "scatter3d"){
        const {
            data,
            xScale,
            yScale,
            zScale
        } = useMemo(() => zipAndScale(
            xData,
            yData,
            zData,
            targetRange
        ),[Object.keys(xData).length, Object.keys(yData).length, Object.keys(zData).length, config, options])

        return {
            xScale,
            yScale,
            zScale,
            data
        }
    } else {
    
        const {
            formattedData,
            fittedLine,
            fittedLineEquation
        } = useMemo(() => formatScatterData({
            xData: config.type === 'lisaScatter' ? lisaData.lisaData : xData,
            yData: config.type === 'lisaScatter' ? lisaData.spatialLags : yData,
            zData: config.type === 'scatter3d' ? [] : zData,
            clusters: lisaData?.lisaResults?.clusters,
            colors: lisaData?.lisaResults?.colors,
            config,
            idKeys,
            options
        }), [Object.keys(xData).length, Object.keys(yData).length, idKeys.length, Object.keys(lisaData).length, config, options]);
    
        const handleFilter = (startX, endX, startY, endY, datasets) => {
            dispatch({
                type: "SET_MAP_FILTER",
                payload: {   
                    widgetIndex: id, 
                    filterId: `${id}-x`,
                    filter: {
                    type: "range",
                    field: config.xVariable,
                    from: Math.min(startX, endX),
                    to: Math.max(startX, endX)
                    }
                }
            });
            dispatch({
                type: "SET_MAP_FILTER",
                payload: {    
                    widgetIndex: id, 
                    filterId: `${id}-y`,
                    filter: {
                    type: "range",
                    field: config.yVariable,
                    from: Math.min(startY, endY),
                    to: Math.max(startY, endY)
                    }
                }
            });
        }

        const {
            chartData, 
            chartOptions
        } = useMemo(() => formatChart({
            options,
            formattedData,
            fittedLine,
            fittedLineEquation,
            filterCallback: handleFilter,
            clickCallback: panToGeoid
        }),
        [JSON.stringify(formattedData[0]), JSON.stringify(config), idKeys.length]);

        
        return {
            chartData,
            chartOptions
        }
    }
}