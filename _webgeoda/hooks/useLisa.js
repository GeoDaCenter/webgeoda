import { useSelector, useDispatch } from "react-redux";
import { useContext } from "react";
import { GeodaContext } from "../../pages/map";

import {
  getColumnData,
  findTable
} from "../utils/data";

import {
  hexToRgb
} from "../utils/map";

import {
  getLisaResults
} from "../utils/geoda-helpers";

export default function useLisa() {
    const geoda = useContext(GeodaContext);
    const currentData = useSelector((state) => state.currentData);
    const storedGeojson = useSelector((state) => state.storedGeojson);
    const storedData = useSelector((state) => state.storedData);
    const dataParams = useSelector((state) => state.dataParams);
    const dataPresets = useSelector((state) => state.dataPresets);

    const dispatch = useDispatch();

    const getLisa = async ({
        dataParams,
        geographyName=currentData,
        getScatterPlot=false
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

        const lisaData = getColumnData({
            numeratorData: storedData[numeratorTable]?.data || storedGeojson[geographyName].properties,
            denominatorData: storedData[denominatorTable]?.data || storedGeojson[geographyName].properties,
            dataParams: dataParams,
            fixedOrder: storedGeojson[geographyName].order
        })

        const { weights, lisaResults } = await getLisaResults({
            geoda,
            storedGeojson,
            currentData: geographyName,
            dataParams,
            lisaData
        })

        if (getScatterPlot) {
            let scatterPlotData = [];
            for (let i=0; i<storedGeojson[geographyName].order; i++){
                scatterPlotData.push({
                    x: lisaData[i],
                    y: lisaResults.lisaValues[i],
                    cluster: lisaResults.clusters[i]
                })
            }
            return { weights, lisaResults, scatterPlotData};
        }

        return { weights, lisaResults }
    }

  const updateLisa = async () => {
    
    const { weights, lisaResults } = await getLisa ({
        geographyName: currentData,
        dataParams
    })

    dispatch({
        type: "UPDATE_LISA",
        payload: {
            lisaResults,
            weights,
            colorScale: (dataParams.lisaColors||lisaResults.colors).map(c => hexToRgb(c)),
        },
    });
  };

  return [getLisa, updateLisa];
}
