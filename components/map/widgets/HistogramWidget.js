import { useSelector } from 'react-redux';
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import {Bar} from 'react-chartjs-2';
import pluginBarSelect from './chartjs-plugins/barselect';
import useGetHistogramData from '@webgeoda/hooks/useGetHistogramData';

function HistogramWidget(props) {
  const chartRef = useRef();
  const boxFilterGeoids = useSelector((state) => state.boxFilterGeoids)
  const {
    chartData,
    chartOptions
  } = useGetHistogramData({
    variable: props.config.variable,
    config: props.config,
    options: props.options,
    id: props.id,
    geoids: boxFilterGeoids
  })
  
  const filter = props.activeFilters.find(i => i.id == props.id);

  if ( chartRef.current ) {
    chartRef.current.barselect.state = {
      display: filter != undefined,
      xMin: filter?.minIndex,
      xMax: filter?.maxIndex
    };
  }

  return (
    <div>
      {chartData.datasets.length && <Bar 
        data={chartData} 
        options={chartOptions} 
        plugins={[pluginBarSelect]} 
        ref={chartRef} />}
    </div>
  );
}

// HistogramWidget.propTypes = {
//   options: PropTypes.object.isRequired,
//   data: PropTypes.object.isRequired,
//   id: PropTypes.number.isRequired,
//   config: PropTypes.object.isRequired
// };

export default HistogramWidget;