import React from 'react';
import PropTypes from 'prop-types';
import * as ss from 'simple-statistics';

function SummaryWidget(props) {

  return (
    <div>
    <center>
        <br /><b>Mean:</b> {props.data.mean}
      <br /><b>Median:</b> {props.data.median}
      <br /><b>Standard Dev: </b>{props.data.stdev}
      <br /><b>Min:</b> {props.data.min}
      <br /><b>Max:</b> {props.data.max}
    </center>
    </div>
  );
}

SummaryWidget.propTypes = {
  options: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
};

export default SummaryWidget;