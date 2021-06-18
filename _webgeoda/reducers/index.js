import { INITIAL_STATE } from "@webgeoda/constants/defaults";

import {
  mapFnNb,
  mapFnHinge,
  dataFn,
  getVarId,
  shallowEqual,
  find,
} from "@webgeoda/utils/data";

import {
  formatWidgetData
} from '@webgeoda/utils/widgets';

import { getCartogramCenter, generateMapData } from "@webgeoda/utils/map";
import { generateReport, parseTooltipData } from "@webgeoda/utils/summarize";

import { dataPresets } from "../../map-config";
const [defaultTables, dataPresetsRedux, tooltipTables] = [{}, {}, []];

export default function reducer(state = INITIAL_STATE, action) {
  // console.log(action)
  switch (action.type) {
    case "INITIAL_LOAD": {
      const dataParams = {
        ...state.dataParams,
        ...action.payload.variableParams,
      };
      const mapParams = {
        ...state.mapParams,
        ...action.payload.mapParams,
      };
      const storedData = {
        ...state.storedData,
        ...action.payload.storedData,
      };

      const storedGeojson = {
        ...state.storedGeojson,
        ...action.payload.storedGeojson,
      };

      return {
        ...state,
        currentData: action.payload.currentData,
        storedGeojson,
        storedData,
        dataParams,
        mapParams,
        initialViewState:
          action.payload.viewState !== null
            ? action.payload.initialViewState
            : null,
        currentId: action.payload.id,
      };
    }
    case "CHANGE_VARIABLE": {
      const dataParams = find(
        dataPresets.variables,
        (o) => o.variable === action.payload
      );
      return {
        ...state,
        dataParams,
      };
    }
    case "UPDATE_BINS": {
      const mapParams = {
        ...state.mapParams,
        ...action.payload,
      };
      return {
        ...state,
        mapParams,
      };
    }
    case "ADD_TABLES": {
      const storedData = {
        ...state.storedData,
        ...action.payload,
      };

      return {
        ...state,
        storedData,
      };
    }
    case "ADD_GEOJSON": {
      const storedGeojson = {
        ...state.storedGeojson,
        ...action.payload.data,
      };

      return {
        ...state,
        storedGeojson,
      };
    }
    case "UPDATE_MAP": {
      return {
        ...state,
        mapData: generateMapData(state),
      };
    }
    case "SET_STORED_LISA_DATA": {
      return {
        ...state,
        storedLisaData: action.payload.data,
        mapData: generateMapData({
          ...state,
          storedLisaData: action.payload.data,
        }),
      };
    }
    case "SET_STORED_CARTOGRAM_DATA": {
      return {
        ...state,
        mapData: generateMapData({
          ...state,
          storedCartogramData: action.payload.data,
        }),
        storedCartogramData: action.payload.data,
      };
    }
    case "SET_CURRENT_DATA": {
      const currentTable = {
        numerator:
          state.dataParams.numerator === "properties"
            ? "properties"
            : dataPresetsRedux[state.currentData].tables.hasOwnProperty(
                state.dataParams.numerator
              )
            ? dataPresetsRedux[state.currentData].tables[
                state.dataParams.numerator
              ].file
            : defaultTables[dataPresetsRedux[state.currentData].geography][
                state.dataParams.numerator
              ].file,
        denominator:
          state.dataParams.denominator === "properties"
            ? "properties"
            : dataPresetsRedux[state.currentData].tables.hasOwnProperty(
                state.dataParams.denominator
              )
            ? dataPresetsRedux[state.currentData].tables[
                state.dataParams.denominator
              ].file
            : defaultTables[dataPresetsRedux[state.currentData].geography][
                state.dataParams.denominator
              ].file,
      };

      return {
        ...state,
        currentData: action.payload.data,
        selectionKeys: [],
        selectionNaes: [],
        sidebarData: {},
        currentTable,
      };
    }
    case "SET_VARIABLE_PARAMS": {
      let dataParams = {
        ...state.dataParams,
        ...action.payload.params,
      };

      const currentTable = {
        numerator:
          dataParams.numerator === "properties"
            ? "properties"
            : dataPresetsRedux[state.currentData].tables.hasOwnProperty(
                dataParams.numerator
              )
            ? dataPresetsRedux[state.currentData].tables[dataParams.numerator]
                .file
            : defaultTables[dataPresetsRedux[state.currentData].geography][
                dataParams.numerator
              ].file,
        denominator:
          dataParams.denominator === "properties"
            ? "properties"
            : dataPresetsRedux[state.currentData].tables.hasOwnProperty(
                dataParams.denominator
              )
            ? dataPresetsRedux[state.currentData].tables[dataParams.denominator]
                .file
            : defaultTables[dataPresetsRedux[state.currentData].geography][
                dataParams.denominator
              ].file,
      };

      if (state.dataParams.zAxisParams !== null) {
        dataParams.zAxisParams.nIndex = dataParams.nIndex;
        dataParams.zAxisParams.dIndex = dataParams.dIndex;
      }

      if (dataParams.nType === "time-series" && dataParams.nIndex === null) {
        dataParams.nIndex = state.storedIndex;
        dataParams.nRange = state.storedRange;
      }
      if (dataParams.dType === "time-series" && dataParams.dIndex === null) {
        dataParams.dIndex = state.storedIndex;
        dataParams.dRange = state.storedRange;
      }

      return {
        ...state,
        storedIndex:
          dataParams.nType === "characteristic" &&
          state.dataParams.nType === "time-series"
            ? state.dataParams.nIndex
            : state.storedIndex,
        storedRange:
          dataParams.nType === "characteristic" &&
          state.dataParams.nType === "time-series"
            ? state.dataParams.nRange
            : state.storedRange,
        dataParams,
        mapData:
          state.mapParams.binMode !== "dynamic" &&
          state.mapParams.mapType !== "lisa" &&
          shallowEqual(state.dataParams, dataParams)
            ? generateMapData({ ...state, dataParams })
            : state.mapData,
        currentTable,
        tooltipContent: {
          x: state.tooltipContent.x,
          y: state.tooltipContent.y,
          data: state.tooltipContent.geoid
            ? parseTooltipData(state.tooltipContent.geoid, state)
            : state.tooltipContent.data,
          geoid: state.tooltipContent.geoid,
        },
        sidebarData: state.selectionKeys.length
          ? generateReport(
              state.selectionKeys,
              state,
              dataPresetsRedux,
              defaultTables
            )
          : state.sidebarData,
      };
    }
    case "SET_VARIABLE_PARAMS_AND_DATASET": {
      const dataParams = {
        ...state.dataParams,
        ...action.payload.params.params,
      };

      const mapParams = {
        ...state.mapParams,
        ...action.payload.params.dataMapParams,
      };

      const currentTable = {
        numerator:
          dataParams.numerator === "properties"
            ? "properties"
            : dataPresetsRedux[
                action.payload.params.dataset
              ].tables.hasOwnProperty(dataParams.numerator)
            ? dataPresetsRedux[action.payload.params.dataset].tables[
                dataParams.numerator
              ].file
            : defaultTables[
                dataPresetsRedux[action.payload.params.dataset].geography
              ][dataParams.numerator].file,
        denominator:
          dataParams.denominator === "properties"
            ? "properties"
            : dataPresetsRedux[
                action.payload.params.dataset
              ].tables.hasOwnProperty(dataParams.denominator)
            ? dataPresetsRedux[action.payload.params.dataset].tables[
                dataParams.denominator
              ].file
            : defaultTables[
                dataPresetsRedux[action.payload.params.dataset].geography
              ][dataParams.denominator].file,
      };

      return {
        ...state,
        dataParams,
        mapParams,
        currentTable,
        selectionKeys: [],
        selectionIndex: [],
        currentData: action.payload.params.dataset,
      };
    }
    case "SET_PANELS": {
      let panelState = {
        ...state.panelState,
        ...action.payload.params,
      };
      return {
        ...state,
        panelState,
      };
    }
    case "UPDATE_SELECTION": {
      let selectionKeys = [...state.selectionKeys];

      const properties = state.storedGeojson[state.currentData].properties;
      const geography = dataPresetsRedux[state.currentData].geography;

      if (!properties || !geography) return state;

      if (action.payload.type === "update") {
        selectionKeys = [action.payload.geoid];
      }
      if (action.payload.type === "append") {
        selectionKeys.push(action.payload.geoid);
      }
      if (action.payload.type === "bulk-append") {
        for (let i = 0; i < action.payload.geoid.length; i++) {
          if (selectionKeys.indexOf(action.payload.geoid[i]) === -1)
            selectionKeys.push(action.payload.geoid[i]);
        }
      }
      if (action.payload.type === "remove") {
        selectionKeys.splice(selectionKeys.indexOf(action.payload.geoid), 1);
      }

      const currCaseData =
        dataPresetsRedux[state.currentData].tables[state.chartParams.table]
          ?.file ||
        defaultTables[dataPresetsRedux[state.currentData].geography][
          state.chartParams.table
        ].file;

      const additionalParams = {
        geoid: selectionKeys,
        populationData: state.chartParams.populationNormalized
          ? selectionKeys.map((key) => properties[key].population)
          : [],
        name:
          geography === "County"
            ? selectionKeys.map(
                (key) =>
                  properties[key].NAME + ", " + properties[key].state_abbr
              )
            : selectionKeys.map((key) => properties[key].name),
      };

      return {
        ...state,
        selectionKeys,
        selectionNames: additionalParams.name,
        chartData: getDataForCharts(
          state.storedData[currCaseData],
          state.dates,
          additionalParams
        ),
        sidebarData: generateReport(
          selectionKeys,
          state,
          dataPresetsRedux,
          defaultTables
        ),
      };
    }
    case "SET_ANCHOR_EL":
      return {
        ...state,
        anchorEl: action.payload.anchorEl,
      };
    case "SET_MAP_LOADED":
      return {
        ...state,
        mapLoaded: action.payload.loaded,
      };
    case "SET_NOTIFICATION": {
      return {
        ...state,
        notification: {
          info: action.payload.info,
          location: action.payload.location,
        },
      };
    }

    case "SET_HOVER_OBJECT": {
      let tooltipData;

      if (
        typeof action.payload.id === "number" ||
        typeof action.payload.id === "string"
      ) {
        tooltipData = parseTooltipData(+action.payload.id, state, dataPresets);
      } else {
        tooltipData = action.payload.data;
      }

      const currentHoverTarget = {
        x: action.payload.x,
        y: action.payload.y,
        data: tooltipData,
        id: +action.payload.id,
      };

      return {
        ...state,
        currentHoverTarget,
      };
    }
    case "FORMAT_WIDGET_DATA": {
      const widgetData = {...state.widgetData};
      for(const i of action.payload.widgetSpecs){
        widgetData[i.id] = formatWidgetData(i.variable, state, i.type);
      }
      return {...state, widgetData};
    }
    default:
      return state;
  }
}
