import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Widgets.module.scss';
import Widget from "./Widget";
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faAngleRight, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import WidgetDataLoader from './WidgetDataLoader';

const mapWidgets = ({widgets, widgetLocations, side}) => widgets
  .map((elem, index) => ({elem, index}))
  .filter(i => widgetLocations[i.index].side == side)
  .sort((a, b) => widgetLocations[a.index].index - widgetLocations[b.index].index)
  .map(i => i.elem);

const renderWidget = (widget, trueIndex, columnIndex) => {
  if(widget == undefined) return <div />;
  return <Widget type={widget.type} options={widget.options} config={widget} key={`widget-${trueIndex}`} id={trueIndex} index={columnIndex} />
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

  const widgetElementsLeft = mapWidgets({widgets, widgetLocations, side: "pinned"});
  const widgetElementsRight = mapWidgets({widgets, widgetLocations, side: "tray"});
  const widgetElementsHidden = mapWidgets({widgets, widgetLocations, side: "hidden"});

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
      ? "pinned" : (result.destination.droppableId == "widgets-right" ? "tray" : "hidden");
    
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
      <WidgetDataLoader />
      <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <div className={styles.widgetsContainer}>
          <Droppable droppableId="widgets-left">
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className={`${styles.widgetColumn} ${snapshot.isDraggingOver ? styles.dropping : ""} ${columnLeftActive ? styles.active : ""}`} id={styles.columnLeft}>
                <button className={styles.widgetDropdownHandle} onClick={() => {
                  setColumnLeftActive(!columnLeftActive);
                }}>
                  <FontAwesomeIcon icon={faAngleRight} className={styles.caret} />
                  <p>Pinned</p>
                </button>
                {/* {provided.placeholder} */}
                {widgetElementsLeft}
              </div>
            )}
          </Droppable>
          <div id={styles.widgetTray}>
            <div id={styles.widgetTrayContent} className={"hideScrollbar"}>
              <Droppable droppableId="widgets-right">
                {(provided, snapshot) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className={`${styles.widgetColumn} ${snapshot.isDraggingOver ? styles.dropping : ""} ${showWidgetTray || widgetIsDragging ? "" : styles.hidden}`} id={styles.columnRight}>
                    {/* {provided.placeholder} */}
                    {widgetElementsRight}
                  </div>
                )}
              </Droppable>
              <Droppable droppableId="widgets-hidden">
                {(provided, snapshot) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className={`${styles.widgetColumn} ${snapshot.isDraggingOver ? styles.dropping : ""} ${showWidgetTray || widgetIsDragging ? "" : styles.hidden} ${widgetIsDragging ? styles.widgetIsDragging : ""}`} id={styles.columnHidden}>
                    <p id={styles.hidingMenuTitle}>Hidden <FontAwesomeIcon icon={faAngleUp} className={styles.caret} /></p>
                    {/* {provided.placeholder} */}
                    {widgetElementsHidden}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}