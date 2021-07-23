import { useMemo } from 'react';
import useGetVariable from './useGetVariable';
import { bin as d3bin } from "d3-array";
import { useDispatch } from 'react-redux';

const formatData = (data, options) => {
    const tempData = Object.values(data)
    let formattedData = [];
    let labels = [];
    let binBounds = [];
    if (!tempData.length) return {labels, formattedData, binBounds }
    const binned = d3bin().thresholds(options.thresholds || 40)(tempData)
    for (let i=0; i<binned.length; i++) {
        formattedData.push(binned[i].length);
        labels.push(`${binned[i].x0}-${binned[i].x1}`);
        binBounds.push([binned[i].x0, binned[i].x1]);
    }
    return { formattedData, labels, binBounds }
}

const formatChart = (formattedData, labels, options, variable, callback) => {
    return {
        chartData: {
            labels,
            datasets: [{
                label: options.header,
                data: formattedData,
                backgroundColor: options.foregroundColor || "#000000"
            }]
        },
        chartOptions: {
            events: ["click", "touchstart", "touchmove", "mousemove", "mouseout"],
            maintainAspectRatio: false,
            animation: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: options.xAxisLabel || variable
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: options.yAxisLabel || "Count Observed"
                    }
                }
            },
            plugins: {
                legend: {
                display: false
                },
                barselect: {
                    select: {
                        enabled: true
                    },
                    callbacks: {
                        beforeSelect: function(startX, endX) {
                            return true;
                        },
                        afterSelect: (startX, endX, datasets) => callback(datasets)
                    }
                }
            }
        }
            
    }
}

export default function useGetHistogramData({
    variable=false,
    dataset=false,
    options={},
    id=0,
}){
    const dispatch = useDispatch();
    const data = useGetVariable({
        variable,
        dataset
    });

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
