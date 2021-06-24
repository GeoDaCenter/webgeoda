import React from 'react';
import PropTypes from 'prop-types';
// import styles from './Widgets.module.css';
import {Scatter} from 'react-chartjs-2';

function ScatterWidgetUnwrapped(props) {
  const dataProp = {
    datasets: [
      {
        type: "scatter",
        label: props.options.header,
        data: props.data.data,
        backgroundColor: props.options.foregroundColor
      },
      {
        type: "line",
        label: "Best fit: " + props.data.fittedLineEquation,
        data: props.data.fittedLine,
        borderColor: "#000000"
      }
    ]
  };

  const options = {
    maintainAspectRatio: false,
    animation: false,
    elements: {
      point: {
        radius: props.options.pointSize
      }
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          filter: (legend, data) => legend.datasetIndex != 0 // hide scatter label
        }
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem, data) => {
            const point = props.data.data[tooltipItem.dataIndex];
            return `${point.id} (${point.x}, ${point.y})`;
          }
        }
      }
    }
  };

  return (
    <div style={{height: "90%"}}>
      <Scatter data={dataProp} options={options} />
    </div>
  );
}

ScatterWidgetUnwrapped.propTypes = {
  options: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
};

const ScatterWidget = React.memo(ScatterWidgetUnwrapped);

export default ScatterWidget;