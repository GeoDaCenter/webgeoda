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
        colorScale: colors.colorbrewer.Purples[7]
    },
    {
        variable: "GEOID",
        numerator: 'GEOID',
        binning: 'naturalBreaks',
        colorScale: colors.colorbrewer.Pastel2[5]
    },
    {
        variable: "Total Population",
        numerator: 'acs_data',
        nProperty: 'Total Population',
        binning: 'naturalBreaks',
        colorScale: colors.colorbrewer.GnBu[6]
    },
    {
        variable: "Population Density",
        numerator: 'acs_data',
        nProperty: 'Total Population',
        denominator: 'acs_data',
        dProperty: 'Area Land',
        binning: 'naturalBreaks',
        colorScale: colors.colorbrewer.Oranges[6]
    },
    {
        variable: "Pct No Internet Access",
        numerator: 'acs_data',
        nProperty: 'No Internet Access',
        denominator: 'acs_data',
        dProperty: 'Internet Total',
        binning: 'naturalBreaks',
        scale: 100,
        colorScale: colors.colorbrewer.Oranges[6]
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
