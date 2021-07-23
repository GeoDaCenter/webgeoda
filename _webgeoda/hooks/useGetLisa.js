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
    dataset=false,
    variable=false,
    getScatterPlot=false
}) {
    const geoda = useContext(GeodaContext);
    const currentData = useSelector((state) => state.currentData);
    const storedGeojson = useSelector((state) => state.storedGeojson);
    const dataPresets = useSelector((state) => state.dataPresets);
    const columnData = useGetVariable({
        dataset,
        variable
    })

    const [data, setData] = useState({
        weights:{},
        lisaResults: {},
        lisaData: []
    });

    const dispatch = useDispatch();

    const getLisa = async (
        columnData,
        dataset,
        getScatterPlot=false
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
            let scatterPlotData = [];
            const standardizedVals = standardize(columnData);
            const spatialLags = await geoda.spatialLag(weights, standardizedVals);
            for (let i=0; i<columnData.length; i++){
                scatterPlotData.push({
                    x: columnData[i],
                    y: spatialLags[i],
                    cluster: lisaResults.clusters[i],
                    id: storedGeojson[geographyName].order[i]
                })
            }
            setData({ weights, lisaResults, scatterPlotData });
        } else {
            setData({ weights, lisaResults, lisaData:columnData });
        }
    }
    useEffect(() => {
        getLisa( 
            columnData,
            dataset||currentData,
            getScatterPlot
        )
    },[dataset, columnData, getScatterPlot])

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

  return data;
}
