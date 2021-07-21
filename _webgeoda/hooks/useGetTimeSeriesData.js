import { useSelector, useDispatch } from "react-redux";
import { useState, useContext, useEffect } from 'react';
import { GeodaContext } from "../contexts";
import { findDatasetTable } from '../utils/summarize';
import { 
    dataFn, 
    find, 
    getVarId, 
    handleLoadData
 } from '../utils/data';

const getProp = (table, prop) => {
    const keys = Object.keys(table)
    const val = 0;
    for (let i=0; i<keys.length; i++) val += table[keys[i]][prop]
    return {prop: val}
}

export default function useGetTimeSeriesData({
    dataSet=false,
    variable=false,
    params={},
    geoids=[]
}) {
    const currentData = useSelector((state) => state.currentData);
    const storedData = useSelector((state) => state.storedData);
    const dataPresets = useSelector((state) => state.dataPresets);
    const cachedTimeSeries = useSelector((state) => state.cachedTimeSeries);
    const dispatch = useDispatch();
    const [timeSeriesData, setTimeSeriesData] = useState([]);
    const [selectedDataset, setSelectedDataset] = useState(dataSet||currentData)
    const [currVarId, setCurVarId] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)

    const variableSpec = variable
        ? find(
            dataPresets.variables,
            (o) => o.variable === variable
        )
        : {}

    useEffect(() => {
        if (!isProcessing && currVarId !== getVarId(selectedDataset, {...variableSpec, ...params})){
            if (!geoids.length && cachedTimeSeries.hasOwnProperty(getVarId(selectedDataset, {...variableSpec, ...params}))) {
                setTimeSeriesData(cachedTimeSeries[getVarId(selectedDataset, {...variableSpec, ...params})])
                setCurVarId(getVarId(selectedDataset, {...variableSpec, ...params}))
            } else {
                setTimeSeriesData(
                        getTimeSeries(
                        selectedDataset, 
                        variable, 
                        params, 
                        geoids
                    )
                )
            }
            setIsProcessing(false)
        }
    },[storedData, selectedDataset, variable, params.nIndex, params.nRange, geoids.length, currVarId, cachedTimeSeries])
    
    const loadTables = async (tableDetails) => {
        const tablePromises = tableDetails.map((table) =>
          handleLoadData(table, dateLists)
        );
        const tableData = await Promise.all(tablePromises);
    
        const dataCollection = {};
        for (let i = 0; i < tableNames.length; i++)
          dataCollection[tableDetails[i].file] = tableData[i];
    
        dispatch({
          type: "ADD_TABLES",
          payload: dataCollection,
        });
    };

    const getTimeSeries = (dataSet, variable, params, geoids) => {
        const t0 = performance.now()
        const variableSpec = variable
            ? find(
                dataPresets.variables,
                (o) => o.variable === variable
              )
            : {}

        const dataParams = {
            ...variableSpec,
            ...params
        }
        
        const numeratorTable = findDatasetTable(
            currentData,
            dataParams.numerator,
            dataPresets.data
        )
        
        const denominatorTable = findDatasetTable(
            currentData,
            dataParams.denominator,
            dataPresets.data
        )

        if ((
            dataParams.numerator !== undefined && (numeratorTable === undefined || !storedData.hasOwnProperty(numeratorTable.file))
        ) || (
            dataParams.denominator !== undefined && (denominatorTable === undefined || !storedData.hasOwnProperty(denominatorTable.file))
        )) {

            console.log('ERROR: Data not found.')
            let dataSetsToLoad = []
            if (numeratorTable !== undefined) dataSetsToLoad.push(numeratorTable);
            if (denominatorTable !== undefined) datrasetstoLoad.push(denominatorTable);
            loadTables(dataSetsToLoad)
            return []
        }

        if (!numeratorTable.type.includes('time')&&!denominatorTable.type.includes('time')) {
            console.log('ERROR: Not a time-series variable')
            return []
        }

        let numerArray = [];
        let denomArray = [];

        const dates = storedData[numeratorTable.file]?.dateIndices?.length
            ? storedData[numeratorTable.file].dateIndices
            : storedData[denominatorTable.file]?.dateIndices?.length
            ? storedData[denominatorTable.file].dateIndices
            : []
            
        if (!dates || !dates.length) {
            console.log('ERROR: Dates not found')
            return []
        }

        const idArray = geoids.length 
            ? geoids
            : Object.keys(storedData[numeratorTable.file].data)


        const getDateIdx = numeratorTable.type.includes('time') && denominatorTable && denominatorTable.type.includes('time')
            ? (nIndices, dIndices, idx) => find(dIndices, d => d['$d'] === nIndices[idx]['$d'])
            : (_, __, idx) => idx
        
        const getDenominatorProp = denominatorTable && denominatorTable.type.includes('time')
            ? getDateIdx
            : () => dataParams.dProperty

        const getNumeratorProp = numeratorTable.type.includes('time')
                ? getDateIdx
                : () => dataParams.nProperty


        const getData = numeratorTable.type.includes('time') && denominatorTable && denominatorTable.type.includes('time')
            ? (id, nIdx, dIdx, nTable, dTable) => {
                return {
                    n: nTable[id][nIdx], 
                    d: dTable[id][dIdx]
                }
              } 
            : numeratorTable.type.includes('time') && denominatorTable === undefined
            ? (id, nIdx, dIdx, nTable, dTable) => {
                return {
                    n: nTable[id][nIdx], 
                    d: 0
                }
              }
            : (id, nIdx, dIdx, nTable, dTable) => {
                return {
                    n: 0, 
                    d: dTable[id][dIdx]
                }
              }

        const [
            nIndices,
            nTable,
            dIndices,
            dTable
        ] = [
            storedData[numeratorTable?.file]?.dateIndices||[],
            storedData[numeratorTable?.file]?.data||[],
            storedData[denominatorTable?.file]?.dateIndices||[],
            storedData[denominatorTable?.file]?.data||[],
        ]

        for (let i=0; i < dates.length; i++){
            const dIdx = getDenominatorProp(
                nIndices,
                dIndices,
                i
            )
            
            const nIdx = getNumeratorProp(
                nIndices,
                dIndices,
                i
            )

            let nVal = 0;
            let dVal = 0;

            for (let x=0; x<idArray.length; x++){
                const {
                    n,
                    d
                } = getData(
                    idArray[x],
                    nIdx,
                    dIdx,
                    nTable,
                    dTable
                )
                nVal += n||0
                dVal += d||0
            }

            numerArray.push(nVal);
            denomArray.push(dVal);
        }

        numerArray = numeratorTable.type.includes('time')
            ? numerArray
            : getProp(nTable, dataParams.nProperty)

        denomArray = denominatorTable === undefined
            ? null
            : numeratorTable.type.includes('time')
            ? denomArray
            : getProp(dTable, dataParams.dProperty)

        let parsedData = []
        for (let i=0; i<dates.length; i++){
            parsedData.push({
                date: dates[i]['$d'],
                value: dataFn(
                    numerArray,
                    denomArray,
                    {
                        ...dataParams,
                        nIndex: i,
                        dIndex: i
                    },
                )
            })
        }
        if (!geoids.length){
            dispatch({
                type:'CACHE_TIME_SERIES',
                payload: {
                    id: getVarId(dataSet, dataParams),
                    data: parsedData
                }
            })
        }
        setCurVarId(getVarId(selectedDataset, {...variableSpec, ...params}))
        return parsedData
    }

    return timeSeriesData


}