import { useSelector, useDispatch } from "react-redux";
import { useContext, useEffect } from "react";
import { GeodaContext } from "@webgeoda/contexts";

import {
  generateBins
} from "../utils/geoda-helpers";

export default function useUpdateBins() {
  const geoda = useContext(GeodaContext);
  const currentData = useSelector((state) => state.currentData);
  const storedGeojson = useSelector((state) => state.storedGeojson);
  const storedData = useSelector((state) => state.storedData);
  const dataParams = useSelector((state) => state.dataParams);
  const dataPresets = useSelector((state) => state.dataPresets);
  const cachedVariables = useSelector((state) => state.cachedVariables);
  
  const dispatch = useDispatch();

  const updateBins = async () => {
    if (!storedGeojson[currentData]) return;
    
    const {bins, colorScale, binData} = await generateBins({
      geoda,
      dataPresets,
      currentData,
      dataParams, 
      storedData,
      storedGeojson,
      cachedVariables
    })

    if (!bins) return;

    dispatch({
      type: "UPDATE_BINS",
      payload: {
        bins,
        colorScale,
        cachedVariable: {
          variable: dataParams.variable,
          data: binData,
          geoidOrder: storedGeojson[currentData].order
        }
      },
    });
  };

  return [updateBins];
}
