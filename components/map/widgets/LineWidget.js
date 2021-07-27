import React from "react";
import PropTypes from "prop-types";
import {Line} from 'react-chartjs-2';
import useGetTimeSeriesData from "@webgeoda/hooks/useGetTimeSeriesData";
import dayjs from "dayjs";

function LineWidget(props){
  const data = useGetTimeSeriesData({
    variable: props.fullWidgetConfig.variable
  });
  const formattedData = React.useMemo(() => {
    if(data == null) return null;
    return data.map((val, i) => {
      return val.value;
    });
  }, [data]);
  const labels = React.useMemo(() => {
    if(data == null) return null;
    return data.map((val, i) => {
      return dayjs(val.date).format(props.options.dateFormat || "YYYY-MM-DD");
    })
  }, [data]);
  const chart = React.useMemo(() => {
    if(formattedData == null || labels == null) return null;
    const dataProp = {
      labels,
      datasets: [
        {
          label: props.options.header,
          data: formattedData,
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
      <Line data={dataProp} options={options} />
    )
  }, [formattedData, labels, props.options, props.fullWidgetConfig, props.fullWidgetConfig, props.data.labels, props.options.header, props.options.foregroundColor, props.options.pointSize, props.options.xAxisLabel, props.options.yAxisLabel]);
  return (
    <div style={{height: "100%"}}>{chart}</div>
  );
}

LineWidget.propTypes = {
  options: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  fullWidgetConfig: PropTypes.object.isRequired
};

export default LineWidget;