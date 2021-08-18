import { useSelector } from 'react-redux';
import {useRef} from 'react';
import PropTypes from 'prop-types';
import {Scatter} from 'react-chartjs-2';
import pluginBoxSelect from './chartjs-plugins/boxselect';
import useGetScatterData from '@webgeoda/hooks/useGetScatterData';

function ScatterWidget(props) {
  const chartRef = useRef();
  const boxFilterGeoids = useSelector((state) => state.boxFilterGeoids);

  const {
    chartData,
    chartOptions
  } = useGetScatterData({
    config: props.config,
    options: props.options,
    id: props.id,
    geoids: boxFilterGeoids
  })

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

  return (
    <div>{(chartData.datasets.length && chartData.datasets[0].data.length) && 
      <Scatter
        data={chartData}
        options={chartOptions}
        plugins={[pluginBoxSelect]}
        ref={chartRef}
      />}
    </div>
  );
}

// ScatterWidget.propTypes = {
//   options: PropTypes.object.isRequired,
//   data: PropTypes.object.isRequired,
//   id: PropTypes.number.isRequired,
//   config: PropTypes.object.isRequired,
//   activeFilters: PropTypes.array.isRequired
// };

export default ScatterWidget;