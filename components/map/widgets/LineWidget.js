import React from "react";
import PropTypes from "prop-types";
import {Line} from 'react-chartjs-2';

function LineWidget(props){
  const dataProp = {
    labels: props.data.labels,
    datasets: [
      {
        label: props.options.header,
        data: props.data.data,
        backgroundColor: props.options.foregroundColor || "#000000"
      }
    ]
  };
  const options = {
    maintainAspectRatio: false,
    animation: false,
    elements: {
      point: {
        radius: props.options.pointSize || 1
      }
    },
    scales: {
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
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <div>
      <Line data={dataProp} options={options} />
    </div>
  );
}

LineWidget.propTypes = {
  options: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
};

export default LineWidget;