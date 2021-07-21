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
      <p>Here's a map of population density, and a short, sweet description.</p>
    </>,
    layout: 'centered',
    map: {
      variable: 'Population Density',
      bounds: [[-106.956325,28.828734],[-91.377711,35.642510]],
      viewState: {}
    }
  },
  {
    text: <>
      <p>Longer blocks of text can provide additional context before diving back in to the mapping.</p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum diam odio, accumsan at mollis eu, molestie id massa. Ut sit amet orci tortor. Sed nisi orci, ullamcorper quis enim ac, vestibulum interdum libero. Sed tempus mi et purus placerat molestie. Aliquam suscipit, magna et ultricies pharetra, lorem leo porttitor lorem, eget dignissim augue arcu et velit. In lobortis, purus vel vestibulum pharetra, enim ligula tincidunt est, vitae euismod augue odio dictum velit. Donec faucibus sodales magna eu viverra. Phasellus pulvinar eleifend neque ut maximus. Curabitur quis ante eros. Quisque placerat interdum ex, a volutpat purus facilisis id.
      </p>
      <h4>Emphasize key points! Or use figures:</h4>
      <img 
        src="https://d1y8sb8igg2f8e.cloudfront.net/images/shutterstock_674373478.2e16d0ba.fill-1200x630.jpg"
        alt="Internet Illustration"
        />
      <p>
        Mauris vel finibus nisl, interdum consectetur nisi. Mauris dictum massa et justo feugiat, vel volutpat lorem vulputate. Integer posuere est nisi. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam a lobortis nulla, vel posuere risus. Pellentesque placerat tincidunt ultricies. Morbi ligula lorem, vehicula ac lorem vel, placerat facilisis lacus. Aenean cursus laoreet eros vitae cursus. Nulla fermentum pharetra arcu.
      </p>
    </>,
    layout: 'full-width'
  },
  {
    text: <>
      <p>And even use LISA!</p>
    </>,
    layout: 'centered',
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
