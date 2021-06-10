
import { useSelector, useDispatch } from 'react-redux';

import { getDataForBins, find } from '@webgeoda/utils/data'; //getVarId
import * as colors from '@webgeoda/utils/colors';

export default function useLoadData(geoda){
  const currentData = useSelector(state => state.currentData)
  const storedGeojson = useSelector(state => state.storedGeojson)
  const storedData = useSelector(state => state.storedData)
  const dataParams = useSelector(state => state.dataParams)
  const mapParams = useSelector(state => state.mapParams)
  const dataPresets = useSelector(state => state.dataPresets);

  const dispatch = useDispatch();
  
  const updateBins = async () => {
      if (!(storedGeojson[currentData])) return;
      const numeratorTable = find(dataPresets.data, o => o.geojson === currentData)?.tables[dataParams.numerator]?.file
      const denominatorTable = find(dataPresets.data, o => o.geojson === currentData)?.tables[dataParams.denominator]?.file
      let binData = getDataForBins(
        storedData[numeratorTable]?.data || storedGeojson[currentData].properties,
        storedData[denominatorTable]?.data || storedGeojson[currentData].properties,
        dataParams
      );
      
      let bins;
      
      if (!(dataParams.fixedScale)){
        // calculate breaks
        
        const binParams = !dataParams.binning || ['naturalBreaks','quantileBreaks'].includes(dataParams.binning) 
          ? [dataParams.colorScale?.length || 5, binData]
          : [binData]

        const nb = await geoda[dataParams.binning || 'naturalBreaks'](...binParams)
        
        bins = {
          bins: dataParams.binning === "natural breaks" || dataParams.binning === undefined   
              ?
              nb
              : 
              ['Lower Outlier','< 25%','25-50%','50-75%','>75%','Upper Outlier'],
          breaks: nb
        }
      } else {
        bins = fixedScales[dataParams?.fixedScale]
      }
      
      dispatch({
          type:'UPDATE_BINS',
          payload: {
              bins: {
                  bins: mapParams.mapType === 'natural_breaks' ? bins.bins : ['Lower Outlier','< 25%','25-50%','50-75%','>75%','Upper Outlier'],
                  breaks: bins.breaks
              },
                  colorScale: dataParams.colorScale
          }
      })
  }

  return [
      updateBins
  ]
}