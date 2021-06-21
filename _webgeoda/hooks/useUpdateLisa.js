import { useSelector, useDispatch } from "react-redux";

import {
  getDataForBins,
  find,
} from "@webgeoda/utils/data";

import {
  hexToRgb
} from "@webgeoda/utils/map";

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

    const numeratorTable = find(
      dataPresets.data,
      (o) => o.geojson === currentData
    )?.tables[dataParams.numerator]?.file;

    const denominatorTable = find(
      dataPresets.data,
      (o) => o.geojson === currentData
    )?.tables[dataParams.denominator]?.file;

    const lisaData = getDataForBins(
        storedData[numeratorTable]?.data || storedGeojson[currentData].properties,
        storedData[denominatorTable]?.data || storedGeojson[currentData].properties,
        dataParams,
        storedGeojson[currentData].order
    );
    
    const weights = storedGeojson[currentData].weights[dataParams.weightsFunction||'getQueenWeights']
      ? storedGeojson[currentData].weights[dataParams.weightsFunction||'getQueenWeights']
      : (dataParams.weightsParams && dataParams.weightsFunction)
      ? await geoda[dataParams.weightsFunction](storedGeojson[currentData].id, ...dataParams.weightsParams)
      : await geoda[dataParams.weightsFunction||'getQueenWeights'](storedGeojson[currentData].id)

    const lisaResults = (dataParams.lisaParams && dataParams.lisaFunction)
      ? await geoda[dataParams.lisaFunction](weights, lisaData, ...dataParams.lisaParams)
      : await geoda[dataParams.lisaFunction||'localMoran'](weights, lisaData)
    
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
