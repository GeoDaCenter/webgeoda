import * as colors from "@webgeoda/utils/colors";
const data = [
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
    name: 'US States', // Plain english name for dataset
    geodata: 'states.geojson', // geospatial data to join to
    id: 'GEOID', // fid / geoid join column
    bounds: [-125.109215,-66.925621,25.043926,49.295128],
    tables: {
      acs_data: {
        file: 'state_acs.csv',
        type: 'characteristic',
        join: 'FIPS',
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
const story = [
  {
    text: <>
      <h1>The Story of Texas</h1>
    </>,
    layout: 'centered',
    map: {
      variable: 'Total Population',
      dataset: 'tx.geojson',
      bounds: [[-102.411182,27.642991],[-94.621875,31.154848]],
      viewState: {}
    }
  },
  {
    text: <>
      <p>Test</p>
    </>,
    layout: 'full-width',
    map: {
      variable: 'Population Density',
      bounds: [[-106.956325,28.828734],[-91.377711,35.642510]],
      viewState: {}
    }
  },
  {
    text: <>
      <p>Test</p>
    </>,
    layout: 'full-width',
    map: {
      variable: 'Count No Internet Access',
      bounds: [[-114.558821,23.893921],[-83.401594,37.690816]],
      viewState: {}
    }
  },
  {
    text: <>
      <p>Test</p>
    </>,
    layout: 'full-width',
    map: {
      variable: 'Hotspot: Pct No Internet',
      bounds: [[-103.744787,34.198998],[-99.850134,35.849796]],
      viewState: {}
    }
  },
]
// 🦺 exports below -- you can safely ignore! 🦺 //
export const dataPresets = {
  data,
  variables,
  mapModes,
  story
  // style
};
