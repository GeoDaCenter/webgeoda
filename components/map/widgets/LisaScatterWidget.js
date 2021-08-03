import React, { Suspense, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
// import styles from './Widgets.module.css';
import { useSelector } from "react-redux";
import { Scatter, Chart } from 'react-chartjs-2';
import pluginBoxSelect from './chartjs-plugins/boxselect';
import useLisa from '@webgeoda/hooks/useLisa';
import useGetScatterplotLisa from '@webgeoda/hooks/useGetScatterplotLisa';
import useGetLisa from '@webgeoda/hooks/useGetLisa';
import { useDispatch } from 'react-redux';
import Loader from '../../layout/Loader';
import usePanMap from '@webgeoda/hooks/usePanMap';
import * as ss from 'simple-statistics';
import { getVarId } from '@webgeoda/utils/data';
import dynamic from 'next/dynamic';



function LisaScatterWidgetUnwrapped(props) {

    import('chartjs-plugin-zoom').then(({ default: zoomPlugin }) => {
        Chart.register(zoomPlugin)
    })

    const chartRef = React.useRef();
    const dispatch = useDispatch();
    // const storedGeojson = useSelector((state) => state.storedGeojson);
    // const currentData = useSelector((state) => state.currentData);
    const panToGeoid = usePanMap();
    // const allLisaData = useSelector((state) => state.cachedLisaScatterplotData);
    // const [getLisa, cacheLisa,] = useLisa();
    // const [getCachedLisa, updateCachedLisa] = useGetScatterplotLisa();
    const lisaVariable = useSelector((state) => state.lisaVariable)    
    const lisaData = useGetLisa({
      variable: lisaVariable,
      getScatterPlot: true
    });

    console.log(lisaData)

    // const lisaData = useGetLisa({
    //     variable: lisaVariable,
    //     getScatterPlot: true
    // })
    // console.log(lisaData)

//     // if (typeof window === "undefined") {
//     //     return null;
//     // }

    // const lisaData = getCachedLisa({ variable: lisaVariable });
    // React.useEffect(async () => {
    //     if (lisaData == null || lisaData == 'undefined') {
    //         const lisaData = await getLisa({
    //             dataParams: { variable: lisaVariable },
    //             getScatterPlot: true
    //         });
    //         console.log('hi')
    //         updateCachedLisa({ variable: lisaVariable }, lisaData);
    //     }
    // }, []);



//     //TODO: box select filtering

//     // const xFilter = props.activeFilters.find(i => i.id == `${props.id}-x`);
//     // const yFilter = props.activeFilters.find(i => i.id == `${props.id}-y`);

//     // if (chartRef.current) {
//     //     chartRef.current.boxselect.state = {
//     //         display: xFilter != undefined && yFilter != undefined,
//     //         xMin: xFilter?.from,
//     //         xMax: xFilter?.to,
//     //         yMin: yFilter?.from,
//     //         yMax: yFilter?.to
//     //     };
//     // }

    const dataProp = useMemo(() => {
        let dataProp;
        if (lisaData == null) {
            dataProp = { datasets: [] };
        } else {
            const dataSub = lisaData.scatterPlotDataStan && lisaData.scatterPlotDataStan.filter(point => point.cluster!=0)
            if (!dataSub) return []
            dataProp = {
                datasets: [
                    {
                        type: "scatter",
                        label: props.options.header,
                        data: dataSub,
                        pointBackgroundColor: dataSub.map(point => lisaData.lisaResults.colors[point.cluster]),
                        pointRadius: 1.5,
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


            let fittedLine = null;
            let fittedLineEquation = null;

            const bestFitInfo = ss.linearRegression(statisticsFormattedData);
            const bestFit = ss.linearRegressionLine(bestFitInfo);
            fittedLine = [ // Provide two points spanning entire domain instead of m & b to match chart.js data type
                { x: minX - 2, y: bestFit(minX - 2) },
                { x: maxX + 2, y: bestFit(maxX + 2) }
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





    const options = useMemo(() => {
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
                panToGeoid(items[0].element.$context.raw.id);
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
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true // SET SCROOL ZOOM TO TRUE
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: "xy",
                        speed: 100
                    },
                    pan: {
                        enabled: true,
                        mode: "xy",
                        speed: 100
                    }
                },
                // tooltip: {
                //     callbacks: {
                //         label: (tooltipItem) => {
                //             const point = tooltipItem.raw.id;
                //             if (point != undefined) {
                //                 return `${tooltipItem.raw.id}`
                //             }
                //             else { return "undefined" };
                //         }
                //     }
                // },
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
                // },
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
            }
        }
        // })
    }, [props.options, props.data, props.fullWidgetConfig]);

    let graphic = null;

    const chart = useMemo(() => {
        if (lisaData) {
            graphic = <Scatter
                data={dataProp}
                options={options}
                //plugins={[pluginBoxSelect]}
                ref={chartRef}
            />
            let buttonFunc = null;
            import('chartjs-plugin-zoom').then(({ resetZoom }) => {
                buttonFunc = resetZoom
            })
            return (
                <div>
                    {graphic}
                    <button onClick={() => { buttonFunc(chartRef.current) }}>Reset Zoom</button>
                </div>
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
    }, [dataProp, options]);

    return (
        <div>
            {chart}
        </div>
    );
}

// LisaScatterWidgetUnwrapped.propTypes = {
//     options: PropTypes.object.isRequired,
//     data: PropTypes.object.isRequired,
//     id: PropTypes.number.isRequired,
//     fullWidgetConfig: PropTypes.object.isRequired,
//     activeFilters: PropTypes.array.isRequired
// };

const LisaScatterWidget = React.memo(LisaScatterWidgetUnwrapped);

export default LisaScatterWidget;