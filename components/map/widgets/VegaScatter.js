import { Vega } from 'react-vega';
import * as vega from 'vega';
import { useSelector } from 'react-redux';
import {useState, useEffect, useRef, useMemo} from 'react';
import PropTypes from 'prop-types';
// import styles from './Widgets.module.css';
import useGetScatterData from '@webgeoda/hooks/useGetScatterData';

const renderVega = (
    chartRef,
    spec,
    scatterData,
    signalListeners,
    setView
) => <Vega 
    ref={chartRef}
    spec={spec} 
    data={scatterData} 
    signalListeners={signalListeners} 
    onNewView={(view) => setView(view)}
    />

export default function VegaScatter(props) {
    const boxFilterGeoids = useSelector((state) => state.boxFilterGeoids);
    const [view, setView] = useState({});
    const chartRef = useRef()

    const {
        chartData
    } = useGetScatterData({
        config: props.config,
        options: props.options,
        id: props.id
    })

    const scatterData = {
        table: chartData?.datasets[0]?.data,
    };

    useEffect(() => {
        if (!(chartData.datasets.length && chartData.datasets[0].data.length)) return;
        function updateGraph() {
            const cs = vega
                .changeset()
                .remove(() => true)
                .insert(chartData.datasets[0].data.filter(t => boxFilterGeoids.includes(t.id)));
            view.change('active', cs).run();
        }
        view && updateGraph();
    }, [view, boxFilterGeoids]);

    const spec = {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "width": 300,
        "height": 150,
        "padding": {
        "top":    10,
        "left":   40,
        "bottom": 20,
        "right":  10
        },
        "autosize": "none",
        "config": {
        "axis": {
            "domain": false,
            "tickSize": 3,
            "tickColor": "#888",
            "labelFont": "Monaco, Courier New"
        }
        },
    
        "signals": [
        {
            "name": "margin",
            "value": 20
        },
        {
            "name": "hover",
            "on": [
            {"events": "*:mouseover", "encode": "hover"},
            {"events": "*:mouseout",  "encode": "leave"},
            {"events": "*:mousedown", "encode": "select"},
            {"events": "*:mouseup",   "encode": "release"}
            ]
        },
        {
            "name": "xoffset",
            "update": "-(height + padding.bottom)"
        },
        {
            "name": "yoffset",
            "update": "-(width + padding.left)"
        },
        { "name": "xrange", "update": "[0, width]" },
        { "name": "yrange", "update": "[height, 0]" },
    
        {
            "name": "down", "value": null,
            "on": [
            {"events": "touchend", "update": "null"},
            {"events": "mousedown, touchstart", "update": "xy()"}
            ]
        },
        {
            "name": "xcur", "value": null,
            "on": [
            {
                "events": "mousedown, touchstart, touchend",
                "update": "slice(xdom)"
            }
            ]
        },
        {
            "name": "ycur", "value": null,
            "on": [
            {
                "events": "mousedown, touchstart, touchend",
                "update": "slice(ydom)"
            }
            ]
        },
        {
            "name": "delta", "value": [0, 0],
            "on": [
            {
                "events": [
                {
                    "source": "window", "type": "mousemove", "consume": true,
                    "between": [{"type": "mousedown"}, {"source": "window", "type": "mouseup"}]
                },
                {
                    "type": "touchmove", "consume": true,
                    "filter": "event.touches.length === 1"
                }
                ],
                "update": "down ? [down[0]-x(), y()-down[1]] : [0,0]"
            }
            ]
        },
    
        {
            "name": "anchor", "value": [0, 0],
            "on": [
            {
                "events": "wheel",
                "update": "[invert('xscale', x()), invert('yscale', y())]"
            },
            {
                "events": {"type": "touchstart", "filter": "event.touches.length===2"},
                "update": "[(xdom[0] + xdom[1]) / 2, (ydom[0] + ydom[1]) / 2]"
            }
            ]
        },
        {
            "name": "zoom", "value": 1,
            "on": [
            {
                "events": "wheel!",
                "force": true,
                "update": "pow(1.001, event.deltaY * pow(16, event.deltaMode))"
            },
            {
                "events": {"signal": "dist2"},
                "force": true,
                "update": "dist1 / dist2"
            }
            ]
        },
        {
            "name": "dist1", "value": 0,
            "on": [
            {
                "events": {"type": "touchstart", "filter": "event.touches.length===2"},
                "update": "pinchDistance(event)"
            },
            {
                "events": {"signal": "dist2"},
                "update": "dist2"
            }
            ]
        },
        {
            "name": "dist2", "value": 0,
            "on": [{
            "events": {"type": "touchmove", "consume": true, "filter": "event.touches.length===2"},
            "update": "pinchDistance(event)"
            }]
        },
    
        {
            "name": "xdom", "update": "slice(xext)",
            "on": [
            {
                "events": {"signal": "delta"},
                "update": "[xcur[0] + span(xcur) * delta[0] / width, xcur[1] + span(xcur) * delta[0] / width]"
            },
            {
                "events": {"signal": "zoom"},
                "update": "[anchor[0] + (xdom[0] - anchor[0]) * zoom, anchor[0] + (xdom[1] - anchor[0]) * zoom]"
            }
            ]
        },
        {
            "name": "ydom", "update": "slice(yext)",
            "on": [
            {
                "events": {"signal": "delta"},
                "update": "[ycur[0] + span(ycur) * delta[1] / height, ycur[1] + span(ycur) * delta[1] / height]"
            },
            {
                "events": {"signal": "zoom"},
                "update": "[anchor[1] + (ydom[0] - anchor[1]) * zoom, anchor[1] + (ydom[1] - anchor[1]) * zoom]"
            }
            ]
        },
        {
            "name": "size",
            "update": "clamp(100 / span(xdom), 5, 1000)"
        }
        ],
    
        "data": [
            {
                "name": "table",
                "transform": [
                    { "type": "extent", "field": "x", "signal": "xext" },
                    { "type": "extent", "field": "y", "signal": "yext" }
                ]
            },
            {
                "name": "active",
            },
        ],
    
        "scales": [
        {
            "name": "xscale", "zero": false,
            "domain": {"signal": "xdom"},
            "range": {"signal": "xrange"}
        },
        {
            "name": "yscale", "zero": false,
            "domain": {"signal": "ydom"},
            "range": {"signal": "yrange"}
        }
        ],
    
        "axes": [
        {
            "scale": "xscale",
            "orient": "top",
            "offset": {"signal": "xoffset"}
        },
        {
            "scale": "yscale",
            "orient": "right",
            "offset": {"signal": "yoffset"}
        }
        ],
    
        "marks": [
            {
                "type": "symbol",
                "from": {"data": "table"},
                "clip": true,
                "encode": {
                "enter": {
                    "fillOpacity": {"value": 0.6},
                },
                "update": {
                    "x": {"scale": "xscale", "field": "x"},
                    "y": {"scale": "yscale", "field": "y"},
                    "size": {"signal": "size"}
                },
                "hover":   { "fill": {"value": "firebrick"} },
                "leave":   { "fill": {"value": "steelblue"} },
                "select":  { "size": {"signal": "size", "mult": 5} },
                "release": { "size": {"signal": "size"} }
                }
            },
            {
                "type": "symbol",
                "from": {"data": "active"},
                "clip": true,
                "encode": {
                    "enter": {
                        "fillOpacity": {"value": 0.6},
                        "fill": {"value": "red"}
                    },
                    "update": {
                        "x": {"scale": "xscale", "field": "x"},
                        "y": {"scale": "yscale", "field": "y"},
                        "size": {"value": 20}
                    },
                    "hover":   { "fill": {"value": "firebrick"} },
                    "leave":   { "fill": {"value": "steelblue"} },
                    "select":  { "size": {"signal": "size", "mult": 5} },
                    "release": { "size": {"signal": "size"} }
                }
            },
        ]
    }
  
  
    function handleHover(...args){
        console.log(args);
    }

    const signalListeners = { hover: handleHover };
    
    const vegaChart = useMemo(() => renderVega(
        chartRef,
        spec,
        scatterData,
        signalListeners,
        setView
    ), [chartData.datasets.length, chartData.datasets[0]?.data.length])
    
    return (
        <div>
            {(chartData.datasets.length && chartData.datasets[0].data.length) 
                && vegaChart
            }   
        </div>
    );
}

VegaScatter.propTypes = {
  options: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  config: PropTypes.object.isRequired,
  activeFilters: PropTypes.array.isRequired
};
