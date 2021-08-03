import { useSelector, useDispatch } from "react-redux";
import { useState, useContext, useEffect, useMemo } from "react";
import { find } from "@webgeoda/utils/data";

export default function useRequireDatasets(datasets) {
    const cachedVariables = useSelector((state) => state.cachedVariables);
    const dispatch = useDispatch();

    const missingDatasets = datasets.filter(i => !(i in cachedVariables));
    if(missingDatasets.length > 0) {
        dispatch({
            type: "ADD_ACTIVE_DATASETS",
            payload: {
                datasets: missingDatasets
            }
        });
        return false;
    }
    return true;
}

export function useRequireDatasetsForVariables(variables) {
    const dataPresets = useSelector((state) => state.dataPresets);

    const variableSpecs = useMemo(() => {
        return variables.map(
            variableName => find(dataPresets.variables, o => o.variable = variableName)
        );
    }, [variables, dataPresets, dataPresets.varaibles]);

    const requiredDatasets = [];
    for(const i of variableSpecs){
        if("numerator" in i) requiredDatasets.push(i.numerator);
        if("denominator" in i) requiredDatasets.push(i.denominator);
    }

    return {
        isLoaded: useRequireDatasets(requiredDatasets),
        requiredDatasets
    };
}