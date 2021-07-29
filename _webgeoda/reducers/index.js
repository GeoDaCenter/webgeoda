import { INITIAL_STATE } from "../constants/defaults";
import {getWidgetSpec} from "../utils/widgets";

import {
  mapFnNb,
  mapFnHinge,
  dataFn,
  getVarId,
  shallowEqual,
  find,
  zip
} from "@webgeoda/utils/data";

import {
  formatWidgetData
} from '@webgeoda/utils/widgets';

import { 
  getCartogramCenter, 
  generateMapData 
} from "../utils/map";

import { 
  generateReport, 
  parseTooltipData, 
  findDatasetTable,
  findDatasetWithTable
} from "../utils/summarize";

import { dataPresets } from "../../map-config";
const [defaultTables, dataPresetsRedux, tooltipTables] = [{}, {}, []];

export default function reducer(state = INITIAL_STATE, action) {
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
        currentTiles: action.payload.currentTiles,
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
        isLoading: false,
        mapData: dataParams.lisa 
          ? state.mapData 
          : generateMapData({
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
            currentId: action.payload.id
          }),
        cachedVariables: {
          ...state.cachedVariables,
          [action.payload.currentData]: {
            ...(state.cachedVariables.hasOwnProperty(action.payload.currentData)
              ? state.cachedVariables[action.payload.currentData]
              : {}),
            [action.payload.cachedVariable.variable]: zip(
              action.payload.cachedVariable.geoidOrder, 
              action.payload.cachedVariable.data
            )
          }
        }
      };
    }
    case "CHANGE_VARIABLE": {
      const dataParams = find(
        dataPresets.variables,
        (o) => o.variable === action.payload
      );

      const currPresets = find(
        state.dataPresets.data, 
        o => o.geodata === state.currentData
      );

      if (
        currPresets?.tables.hasOwnProperty(dataParams.numerator) 
        || dataParams.numerator === "properties"
      ){
        return {
          ...state,
          dataParams,
        };
      } else {
        const currentData = findDatasetWithTable(
          dataParams.numerator, 
          state.dataPresets.data
        )
        return {
          ...state,
          currentData,
          dataParams
        };
      }
    }
    case "CHANGE_DATASET": {
      if (state.storedGeojson.hasOwnProperty(action.payload)){
        return {
          ...state,
          currentData: action.payload,
          currentTiles: find(state.dataPresets.data, o => o.geodata === action.payload).tiles
        };
      } else {
        return {
          ...state,
          datasetToLoad: action.payload
        };
      }
    }
    case "UPDATE_BINS": {
      const mapParams = {
        ...state.mapParams,
        ...action.payload,
      };
      return {
        ...state,
        mapParams,
        mapData: generateMapData({
          ...state,
          mapParams
        }),
        cachedVariables: {
          ...state.cachedVariables,
          [state.currentData]: {
              ...state.cachedVariables[state.currentData],
              [action.payload.cachedVariable.variable]: zip(
                action.payload.cachedVariable.geoidOrder, 
                action.payload.cachedVariable.data
            )
          }
        }
      };
    }
    case "UPDATE_LISA": {
      let data = {};
      for (let i=0; i < state.storedGeojson[state.currentData].order.length; i++){
        data[state.storedGeojson[state.currentData].order[i]] = {
          color: action.payload.colorScale[action.payload.lisaResults.clusters[i]]
        }
      }

      return {
        ...state,
        mapData: {
          params: getVarId(state.currentData, state.dataParams, state.mapParams),
          data
        },
        storedGeojson:{
          ...state.storedGeojson,
          [state.currentData]: {
            ...state.storedGeojson[state.currentData],
            weights: {
              ...state.storedGeojson[state.currentData].weights,
              [state.dataParams.weightMethod||"getQueenWeights"]: action.payload.weights
            }
          }
        },
        mapParams: {
          ...state.mapParams,
          colorScale: action.payload.colorScale,
          bins: {
            breaks: action.payload.lisaResults.labels,
            bins: action.payload.lisaResults.labels
          }
        },
        cachedVariables: {
          ...state.cachedVariables,
          [state.currentData]: {
              ...state.cachedVariables[state.currentData],
              [action.payload.cachedVariable.variable]: zip(
                action.payload.cachedVariable.geoidOrder, 
                action.payload.cachedVariable.data
            )
          }
        }
      }
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
    case "CHANGE_NINDEX": {
      const dataParams = {
        ...state.dataParams,
        nIndex: action.payload,
      };

      return {
        ...state,
        dataParams,
        mapData: generateMapData({
          ...state,
          dataParams
        })
      }
    }
    case "INCREMENT_DATE": {
      const currFile = findDatasetTable(state.currentData, state.dataParams.numerator, state.dataPresets.data)?.file;
      const max = state.storedData[currFile]?.dateIndices?.length
      const dataParams = {
        ...state.dataParams,
        nIndex: state.dataParams.nIndex + action.payload < max 
          ? state.dataParams.nIndex + action.payload 
          : state.dataParams.nIndex,
      };

      return {
        ...state,
        dataParams,
        mapData: generateMapData({
          ...state,
          dataParams
        })
      }
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
        currentHoverId: action.payload.layer?.includes("tiles") ? null : +action.payload.id
      };
    }
    case "SET_WIDGET_CONFIG": {
      const widgetConfig = [...state.widgetConfig];
      widgetConfig[action.payload.widgetIndex] = action.payload.newConfig;
      return {...state, widgetConfig};
    }
    case "FORMAT_WIDGET_DATA": {
      let cachedVariables = {...state.cachedVariables}
      const widgetData = {...state.widgetData};

      if("widgetSpec" in action.payload){
        // Only loading one widget's data
        widgetData[action.payload.widgetSpec.id] = formatWidgetData(action.payload.widgetSpec.variable, state, action.payload.widgetSpec.type, action.payload.widgetSpec.options);
        if (cachedVariables.hasOwnProperty(state.currentData) 
          && widgetData[i.id].hasOwnProperty('variableToCache')) {
            for (let n=0; n<widgetData[i.id].variableToCache.length; n++){
              cachedVariables = {
                ...cachedVariables,
                [state.currentData]: {
                  ...(cachedVariables[state.currentData]||{}),
                  [widgetData[i.id].variableToCache[n].variable]: zip(widgetData[i.id].variableToCache[n].order, widgetData[i.id].variableToCache[n].data)
                }
              }
            }
          }
      } else {
        // Loading multiple widget data
        for(const i of action.payload.widgetSpecs){
          widgetData[i.id] = formatWidgetData(i.variable, state, i.type, i.options);
          if (cachedVariables.hasOwnProperty(state.currentData) 
            && widgetData[i.id].hasOwnProperty('variableToCache')) {
              for (let n=0; n<widgetData[i.id].variableToCache.length; n++){
                cachedVariables = {
                  ...cachedVariables,
                  [state.currentData]: {
                    ...(cachedVariables[state.currentData]||{}),
                    [widgetData[i.id].variableToCache[n].variable]: zip(widgetData[i.id].variableToCache[n].order, widgetData[i.id].variableToCache[n].data)
                  }
                }
              }
            }
        }
      }
      
      return {
        ...state, 
        widgetData,
        cachedVariables
      };
    }
    case "UPDATE_WIDGET_CONFIG_AND_DATA":{
      let widgetConfig = [...state.widgetConfig];

      const newWidgetConfig = {
        ...state.widgetConfig[action.payload.widgetIndex],
        ...action.payload.newConfig
      }

      widgetConfig[action.payload.widgetIndex] = newWidgetConfig;
      const widgetSpec = getWidgetSpec(newWidgetConfig, action.payload.widgetIndex);

      const widgetData = {...state.widgetData};
      if(action.payload.doesWidgetNeedRefresh){
        const newWidgetData = formatWidgetData(
          widgetSpec.variable, 
          state,
          widgetSpec.type, 
          widgetSpec.options
        );  
        widgetData[action.payload.widgetIndex] = newWidgetData;
      }
      return {
        ...state,
        widgetData,
        widgetConfig
      }
    }
    case "SET_WIDGET_LOCATIONS": {
      return {
        ...state,
        widgetLocations: action.payload,
        widgetIsDragging: false
      }
    }
    case "SET_WIDGET_IS_DRAGGING":{
      return {
        ...state,
        widgetIsDragging: action.payload
      }
    }
    case "SET_SHOW_WIDGET_TRAY": {
      return {
        ...state,
        showWidgetTray: action.payload
      };
    }
    case "CACHE_SCATTERPLOT_LISA": {
      const cachedLisaScatterplotData = {...state.cachedLisaScatterplotData};
      cachedLisaScatterplotData[action.payload.variableName] = action.payload.data;
      return {...state, cachedLisaScatterplotData};
    }
    case "SET_MAP_FILTER": {
      const mapFilters = [...state.mapFilters];
      const newFilter = action.payload.filter === null ? null : {
        ...action.payload.filter,
        source: action.payload.widgetIndex,
        id: action.payload.filterId
      };
      const index = mapFilters.findIndex(i => i.id == action.payload.filterId);

      // Append, replace, or delete
      if(index === -1) { mapFilters.push(newFilter); }
      else {
        if(action.payload.filter === null) { mapFilters.splice(index, 1); }
        else { mapFilters[index] = newFilter; }
      }

      return {...state, mapFilters};
    }
    case "CACHE_TIME_SERIES": {
      const cachedTimeSeries = {
        ...state.cachedTimeSeries,
        [action.payload.id]:action.payload.data
      }
      return {
        ...state,
        cachedTimeSeries
      }
    }
    case "CACHE_VARIABLE": {
      const cachedVariables = {
        ...state.cachedVariables,
        [action.payload.dataset]: {
            ...state.cachedVariables[action.payload.dataset],
            [action.payload.cachedVariable.variable]: zip(
              action.payload.cachedVariable.geoidOrder, 
              action.payload.cachedVariable.data
          )
        }
      }
      return {
        ...state,
        cachedVariables
      }
    }
    case "TOGGLE_SELECT": {
      return {
        ...state,
        boxSelect: !state.boxSelect.active
          ? {left:200,top:200,width:200,height:200,active:true}
          : {active:false}
      }
    }
    case "MOVE_SELECT": {
      return {
        ...state,
        boxSelect: {
          active: true,
          width: action.payload.width < 50 ? 50 : action.payload.width || state.boxSelect.width,
          height: action.payload.height < 50 ? 50 : action.payload.height || state.boxSelect.height,
          top: action.payload.top < 0 ? 0 : action.payload.top || state.boxSelect.top,
          left: action.payload.left < 0 ? 0 : action.payload.left || state.boxSelect.left,
        }
      }
    }
    default:
      return state;
  }
}
