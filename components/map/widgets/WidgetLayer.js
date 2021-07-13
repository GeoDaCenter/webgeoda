import React, {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Widgets.module.css';
import Widget from "./Widget";
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

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
  const widgetLocations = useSelector(state => state.widgetLocations);
  const dispatch = useDispatch();
  
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

  return (
    <div className={styles.widgetLayer}>
      <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <div className={styles.widgetsContainer}>
          <Droppable droppableId="widgets-left">
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className={`${styles.widgetColumn} ${snapshot.isDraggingOver ? styles.dropping : ""}`} id={styles.columnLeft}>
                <div className={styles.widgetDropdownHandle}>
                  <p>Widgets <FontAwesomeIcon icon={faAngleRight} className={styles.caret} /></p>
                </div>
                {widgetElementsLeft}
              </div>
            )}
          </Droppable>
          <Droppable droppableId="widgets-right">
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className={`${styles.widgetColumn} ${snapshot.isDraggingOver ? styles.dropping : ""}`} id={styles.columnRight}>
                {widgetElementsRight}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
}