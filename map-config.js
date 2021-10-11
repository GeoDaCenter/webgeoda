import * as colors from "@webgeoda/utils/colors";
const data = [
  {
    name: 'Colorado Block Groups', // Plain english name for dataset
    geodata: 'colorado_cbgs.geojson', // geospatial data to join to
    id: 'GEOID', // fid / geoid join column
    tables: {
      acsData: {
        file:'colorado-acs-cbg.csv',
        join:'FIPS',
        type:'characteristic'
      }
    },
  },
  {
    name: 'Colorado Counties', // Plain english name for dataset
    geodata: 'colorado_counties.geojson', // geospatial data to join to
    id: 'GEOID', // fid / geoid join column
    tables: {
      acsData:{
        file:'colorado-acs-county.csv',
        join:'FIPS',
        type:'characteristic'
      }

    },
  },
  
];

const variables = [
  {
    variable: "Population Density",
    numerator: "acsData",
    nProperty: "Population",
    denominator: "acsData",
    dProperty: "Land Area",
    binning: "percentileBreaks",
    colorScale: colors.colorbrewer.YlGnBu,
  },
  {
    variable: "Median Age",
    numerator: "acsData",
    nProperty: "Median Age",
    binning: "quantileBreaks",
    numberOfBins: 8,
    colorScale: colors.colorbrewer.RdYlBu,
  },
  {
    variable: "Median Household Income",
    numerator: "acsData",
    nProperty: "Median HH",
    binning: "naturalBreaks",
    numberOfBins: 8,
    colorScale: colors.colorbrewer.PiYG,
  },
  {
    variable: "Median Structure Year Built",
    numerator: "acsData",
    nProperty: "Median Structure Year",
    binning: "quantileBreaks",
    numberOfBins: 8,
    colorScale: colors.colorbrewer.PuBuGn,
  },
  {
    variable: "Median House Value",
    numerator: "acsData",
    nProperty: "Median Value",
    binning: "stddev_breaks",
    colorScale: colors.colorbrewer.Greens,
  }
];

const mapModes = {
  "2D": true,
  "3D": false,
  BubbleCartogram: false,
};

const widgets = [
  // {
  //   display: "tray",
  //   type: "scatter",
  //   xVariable: "Median Household Income",
  //   yVariable: "Median House Value",
  //   options: {
  //     regression:true
  //   }
  // },
  // {
  //   display: "tray",
  //   type: "scatter",
  //   xVariable: "Median Household Income",
  //   yVariable: "Median House Value",
  //   aggregate:"scale",
  //   options: {
  //     regssion:false
  //   }
  // },
  // {
  //   display:"tray",
  //   type:"histogram",
  //   variable:"Population Density",
  //   options: {
  //     xAxisLabel: 'People Per Square Mile',
  //     yAxisLabel: 'Count of Geographies'
  //   }
  // }
];

const style = {
  mapboxStyle: 'mapbox://styles/dhalpern/cktkfleo714bm18qqzjhpbsaw?fresh=true',
  underLayerId: 'waterway-shadow'
}

// 🦺 exports below -- you can safely ignore! 🦺 //
export const dataPresets = {
  data,
  variables,
  mapModes,
  widgets,
  style
};
