import React from 'react';
import PropTypes from 'prop-types';
import {Bar} from 'react-chartjs-2';

function HistogramWidget(props) {
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
    <div style={{height: "90%"}}>
      <Bar data={dataProp} options={options} />
    </div>
  );
}

HistogramWidget.propTypes = {
  options: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
};

export default HistogramWidget;