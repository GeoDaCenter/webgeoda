import React from 'react';
import PropTypes from 'prop-types';
import {Bar} from 'react-chartjs-2';
import pluginBarSelect from './chartjs-plugins/barselect';

function HistogramWidget(props) {
  const chartRef = React.useRef();
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
    events: ["click", "touchstart", "touchmove", "mousemove", "mouseout"],
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
      },
      barselect: {
        select: {
          enabled: true
        },
        callbacks: {
          beforeSelect: function(startX, endX, startY, endY) {
              return true;
          },
          afterSelect: (startX, endX, startY, endY, datasets) => {
          }
        }
      }
    }
  };
  console.log(chartRef.current)
  return (
    <div>
      <Bar data={dataProp} options={options} plugins={[pluginBarSelect]} ref={chartRef} />
    </div>
  );
}

HistogramWidget.propTypes = {
  options: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired
};

export default HistogramWidget;