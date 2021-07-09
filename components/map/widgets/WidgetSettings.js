import React from 'react';
import PropTypes from 'prop-types';
import styles from './Widgets.module.css';
import {useDispatch, useSelector} from 'react-redux';
import useLoadWidgetData from '@webgeoda/hooks/useLoadWidgetData';
import {shallowEqual} from '@webgeoda/utils/data';

const WIDGET_OPTION_TYPES = [
    {
        displayName: "Variable",
        datatype: "variable",
        supportedTypes: ["histogram", "summary"],
        get: (w) => w.variable,
        set: (w, v) => { w.variable = v , w.options.header = v}
    },
    {
        displayName: "X Variable",
        datatype: "variable",
        supportedTypes: ["scatter", "scatter3d"],
        get: (w) => w.xVariable,
        set: (w, v) => { w.xVariable = v, w.options.xAxisLabel = v, w.options.header = w.yVariable + " vs " + v}
    },
    {
        displayName: "Y Variable",
        datatype: "variable",
        supportedTypes: ["scatter", "scatter3d"],
        get: (w) => w.yVariable,
        set: (w, v) => { w.yVariable = v, w.options.yAxisLabel = v, w.options.header = v + " vs " + w.xVariable}
    },
    {
        displayName: "Z Variable",
        datatype: "variable",
        supportedTypes: ["scatter3d"],
        get: (w) => w.zVariable,
        set: (w, v) => { w.zVariable = v ,w.options.zAxisLabel = v}
    },
    {
        displayName: "Header",
        datatype: "string",
        supportedTypes: ["line", "scatter3d"],
        get: (w) => w.options.header,
        set: (w, v) => { w.options.header = v }
    },
    {
        displayName: "Foreground Color",
        datatype: "color",
        supportedTypes: ["histogram", "line", "scatter", "scatter3d", "summary"],
        get: (w) => w.options.foregroundColor,
        set: (w, v) => { w.options.foregroundColor = v }
    },
    // {
    //     displayName: "X-Axis Label",
    //     datatype: "string",
    //     supportedTypes: ["histogram", "line", "scatter", "scatter3d"],
    //     get: (w) => w.options.xAxisLabel,
    //     set: (w, v) => { w.options.xAxisLabel = v }
    // },
    // {
    //     displayName: "Y-Axis Label",
    //     datatype: "string",
    //     supportedTypes: ["histogram", "line", "scatter", "scatter3d"],
    //     get: (w) => w.options.yAxisLabel,
    //     set: (w, v) => { w.options.yAxisLabel = v }
    // },
    // {
    //     displayName: "Z-Axis Label",
    //     datatype: "string",
    //     supportedTypes: ["scatter3d"],
    //     get: (w) => w.options.zAxisLabel,
    //     set: (w, v) => { w.options.zAxisLabel = v }
    // },
    {
        displayName: "Point Size",
        datatype: "number",
        supportedTypes: ["scatter", "scatter3d"],
        get: (w) => w.options.pointSize,
        set: (w, v) => { w.options.pointSize = v }
    },
]

function WidgetSettings(props){
    const dispatch = useDispatch();
    const variableConfig = useSelector(state => state.dataPresets.variables);
    const variableOptions = variableConfig.filter(config => config.categorical !== true).map(config => config.variable);

    const [data, setData] = React.useState(props.config);
    const [doesWidgetNeedRefresh, setDoesWidgetNeedRefresh] = React.useState(false);

    const save = () => {
        if (!shallowEqual(props.config, data)){
            dispatch({
                type: "UPDATE_WIDGET_CONFIG_AND_DATA",
                payload: {
                    widgetIndex: props.id,
                    newConfig: data,
                    doesWidgetNeedRefresh
                }
            });
        }

        props.onSave();
    }

    const modifyData = (data, mutation, value) => {
        const newData = {...data}; // TODO: This only does a shallow clone
        mutation(newData, value);
        setData(newData);
    }

    const elems = WIDGET_OPTION_TYPES.filter(i => i.supportedTypes.includes(props.config.type)).map((i, idx) => {
        let elem = null;
        switch(i.datatype){
            case "variable": {
                elem = (
                    <select value={i.get(data)} onChange={(e) => {
                        modifyData(data, i.set, e.target.value);
                        setDoesWidgetNeedRefresh(true);
                    }}>
                        {
                            variableOptions.map(v => (
                                <option value={v} key={`variable-choice-${v}`}>{v}</option>
                            ))
                        }
                    </select>
                )
                break;
            }
            case "string": {
                elem = <input type="text" value={i.get(data)} onChange={(e) => modifyData(data, i.set, e.target.value)} />;
                break;
            }
            case "color": {
                elem = <input type="color" value={i.get(data)} onChange={(e) => modifyData(data, i.set, e.target.value)} />;
                break;
            }
            case "number": {
                elem = <input type="number" value={i.get(data)} onChange={(e) => modifyData(data, i.set, e.target.value)} />;
                break;
            }
        }
        return (
            <div className={styles.widgetSettingItem} key={`widgetsetting-${props.id}-${idx}`}>
                <p>{i.displayName}: {elem}</p>
            </div>
        );
    });
    return (
        <div>
            <h3 className={styles.widgetSettingsHeader}>Widget Options</h3>
            <div style={{height: "90%", overflowY: "auto"}}>
                {elems}
            </div>
            <button onClick={save}>Save</button>
        </div>
    );
}

WidgetSettings.propTypes = {
    config: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
    onSave: PropTypes.func.isRequired
};

export default WidgetSettings;