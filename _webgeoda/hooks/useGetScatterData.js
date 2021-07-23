import { useMemo } from 'react';
import useGetVariable from './useGetVariable';
import useGetLisa from './useGetLisa';
import { useDispatch, useSelector } from 'react-redux';
import {linearRegression, linearRegressionLine, kMeansCluster} from "simple-statistics";

const formatScatterData = ({
    xData,
    yData,
    idKeys,
    options
}) => {
    let min = xData[0];
    let max = xData[0];
    const formattedData = [];
    const statisticsFormattedData = [];
    const statsLoopFunction = options.showBestFitLine || options.isCluster
        ? (x,y) => statisticsFormattedData.push([x,y])
        : () => {}

    for(let i = 0; i < idKeys.length; i++){
        // TODO: Find a smarter way to remove zero values
        if(options.removeZeroValues === true && (xData[i] === 0 || yData[i] === 0)) continue;
        if(xData[i] < min) min = xData[i];
        if(xData[i] > max) max = xData[i];
        formattedData.push({
            x: xData[i],
            y: yData[i],
            id: idKeys[i]
        });
        statsLoopFunction(xData[i],yData[i])
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
        formattedData,
        fittedLine,
        fittedLineEquation,
        clusterLabels,
        isCluster,
    }
}

export default function useGetScatterplotData({
    dataset=false,
    options={},
    config={},
    id=0,
}){
    const currentDataset = useSelector((state) => state.storedGeojson[dataset]);
    const idKeys = currentDataset?.order;
    const dispatch = useDispatch();

    const xData = useGetVariable({
        variable: config.type === lisaScatter
            ? config.variable
            : config.xVariable,
        dataset
    });

    const yData = useGetVariable({
        variable: config.type === lisaScatter
            ? false
            : config.yVariable,
        dataset
    });

    const lisaData = useGetLisa({
        variable: config.type === lisaScatter
            ? config.variable
            : false,
        dataset,
        getScatterPlot: true
    })
    

    const {
        formattedData,
        labels,
        binBounds
    } = useMemo(() => formatData(data, options), [data, options]);

    const handleFilter = (datasets) => dispatch({
        type: "SET_MAP_FILTER",
            payload: {    
                widgetIndex: id,
                filterId: id,
                filter: {
                    type: "range",
                    field: variable,
                    from: binBounds[datasets[0].minIndex][0],
                    to: binBounds[datasets[0].maxIndex][0],
                    minIndex: datasets[0].minIndex,
                    maxIndex: datasets[0].maxIndex
                }
        }
    });
    
    const {
        chartData, 
        chartOptions
    } = useMemo(() => formatChart(
        formattedData, 
        labels, 
        options,
        variable,
        handleFilter
    ),
    [data.length, variable, dataset, JSON.stringify(options)]);
    
    return {
        chartData,
        chartOptions
    }
}