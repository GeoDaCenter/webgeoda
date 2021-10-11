import { useState, useMemo } from 'react';
import useGetVariable from './useGetVariable';
import useUpdateBins from './useUpdateBins';
import useGetLisa from './useGetLisa';
import { useDispatch, useSelector } from 'react-redux';

import { 
    getCartogramCenter, 
    generateMapData 
} from "../utils/map";

export default function useGetMapData({
    currentData=false,
    dataParams={},
    mapParams={}
}){
    const [mapGeographicData, setMapGeographicData] = useState([]);
    const storedData = useSelector((state) => state.storedData);
    const storedGeojson = useSelector((state) => state.storedGeojson);
    const currentMapGeography = storedGeojson[currentData]?.data || [];
    const currentTiles = useSelector((state) => state.currentTiles);
    const dataPresets = useSelector((state) => state.dataPresets);
    
    const variableData = useGetVariable({
        variable: dataParams.variable,
        dataset: currentData
    });

    console.log(variableData)

    // const mapData = useMemo(() => generateMapData({
    //     storedGeojson,
    //     storedData,
    //     currentData,
    //     mapParams,
    //     dataParams,
    //     dataPresets,
    // }), [
    //     Object.keys(storedGeojson).length,
    //     Object.keys(storedData).length,
    //     currentData,
    //     JSON.stringify(mapParams),
    //     JSON.stringify(dataParams)
    // ]);


    // const [updateBins] = useUpdateBins();
    // const [getLisa, cacheLisa, updateLisa] = useLisa();

    // useEffect(() => {
    //     if (!dataParams.lisa) {
    //         updateBins();
    //     } else {
    //         updateLisa()
    //     }
    // }, [dataParams.variable, currentData]);
    return { 
        // mapData,
        // currentMapGeography
    }
}