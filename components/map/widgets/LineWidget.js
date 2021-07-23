import React from "react";
import PropTypes from "prop-types";
import useGetLineChartData from "@webgeoda/hooks/useGetLineChartData";
import {Line} from 'react-chartjs-2';

function LineWidget(props){
  const {
    chartData,
    chartOptions
  } = useGetLineChartData({
    variable: props.fullWidgetConfig.variable,
    dataset: 'states.geojson',
    options: props.options
  })

  return (
    <div style={{height: "100%"}}>
      {chartData !== null && <Line data={chartData} options={chartOptions} />}
    </div>
  );
}

LineWidget.propTypes = {
  options: PropTypes.object.isRequired,
  fullWidgetConfig: PropTypes.object.isRequired
};

export default LineWidget;