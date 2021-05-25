import { dataFn, getVarId } from './data';

export const getCartogramCenter = (cartogramData) => {
    let x = 0;
    let y = 0;
    const keys = Object.keys(cartogramData)
    const dataLength = keys.length

    for (let i=0; i<dataLength; i++) {
        x += cartogramData[keys[i]]['position'][0];
        y += cartogramData[keys[i]]['position'][1];
    };
    return [x/dataLength, y/dataLength]
}

function mapFn(val, bins, colors){
    if (val === null) return [0,0,0,0]
    for (let i=0; i<bins.length; i++) {
      if (val < bins[i]) {
        return colors[i]
      }
    }
    return colors[colors.length-1];
}

// utils
const getSimpleColor = (value, bins, colorScale, mapType, numerator, storedLisaData, storedGeojson, currentData, GEOID, mapFn) => mapFn(value, bins, colorScale, mapType, numerator);
const getLisaColor = (value, bins, colorScale, mapType, numerator, storedLisaData, storedGeojson, currentData, GEOID) => colorScale[storedLisaData[storedGeojson[currentData].indices['geoidOrder'][GEOID]]]||[240,240,240]
const getColorFunction = (mapType) => mapType === 'lisa' ? getLisaColor : getSimpleColor;
const getHeight = (val, dataParams) => val*(dataParams.scale3D/((dataParams.nType === "time-series" && dataParams.nRange === null) ? (dataParams.nIndex)/10 : 1));

export const generateMapData = (state) => {

    if (!(state.storedGeojson[state.currentData])) return { data: [], params: []}

    if (!state.mapParams.bins.hasOwnProperty("bins") || (state.mapParams.mapType !== 'lisa' && !state.mapParams.bins.breaks)) {
        return state
    };

    let returnObj = {};
    let i = 0;

    const getTable = (i, predicate) => {
        if (state.dataParams[predicate] === 'properties' || (!(state.dataParams.nIndex)&&!(state.dataParams.nProperty))) {
            return state.storedGeojson[state.currentData].data.features[i].properties 
        } else {
            try {
                return state.storedData[dataPresetsRedux[state.currentData].tables[state.dataParams[predicate]].file].data[state.storedGeojson[state.currentData].data.features[i].properties[state.currentId]]
            } catch {
                return state.storedData[defaultTables[dataPresetsRedux[state.currentData].geography][state.dataParams[predicate]].file].data[state.storedGeojson[state.currentData].data.features[i].properties[state.currentId]];
            }
        }
    }

    const getColor = getColorFunction(state.mapParams.mapType)


    let tempParams = {...state.dataParams}

    if (!(tempParams.nProperty)&&!(tempParams.nIndex)) {
        tempParams.nProperty = tempParams.numerator
        tempParams.numerator = 'properties'
    }

    if (!(tempParams.dProperty)&&!(tempParams.dIndex)) {
        tempParams.dProperty = tempParams.denominator
        tempParams.denominator = 'properties'
    }

    if (state.mapParams.vizType === "cartogram"){
        for (let i=0; i<state.storedCartogramData.length; i++){
            const currGeoid = state.storedGeojson[state.currentData].indices.indexOrder[state.storedCartogramData[i].properties.id]

            const color = getColor(
                state.storedCartogramData[i].value, 
                state.mapParams.bins.breaks, 
                state.mapParams.colorScale, 
                state.mapParams.mapType, 
                tempParams.numerator, 
                state.storedLisaData, 
                state.storedGeojson, 
                state.currentData, 
                state.storedGeojson[state.currentData].properties[currGeoid],
                mapFn
            );
            if (color === null) {
                returnObj[currGeoid] = {color:[0,0,0,0]}
                continue;
            }
    
            returnObj[currGeoid] = {
                ...state.storedCartogramData[i],
                color
            }
        }
        return {
            params: getVarId(state.currentData, tempParams, state.mapParams),
            data: returnObj
        }
    }
    console.log(state.mapParams.bins.breaks)
    for (let i=0; i<state.storedGeojson[state.currentData].data.features.length; i++){
        const tempVal = dataFn(getTable(i, 'numerator'), getTable(i, 'denominator'), tempParams)

        const color = getColor(
            tempVal, 
            state.mapParams.bins.breaks, 
            state.mapParams.colorScale, 
            state.mapParams.mapType, 
            tempParams.numerator, 
            state.storedLisaData, 
            state.storedGeojson, 
            state.currentData, 
            state.storedGeojson[state.currentData].data.features[i].properties[state.currentId],
            mapFn
        );

        const height = getHeight(tempVal, tempParams);

        if (color === null) {
            returnObj[state.storedGeojson[state.currentData].data.features[i].properties[state.currentId]] = {color:[0,0,0,0],height:0}
            continue;
        }

        returnObj[state.storedGeojson[state.currentData].data.features[i].properties[state.currentId]] = {color,height}
    }
    
    return {
        params: getVarId(state.currentData, tempParams, state.mapParams),
        data: returnObj
    }
};