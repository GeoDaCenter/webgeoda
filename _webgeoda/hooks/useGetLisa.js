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
        dataset: dataset||currentData,
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
        if (!Object.keys(columnData).length || !(dataset in storedGeojson)) return;
        
        const variableSpec = find(
            dataPresets.variables,
            (o) => o.variable === variable
        )

        const { weights, lisaResults } = await getLisaResults({
            geoda,
            storedGeojson,
            currentData: dataset,
            dataParams: variableSpec,
            lisaData: Object.values(columnData),
            dataset
        })

        if (getScatterPlot) {
            let scatterPlotDataStan = [];
            const standardizedVals = standardize(Object.values(columnData));
            const spatialLags = await geoda.spatialLag(weights, standardizedVals);
            for (let i=0; i<standardizedVals.length; i++){
                scatterPlotDataStan.push({
                    x: standardizedVals[i],
                    y: spatialLags[i],
                    cluster: lisaResults.clusters[i],
                    id: storedGeojson[currentData].order[i]
                })
            }
            setData({ weights, lisaResults, scatterPlotDataStan, lisaData:columnData, spatialLags });
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
    },[dataset, Object.keys(columnData).length, getScatterPlot, Object.keys(storedGeojson).length])

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
