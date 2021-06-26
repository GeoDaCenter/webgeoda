import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import styles from './Widgets.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from '../../layout/Loader';
import HistogramWidget from './HistogramWidget';
import ScatterWidget from './ScatterWidget';
import Scatter3DWidget from './Scatter3DWidget';

// As defined in CSS
export const WIDGET_WIDTH = 400;

function Widget(props) {
  const widgetData = useSelector(state => state.widgetData);
  const data = widgetData[props.id]
  if(!data || !props.id) {
    return (
      <div className={styles.widget}><Loader /></div>
    );
  }

  if (props.type === "histogram"){
    return <HistogramWidget
      options={props.options}
      data={data}
    />
  }

  if (props.type === "scatter"){
    return <ScatterWidget 
      options={props.options}
      data={data}
    />
  }

  if (props.type === "scatter3d"){
    return <Scatter3DWidget 
      options={props.options}
      data={data}
    />
  }

  return (
    <div className={styles.widget}>
      <h3>Error: Invalid widget type {props.type}</h3>
    </div>
  )
}

Widget.propTypes = {
  type: PropTypes.oneOf(["histogram", "line", "scatter", "scatter3d", "cluster"]).isRequired,
  id: PropTypes.number,
  config: PropTypes.object.isRequired
};

export default Widget;