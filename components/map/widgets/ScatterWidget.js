import React from 'react';
import PropTypes from 'prop-types';
// import styles from './Widgets.module.css';
import {Scatter} from 'react-chartjs-2';
import pluginBoxSelect from './chartjs-plugins/boxselect';
import useLisa from '@webgeoda/hooks/useLisa';
import useGetScatterplotLisa from '@webgeoda/hooks/useGetScatterplotLisa';
import {useDispatch} from 'react-redux';
import usePanMap from '@webgeoda/hooks/usePanMap';

function ScatterWidgetUnwrapped(props) {
  const chartRef = React.useRef();
  const dispatch = useDispatch();
  const panToGeoid = usePanMap();
  const [getLisa,] = useLisa();
  const [getCachedLisa, updateCachedLisa] = useGetScatterplotLisa();
  const lisaData = getCachedLisa(props.data.variableSpecs[0]);
  console.log(props)

  React.useEffect(async () => {
    if(lisaData == null){
      const lisaData = await getLisa({
        dataParams: props.data.variableSpecs[0],
        getScatterPlot: true
      });
      updateCachedLisa(props.data.variableSpecs[0], lisaData);
    }
  });

  const xFilter = props.activeFilters.find(i => i.id == `${props.id}-x`);
  const yFilter = props.activeFilters.find(i => i.id == `${props.id}-y`);

  if(chartRef.current){
    chartRef.current.boxselect.state = {
      display: xFilter != undefined && yFilter != undefined,
      xMin: xFilter?.from,
      xMax: xFilter?.to,
      yMin: yFilter?.from,
      yMax: yFilter?.to
    };
  }

  const dataProp = React.useMemo(() => {
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
    return dataProp;
  }, [props.data, props.options.header, props.options.foregroundColor, props.options.clusterColors, lisaData]);

  const options = React.useMemo(() => {
    return {
      events: ["click", "touchstart", "touchmove", "mousemove", "mouseout"],
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
        },
        boxselect: {
          select: {
            enabled: true,
            direction: 'xy'
          },
          callbacks: {
            beforeSelect: function(startX, endX, startY, endY) {
                return true;
            },
            afterSelect: (startX, endX, startY, endY, datasets) => {
              dispatch({
                type: "SET_MAP_FILTER",
                payload: {   
                  widgetIndex: props.id, 
                  filterId: `${props.id}-x`,
                  filter: {
                    type: "range",
                    field: props.fullWidgetConfig.xVariable,
                    from: Math.min(startX, endX),
                    to: Math.max(startX, endX)
                  }
                }
              });
              dispatch({
                type: "SET_MAP_FILTER",
                payload: {    
                  widgetIndex: props.id, 
                  filterId: `${props.id}-y`,
                  filter: {
                    type: "range",
                    field: props.fullWidgetConfig.yVariable,
                    from: Math.min(startY, endY),
                    to: Math.max(startY, endY)
                  }
                }
              });
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
  }, [props.options, props.options.pointSize, props.data, props.fullWidgetConfig.xVariable, props.fullWidgetConfig.yVariable]);

  console.log(dataProp)
  console.log(options)
   
  const chart = React.useMemo(() => {
    return (
      <Scatter
        data={dataProp}
        options={options}
        plugins={[pluginBoxSelect]}
        ref={chartRef}
      />
    );
  }, [dataProp, options, pluginBoxSelect]);

  return (
    <div>{chart}</div>
  );
}

ScatterWidgetUnwrapped.propTypes = {
  options: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  fullWidgetConfig: PropTypes.object.isRequired,
  activeFilters: PropTypes.array.isRequired
};

const ScatterWidget = React.memo(ScatterWidgetUnwrapped);

export default ScatterWidget;