import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Widgets.module.scss';
import { Draggable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripLines, faCog, faFilter, faSlash } from "@fortawesome/free-solid-svg-icons";
import WidgetSettings from './WidgetSettings';
import HistogramWidget from './HistogramWidget';
import ScatterWidget from './ScatterWidget';
import Scatter3DWidget from './Scatter3DWidget';
import HeatmapWidget from './HeatmapWidget';
import LineWidget from './LineWidget';
import VegaScatter from './VegaScatter';
import VegaHistogram from './vegaHistogram';
// As defined in CSS
export const WIDGET_WIDTH = 400;

const widgetTypes = {
  'histogram': HistogramWidget,
  'scatter': ScatterWidget,
  'scatter3d': Scatter3DWidget,
  'heatmap':HeatmapWidget,
  'line': LineWidget,
  'vegaScatter': VegaScatter,
  'vegaHistogram': HistogramWidget
}

const ParentWidget = (props) => {
  if (!(props.type in widgetTypes)) return (
    <div className={styles.widget}>
      <h3>Error: Invalid widget type {props.type}</h3>
    </div>
  )
  let Component = widgetTypes[props.type];
  return <Component {...props}/>
}
function Widget(props) {
  const dispatch = useDispatch();
  const mapFilters = useSelector(state => state.mapFilters);
  const [showSettings, setShowSettings] = React.useState(false);
  const activeFilters = mapFilters.filter(i => i.source == props.id);
  const hasActiveFilter = activeFilters.length > 0;

  return (
    <Draggable draggableId={props.id.toString()} index={props.index}>
      {(provided, snapshot) => (
        <div className={`${styles.widget} ${showSettings ? styles.showSettings : ""} ${snapshot.isDragging ? styles.dragging : ""} ${hasActiveFilter ? styles.filter : ""}`} ref={provided.innerRef} {...provided.draggableProps}>
          <button className={`${styles.floatingButton} ${styles.settingsButton}`} onClick={() => {
            setShowSettings(true);
          }}>
            <FontAwesomeIcon icon={faCog} />
          </button>
          {
            hasActiveFilter ? (
              <button className={`${styles.floatingButton} ${styles.clearFilterButton}`} onClick={() => {
                for(const filter of activeFilters){
                  dispatch({
                    type: "SET_MAP_FILTER",
                    payload: {    
                      filterId: filter.id,
                      filter: null
                    }
                  });
                }
              }}>
                <span className="fa-layers fa-fw">
                  <FontAwesomeIcon icon={faSlash} />
                  <FontAwesomeIcon icon={faFilter} />
                </span>
              </button>
            ) : null
          }
          {
            <h3 className={styles.widgetHeader} {...provided.dragHandleProps}>
              {
                props.options.header == null ? 
                  <FontAwesomeIcon icon={faGripLines} style={{color: "#00000055"}} /> :
                  props.options.header
              }
            </h3>
          }
          <div id='myDiv' className={styles.widgetContent}>
            <ParentWidget 
              type={props.type}
              options={props.options}
              config={props.config}
              id={props.id}
              activeFilters={activeFilters}
            />
          </div>
          <div className={styles.widgetSettings}>
            <WidgetSettings config={props.config} id={props.id} onSave={() => {
              setShowSettings(false);
            }} />
          </div>
        </div>
      )}
    </Draggable>
    
  );
}

Widget.propTypes = {
  type: PropTypes.oneOf(["histogram", "line", "scatter", "scatter3d", "heatmap","vegaHistogram","vegaScatter"]).isRequired,
  options: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired
};

export default Widget;