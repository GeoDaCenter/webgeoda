import React from 'react';
import PropTypes from 'prop-types';
import * as ss from 'simple-statistics';

function SummaryWidget(props) {
console.log(props);
  const dataProp = {
    labels: props.data.labels,
    datasets: [
      {
        label: props.options.header,
        data: props.data.data,
        backgroundColor: props.options.foregroundColor || "#000000"
      }
    ]
  };

  return (
    <div>
      Mean: {ss.mean([1,1])}
      Median: {ss.median([1,1])}
      Median: {ss.standardDeviation([1,1])}
      Min: {ss.min([1,3])}
      Min: {ss.max([1,3])}
    </div>
  );
}

SummaryWidget.propTypes = {
  options: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
};

export default SummaryWidget;