import React from 'react';
import PropTypes from 'prop-types';
// import styles from './Widgets.module.css';
import { useSelector } from "react-redux";
import { Scatter } from 'react-chartjs-2';
import pluginBoxSelect from './chartjs-plugins/boxselect';
import useLisa from '@webgeoda/hooks/useLisa';
import useGetScatterplotLisa from '@webgeoda/hooks/useGetScatterplotLisa';
import { useDispatch } from 'react-redux';
import usePanMap from '@webgeoda/hooks/usePanMap';
import * as ss from 'simple-statistics';

function LisaScatterWidgetUnwrapped(props) {
    const chartRef = React.useRef();
    const dispatch = useDispatch();
    const storedGeojson = useSelector((state) => state.storedGeojson);
    const currentData = useSelector((state) => state.currentData);
    const panToGeoid = usePanMap();
    //const allLisaData = useSelector((state) => state.cachedLisaScatterplotData);
    const [getLisa,] = useLisa();
    const [getCachedLisa, updateCachedLisa] = useGetScatterplotLisa();
    const lisaData = getCachedLisa(props.data.variableSpec);

    React.useEffect(async () => {
        if (lisaData == null) {
            const lisaData = await getLisa({
                dataParams: props.data.variableSpec,
                getScatterPlot: true
            });
            updateCachedLisa(props.data.variableSpec, lisaData);
        }
    });

    //const lisaData = allLisaData[props.data.variableSpec]

    const xFilter = props.activeFilters.find(i => i.id == `${props.id}-x`);
    const yFilter = props.activeFilters.find(i => i.id == `${props.id}-y`);

    if (chartRef.current) {
        chartRef.current.boxselect.state = {
            display: xFilter != undefined && yFilter != undefined,
            xMin: xFilter?.from,
            xMax: xFilter?.to,
            yMin: yFilter?.from,
            yMax: yFilter?.to
        };
    }

    const dataProp = React.useMemo(() => {
        let dataProp;
        if (lisaData == null) {
            dataProp = { datasets: [] };
        } else {
            console.log(lisaData.scatterPlotDataStan)
            dataProp = {
                datasets: [
                    {
                        type: "scatter",
                        label: props.options.header,
                        data: lisaData.scatterPlotDataStan,
                        pointBackgroundColor: lisaData.lisaResults.clusters.map(i => lisaData.lisaResults.colors[i])
                    }
                ]
            };
        }
        let formattedData = [];

        if (lisaData) {

            let statisticsFormattedData = [];
            let arrayXData = [];
            let arrayYData = [];
            for (let i = 0; i < lisaData.scatterPlotDataStan.length; i++) {
                let x = lisaData.scatterPlotDataStan[i].x
                let y = lisaData.scatterPlotDataStan[i].y
                arrayXData.push(x)
                arrayYData.push(y)
                statisticsFormattedData.push(
                    [x, y]
                )
                formattedData.push({
                    x: x,
                    y: y,
                    id: i
                })
            }
            console.log(formattedData)
            //   let fittedLine = null;
            //   let fittedLineEquation = null;
            //   // TODO: Zero values influence k-means cluster algo, but need to be
            //   // excluded in a way that preserves OG indices of data
            //   const bestFitInfo = ss.linearRegression(statisticsFormattedData);
            //   const bestFit = ss.linearRegressionLine(bestFitInfo);
                // minX = ss.min(arrayXData)
                // minY = ss.min(arrayYData)
            //   fittedLine = [ // Provide two points spanning entire domain instead of m & b to match chart.js data type
            //       { x: minX, y: bestFit(minX) },
            //       { x: minY, y: bestFit(minY) }
            //   ];
            //   fittedLineEquation = `y = ${bestFitInfo.m.toFixed(4)}x + ${bestFitInfo.b.toFixed(4)}`

            //   dataProp.datasets.push({
            //     type: "line",
            //     label: "Global Moran's " + bestFitInfo.m.toFixed(3),
            //     data: fittedLine,
            //     borderColor: "#000000"
            //   });
        }

        return dataProp;
    }, [props.data, props.options, lisaData]);

    const options = React.useMemo(() => {
        return {
            events: ["click", "touchstart", "touchmove", "mousemove", "mouseout"],
            maintainAspectRatio: false,
            animation: false,
            elements: {
                point: {
                    radius: props.options.pointSize || 0.1
                }
            },
            onClick: (e, items) => {
                if (items.length == 0) return;
                const point = formattedData[items[0].index];
                panToGeoid(point.id);
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        filter: (legend) => legend.datasetIndex != 0 // hide scatter label
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
                // boxselect: {
                //     select: {
                //         enabled: true,
                //         direction: 'xy'
                //     },
                //     callbacks: {
                //         beforeSelect: function (startX, endX, startY, endY) {
                //             return true;
                //         },
                //         afterSelect: (startX, endX, startY, endY, datasets) => {
                //             dispatch({
                //                 type: "SET_MAP_FILTER",
                //                 payload: {
                //                     widgetIndex: props.id,
                //                     filterId: `${props.id}-x`,
                //                     filter: {
                //                         type: "range",
                //                         field: props.fullWidgetConfig.xVariable,
                //                         from: Math.min(startX, endX),
                //                         to: Math.max(startX, endX)
                //                     }
                //                 }
                //             });
                //             dispatch({
                //                 type: "SET_MAP_FILTER",
                //                 payload: {
                //                     widgetIndex: props.id,
                //                     filterId: `${props.id}-y`,
                //                     filter: {
                //                         type: "range",
                //                         field: props.fullWidgetConfig.yVariable,
                //                         from: Math.min(startY, endY),
                //                         to: Math.max(startY, endY)
                //                     }
                //                 }
                //             });
                //         }
                //     }
                // }
            },
            scales: { // TODO: Support gridlinesInterval option
                x: {
                    title: {
                        display: "xAxisLabel" in props.options,
                        text: props.options.xAxisLabel || ""
                    }
                },
                y: {
                    title: {
                        display: "yAxisLabel" in props.options,
                        text: props.options.yAxisLabel || ""
                    }
                }
            }
        };
    }, [props.options, props.data, props.fullWidgetConfig]);

    const chart = React.useMemo(() => {
        return (
            <Scatter
                data={dataProp}
                options={options}
                plugins={[pluginBoxSelect]}
                ref={chartRef}
            />
        );
    }, [dataProp, options, pluginBoxSelect]);

    return (
        <div>{chart}</div>
    );
}

LisaScatterWidgetUnwrapped.propTypes = {
    options: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
    fullWidgetConfig: PropTypes.object.isRequired,
    activeFilters: PropTypes.array.isRequired
};

const LisaScatterWidget = React.memo(LisaScatterWidgetUnwrapped);

export default LisaScatterWidget;