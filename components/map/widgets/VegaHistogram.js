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

export default function VegaHistogram(props) {
    const boxFilterGeoids = useSelector((state) => state.boxFilterGeoids);
    const [view, setView] = useState({});
    const dispatch = useDispatch();
    const chartRef = useRef();
    const mapFilters = useSelector((state) => state.mapFilters);
    const currFilters = mapFilters.filter(f => f.source === props.config.id);

    const {
        chartData
    } = useGetColumnarData({
        variable: props.config.variable,
        config: props.config,
        options: props.options,
        id: props.id
    })

    const histogramData = {
        table: chartData
    };
    // useEffect(() => {
    //     if (!(chartData.length)) return;
    //     function updateGraph() {
    //         const cs = vega
    //             .changeset()
    //             .remove(() => true)
    //             .insert(chartData.filter(t => boxFilterGeoids.includes(t.id)));
    //         view.change('active', cs).run();
    //     }
    //     Object.keys(view).length && updateGraph();
    // }, [view, boxFilterGeoids]);


    const spec = {
        "width": 300,
        "height": 150,
        "padding": 5,
      
        // "signals": [
        //   { "name": "binOffset", "value": 0,
        //     "bind": {"input": "range", "min": -0.1, "max": 0.1} },
        //   { "name": "binStep", "value": 0.1,
        //     "bind": {"input": "range", "min": 0.001, "max": 0.4, "step": 0.001} }
        // ],
      
        "data": [
          {
            "name": "table",
          },
          {
            "name": "binned",
            "source": "table",
            "transform": [
              {
                "type": "bin", "field": "value",
                // "extent": [-1, 1],
                // "anchor": {"value": "0"},
                // "step": {"value": ".05"},
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
      
        "scales": [
          {
            "name": "xscale",
            "type": "linear",
            "range": "width",
            "domain": [-1, 1]
          },
          {
            "name": "yscale",
            "type": "linear",
            "range": "height", "round": true,
            "domain": {"data": "binned", "field": "count"},
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
                "x": {"scale": "xscale", "field": "bin0"},
                "x2": {"scale": "xscale", "field": "bin1"},
                "y": {"scale": "yscale", "field": "count"},
                "y2": {"scale": "yscale", "value": 0},
                "fill": {"value": "steelblue"}
              },
              "hover": { "fill": {"value": "firebrick"} }
            }
          }
        ]
    }

    const signalListeners = { 
        // click: handleClick,
        // endDrag: handleDragEnd,
    };
    
    const vegaChart = useMemo(() => renderVega(
        chartRef,
        spec,
        histogramData,
        signalListeners,
        setView
    ), [chartData.length])
    
    return (
        <div>
            {chartData.length && vegaChart}   
        </div>
    );
}

VegaHistogram.propTypes = {
  options: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  config: PropTypes.object.isRequired
};
