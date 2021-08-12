import { useMemo } from 'react';
import useGetVariable from './useGetVariable';
import { useDispatch } from 'react-redux';

const formatData = (data) => {
    let returnArray = [];
    const vals = Object.values(data)
    for (let i=0; i<vals.length;i++){
        returnArray.push({value:vals[i]})
    }
    return returnArray
}

export default function useGetColumnarData({
    variable=false,
    dataset=false,
    options={},
    id=0,
    geoids=[]
}){
    
    const columnData = useGetVariable({
        variable,
        dataset
    });
    
    const chartData = useMemo(() => formatData(columnData), [columnData, options]);

    return {
        chartData
    }
}
