import React from 'react';
import PropTypes from 'prop-types';
// import styles from './Widgets.module.css';
import {Scatter} from 'react-chartjs-2';
import {useDispatch} from 'react-redux';

function ScatterWidget(props) {
  const dispatch = useDispatch();
  if (!props.data) return null;

  const dataProp = [props.config.xVariable, props.config.yVariable].includes("LISA")
    ? {
        datasets: [
          {
            type: "scatter",
            label: props.options.header,
            data: props.data.scatterPlotData,
            backgroundColor: props.data.scatterPlotColors
          }
        ]
      }
    : (
      props.options.showBestFitLine 
      && props.data.fittedLine != null 
      && props.data.fittedLineEquation != null)
    ? {
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
      }
    : {
        datasets: [
          {
            type: "scatter",
            label: props.options.header,
            data: props.data.data,
            backgroundColor: props.options.foregroundColor
          }
        ]
      }

  const options = {
    maintainAspectRatio: false,
    animation: false,
    elements: {
      point: {
        radius: props.options.pointSize
      }
    },
    onClick: (e, items) => {
      if(items.length == 0) return;
      const point = props.data.data[items[0].index];
      dispatch({
        type: "SET_HOVER_OBJECT",
        payload: {
          id: point.id,
          x: 500, // TODO: Query map data, get current screen point of selected item
          y: 250
        },
      });
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          filter: (legend) => legend.datasetIndex != 0 // hide scatter label
        }
      },
      // tooltip: {
      //   callbacks: {
      //     label: (tooltipItem) => {
      //       const point = props.data.data[tooltipItem.dataIndex];
      //       return `${point.id} (${point.x}, ${point.y})`; // TODO: point.y is null for LISA scatterplots
      //     }
      //   }
      // }
    }
  };

  return (
    <div style={{height: "90%"}}>
      <Scatter data={dataProp} options={options} />
    </div>
  );
}

export default ScatterWidget;