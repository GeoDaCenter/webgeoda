import { Vega, View } from 'react-vega';
import * as vega from 'vega';
import { useSelector, useDispatch } from 'react-redux';
import {useState, useEffect, useRef, useMemo} from 'react';
import PropTypes from 'prop-types';
// import styles from './Widgets.module.css';
import useGetColumnarData from '@webgeoda/hooks/useGetColumnarData';

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

export default function HistogramWidget(props) {
    const boxFilterGeoids = useSelector((state) => state.boxFilterGeoids);
    const [view, setView] = useState({});
    const dispatch = useDispatch();
    const chartRef = useRef();
    const mapFilters = useSelector((state) => state.mapFilters);
    const currFilters = mapFilters.filter(f => f.source === props.config.id);
    
    const {chartData} = useGetColumnarData({
        variable: props.config.variable,
        config: props.config
    })

    const histogramData = {
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


    const spec = {
        "width": 300,
        "height": 150,
        "padding": 5,      
        "data": [
            {
              "name": "table",
              "transform": [{ "type": "extent", "field": "value", "signal": "ext" }]
            },
            {
              "name": "active"
            },
            {
                "name": "binned",
                "source": "table",
                "transform": [
                    {
                        "type": "bin", 
                        "field": "value",
                        "extent": { "signal": "ext"},
                        "maxbins":40,
                        "nice": false
                    },
                    {
                        "type": "aggregate",
                        "key": "bin0", "groupby": ["bin0", "bin1"],
                        "fields": ["bin0"], "ops": ["count"], "as": ["count"]
                    }
                ]
            },
            {
                "name": "activeBinned",
                "source": "active",
                "transform": [
                    {
                        "type": "bin", 
                        "field": "value",
                        "extent": { "signal": "ext"},
                        "maxbins":40,
                        "nice": false
                    },
                    {
                        "type": "aggregate",
                        "key": "bin0", "groupby": ["bin0", "bin1"],
                        "fields": ["bin0"], "ops": ["count"], "as": ["count"]
                    }
                ]
            }
        ],
        "signals":[  
            {
                "name": "click",
                "on": [{"events": "*:click", "encode": "click"}]
            },
        ],      
        "scales": [
          {
            "name": "xscale",
            "type": "linear",
            "range": "width",
            "domain": {"signal": "ext"},
            "padding": 0,
          },
          {
            "name": "yscale",
            "type": "linear",
            "range": "height", "round": true,
            "domain": {"data": "binned", "field": "count"},
            "zero": true, "nice": true
          },
          {
            "name": "yscaleActive",
            "type": "linear",
            "range": "height", "round": true,
            "domain": {"data": "activeBinned", "field": "count"},
            "zero": true, "nice": true
          }
        ],
      
        "axes": [
          {"orient": "bottom", "scale": "xscale", "zindex": 1},
          {"orient": "left", "scale": "yscale", "tickCount": 5, "zindex": 1}
        ],
      
        "marks": [
            {
                "type": "rect",
                "from": {"data": "binned"},
                "encode": {
                    "update": {
                        "x": {"scale": "xscale", "field": "bin0", "offset": 1},
                        "x2": {"scale": "xscale", "field": "bin1", "offset": -1},
                        "y": {"scale": "yscale", "field": "count"},
                        "y2": {"scale": "yscale", "value": 0},
                        "fill": {"value": "steelblue"}
                    }
                }
            },
            {
                "type": "rect",
                "from": {"data": "activeBinned"},
                "encode": {
                    "update": {
                        "x": {"scale": "xscale", "field": "bin0", "offset": 4},
                        "x2": {"scale": "xscale", "field": "bin1", "offset": -4},
                        "y": {"scale": "yscaleActive", "field": "count"},
                        "y2": {"scale": "yscaleActive", "value": 0},
                        "fill": {"value": "black"}
                    }
                }
            },
            {
                "type": "rect",
                "from": {"data": "binned"},
                "clip": true,
                "encode": {
                "update": {
                    "x": {"scale": "xscale", "field": "bin0"},
                    "x2": {"scale": "xscale", "field": "bin1"},
                    "y": {"scale": "yscale", "value": chartData.length},
                    "y2": {"scale": "yscale", "value": 0},
                    "fill": {"value": "#00000000"}
                },
                "hover": { "fill": {"value": "#00000055"} }
                }
            },
        ]
    }
    const handleClick = (e,target) => {
        dispatch({
            type: "SET_MAP_FILTER",
            payload: {   
                widgetIndex: props.config.id, 
                filterId: `${props.config.id}`,
                filter: {
                type: "range",
                field: props.config.variable,
                from: target.datum.bin0,
                to: target.datum.bin1
                }
            }
        });
    }
    
    const signalListeners = { 
        click: handleClick
    };
    
    const vegaChart = useMemo(() => renderVega(
        chartRef,
        spec,
        histogramData,
        signalListeners,
        setView
    ), [chartData.length])
    
    return <div>{chartData.length && vegaChart}</div>

}