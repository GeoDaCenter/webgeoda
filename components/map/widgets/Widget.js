import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import styles from './Widgets.module.css';
import { Draggable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripLines } from "@fortawesome/free-solid-svg-icons";
import Loader from '../../layout/Loader';
import HistogramWidget from './HistogramWidget';
import ScatterWidget from './ScatterWidget';
import Scatter3DWidget from './Scatter3DWidget';
import LineWidget from './LineWidget';

// As defined in CSS
export const WIDGET_WIDTH = 400;

function Widget(props) {
  const data = useSelector(state => state.widgetData[props.id]);

  if(data == null){
    return (
      <div className={styles.widget}><Loader /></div>
    );
  }

  let component;
  switch(props.type){
    case 'histogram':
      component = HistogramWidget;
      break;
    case 'scatter':
      component = ScatterWidget;
      break;
    case 'scatter3d':
      component = Scatter3DWidget;
      break;
    case 'line':
      component = LineWidget;
      break;
    default:
      return (
        <div className={styles.widget}>
          <h3>Error: Invalid widget type {props.type}</h3>
        </div>
      );
  }

  return (
    <Draggable draggableId={props.id} index={props.index}>
      {provided => (
        <div className={styles.widget} ref={provided.innerRef} {...provided.draggableProps}>
          {
            <h3 className={styles.widgetHeader} {...provided.dragHandleProps}>
              {
                props.options.header == null ? 
                  <FontAwesomeIcon icon={faGripLines} style={{color: "#00000055"}} /> :
                  props.options.header
              }
            </h3>
          }
          {
            React.createElement(component, {
              options: props.options,
              data: data,
              fullWidgetConfig: props.fullWidgetConfig
            })
          }
        </div>
      )}
    </Draggable>
    
  );
}

Widget.propTypes = {
  type: PropTypes.oneOf(["histogram", "line", "scatter", "scatter3d", "cluster"]).isRequired,
  options: PropTypes.object.isRequired,
  fullWidgetConfig: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired
};

export default Widget;