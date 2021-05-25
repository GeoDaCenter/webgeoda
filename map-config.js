import * as colors from '@webgeoda/utils/colors'

const data = [
    {
        name: 'Puerto Rico Block Groups', // Plain english name for dataset
        geojson: 'pr.geojson', // geospatial data to join to
        id:'GEOID10', // fid / geoid join column
        tables: {} // any additional tabular data
    }
]

const variables = [
    {
        variable: "Total Population",
        numerator: 'Total Population',
        binning: 'natural breaks',
        colorScale: colors.colorbrewer.Blues[5]
    },
    {
        variable: "Population Density",
        numerator: 'Total Population',
        denmoinator: 'ALAND10',
        binning: 'natural breaks',
        colorScale: colors.colorbrewer.YlGnBu[5]
    },
    {
        variable: "Population Density Hotspot",
        numerator: 'Total Population',
        denmoinator: 'ALAND10',
        binning: 'lisa',
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



// const data = [
//     {
//         name: 'Texas Block Groups', // Plain english name for dataset
//         geojson: 'tx.geojson', // geospatial data to join to
//         id:'GEOID', // fid / geoid join column
//         tables: {} // any additional tabular data
//     }
// ]

// const variables = [
//     {
//         variable: "Median age",
//         numerator: 'Median age',
//         binning: 'natural breaks',
//         colorScale: colors.colorbrewer.PuOr[9]
//     }
// ]