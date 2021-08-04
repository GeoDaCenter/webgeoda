import { useSelector, useDispatch } from "react-redux";
import { useState, useContext, useEffect } from "react";
import { GeodaContext } from "../contexts";

import {
    parseColumnData,
    findTable
} from "../utils/data";

import {
    hexToRgb
} from "../utils/map";

import {
    getLisaResults
} from "../utils/geoda-helpers";


import {
    standardize
} from "../utils/stats";

import useGetVariable from "./useGetVariable";


export default function useGetLisa({
    dataset = false,
    variable = false,
    getScatterPlot = false,
    id=0,
    config={},
}) {
    const geoda = useContext(GeodaContext);
    const currentData = useSelector((state) => state.currentData);
    const storedGeojson = useSelector((state) => state.storedGeojson);
    const dataPresets = useSelector((state) => state.dataPresets);
    const lisaVariable = useSelector((state) => state.lisaVariable);
    console.log(lisaVariable)
    console.log(variable)
    const columnData = useGetVariable({
        dataset: dataset || currentData,
        variable,
        priority: true
    })

    const [data, setData] = useState({
        weights: {},
        lisaResults: {},
        lisaData: []
    });

    const dispatch = useDispatch();

    const clusterFilter = config.clusterFilter
    console.log(clusterFilter)

    let clusterFiltered = {};
    let lisaResultsFiltered = {clusters:[], lisaValues:[], neighbors: [], pvalues:[]};
    

    const getLisa = async (
        columnData,
        dataset,
        getScatterPlot = true,
    ) => {
        if (!Object.keys(columnData).length || !(dataset in storedGeojson)) return;

        // const variableSpec = find(
        //     dataPresets.variables,
        //     (o) => o.variable === variable
        // )

        const variableSpec = {variable: lisaVariable}

        const { weights, lisaResults } = await getLisaResults({
            geoda,
            storedGeojson,
            currentData: dataset,
            dataParams: variableSpec,
            lisaData: Object.values(columnData),
            dataset
        })


        if (clusterFilter!='All')
        {
        const index = lisaResults.labels.findIndex(cl => cl == clusterFilter)
        

        for (let i=0; i<lisaResults.clusters.length; i++)
        {
            if (lisaResults.clusters[i]==index)
            {
                clusterFiltered[i] = columnData[storedGeojson[currentData].order[i]];
                lisaResultsFiltered.clusters.push(lisaResults.clusters[i])
                lisaResultsFiltered.lisaValues.push(lisaResults.lisaValues[i])
                lisaResultsFiltered.neighbors.push(lisaResults.neighbors[i])
                lisaResultsFiltered.pvalues.push(lisaResults.pvalues[i])
            }
        }


        // const handleFilter = () => {
            dispatch({
                type: "SET_MAP_FILTER",
                payload: {
                    widgetIndex: id,
                    filterId: id,
                    filter: {
                        type: "set",
                        field: lisaVariable,
                        values: Object.values(clusterFiltered),
                    }
                }
            });
        // }
        }

        let scatterPlotDataStan = [];
        const standardizedVals = standardize(Object.values(columnData));
        const spatialLags = await geoda.spatialLag(weights, standardizedVals);
        const spatialLagsNonStan = await geoda.spatialLag(weights, Object.values(columnData));
        for (let i = 0; i < standardizedVals.length; i++) {
            scatterPlotDataStan.push({
                x: standardizedVals[i],
                y: spatialLags[i],
                cluster: lisaResults.clusters[i],
                id: storedGeojson[currentData].order[i]
            })
        }
        setData({ weights, lisaResults, scatterPlotDataStan, lisaData: columnData, spatialLags: spatialLagsNonStan, order: storedGeojson[currentData].order, clusterFiltered, lisaResultsFiltered });
    }

    useEffect(() =>
        getLisa(
            columnData,
            dataset || currentData,
            getScatterPlot
        ),
        [dataset, Object.keys(columnData).length, getScatterPlot, Object.keys(storedGeojson).length])

    return data;
}
