import React from 'react';
import PropTypes from 'prop-types';
// import styles from './Widgets.module.css';
import {BarChart, ResponsiveContainer, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Label} from 'recharts'; // Cell, Legend
// import { bin } from "d3-array";

function HistogramWidget(props) {
  
  return (
    <ResponsiveContainer height="90%">
      <BarChart data={props.data} margin={{
        left: "yAxisLabel" in props.options ? 15 : 0,
        bottom: "xAxisLabel" in props.options ? 20 : 0
      }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name">
          {"xAxisLabel" in props.options ? (
            <Label value={props.options.xAxisLabel} position="bottom" />
          ) : null}
        </XAxis>
        <YAxis label={"yAxisLabel" in props.options ? {
          value: props.options.yAxisLabel,
          position: "left",
          angle: -90
        } : null} />
        <Tooltip />
        <Bar dataKey="val" name={props.options.yAxisLabel || ""} fill={props.options.foregroundColor || "#000000"} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}

HistogramWidget.propTypes = {
  options: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
};

export default HistogramWidget;