import { useSelector, useDispatch } from "react-redux";
import { useState, useContext, useEffect } from "react";
import {getWidgetSpec} from "../utils/widgets";
import { find } from "@webgeoda/utils/data";

export default function useLoadWidgetData(widgetIndex) {
    const dataPresets = useSelector((state) => state.dataPresets);
    const cachedVariables = useSelector((state) => state.cachedVariables);
    const widgetData = useSelector((state) => state.widgetData);
    const dispatch = useDispatch();

    if(widgetIndex in widgetData && widgetData[widgetIndex] !== null) {
        // Widget data is already loaded
        return widgetData[widgetIndex];
    }

    const widgetSpec = getWidgetSpec(config, widgetIndex);
    const variableSpecs = widgetSpec.variable.map(
        variableName => find(dataPresets.variables, o => o.variable = variableName)
    );
    const requiredDatasets = [];
    for(const i of variableSpecs){
        if("numerator" in i) requiredDatasets.push(i.numerator);
        if("denominator" in i) requiredDatasets.push(i.denominator);
    }
    const missingDatasets = requiredDatasets.filter(i => !(i in cachedVariables));
    if(missingDatasets.length > 0) {
        // Data needs to be loaded before formatted widget data can be generated
        dispatch({
            type: "ADD_ACTIVE_DATASETS",
            payload: {
                datasets: missingDatasets
            }
        });
        return null;
    }

    // All data is loaded, but formatted widget data is not
    dispatch({
        type: "FORMAT_WIDGET_DATA",
        payload: {widgetSpec}
    });
    return null;
}