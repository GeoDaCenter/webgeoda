import { useSelector, useDispatch } from "react-redux";
import { useContext, useEffect } from "react";
import { GeodaContext } from "../contexts";

import {
  parseColumnData,
  findTable,
  getVarId
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


export default function useLisa() {
    const geoda = useContext(GeodaContext);
    const currentData = useSelector((state) => state.currentData);
    const storedGeojson = useSelector((state) => state.storedGeojson);
    const storedData = useSelector((state) => state.storedData);
    const dataParams = useSelector((state) => state.dataParams);
    const dataPresets = useSelector((state) => state.dataPresets);
    const cachedVariables = useSelector((state) => state.cachedVariables);

    const dispatch = useDispatch();

    const getLisa = async ({
        dataParams,
        geographyName=currentData,
    }) => {
        if (!storedGeojson[geographyName]) return;
        // TODO: load data if missing
        const numeratorTable = findTable(
            dataPresets.data,
            geographyName,
            dataParams.numerator
        )
        
        const denominatorTable = findTable(
            dataPresets.data,
            geographyName,
            dataParams.denominator
        )

        const lisaData = cachedVariables.hasOwnProperty(currentData) && 
                cachedVariables[currentData].hasOwnProperty(dataParams.variable)
            ? Object.values(cachedVariables[currentData][dataParams.variable])
            : parseColumnData({
            numeratorData: dataParams.numerator === "properties" ? storedGeojson[geographyName].properties : storedData[numeratorTable]?.data,
            denominatorData: dataParams.numerator === "properties" ? storedGeojson[geographyName].properties : storedData[denominatorTable]?.data,
            dataParams: dataParams,
            fixedOrder: storedGeojson[geographyName].order
        })
        //console.log(lisaData)

        const { weights, lisaResults } = await getLisaResults({
            geoda,
            storedGeojson,
            currentData: geographyName,
            dataParams,
            lisaData
        })

            let scatterPlotData = [];
            let scatterPlotDataStan = [];
            const standardizedVals = standardize(lisaData);
            const spatialLags = await geoda.spatialLag(weights, lisaData);
            const spatialLagsStandardized = await geoda.spatialLag(weights, standardizedVals);
            for (let i=0; i<lisaData.length; i++){
                scatterPlotData.push({
                    x: lisaData[i],
                    y: spatialLags[i],
                    cluster: lisaResults.clusters[i],
                    id: storedGeojson[geographyName].order[i]
                })
            }
            for (let i=0; i<lisaData.length; i++){
                scatterPlotDataStan.push({
                    x: standardizedVals[i],
                    y: spatialLagsStandardized[i],
                    cluster: lisaResults.clusters[i],
                    id: storedGeojson[geographyName].order[i]
            })
        }
            return { weights, lisaResults, scatterPlotData, scatterPlotDataStan};
    }

    const cacheLisa = async ({
        dataParams,
        geographyName=currentData,
        getScatterPlot=true
    }) => {
        const lisaResults = await getLisa ({
            dataParams,
            geographyName: currentData,
        })
        dispatch({
            type: "CACHE_SCATTERPLOT_LISA",
            payload: {
                data: lisaResults,
                id: getVarId(geographyName, dataParams)
            }
        });
    }
  const updateLisa = async () => {

    const { weights, lisaResults, scatterPlotData, scatterPlotDataStan} = await getLisa ({
        geographyName: currentData,
        dataParams
    })

    dispatch({
        type: "UPDATE_LISA",
        payload: {
            lisaResults,
            weights,
            colorScale: (dataParams.lisaColors||lisaResults.colors).map(c => hexToRgb(c)),
            cachedVariable: {
                variable: dataParams.variable,
                data: lisaData,
                geoidOrder: storedGeojson[currentData].order
            }
        },
    });
  };

  return [getLisa, cacheLisa, updateLisa];
}
