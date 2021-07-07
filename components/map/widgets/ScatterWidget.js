import React from 'react';
import PropTypes from 'prop-types';
// import styles from './Widgets.module.css';
import {Scatter} from 'react-chartjs-2';
import useLisa from '@webgeoda/hooks/useLisa';
import useGetScatterplotLisa from '@webgeoda/hooks/useGetScatterplotLisa';
import {useDispatch} from 'react-redux';
import usePanMap from '@webgeoda/hooks/usePanMap';

function ScatterWidgetUnwrapped(props) {
  const dispatch = useDispatch();
  const panToGeoid = usePanMap();
  const [getLisa,] = useLisa();
  const [getCachedLisa, updateCachedLisa] = useGetScatterplotLisa();
  const lisaData = getCachedLisa(props.data.variableSpecs[0]);

  React.useEffect(async () => {
    if(lisaData == null){
      const lisaData = await getLisa({
        dataParams: props.data.variableSpecs[0],
        getScatterPlot: true
      });
      updateCachedLisa(props.data.variableSpecs[0], lisaData);
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
          backgroundColor: (props.options.foregroundColor === "cluster") ? (
            props.data.clusterLabels.map(i => props.options.clusterColors[i])
          ) : (props.options.foregroundColor || "#000000")
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
        radius: props.options.pointSize || 0.1
      }
    },
    onClick: (e, items) => {
      if(items.length == 0) return;
      const point = props.data.data[items[0].index];
      panToGeoid(point.id);
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          filter: (legend) => legend.datasetIndex != 0 // hide scatter label
        }
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => { //data
            const point = props.data.data[tooltipItem.dataIndex];
            return `${point.id} (${point.x}, ${point.y})`; // TODO: point.y is null for LISA scatterplots
          }
        }
      }
    },
    scales: { // TODO: Support gridlinesInterval option
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
    }
  };

  return (
    <div>
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