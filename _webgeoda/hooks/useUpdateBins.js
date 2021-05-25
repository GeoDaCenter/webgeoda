
import { useSelector, useDispatch } from 'react-redux';

import { getDataForBins } from '@webgeoda/utils/data'; //getVarId
import * as colors from '@webgeoda/utils/colors';

export default function useLoadData(gdaProxy){

    const currentData = useSelector(state => state.currentData)
    const storedGeojson = useSelector(state => state.storedGeojson)
    const dataParams = useSelector(state => state.dataParams)
    const mapParams = useSelector(state => state.mapParams)

    const dispatch = useDispatch();

    const updateBins = async () => {
        if (!gdaProxy.ready) await gdaProxy.init()
        if (!(storedGeojson[currentData])) return;
        let binData = getDataForBins(
            storedGeojson[currentData].properties,
            storedGeojson[currentData].properties,
            dataParams
        );
        
        let bins;
        
        if (!(dataParams.fixedScale)){
          // calculate breaks
          let nb = dataParams.binning === "natural breaks" || dataParams.binning === undefined ? 
            await gdaProxy.Bins.NaturalBreaks(dataParams.colorScale?.length || 5, binData) :
            await gdaProxy.Bins.Hinge15(6, binData)  
          bins = {
            bins: dataParams.binning === "natural breaks" || dataParams.binning === undefined   
                ?
                nb.bins 
                : 
                ['Lower Outlier','< 25%','25-50%','50-75%','>75%','Upper Outlier'],
            breaks: nb.breaks.slice(1,-1)
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