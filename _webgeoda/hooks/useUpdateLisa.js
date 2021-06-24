import { useSelector, useDispatch } from "react-redux";

import {
  getColumnData,
  findTable
} from "@webgeoda/utils/data";

import {
  hexToRgb
} from "@webgeoda/utils/map";

import {
  getLisaResults
} from "@webgeoda/utils/geoda-helpers";

export default function useLoadData(geoda) {
  const currentData = useSelector((state) => state.currentData);
  const storedGeojson = useSelector((state) => state.storedGeojson);
  const storedData = useSelector((state) => state.storedData);
  const dataParams = useSelector((state) => state.dataParams);
  const mapParams = useSelector((state) => state.mapParams);
  const dataPresets = useSelector((state) => state.dataPresets);

  const dispatch = useDispatch();

  const updateLisa = async () => {
    
    if (!storedGeojson[currentData]) return;

    const numeratorTable = findTable(
      dataPresets.data,
      currentData,
      dataParams.numerator
    )
    
    const denominatorTable = findTable(
      dataPresets.data,
      currentData,
      dataParams.denominator
    )

    const lisaData = getColumnData({
        numeratorData: storedData[numeratorTable]?.data || storedGeojson[currentData].properties,
        denominatorData: storedData[denominatorTable]?.data || storedGeojson[currentData].properties,
        dataParams: dataParams,
        fixedOrder: storedGeojson[currentData].order
    });

    const { weights, lisaResults} = await getLisaResults({
        geoda,
        storedGeojson,
        currentData,
        dataParams,
        lisaData
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

  return [updateLisa];
}
