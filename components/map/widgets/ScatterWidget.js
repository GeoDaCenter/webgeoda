import React from 'react';
import PropTypes from 'prop-types';
import styles from './Widgets.module.css';
import {ScatterChart, Scatter, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

function ScatterWidget(props) {

  // WORKAROUND: Delete the .slice below, find a way to ensure performance for large datasets
  const formattedData = Object.values(props.data).slice(0, 1000);

  return (
    <ResponsiveContainer height="90%">
      <ScatterChart>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={props.options.xAxisVariable} />
        <YAxis dataKey={props.options.yAxisVariable} />
        <Tooltip />
        <Scatter data={formattedData} fill={props.options.foregroundColor} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

ScatterWidget.propTypes = {
  options: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
};

export default ScatterWidget;