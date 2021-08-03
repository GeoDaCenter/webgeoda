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
    getScatterPlot = false
}) {
    const geoda = useContext(GeodaContext);
    const currentData = useSelector((state) => state.currentData);
    const storedGeojson = useSelector((state) => state.storedGeojson);
    const dataPresets = useSelector((state) => state.dataPresets);
    const columnData = useGetVariable({
        dataset,
        variable
    })
    const data = useSelector((state) => state.cachedLisaScatterplotData);

    // const [data, setData] = useState({
    //     weights:{},
    //     lisaResults: {},
    //     lisaData: []
    // });

    //const dispatch = useDispatch();

    const getLisa = async (
        columnData,
        dataset,
        getScatterPlot = true
    ) => {
        if (!columnData.length || !(dataset in storedGeojson)) return;

        const variableSpec = find(
            dataPresets.variables,
            (o) => o.variable === variable
        )

        const { weights, lisaResults } = await getLisaResults({
            geoda,
            storedGeojson,
            currentData: dataset,
            dataParams: variableSpec,
            lisaData: columnData,
            dataset
        })


        if (getScatterPlot) {
            let scatterPlotDataStan = [];
            const standardizedVals = standardize(lisaData);
            const spatialLags = await geoda.spatialLag(weights, standardizedVals);
            for (let i = 0; i < standardizedVals.length; i++) {
                scatterPlotDataStan.push({
                    x: standardizedVals[i],
                    y: spatialLags[i],
                    cluster: lisaResults.clusters[i],
                    id: storedGeojson[state.currentData].order[i]
                })
            }
            return ({ weights, lisaResults, scatterPlotDataStan, spatialLags });
        } else {
            return ({ weights, lisaResults });
        }
    }


    let results = null;
    if (variableSpec.variable in data) {
        results = data[variableSpec.variable]
    }
    else {
        React.useEffect(async () => {
            results = await getLisa({
                columnData,
                dataset,
                getScatterPlot: true
            });
            console.log('hi')
            dispatch({
                type: "CACHE_SCATTERPLOT_LISA",
                payload: {
                    variableName: variable,
                    results
                }
            });
        }, []);
    }
    return results;
    // useEffect(() => {
    //     let isMounted = true;
    //     if (isMounted){
    //     getLisa( 
    //         columnData,
    //         dataset||currentData,
    //         getScatterPlot
    //     )
    //     }
    //     return () => { isMounted = false };
    // },[dataset, columnData, getScatterPlot])

    //   const updateLisa = async () => {

    //     const { weights, lisaResults, lisaData } = await getLisa ({
    //         geographyName: currentData,
    //         dataParams
    //     })

    //     dispatch({
    //         type: "UPDATE_LISA",
    //         payload: {
    //             lisaResults,
    //             weights,
    //             colorScale: (dataParams.lisaColors||lisaResults.colors).map(c => hexToRgb(c)),
    //             cachedVariable: {
    //                 variable: dataParams.variable,
    //                 data: lisaData,
    //                 geoidOrder: storedGeojson[currentData].order
    //             }
    //         },
    //     });
    //   };
}
