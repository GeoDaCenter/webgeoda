import {
    parseColumnData,
    getUniqueVals,
    findTable,
    fixedScales,
    fixedBreakLabels,
} from "./data";

export const getBins = async ({
    geoda,
    dataParams,
    binData
}) => {

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

    return bins
}

export const getColorScale = ({
    dataParams,
    bins
}) => {

    let colorScaleLength = dataParams.categorical 
        ? bins.breaks.length
        : bins.breaks.length + 1;

    if (colorScaleLength < 3) colorScaleLength = 3;

    let colorScale = Array.isArray(dataParams.colorScale)
        ? dataParams.colorScale
        : dataParams.colorScale[colorScaleLength];

    if (dataParams.categorical && colorScaleLength !== bins.breaks.length) colorScale = colorScale.slice(0,bins.breaks.length);
    
    return colorScale
}

export const generateBins = async ({
    geoda,
    dataPresets,
    currentData,
    dataParams, 
    storedData,
    storedGeojson,
    cachedVariables
}) => {
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

    const binData = cachedVariables.hasOwnProperty(currentData) && 
            cachedVariables[currentData].hasOwnProperty(dataParams.variable)
        ? Object.values(cachedVariables[currentData][dataParams.variable])
        : dataParams.categorical 
        ? getUniqueVals(
            storedData[numeratorTable]?.data||storedGeojson[currentData].properties,
            dataParams)
        : parseColumnData({
            numeratorData: storedData[numeratorTable]?.data || storedGeojson[currentData].properties,
            denominatorData: storedData[denominatorTable]?.data || storedGeojson[currentData].properties,
            dataParams: dataParams,
            fixedOrder: storedGeojson[currentData].order
        });
    
    const bins = await getBins({
        geoda,
        dataParams,
        binData
    })
    
    const colorScale = getColorScale({
        dataParams,
        binData,
        bins
    })

    return {
        bins,
        colorScale,
        binData
    }
}

export const getLisaResults = async ({
    geoda,
    storedGeojson,
    currentData,
    dataParams,
    lisaData,
    dataset=false
}) => {    
    const weights = storedGeojson[dataset||currentData].weights[dataParams.weightsFunction||'getQueenWeights']
      ? storedGeojson[dataset||currentData].weights[dataParams.weightsFunction||'getQueenWeights']
      : (dataParams.weightsParams && dataParams.weightsFunction)
      ? await geoda[dataParams.weightsFunction](storedGeojson[dataset||currentData].id, ...dataParams.weightsParams)
      : await geoda[dataParams.weightsFunction||'getQueenWeights'](storedGeojson[dataset||currentData].id)

    const lisaResults = (dataParams.lisaParams && dataParams.lisaFunction)
      ? await geoda[dataParams.lisaFunction](weights, lisaData, ...dataParams.lisaParams)
      : await geoda[dataParams.lisaFunction||'localMoran'](weights, lisaData)

    return {
        weights,
        lisaResults
    }
    
}