import React from 'react';
import PropTypes from 'prop-types';
// import styles from './Widgets.module.css';
import { useSelector } from "react-redux";
import { Scatter } from 'react-chartjs-2';
import pluginBoxSelect from './chartjs-plugins/boxselect';
import useLisa from '@webgeoda/hooks/useLisa';
import useGetScatterplotLisa from '@webgeoda/hooks/useGetScatterplotLisa';
import { useDispatch } from 'react-redux';
import Loader from '../../layout/Loader';
import usePanMap from '@webgeoda/hooks/usePanMap';
import * as ss from 'simple-statistics';
import { getVarId } from '@webgeoda/utils/data';


function LisaScatterWidgetUnwrapped(props) {
    const chartRef = React.useRef();
    const dispatch = useDispatch();
    const storedGeojson = useSelector((state) => state.storedGeojson);
    const currentData = useSelector((state) => state.currentData);
    const panToGeoid = usePanMap();
    const allLisaData = useSelector((state) => state.cachedLisaScatterplotData);
    //const variableId = getVarId(currentData, props.data.variableSpec)
    const [getLisa, cacheLisa,] = useLisa();
    const [getCachedLisa, updateCachedLisa] = useGetScatterplotLisa();
    const lisaVariable = useSelector((state) => state.lisaVariable)
    const lisaData = getCachedLisa({variable: lisaVariable});


    // console.log(allLisaData)
    // const prelimLisaData = allLisaData[props.data.variableSpec.variable]

    // React.useEffect(async () => {
    //     if (prelimLisaData === undefined || prelimLisaData == null) {
    //        cacheLisa({
    //            dataParams: props.data.variableSpec.variable,
    //            geographyName: currentData,
    //        })
    //     }
    // },[]);

    // const lisaData = allLisaData[props.data.variableSpec.variable]

    React.useEffect(async () => {
        if (lisaData == null) {
            const lisaData = await getLisa({
                dataParams: {variable: lisaVariable},
                getScatterPlot: true
            });
            updateCachedLisa({variable: lisaVariable}, lisaData);
        }
    },[]);


    //const lisaData = allLisaData[props.data.variableSpec]
    //TODO: box select filtering

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
            }

            //Axes lines
            const minX = ss.min(arrayXData)
            const minY = ss.min(arrayYData)
            const maxX = ss.max(arrayXData)
            const maxY = ss.max(arrayYData)

            // dataProp.datasets.push({
            //     type: "line",
            //     label: false,
            //     data: [{x:minX, y:0}, {x:maxX, y:0}],
            //     borderColor: "black",
            //   })

            //   dataProp.datasets.push({
            //     type: "line",
            //     label: false,
            //     data: [{x:0, y:minY}, {x:0, y:maxY}],
            //     borderColor: "black",
            //   })

              let fittedLine = null;
              let fittedLineEquation = null;
              // TODO: Zero values influence k-means cluster algo, but need to be
              // excluded in a way that preserves OG indices of data
              const bestFitInfo = ss.linearRegression(statisticsFormattedData);
              const bestFit = ss.linearRegressionLine(bestFitInfo);
              fittedLine = [ // Provide two points spanning entire domain instead of m & b to match chart.js data type
                  { x: minX-2, y: bestFit(minX-2) },
                  { x: maxX+2, y: bestFit(maxX+2) }
              ];
              fittedLineEquation = `y = ${bestFitInfo.m.toFixed(4)}x + ${bestFitInfo.b.toFixed(4)}`

              dataProp.datasets.push({
                type: "line",
                label: "Global Moran's: " + bestFitInfo.m.toFixed(3),
                data: fittedLine,
                borderColor: "purple",
                borderWidth: 0.5,
              });
        }

        return dataProp;
    }, [props.data, props.options, lisaData]);





    const options = React.useMemo(() => {
        // let formattedData =[];
        // if (lisaData){
        //     for (let i = 0; i < lisaData.scatterPlotDataStan.length; i++) {
        //         let x = lisaData.scatterPlotDataStan[i].x
        //         let y = lisaData.scatterPlotDataStan[i].y
        //         formattedData.push({
        //             x: x,
        //             y: y,
        //             id: i
        //         })
        //     }
        //}
        
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
                const point = props.data.data[items[0].index];
                panToGeoid(point.id);
            },
            onHover: (e, items) => {
                if (items.length == 0) {
                    dispatch({
                        type: "SET_HOVER_ID",
                        payload: 0
                    });
                    return;
                };
                dispatch({
                    type: "SET_HOVER_ID",
                    payload: items[0].element.$context.raw.id
                })
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
                        label: (tooltipItem) => { 
                            const point = tooltipItem.raw.id;
                            if (point != undefined) { 
                                return `${tooltipItem.raw.id}` 
                            }
                            else { return "undefined" };
                        }
                    }
                },
                boxselect: {
                    select: {
                        enabled: true,
                        direction: 'xy'
                    },
                    callbacks: {
                        beforeSelect: function (startX, endX, startY, endY) {
                            return true;
                        },
                        afterSelect: (startX, endX, startY, endY, datasets) => {
                            dispatch({
                                type: "SET_MAP_FILTER",
                                payload: {
                                    widgetIndex: props.id,
                                    filterId: `${props.id}-x`,
                                    filter: {
                                        type: "range",
                                        field: props.fullWidgetConfig.xVariable,
                                        from: Math.min(startX, endX),
                                        to: Math.max(startX, endX)
                                    }
                                }
                            });
                            dispatch({
                                type: "SET_MAP_FILTER",
                                payload: {
                                    widgetIndex: props.id,
                                    filterId: `${props.id}-y`,
                                    filter: {
                                        type: "range",
                                        field: props.fullWidgetConfig.yVariable,
                                        from: Math.min(startY, endY),
                                        to: Math.max(startY, endY)
                                    }
                                }
                            });
                        }
                    }
                }
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
        if (lisaData) {
            return (
                <Scatter
                    data={dataProp}
                    options={options}
                    plugins={[pluginBoxSelect]}
                    ref={chartRef}
                />
            );
        }
        else {
            return (
            <div>
                <Loader /> 
                <br />
                <br />
                <center><small><i>LISA data generating...</i></small></center>
            </div>
            )
        }
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