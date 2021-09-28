import { Vega } from 'react-vega';
import React, { useMemo} from "react";
// import { useDispatch } from 'react-redux';
import PropTypes from "prop-types";
import useGetTimeSeriesData from "@webgeoda/hooks/useGetTimeSeriesData";

const renderVega = (
  spec,
  data,
  signalListeners,
  // setView
) => <Vega 
  spec={spec} 
  data={data} 
  signalListeners={signalListeners} 
  // onNewView={(view) => setView(view)}
  />  

export default function LineWidget(props){
  // const [view, setView] = useState({});
  // const dispatch = useDispatch();
  // console.log(view)
  const chartData = useGetTimeSeriesData({
    variable: props.config.variable,
    dataset: 'states.geojson'
  })

  const lineData = {
    table: chartData,
  };

  const spec = {
    "width": 300,
    "height": 150,
    "padding": 5,      
    "data": [
        {
          "name": "table",
          "transform": [{ "type": "extent", "field": "value", "signal": "ext" }]
        },
    ],
    "scales": [
      {
        "name": "x",
        "type": "point",
        "range": "width",
        "domain": {"data": "table", "field": "date"}
      },
      {
        "name": "y",
        "type": "linear",
        "range": "height",
        "nice": true,
        "zero": true,
        "domain": {"data": "table", "field": "value"}
      },
    ],
    "axes": [
      {
        "orient": "bottom", 
        "scale": "x", 
        "autosize": "pad", 
        "labelOverlap":true, 
        "ticks":false, 
        "labelAngle":-30, 
        "labelPadding":15
      },
      {"orient": "left", "scale": "y"}
    ],
    "marks": [
      {
        "type": "line",
        "from": {"data": "table"},
        "encode": {
          "enter": {
            "x": {"scale": "x", "field": "date"},
            "y": {"scale": "y", "field": "value"},
            "strokeWidth": {"value": 2}
          }
        }
      }
    ]
  }
  const vegaChart = useMemo(() => renderVega(
    spec,
    lineData,
    {},
    // setView
  ), [chartData.length])

  return <div>{chartData.length && vegaChart}</div>
}

LineWidget.propTypes = {
  options: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired
};
