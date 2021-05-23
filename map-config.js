import * as colors from '@webgeoda/utils/colors'

const data = [
    {
        name: 'USA Facts County', // Plain english name for dataset
        geojson: 'county_usfacts.geojson', // geospatial data to join to
        tables: {}
    }
]

const variables = [
    {
        variable: "Confirmed Count",
        numerator: 'cases',
        binning: 'natural breaks',
        numberOfBins:5,
        colorScale: colors.colorbrewer.YlGnBu[5]
    },
    {
        variable: "Confirmed Count",
        numerator: 'cases',
        binning: 'natural breaks',
        numberOfBins:5,
        colorScale: colors.colorbrewer.YlGnBu[5]
    },
]

// 🦺 exports below -- you can safely ignore! 🦺 //
export const dataPresets = {
    data,
    variables,
    mapModes
}
