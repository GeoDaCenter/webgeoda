
import { useSelector, useDispatch } from 'react-redux';

import { getDataForBins } from '@webgeoda/utils/data'; //getVarId
import * as colors from '@webgeoda/utils/colors';

import { fitBounds } from '@math.gl/web-mercator';
import bbox from '@turf/bbox';

// Main data loader
// This functions asynchronously accesses the Geojson data and CSVs
//   then performs a join and loads the data into the store

// import { initialDataLoad, updateMap } from '@webgeoda/actions';

// import { colorScales, fixedScales, dataPresets, defaultTables, dataPresetsRedux, variablePresets, colors } from '../config';

export default function useLoadData(gdaProxy){
    const currentData = useSelector(state => state.currentData);
    const dispatch = useDispatch();

    const loadData = async (dataPresets) => {
        if (!gdaProxy.ready) await gdaProxy.init()  
        // const numeratorParams = datasetParams.tables[dataParams.numerator]
        // const denominatorParams = dataParams.denominator !== 'properties' ? datasetParams.tables[dataParams.denominator]||defaultTables[dataParams.denominator] : null

        // if ((storedData.hasOwnProperty(numeratorParams?.file)||dataParams.numerator === 'properties') && (storedData.hasOwnProperty(denominatorParams?.file)||dataParams.denominator !== 'properties')) return [numeratorParams.file, denominatorParams && denominatorParams.file]
        const firstLoadPromises = [
          gdaProxy.LoadGeojson(`/geojson/${dataPresets.data[0].geojson}`, dataPresets.data[0].id)
        //   numeratorParams && handleLoadData(numeratorParams),
        //   denominatorParams && handleLoadData(denominatorParams)
        ] 
    
        let [geojsonData] = await Promise.all(firstLoadPromises) //, numeratorData, denominatorData
        const bounds = bbox(geojsonData.data)
        const initialViewState = window !== undefined ? fitBounds({width: window.innerWidth,height: window.innerHeight,bounds: [[bounds[0],bounds[1]],[bounds[2], bounds[3]]]}) : null

        let binData = getDataForBins(
            geojsonData.properties,
            geojsonData.properties,
            dataPresets.variables[0]
        );
        
        let bins;
        
        if (dataPresets.variables[0].fixedScale === null || dataPresets.variables[0].fixedScale === undefined){
          // calculate breaks
          let nb = dataPresets.variables[0].binning === "natural breaks" || dataPresets.variables[0].binning === undefined ? 
            await gdaProxy.Bins.NaturalBreaks(dataPresets.variables[0].colorScale?.length || 5, binData) :
            await gdaProxy.Bins.Hinge15(6, binData)  
          bins = {
            bins: dataPresets.variables[0].binning === "natural breaks" || dataPresets.variables[0].binning === undefined   
                ?
                nb.bins 
                : 
                ['Lower Outlier','< 25%','25-50%','50-75%','>75%','Upper Outlier'],
            breaks: nb.breaks.slice(1,-1)
          }
        } else {
          bins = fixedScales[dataPresets.variables[0]?.fixedScale]
        }
        dispatch({
            type: 'INITIAL_LOAD',
            payload: {
                currentData: dataPresets.data[0].geojson,
                currentTable: {
                    numerator:'properties',
                    denominator:'properties',
                },
                storedGeojson: {
                    [dataPresets.data[0].geojson]:geojsonData
                },
                mapParams: {
                    bins,
                    colorScale: dataPresets.variables[0].colorScale || colors.colorbrewer.YlGnBu[5]
                },
                variableParams: dataPresets.variables[0],
                initialViewState,
                id:dataPresets.data[0].id

            }
        })
    }

    return [
        loadData
    ]
}