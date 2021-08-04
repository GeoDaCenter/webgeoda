import { useSelector, useDispatch } from "react-redux"

import {
    findTable
} from '../utils/summarize';

import {
    find
} from '../utils/data';
import useFetchData from "./useFetchData";
import { useState, useEffect } from "react";

export default function useGetTables({
    dataset=false,
    variable=false,
    geoids=[],
    getDates=false,
    priority=true
}){
    const dispatch = useDispatch();
    const currentData = useSelector((state) => state.currentData);
    const storedData = useSelector((state) => state.storedData);
    const storedGeojson = useSelector((state) => state.storedGeojson);
    const dataPresets = useSelector((state) => state.dataPresets);
    const fetchData = useFetchData();
    const [tables, setTables] = useState({
        numerator: {},
        denominator: {},
        dates: []
    });

    const queueFetchData = (dataset) => {
        dispatch({
            type: "PUSH_DATA_QUEUE",
            payload: {
                datasets: [dataset]
            }
        });
    }

    

    const getTables = async (
        dataset=false,
        variable=false,
        geoids=[]
    ) => {
        if (variable === false) return;
        const variableSpec = find(
                dataPresets.variables,
                (o) => o.variable === variable
            )
        
        if (variableSpec === undefined){
            console.log('Missing Variable')
            setTables({
                numerator: {},
                denominator: {},
                dates: []
            })
            return;
        }
        const numeratorTable = findTable(
            dataset,
            variableSpec.numerator,            
            dataPresets.data
        )
        
        const denominatorTable = findTable(
            dataset,
            variableSpec.denominator,
            dataPresets.data,
        )

        let numeratorData;
        if(variableSpec && variableSpec.numerator === 'properties'){
            if(dataset in storedGeojson) {
                numeratorData = storedGeojson[dataset].properties;
            } else {
                if(priority){
                    numeratorData = await fetchData({req: dataset});
                } else {
                    queueFetchData(dataset);
                    return null;
                }
            }
        } else {
            if(numeratorTable && numeratorTable.file in storedData){
                numeratorData = storedData[numeratorTable.file];
            } else {
                if(priority){
                    numeratorData = await fetchData({req: numeratorTable});
                } else {
                    queueFetchData(numeratorTable);
                    return null;
                }
            }
        }
        let denominatorData;
        if(variableSpec && variableSpec.numerator === 'properties'){
            if(dataset in storedGeojson) {
                denominatorData = storedGeojson[dataset].properties;
            } else {
                if(priority){
                    denominatorData = await fetchData({req: dataset});
                } else {
                    queueFetchData(dataset);
                    return null;
                }
            }
        } else {
            if(denominatorTable && denominatorTable.file in storedData){
                denominatorData = storedData[denominatorTable.file];
            } else {
                if(priority){
                    denominatorData = await fetchData({req: denominatorTable});
                } else {
                    queueFetchData(denominatorTable);
                    return null;
                }
            }
        }
        
        if (geoids.length){
            let numeratorDataList = 'data' in numeratorData ? numeratorData.data : numeratorData;
            let denominatorDataList = 'data' in denominatorData ? denominatorData.data : denominatorData;
            let tempNumer = {};
            let tempDenom = {};

            if (denominatorData) {
                for (let i=0; i<geoids.length;i++){
                    tempNumer[geoids[i]] = numeratorDataList[geoids[i]]
                    tempDenom[geoids[i]] = denominatorDataList[geoids[i]]
                }
            } else {
                for (let i=0; i<geoids.length;i++){
                    tempNumer[geoids[i]] = numeratorDataList[geoids[i]]
                }
            }

            setTables({
                numerator: numeratorDataList,
                denominator: tempDenom,
                dates: numeratorData?.dateIndices || denominatorData.dateIndices || []
            })
        }
        
        setTables({
            numerator: 'data' in numeratorData ? numeratorData.data : numeratorData,
            denominator: 'data' in denominatorData ? denominatorData.data : denominatorData,
            dates: numeratorData?.dateIndices || denominatorData?.dateIndices || []
        })
    }

    useEffect(() => {
        getTables(
            dataset||currentData, 
            variable, 
            geoids
        )
    },[dataset, variable, geoids.length])

    return tables
}