import * as colors from '@webgeoda/utils/colors'

const data = [
    {
        name: 'Texas Block Groups', // Plain english name for dataset
        geojson: 'tx.geojson', // geospatial data to join to
        id:'GEOID', // fid / geoid join column
        tables: { // any additional tabular data
            acs_data: {
                file:'texas_acs.csv',
                type:'characteristic',
                join:'FIPS'
            }
        } 
    }
]

const variables = [
    {
        variable: "Median age",
        numerator: 'Median age',
        binning: 'naturalBreaks',
        numberOfBins:7,
        colorScale: colors.colorbrewer.Purples
    },
    {
        variable: "GEOID",
        numerator: 'GEOID',
        binning: 'naturalBreaks',
        colorScale: colors.colorbrewer.Pastel2
    },
    {
        variable: "Total Population",
        numerator: 'acs_data',
        nProperty: 'Total Population',
        binning: 'naturalBreaks',
        numberOfBins:8,
        colorScale: colors.colorbrewer.Greens
    },
    {
        variable: "Population Density",
        numerator: 'acs_data',
        nProperty: 'Total Population',
        denominator: 'acs_data',
        dProperty: 'Area Land',
        binning: 'percentileBreaks',
        numberOfBins:6,
        colorScale: colors.colorbrewer.Oranges
    },
    {
        variable: "Pct No Internet Access",
        numerator: 'acs_data',
        nProperty: 'No Internet Access',
        denominator: 'acs_data',
        dProperty: 'Internet Total',
        scale: 100,
        binning: 'stddev_breaks',
        numberOfBins:6,
        colorScale: colors.colorbrewer.BrBG
    },
]

const mapModes = {
    '2D': true,
    '3D': false,
    'BubbleCartogram':false
}

// 🦺 exports below -- you can safely ignore! 🦺 //
export const dataPresets = {
    data,
    variables,
    mapModes
}
