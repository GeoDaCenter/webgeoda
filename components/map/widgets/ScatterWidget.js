import React from 'react';
import PropTypes from 'prop-types';
// import styles from './Widgets.module.css';
import {Scatter} from 'react-chartjs-2';
import useLisa from '@webgeoda/hooks/useLisa';
import {useDispatch} from 'react-redux';

function ScatterWidgetUnwrapped(props) {
  const dispatch = useDispatch();
  const [getLisa,] = useLisa();
  const [lisaData, setLisaData] = React.useState(null);
  React.useEffect(async () => {
    if(lisaData == null){
      const lisaData = await getLisa({
        dataParams: props.data.variableSpecs[0],
        getScatterPlot: true
      });
      console.log(lisaData)
      setLisaData(lisaData);
    }
  });

  let dataProp;
  if(props.data.isLisa){
    if(lisaData == null){
      dataProp = {datasets: []};
    } else {
      dataProp = {
        datasets: [
          {
            type: "scatter",
            label: props.options.header,
            data: lisaData.scatterPlotData,
            backgroundColor: lisaData.lisaResults.clusters.map(i => lisaData.lisaResults.colors[i])
          }
        ]
      };
    }
    
  } else {
    dataProp = {
      datasets: [
        {
          type: "scatter",
          label: props.options.header,
          data: props.data.data,
          backgroundColor: props.options.foregroundColor
        }
      ]
    };
    if(props.options.showBestFitLine && props.data.fittedLine != null && props.data.fittedLineEquation != null){
      dataProp.datasets.push({
        type: "line",
        label: "Best fit: " + props.data.fittedLineEquation,
        data: props.data.fittedLine,
        borderColor: "#000000"
      });
    }
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
          filter: (legend, data) => legend.datasetIndex != 0 // hide scatter label
        }
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem, data) => {
            const point = props.data.data[tooltipItem.dataIndex];
            return `${point.id} (${point.x}, ${point.y})`; // TODO: point.y is null for LISA scatterplots
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