import React, {useState} from 'react';
import styles from './Widgets.module.css';
import {dataPresets} from '../../../map-config';
import Widget from "./Widget";
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

const mapWidgets = ({widgets, widgetLocations, side}) => widgets
  .map((elem, index) => ({elem, index}))
  .filter(i => widgetLocations[i.index].side == side)
  .sort((a, b) => widgetLocations[a.index].index - widgetLocations[b.index].index)
  .map(i => i.elem);

export default function WidgetLayer(props){
  const renderWidget = (widget, trueIndex, columnIndex) => {
    if(widget == undefined) return <div />;
    return <Widget type={widget.type} options={widget.options} fullWidgetConfig={widget} key={`widget-${trueIndex}`} id={trueIndex.toString()} index={columnIndex} />
  };

  const defaultWidgetLocations = [];
  let leftIndex = 0;
  let rightIndex = 0;
  for(const i of dataPresets.widgets){
    defaultWidgetLocations.push({
      side: i.position,
      index: i.position == "left" ? leftIndex : rightIndex
    });
    if(i.position == "left") { leftIndex++; }
    else { rightIndex++; }
  }
  const [widgetLocations, setWidgetLocations] = useState(defaultWidgetLocations);
  const widgets = dataPresets.widgets.map((widget, trueIndex) => {
    return renderWidget(widget, trueIndex, widgetLocations[trueIndex].index);
  });

  const widgetElementsLeft = mapWidgets({widgets, widgetLocations, side:"left"})
  const widgetElementsRight = mapWidgets({widgets, widgetLocations, side:"right"})

  const onDragEnd = (result) => {
    if(!result.destination) return;
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
        widgets[i] = renderWidget(dataPresets.widgets[i], i, widget.index);
      }
    }
    setWidgetLocations(newWidgetLocations);
  }

  return (
    <div className={styles.widgetLayer}>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.widgetsContainer}>
          <Droppable droppableId="widgets-left">
            {provided => (
              <div {...provided.droppableProps} ref={provided.innerRef} className={styles.widgetColumn} id={styles.columnLeft}>
                {widgetElementsLeft}
              </div>
            )}
          </Droppable>
          <Droppable droppableId="widgets-right">
            {provided => (
              <div {...provided.droppableProps} ref={provided.innerRef} className={styles.widgetColumn} id={styles.columnRight}>
                {widgetElementsRight}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
}