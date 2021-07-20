import React, {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Widgets.module.scss';
import Widget from "./Widget";
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

const mapWidgets = ({widgets, widgetLocations, side}) => widgets
  .map((elem, index) => ({elem, index}))
  .filter(i => widgetLocations[i.index].side == side)
  .sort((a, b) => widgetLocations[a.index].index - widgetLocations[b.index].index)
  .map(i => i.elem);

const renderWidget = (widget, trueIndex, columnIndex) => {
  if(widget == undefined) return <div />;
  return <Widget type={widget.type} options={widget.options} fullWidgetConfig={widget} key={`widget-${trueIndex}`} id={trueIndex} index={columnIndex} />
};

export default function WidgetLayer(){
  const widgetConfig = useSelector(state => state.widgetConfig);
  const widgetIsDragging = useSelector(state => state.widgetIsDragging);
  const widgetLocations = useSelector(state => state.widgetLocations);
  const showWidgetTray = useSelector(state => state.showWidgetTray);
  const dispatch = useDispatch();
  const [columnLeftActive, setColumnLeftActive] = React.useState(false);
  
  const widgets = widgetConfig.map((widget, trueIndex) => {
    return renderWidget(widget, trueIndex, widgetLocations[trueIndex].index);
  });

  const widgetElementsLeft = mapWidgets({widgets, widgetLocations, side:"left"})
  const widgetElementsRight = mapWidgets({widgets, widgetLocations, side:"right"})

  const handleDragStart = () => dispatch({type:'SET_WIDGET_IS_DRAGGING', payload: true})

  const handleDragEnd = (result) => {
    if(!result.destination) {
      dispatch({type:'SET_WIDGET_IS_DRAGGING', payload: false})
      return;
    }
    const newWidgetLocations = [...widgetLocations];
    const widgetIndex = parseInt(result.draggableId);
    const previousSide = widgetLocations[widgetIndex].side;
    const previousIndex = widgetLocations[widgetIndex].index;
    widgetLocations[widgetIndex].index = result.destination.index;

    newWidgetLocations[widgetIndex].side = 
      result.destination.droppableId == "widgets-left"
      ? "left"
      : "right"
    
    for(let i = 0; i < newWidgetLocations.length; i++) {
      const widget = newWidgetLocations[i];
      if(widget == newWidgetLocations[widgetIndex]) continue;
      const thisWidgetPrevIndex = widget.index;
      if(widget.side == previousSide){
        if(widget.index > previousIndex) widget.index--;
      }
      if(widget.side == newWidgetLocations[widgetIndex].side){
        if(widget.index >= result.destination.index) widget.index++;
      }
      if(thisWidgetPrevIndex !== widget.index){
        widgets[i] = renderWidget(widgetConfig[i], i, widget.index);
      }
    }    
    dispatch({
      type: 'SET_WIDGET_LOCATIONS',
      payload: newWidgetLocations
    });
  }
  const handleWidgetTrayClick = () => dispatch({type: "SET_SHOW_WIDGET_TRAY", payload: !showWidgetTray});

  return (
    <div className={styles.widgetLayer}>
      <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <div className={styles.widgetsContainer}>
          <Droppable droppableId="widgets-left">
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className={`${styles.widgetColumn} ${snapshot.isDraggingOver ? styles.dropping : ""} ${columnLeftActive ? styles.active : ""}`} id={styles.columnLeft}>
                <div className={styles.widgetDropdownHandle} onClick={() => {
                  setColumnLeftActive(!columnLeftActive);
                }}>
                  <FontAwesomeIcon icon={faAngleRight} className={styles.caret} />
                  <p>Pinned</p>
                </div>
                {widgetElementsLeft}
              </div>
            )}
          </Droppable>
          <div id={styles.widgetTray}>
            <div className={`${styles.widgetDropdownHandle} ${showWidgetTray || widgetIsDragging ? "" : styles.hidden}`} onClick={handleWidgetTrayClick}>
              <FontAwesomeIcon icon={faAngleRight} className={styles.caret} />
              <p>Widgets</p>
            </div>
            <Droppable droppableId="widgets-right">
              {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className={`${styles.widgetColumn} ${snapshot.isDraggingOver ? styles.dropping : ""} ${showWidgetTray || widgetIsDragging ? "" : styles.hidden}`} id={styles.columnRight}>
                  {widgetElementsRight}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}