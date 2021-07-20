import * as colors from "@webgeoda/utils/colors";
const data = [
  {
    name: 'US States', // Plain english name for dataset
    geodata: 'states.geojson', // geospatial data to join to
    id: 'GEOID', // fid / geoid join column
    bounds: [-125.109215,-66.925621,25.043926,49.295128],
    tables: {
      acs_data: {
        file: 'state_acs.csv',
        type: 'characteristic',
        join: 'FIPS',
      },
      covid_data: {
        file: 'nyt_covid_state.csv',
        type: 'time-series',
        join: 'fips',

      }
    },
  },
  {
    name: 'Texas Block Groups', // Plain english name for dataset
    geodata: 'tx.geojson', // geospatial data to join to
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
      }
    },
  },
  {
    name: 'US Tracts',
    geodata: 'US Tracts [tiles]',
    tiles: `csds-hiplab.3ezoql1c`,
    id: 'GEOID',
    bounds: [-125.109215,-66.925621,25.043926,49.295128],
    tables: {
      acs_data: {
        file: 'tract_acs.csv',
        type: 'characteristic',
        join: 'FIPS',
      }
    },
  }
];

const variables = [
  {
    variable: "Covid April",
    numerator: "covid_data",
    nIndex: null,
    nRange: null,
    binning: "naturalBreaks",
    numberOfBins: 5,
    colorScale: colors.colorbrewer.YlOrBr,
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
    binning: "stddev_breaks",
    numberOfBins: 6,
    colorScale: colors.colorbrewer.Reds,
  },
  {
    variable: "Hotspot: Pct No Internet",
    numerator: "acs_data",
    nProperty: "No Internet Access",
    denominator: "acs_data",
    dProperty: "Internet Total",
    scale: 100,    
    lisa: true
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

// const style = {
//   mapboxStyle: 'mapbox://styles/dhalpern/ckpkalk6o2me517kvlgz1eo7r',
//   underLayerId: 'hillshade copy'
// }

// 🦺 exports below -- you can safely ignore! 🦺 //
export const dataPresets = {
  data,
  variables,
  mapModes,
  // style
};
