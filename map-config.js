import * as colors from "@webgeoda/utils/colors";

const data = [
  {
    name: 'Texas Block Groups', // Plain english name for dataset
    geojson: 'tx.geojson', // geospatial data to join to
    id: 'GEOID', // fid / geoid join column
    tables: {
      // any additional tabular data
      acs_data: {
        file: 'texas_acs.csv',
        type: 'characteristic',
        join: 'FIPS',
      },
      household_data: {
        file: 'texas_heating.csv',
        type:'characteristic',
        join: 'FIPS'
      },
      income_data: {
        file: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSbtTg_m2TfwpmiZo7ylZKxt6cx79kny9plIqp4PSxUgnV6XvQBrTWcSPHH7b5_WE8IL1o_YJ95cOuJ/pub?output=csv',
        type:'characteristic',
        join: 'FIPS'
      }
    },
  },
];

const variables = [
  {
    variable: "Median age",
    numerator: "Median age",
    binning: "naturalBreaks",
    numberOfBins: 7,
    colorScale: colors.colorbrewer.Purples,
  },
  {
    variable: "Median Household Income",
    numerator: "income_data",
    nProperty: "Median Household Income",
    binning: "naturalBreaks",
    numberOfBins: 5,
    colorScale: colors.colorbrewer.YlGn,
  },
  {
    variable: "Median Gross Rent",
    numerator: "income_data",
    nProperty: "Median Gross Rent",
    binning: "hinge15Breaks",
    numberOfBins: 5,
    colorScale: colors.colorbrewer.YlOrRd,
  },
  {
    variable: "GEOID",
    numerator: "GEOID",
    binning: "naturalBreaks",
    colorScale: colors.colorbrewer.Pastel2,
  },
  {
    variable: "Total Population",
    numerator: "acs_data",
    nProperty: "Total Population",
    binning: "naturalBreaks",
    numberOfBins: 8,
    colorScale: colors.colorbrewer.Greens,
  },
  {
    variable: "Population Density",
    numerator: "acs_data",
    nProperty: "Total Population",
    denominator: "acs_data",
    dProperty: "Area Land",
    binning: "percentileBreaks",
    numberOfBins: 6,
    colorScale: colors.colorbrewer.Oranges,
  },
  {
    variable: "Count No Internet Access",
    numerator: "acs_data",
    nProperty: "No Internet Access",
    scale: 100,
    binning: "stddev_breaks",
    numberOfBins: 6,
    colorScale: colors.colorbrewer.Reds,
  },
  {
    variable: "Most Common Heating Fuel",
    numerator: "household_data",
    nProperty: "Fuel Type",
    categorical: true,
    colorScale: colors.colorbrewer.Dark2,
  },
];

const mapModes = {
  "2D": true,
  "3D": false,
  BubbleCartogram: false,
};

const widgets = [
  {
    position: "left",
    type: "histogram",
    variable: "Median age",
    options: {
      header: "Median Age",
      foregroundColor: "#FF00FF",
      yAxisLabel: "Median Age"
    }
  },
  {
    position: "right",
    type: "histogram",
    variable: "Count No Internet Access",
    options: {
      header: "No Internet Access",
      foregroundColor: "#00FFAA",
      yAxisLabel: "Count No Internet Access"
    }
  },
  {
    position: "right",
    type: "scatter",
    xVariable: "Median Household Income",
    yVariable: "Median Gross Rent",
    options: {
      header: "Median HH Income vs Median Gross Rent",
      foregroundColor: "#00AAFF",
      pointSize: .2,
      xAxisLabel: "Median HH Income",
      yAxisLabel: "Median Gross Rent"
    }
  },
  {
    position: "right",
    type: "scatter3d",
    xVariable: "Median age",
    yVariable: "Count No Internet Access",
    zVariable: "Population Density",
    options: {
      foregroundColor: "#00AAFF",
      pointSize: .5,
      xAxisLabel: "Median Age",
      yAxisLabel: "Count No Internet Acccess",
      zAxisLabel: "Population Density",
      gridlinesInterval: [10, 20000, 10000]
    }
  }
];

// 🦺 exports below -- you can safely ignore! 🦺 //
export const dataPresets = {
  data,
  variables,
  mapModes,
  widgets
};
