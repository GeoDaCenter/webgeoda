import React from 'react';
import PropTypes from 'prop-types';
import styles from './Widgets.module.css';
import {BarChart, ResponsiveContainer, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import { bin } from "d3-array";

function HistogramWidget(props) {
  const d3bin = bin();
  const binned = d3bin(Object.values(props.data).map(i => i[props.options.yAxisVariable]));
  const formattedData = binned.map((i, idx) => {
    return {
      name: `${i.x0}-${i.x1}`,
      [props.options.yAxisVariable]: i.length,
      label: i.length
    };
  });
  console.log(formattedData)
  return (
    <ResponsiveContainer height="90%">
      <BarChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey={props.options.yAxisVariable} fill={props.options.foregroundColor} />
      </BarChart>
    </ResponsiveContainer>
  );
}

HistogramWidget.propTypes = {
  options: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
};

export default HistogramWidget;