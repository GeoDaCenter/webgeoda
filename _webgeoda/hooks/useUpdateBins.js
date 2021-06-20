import { useSelector, useDispatch } from "react-redux";

import {
  getDataForBins,
  getUniqueVals,
  find,
  fixedScales,
  fixedBreakLabels,
} from "@webgeoda/utils/data"; //getVarId

export default function useLoadData(geoda) {
  const currentData = useSelector((state) => state.currentData);
  const storedGeojson = useSelector((state) => state.storedGeojson);
  const storedData = useSelector((state) => state.storedData);
  const dataParams = useSelector((state) => state.dataParams);
  const mapParams = useSelector((state) => state.mapParams);
  const dataPresets = useSelector((state) => state.dataPresets);
  
  const dispatch = useDispatch();

  const updateBins = async () => {
    
    if (!storedGeojson[currentData]) return;

    const numeratorTable = find(
      dataPresets.data,
      (o) => o.geojson === currentData
    )?.tables[dataParams.numerator]?.file;

    const denominatorTable = find(
      dataPresets.data,
      (o) => o.geojson === currentData
    )?.tables[dataParams.denominator]?.file;

    const binData = dataParams.categorical 
      ? getUniqueVals(
          storedData[numeratorTable]?.data||storedGeojson[currentData].properties,
          dataParams)
      : getDataForBins(
          storedData[numeratorTable]?.data || storedGeojson[currentData].properties,
          storedData[denominatorTable]?.data || storedGeojson[currentData].properties,
          dataParams);
    
    let bins = fixedScales[dataParams.fixedScale] || dataParams.fixedScale;

    if (!dataParams.fixedScale && !dataParams.categorical) {
      // calculate breaks
      let numberOfBins = Array.isArray(dataParams.colorscale)
        ? dataParams.colorscale.length
        : dataParams.numberOfBins || 5;

      const binParams =
        !dataParams.binning ||
        ["naturalBreaks", "quantileBreaks"].includes(dataParams.binning)
          ? [numberOfBins, binData]
          : [binData];

      const nb = await geoda[dataParams.binning || "naturalBreaks"](
        ...binParams
      );

      bins = {
        bins: fixedBreakLabels[dataParams.binning] || nb,
        breaks: nb,
      };
    }

    if (!dataParams.fixedScale && dataParams.categorical) {
      bins = {
        bins: binData,
        breaks: binData,
      }
    };

    let colorScaleLength = dataParams.categorical 
      ? binData.length
      : bins.breaks.length + 1;

    if (colorScaleLength < 3) colorScaleLength = 3;

    let colorScale = Array.isArray(dataParams.colorscale)
      ? dataParams.colorScale
      : dataParams.colorScale[colorScaleLength];
    
    if (dataParams.categorical && colorScaleLength !== binData.length) colorScale = colorScale.slice(0,binData.length);

    dispatch({
      type: "UPDATE_BINS",
      payload: {
        bins,
        colorScale,
      },
    });
  };

  return [updateBins];
}
