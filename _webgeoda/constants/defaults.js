import {dataPresets} from '../../map-config'

export const INITIAL_STATE = {
    storedGeojson: {},
    storedData: {},
    currentData: dataPresets.data[0].geojson,
    currentMethod: 'natural_breaks',
    currentOverlay: '',
    currentResource: '',
    mapData : {
      data: [],
      params: []
    },
    dataParams: {
        ...dataPresets
    },
    mapParams: {
      mapType: 'natural_breaks',
      bins: {
        bins: [],
        breaks: []
      },
      binMode: '',
      fixedScale: null,
      nBins: 8,
      vizType: '2D',
      activeGeoid: '',
      overlay: '',
      resource: '',
      colorScale: [
        [240,240,240],
        [255,255,204],
        [255,237,160],
        [254,217,118],
        [254,178,76],
        [253,141,60],
        [252,78,42],
        [227,26,28],
        [177,0,38],
      ],
    },
    panelState: {
      variables: true,
      report: false,
      context: false,
      contextPos: {x:null,y:null}
    },
    selectionKeys: [],
    selectionNames: [],
    sidebarData: {},
    anchorEl: null,
    mapLoaded: false,
    notification: {
      info: null,
      location: ''
    },
    tooltipContent: {
      x:0,
      y:0,
      data: null
    }
};