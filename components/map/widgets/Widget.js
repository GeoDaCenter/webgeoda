import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import styles from './Widgets.module.css';
import Loader from '../../layout/Loader';

import HistogramWidget from './HistogramWidget';
import ScatterWidget from './ScatterWidget';
import Scatter3DWidget from './Scatter3DWidget';

const widgetMapping = {
  histogram: HistogramWidget,
  scatter: ScatterWidget,
  scatter3d: Scatter3DWidget
}


const dataStatus = (data) => data && Object.keys(data)?.length

function Widget(props) {
  const widgetData = useSelector(state => state.widgetData);
  const data = widgetData[`${props.id}`]
  const InnerWidget = useMemo(
    () => {
      console.log('updating widget')
      console.log(dataStatus(data))
      return widgetMapping[props.type]({...props, data})
    },
    [dataStatus(data)]
  );
  
  if(!data) {
    return (
      <div className={styles.widget}><Loader /></div>
    );
  }
  if (!widgetMapping.hasOwnProperty(props.type)){
    return (
      <div className={styles.widget}>
        <h3>Error: Invalid widget type {props.type}</h3>
      </div>
    )
  }
  return InnerWidget

}

Widget.propTypes = {
  type: PropTypes.oneOf(["histogram", "line", "scatter", "scatter3d", "cluster"]).isRequired,
  id: PropTypes.number,
  config: PropTypes.object.isRequired
};

export default Widget;