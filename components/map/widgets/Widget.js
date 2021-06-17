import React, {useState} from 'react';
import PropTypes from 'prop-types';
import styles from './Widgets.module.css';

import HistogramWidget from './HistogramWidget';
import ScatterWidget from './ScatterWidget';

function Widget(props) {
  // TEMP: Replace with data stored in redux state
  const [data, setData] = useState(null);
  if(data == null){
    fetchData(props.dataConfig.file).then(res => {
      setData(res)
    });
    return <div className={styles.widget} />;
  }

  let component;
  switch(props.type){
    case 'histogram':
      component = HistogramWidget;
      break;
    case 'scatter':
      component = ScatterWidget;
      break;
    default:
      return (
        <div className={styles.widget}>
          <h3>Error: Invalid widget type {props.type}</h3>
        </div>
      );
  }

  return (
    <div className={styles.widget}>
      {
        props.options.header == null ? null : (
          <h3 className={styles.widgetHeader}>{props.options.header}</h3>
        )
      }
      {
        React.createElement(component, {
          options: props.options,
          data: data
        })
      }
    </div>
  );
}

async function fetchData(fileURL){
  let res;
  try {
    res = await fetch(fileURL);
  } catch(e){
    console.error(e);
    return null;
  }
  return await res.json();
}

Widget.propTypes = {
  type: PropTypes.oneOf(["histogram", "line", "scatter", "scatter3d", "cluster"]).isRequired,
  options: PropTypes.object.isRequired,
  dataConfig: PropTypes.object.isRequired
};

export default Widget;