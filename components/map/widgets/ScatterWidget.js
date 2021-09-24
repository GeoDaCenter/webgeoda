import { Vega } from 'react-vega';
import * as vega from 'vega';
import { useSelector, useDispatch } from 'react-redux';
import {useState, useEffect, useRef, useMemo} from 'react';
import PropTypes from 'prop-types';
import styles from './Widgets.module.scss';
import useGetScatterData from '@webgeoda/hooks/useGetScatterData';
import usePanMap from '@webgeoda/hooks/usePanMap';
import Loader from '@components/layout/Loader';

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

const parseFilters = (filters) => {
    let returnObj = {}
    for (let i=0; i<filters.length; i++){
        returnObj[`${filters[i].id.slice(-1,)[0]}max`] = filters[i].to
        returnObj[`${filters[i].id.slice(-1,)[0]}min`] = filters[i].from
    }
    return [returnObj]
}
export default function ScatterWidget(props) {
    const boxFilterGeoids = useSelector((state) => state.boxFilterGeoids);
    const [view, setView] = useState({});
    const dispatch = useDispatch();
    const chartRef = useRef();
    const panToGeoid = usePanMap();
    const mapFilters = useSelector((state) => state.mapFilters);
    const currFilters = mapFilters.filter(f => f.source === props.config.id);
    const {
        chartData
    } = useGetScatterData({
        config: props.config,
        options: props.options,
        id: props.id
    })

    const scatterData = {
        table: chartData
    };

    useEffect(() => {
        if (!(chartData.length)) return;
        function updateGraph() {
            const cs = vega
                .changeset()
                .remove(() => true)
                .insert(chartData.filter(t => boxFilterGeoids.includes(t.id)));
            view.change('active', cs).run();
        }
        Object.keys(view).length && updateGraph();
    }, [view, boxFilterGeoids]);


    useEffect(() => {
        // if (currFilters.length === 1) return;
        function updateExtent() {
            const cs = vega
                .changeset()
                .remove(() => true)
                .insert(parseFilters(currFilters));
            view.change('filterExtent', cs).run();
        }
        Object.keys(view).length && updateExtent();
        // view && updateGraph();
    }, [view, currFilters]);

    const spec = {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "width": 300,
        "height": 160,
        "padding": {
        "top":    10,
        "left":   40,
        "bottom": 30,
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
            { "name": "chartWidth", "value": 300 },
            { "name": "chartHeight", "value": 160 },
            {
                "name": "hover",
                "on": [
                    // {"events": "*:mousedown", "encode": "select"},
                    // {"events": "*:mouseup",   "encode": "release"}
                ]
            },
            {
                "name": "click",
                "on": [
                {"events": "*:click", "encode": "click"}
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
            { "name": "xcur", "value": null, "update": "slice(xdom)"},
            { "name": "ycur", "value": null, "update": "slice(ydom)"}, 
            {
                "name": "startDrag", "value": null,
                "on": [
                    {"events": "mouseup, touchend", "update": "0"},
                    {"events": "mousedown, touchstart", "update": "1"},
                ]
            }, 
            {
                "name": "startDragCoords", "value": null,
                "on": [
                    {"events": "mousedown, touchstart", "update": "[invert('xscale', x()),invert('yscale', y())]"},
                ]
            },   
            {
                "name": "dragBox", "value": null,
                on: [{
                        "events": {"signal": "startDragCoords"},
                        "force": true,
                        "update":"[[startDragCoords[0], startDragCoords[1]],[]]"
                    },
                    {   
                        "events": "mousemove, touchmove", "update": "startDrag ? [dragBox[0],[invert('xscale', x()),invert('yscale', y())]] : dragBox"
                    }]
            }, 
            {
                "name": "endDrag", "value": null,
                "on": [
                    {"events": "mouseup, touchend", "update": "dragBox"},
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
                        "events": {"signal": "zoom"},
                        "update": "[anchor[0] + (xdom[0] - anchor[0]) * zoom, anchor[0] + (xdom[1] - anchor[0]) * zoom]"
                    }
                ]
            },
            {
                "name": "ydom", "update": "slice(yext)",
                "on": [
                    {
                        "events": {"signal": "zoom"},
                        "update": "[anchor[1] + (ydom[0] - anchor[1]) * zoom, anchor[1] + (ydom[1] - anchor[1]) * zoom]"
                    }
                ]
            },
            {
                "name": "size",
                "update": "clamp(100 / span(xdom), 5, 1000)"
            },
        ],
        
            "data": [
                {
                    "name": "table",
                    "transform": [
                        { "type": "filter", "expr": "datum.x != 0 && datum.y != 0"},
                        { "type": "extent", "field": "x", "signal": "xext" },
                        { "type": "extent", "field": "y", "signal": "yext" },
                    ]
                },
                props.config.aggregate !== undefined? 
                    {
                        "source": "table",
                        "name": "tableBinned",
                        "transform": [
                            { "type": "filter", "expr": "datum.x != 0 && datum.y != 0"},
                            {
                                "type": "bin", "field": "x", "maxbins": 40,
                                "extent": {"signal": "xext"},
                                "as": ["x0", "x1"]
                            },
                            {
                                "type": "bin", "field": "y", "maxbins": 20,
                                "extent": {"signal": "yext"},
                                "as": ["y0", "y1"]
                            },
                            {
                                "type": "aggregate",
                                "groupby": ["x0","x1","y0","y1"]
                            } 
                        ]
                    }
                    :   {"name": "tablebinned"}
                ,
                {
                    "name": "active",
                    "transform": [
                        { "type": "filter", "expr": "datum.x != 0 && datum.y != 0"},
                    ]
                },
                props.config.aggregate !== undefined ? 
                    {
                        "source": "active",
                        "name": "activeBinned",
                        "transform": [
                            { "type": "filter", "expr": "datum.x != 0 && datum.y != 0"},
                            {
                                "type": "bin", "field": "x", "maxbins": 40,
                                "extent": {"signal": "xext"},
                                "as": ["x0", "x1"]
                            },
                            {
                                "type": "bin", "field": "y", "maxbins": 20,
                                "extent": {"signal": "yext"},
                                "as": ["y0", "y1"]
                            },
                            {
                                "type": "aggregate",
                                "groupby": ["x0","x1","y0","y1"]
                            } 
                        ]
                    }
                    :   {"name": "activeBinned"}
                ,
                {
                    "name":"filterExtent"
                },
                props.options.regression ? {
                    "name": "trend",
                    "source": "table",
                    "transform": [
                        {
                            "type": "regression",
                            "extent": {"signal": "xdom"},
                            "x": "x",
                            "y": "y",
                            "as": ["u", "v"]
                        }
                    ]
                } : {"name": "trend"},
                props.options.regression ? {
                    "name": "trend-active",
                    "source": "active",
                    "transform": [
                        {
                            "type": "regression",
                            "extent": {"signal": "xdom"},
                            "x": "x",
                            "y": "y",
                            "as": ["u", "v"]
                        }
                    ]
                } : {"name": "trend-active"},
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
                },
                props.config.aggregate === 'scale' ? {
                    "name": "size",
                    "type": "linear",
                    "zero": true,
                    "domain": {"data": "tableBinned", "field": "count"},
                    "range": [0,360]
                }
                : props.config.aggregate === 'heatmap' ? {
                    "name": "color",
                    "type": "linear",
                    "range": {"scheme": "Viridis"},
                    "domain": {"data": "tableBinned", "field": "count"},
                    "zero": false, 
                    "nice": true
                } : { 'name': 'null'}
            ],
        
            "axes": [
                {
                    "scale": "xscale",
                    "orient": "top",
                    "offset": {"signal": "xoffset+10"},
                    "labelOverlap": false,
                    "grid":true,
                    "format": ".2s",
                    "title":props.config.xVariable,
                    "tickCount":5,
                    "tickColor":"#fff",
                    "titleY":10
                },
                {
                    "scale": "yscale",
                    "orient": "right",
                    "offset": {"signal": "yoffset+10"},
                    "title":props.config.yVariable,
                    "labelOverlap": false,
                    "grid":true,
                    "format": ".2s",
                    "tickCount":3,
                    "tickColor":"#fff",
                    "titleX":-10
                }
        ],
    
        "marks": [
            {
                "type": "rect",
                "encode": {
                    "enter": {
                        "fill": {"value": "#0099FF55"},
                        "stroke": {"value": "#0099FF"}
                    },
                    "update": {
                        "x": {"scale":"xscale", "signal": "startDrag ? dragBox[0][0] : 0"},
                        "x2": {"scale":"xscale", "signal": "startDrag ? dragBox[1][0] : 0"},
                        "y": {"scale":"yscale", "signal": "startDrag ? dragBox[0][1] : 0"},
                        "y2": {"scale":"yscale", "signal": "startDrag ? dragBox[1][1] : 0"}
                    }
                }
            },
            {
                "type": "rect",
                "from": {"data":"filterExtent"},
                "encode": {
                    "enter": {
                        "fill": {"value": "#0099FF55"},
                        "stroke": {"value": "#0099FF"}
                    },
                    "update": {
                        "x": {"scale": "xscale", "field": "xmin"},
                        "x2": {"scale": "xscale", "field": "xmax"},
                        "y": {"scale": "yscale", "field": "ymin"},
                        "y2": {"scale": "yscale", "field": "ymax"},
                    }
                }
            },
            props.config.aggregate === 'scale' ? {
                "type": "symbol",
                "from": {"data": "tableBinned"},
                "encode": {
                  "update": {
                    "x": {"scale": "xscale", "signal": "(datum.x0 + datum.x1) / 2"},
                    "y": {"scale": "yscale", "signal": "(datum.y0 + datum.y1) / 2"},
                    "size": {"scale": "size", "field": "count"},
                    "shape": {"value": "circle"},
                    "fill": {"value": "#4682b4"}
                  }
                }
            } : props.config.aggregate === 'heatmap' ? 
            {
              "type": "rect",
              "from": {"data": "tableBinned"},
              "encode": {
                "enter": {
                    "x": {"scale": "xscale", "field": "x0"},
                    "x2": {"scale": "xscale", "field": "x1"},
                    "y": {"scale": "yscale", "field": "y0"},
                    "y2": {"scale": "yscale", "field": "y1"},
                    "fill": {"scale": "color", "field": "count"}
                }
              }
            } : {
                "type": "symbol",
                "from": {"data": "table"},
                "clip": true,
                "encode": {
                "enter": {
                    "fillOpacity": {"value": 0.6},
                    "fill": {"value": props.options.foregroundColor || 'black'}
                },
                "update": {
                    "x": {"scale": "xscale", "field": "x"},
                    "y": {"scale": "yscale", "field": "y"},
                    "size": {"signal": "size"}
                },
                "select":  { "size": {"signal": "size", "mult": 5} },
                "release": { "size": {"signal": "size"} }
                }
            },
            props.config.aggregate === 'scale' ? {
                "type": "symbol",
                "from": {"data": "activeBinned"},
                "encode": {
                  "update": {
                    "x": {"scale": "xscale", "signal": "(datum.x0 + datum.x1) / 2"},
                    "y": {"scale": "yscale", "signal": "(datum.y0 + datum.y1) / 2"},
                    "size": {"scale": "size", "field": "count"},
                    "shape": {"value": "circle"},
                    "fill": {"value": "red"}
                  }
                }
            } : props.config.aggregate === 'heatmap' ? 
            {
              "type": "rect",
              "from": {"data": "activeBinned"},
              "encode": {
                "enter": {
                    "x": {"scale": "xscale", "field": "x0"},
                    "x2": {"scale": "xscale", "field": "x1"},
                    "y": {"scale": "yscale", "field": "y0"},
                    "y2": {"scale": "yscale", "field": "y1"},
                    "fill": {"scale": "color", "field": "count"}
                }
              }
            } : {
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
                    "select":  { "size": {"signal": "size", "mult": 5} },
                    "release": { "size": {"signal": "size"} }
                }
            },
            props.options.regression ? {
                "type": "line",
                "from": {"data": "trend"},
                "clip":true,
                "encode": {
                    "update": {
                        "x": {"scale": "xscale", "field": "u"},
                        "y": {"scale": "yscale", "field": "v"},
                        "stroke": {"value": "#222"}
                    }
                }
            } : {"type": "line"},
            props.options.regression ? {
                "type": "line",
                "from": {"data": "trend-active"},
                "clip":true,
                "encode": {
                    "update": {
                        "x": {"scale": "xscale", "field": "u"},
                        "y": {"scale": "yscale", "field": "v"},
                        "stroke": {"value": "red"}
                    }
                }
            } : {"type": "line"},
        ]
    }
    
    function handleDragEnd(e, result){
        if (isNaN(result[1][0])||isNaN(result[1][1])) return
        dispatch({
            type: "SET_MAP_FILTER",
            payload: {   
                widgetIndex: props.config.id, 
                filterId: `${props.config.id}-x`,
                filter: {
                type: "range",
                field: props.config.xVariable,
                from: Math.min(result[0][0], result[1][0]),
                to: Math.max(result[0][0], result[1][0])
                }
            }
        });
        dispatch({
            type: "SET_MAP_FILTER",
            payload: {    
                widgetIndex: props.config.id, 
                filterId: `${props.config.id}-y`,
                filter: {
                type: "range",
                field: props.config.yVariable,
                from: Math.min(result[0][1], result[1][1]),
                to: Math.max(result[0][1], result[1][1])
                }
            }
        });
    }
    
    function handleClick(e, target){
        try {
            panToGeoid(target.datum.id, 500)
        } catch {}
    }

    const signalListeners = { 
        click: handleClick,
        endDrag: handleDragEnd,
        // tempDrag: (e, target) => console.log(e, target)
    };
    
    const vegaChart = useMemo(() => renderVega(
        chartRef,
        spec,
        scatterData,
        signalListeners,
        setView
    ), [chartData.length, JSON.stringify(props)])
    
    return (
        <div>  
            {chartData.length 
                ? vegaChart
                : <Loader />
            }   
        </div>
    );
}

ScatterWidget.propTypes = {
  options: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  config: PropTypes.object.isRequired,
  activeFilters: PropTypes.array.isRequired
};
