import React from 'react';
import PropTypes from 'prop-types';
import {Bar} from 'react-chartjs-2';
import pluginBarSelect from './chartjs-plugins/barselect';
import { useDispatch } from 'react-redux';

function HistogramWidget(props) {
  const chartRef = React.useRef();
  const dispatch = useDispatch();

  const filter = props.activeFilters.find(i => i.id == props.id);
  if(chartRef.current){
    chartRef.current.barselect.state = {
      display: filter != undefined,
      xMin: filter?.minIndex,
      xMax: filter?.maxIndex
    };
  }

  const dataProp = React.useMemo(() => {
    return {
      labels: props.data.labels,
      datasets: [
        {
          label: props.options.header,
          data: props.data.data,
          backgroundColor: props.options.foregroundColor || "#000000"
        }
      ]
    };
  }, [props.data, props.options]);

  const options = React.useMemo(() => {
    return {
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
            beforeSelect: function(startX, endX) {
                return true;
            },
            afterSelect: (startX, endX, datasets) => {
              // Range is the min of the first bucket and the max of the last bucket in selection
              const min = props.data.binBounds[datasets[0].minIndex][0];
              const max = props.data.binBounds[datasets[0].maxIndex][1];
              dispatch({
                type: "SET_MAP_FILTER",
                payload: {    
                  widgetIndex: props.id,
                  filterId: props.id,
                  filter: {
                    type: "range",
                    field: props.fullWidgetConfig.variable,
                    from: min,
                    to: max,
                    minIndex: datasets[0].minIndex,
                    maxIndex: datasets[0].maxIndex
                  }
                }
              });
            }
          }
        }
      }
    };
  }, [props.data, props.options, props.fullWidgetConfig]);

  const chart = React.useMemo(() => {
    return (
      <Bar data={dataProp} options={options} plugins={[pluginBarSelect]} ref={chartRef} />
    );
  });

  return (
    <div>{chart}</div>
  );
}

HistogramWidget.propTypes = {
  options: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  fullWidgetConfig: PropTypes.object.isRequired
};

export default HistogramWidget;