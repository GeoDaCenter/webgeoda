import { dataFn, getVarId, find } from "./data";

export const getCartogramCenter = (cartogramData) => {
  let x = 0;
  let y = 0;
  const keys = Object.keys(cartogramData);
  const dataLength = keys.length;

  for (let i = 0; i < dataLength; i++) {
    x += cartogramData[keys[i]]["position"][0];
    y += cartogramData[keys[i]]["position"][1];
  }
  return [x / dataLength, y / dataLength];
};

function mapFn(val, bins, colors) {
  if (val === null  || val === undefined || isNaN(val)) return [0, 0, 0, 0];
  for (let i = 0; i < bins.length; i++) {
    if (val < bins[i]) {
      return colors[i];
    }
  }
  return colors[colors.length - 1];
}

// utils
const getSimpleColor = (
  value,
  bins,
  colorScale,
  mapType,
  numerator,
  storedLisaData,
  storedGeojson,
  currentData,
  GEOID,
  mapFn
) => mapFn(value, bins, colorScale, mapType, numerator);

const geoGeojsonKeyList = (object, prop) => {
  let returnArray = [];
  for (let i=0; i<object.features.length; i++) returnArray.push(object.features[i].properties[prop])
  return returnArray
}

const getLisaColor = (
  value,
  bins,
  colorScale,
  mapType,
  numerator,
  storedLisaData,
  storedGeojson,
  currentData,
  GEOID
) =>
  colorScale[
    storedLisaData[storedGeojson[currentData].indices["geoidOrder"][GEOID]]
  ] || [240, 240, 240];

const getCategoricalColor = (
  value,
  bins,
  colorScale
) => colorScale[bins.indexOf(value)];

const colorFunctions = {
  'LISA': getLisaColor,
  'breaks': getSimpleColor,
  'categorical': getCategoricalColor
}


const getHeight = (val, dataParams) =>
  val *
  (dataParams.scale3D /
    (dataParams.nType === "time-series" && dataParams.nRange === null
      ? dataParams.nIndex / 10
      : 1));

export const generateMapData = (state) => {
  if (!state.storedGeojson[state.currentData]) return { data: [], params: [] };

  if (
    !state.mapParams.bins.hasOwnProperty("bins") ||
    (state.mapParams.mapType !== "lisa" && !state.mapParams.bins.breaks)
  ) {
    return state;
  }

  let returnObj = {};
  let i = 0;

  const getTable = (id, predicate, table) => {
    if (!state.dataParams[predicate]) return {};

    if (
      state.dataParams[predicate] === "properties" ||
      (!state.dataParams.nIndex && !state.dataParams.nProperty)
    ) {
      return state.storedGeojson[state.currentData].properties[id];
    } else {
      // todo fallback table
      return state.storedData[table]?.data[id];
    }
  };
  
  const colorType = state.dataParams.binning === "LISA" ? 'LISA' : state.dataParams.categorical ? 'categorical' : 'breaks'
  
  const getColor = colorFunctions[colorType]

  let tempParams = { ...state.dataParams };

  const idList = state.currentData.includes('tiles') 
  ? Object.keys(state.storedData[numeratorTable].data)
  : state.storedGeojson[state.currentData].order

  for (
    let i = 0;
    i < idList.length;
    i++
  ) {
    const tempVal = dataFn(
      getTable(idList[i], "numerator", numeratorTable),
      getTable(idList[i], "denominator", denominatorTable),
      tempParams
    );
    const color = isNaN(tempVal) || tempVal === null || tempVal === undefined
      ? [0,0,0,0]
      : getColor(
          tempVal,
          state.mapParams.bins.breaks,
          state.mapParams.colorScale,
          state.mapParams.mapType,
          tempParams.numerator,
          state.storedLisaData,
          state.storedGeojson,
          state.currentData,
          idList[i],
          mapFn
        );

    const height = getHeight(tempVal, tempParams);

    if (color === null) {
      returnObj[idList[i]] = { color: [0, 0, 0, 0], height: 0 };
      continue;
    }
    returnObj[idList[i]] = { color, height };
  }
  return {
    params: getVarId(state.currentData, tempParams, state.mapParams),
    data: returnObj,
  };
};

export const getMapData = ({
  currentData,
  dataParams,
  mapParams,
  variableData,
  storedGeojson,
  storedLisaData
}) => {
  let returnObj = {};
  const colorType = dataParams.binning === "LISA" ? 'LISA' : dataParams.categorical ? 'categorical' : 'breaks'
  const getColor = colorFunctions[colorType]

  const idList = currentData.includes('tiles') || !dataParams.lisa
    ? Object.keys(variableData)
    : storedGeojson[currentData].order
  
  for (
    let i = 0;
    i < idList.length;
    i++
  ) {
    const val = variableData[idList[i]]
    const color = (isNaN(val) && typeof val !== 'string') || val === null || val === undefined
      ? [0,0,0,0]
      : getColor(
          val,
          mapParams.bins.breaks,
          mapParams.colorScale,
          mapParams.mapType,
          dataParams.numerator,
          storedLisaData,
          storedGeojson,
          currentData,
          val,
          mapFn
        );

    const height = getHeight(val, dataParams);

    if (color === null) {
      returnObj[idList[i]] = { color: [0, 0, 0, 0], height: 0 };
      continue;
    }
    returnObj[idList[i]] = { color, height };
  }
  return {
    params: getVarId(currentData, dataParams, mapParams),
    data: returnObj,
  };

}

export const hexToRgb = (hex) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
}