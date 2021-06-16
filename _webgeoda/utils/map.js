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
  if (val === null) return [0, 0, 0, 0];
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

  const getTable = (i, predicate) => {
    if (!state.dataParams[predicate]) return {};

    if (
      state.dataParams[predicate] === "properties" ||
      (!state.dataParams.nIndex && !state.dataParams.nProperty)
    ) {
      return state.storedGeojson[state.currentData].data.features[i].properties;
    } else {
      // todo fallback table
      const currentTables = find(
        state.dataPresets.data,
        (o) => o.geojson === state.currentData
      )?.tables;
      const tableName = currentTables[state.dataParams[predicate]]?.file;
      const id =
        state.storedGeojson[state.currentData].data.features[i].properties[
          state.currentId
        ];
      return tableName && state.storedData[tableName].data[id];
    }
  };
  const colorType = state.dataParams.binning === "LISA" ? 'LISA' : state.dataParams.categorical ? 'categorical' : 'breaks'
  
  const getColor = colorFunctions[colorType]

  let tempParams = { ...state.dataParams };

  if (!tempParams.nProperty && !tempParams.nIndex) {
    tempParams.nProperty = tempParams.numerator;
    tempParams.numerator = "properties";
  }

  if (!tempParams.dProperty && !tempParams.dIndex) {
    tempParams.dProperty = tempParams.denominator;
    tempParams.denominator = "properties";
  }

  if (state.mapParams.vizType === "cartogram") {
    for (let i = 0; i < state.storedCartogramData.length; i++) {
      const currGeoid =
        state.storedGeojson[state.currentData].indices.indexOrder[
          state.storedCartogramData[i].properties.id
        ];

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
        returnObj[currGeoid] = { color: [0, 0, 0, 0] };
        continue;
      }

      returnObj[currGeoid] = {
        ...state.storedCartogramData[i],
        color,
      };
    }
    return {
      params: getVarId(state.currentData, tempParams, state.mapParams),
      data: returnObj,
    };
  }

  for (
    let i = 0;
    i < state.storedGeojson[state.currentData].data.features.length;
    i++
  ) {
    const tempVal = dataFn(
      getTable(i, "numerator"),
      getTable(i, "denominator"),
      tempParams
    );

    const color = getColor(
      tempVal,
      state.mapParams.bins.breaks,
      state.mapParams.colorScale,
      state.mapParams.mapType,
      tempParams.numerator,
      state.storedLisaData,
      state.storedGeojson,
      state.currentData,
      state.storedGeojson[state.currentData].data.features[i].properties[
        state.currentId
      ],
      mapFn
    );
    
    const height = getHeight(tempVal, tempParams);

    if (color === null) {
      returnObj[
        state.storedGeojson[state.currentData].data.features[i].properties[
          state.currentId
        ]
      ] = { color: [0, 0, 0, 0], height: 0 };
      continue;
    }

    returnObj[
      state.storedGeojson[state.currentData].data.features[i].properties[
        state.currentId
      ]
    ] = { color, height };
  }

  return {
    params: getVarId(state.currentData, tempParams, state.mapParams),
    data: returnObj,
  };
};
