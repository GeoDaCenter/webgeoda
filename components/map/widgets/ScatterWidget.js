import React from 'react';
import PropTypes from 'prop-types';
import styles from './Widgets.module.css';
import {Scatter} from 'react-chartjs-2';

function ScatterWidgetUnwrapped(props) {
  const dataKeys = React.useMemo(() => Object.keys(props.data), [props.data]);
  const dataValues = React.useMemo(() => Object.values(props.data), [props.data]);
  const formattedData = React.useMemo(() => {
    return dataValues.map(i => {
      return {
        x: parseFloat(i[props.options.xAxisVariable]),
        y: parseFloat(i[props.options.yAxisVariable])
      };
    });
  }, [props.data, props.options]);
  
  const dataProp = {
    datasets: [
      {
        label: props.options.header,
        data: formattedData,
        backgroundColor: props.options.foregroundColor
      }
    ]
  };

  const options = {
    maintainAspectRatio: false,
    elements: {
      point: {
        radius: 1
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem, data) => {
            const id = dataKeys[tooltipItem.dataIndex];
            const point = formattedData[tooltipItem.dataIndex];
            return `${id} (${point.x}, ${point.y})`;
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