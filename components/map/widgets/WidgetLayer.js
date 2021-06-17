import React from 'react';
import styles from './Widgets.module.css';
import {dataPresets} from '../../../map-config';
import Widget from "./Widget";

export default function WidgetLayer(props){
  const widgetList = [
    dataPresets.widgets.find(i => i.position == "top left"),
    dataPresets.widgets.find(i => i.position == "top center"),
    dataPresets.widgets.find(i => i.position == "top right"),
    dataPresets.widgets.find(i => i.position == "middle left"),
    dataPresets.widgets.find(i => i.position == "middle center"),
    dataPresets.widgets.find(i => i.position == "middle right"),
    dataPresets.widgets.find(i => i.position == "bottom left"),
    dataPresets.widgets.find(i => i.position == "bottom center"),
    dataPresets.widgets.find(i => i.position == "bottom right")
  ];
  const widgetElements = widgetList.map((widget, i) => {
    if(widget == undefined) return <div />;
    return <Widget type={widget.type} options={widget.options} dataConfig={widget.data} key={"widget-" + i} />
  });

  return (
    <div className={styles.widgetLayer}>
      <div className={styles.widgetsContainer}>
        {widgetElements}
      </div>
    </div>
  );
}