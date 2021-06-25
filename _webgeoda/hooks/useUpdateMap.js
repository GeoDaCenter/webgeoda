import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import useLisa from './useLisa';
import useUpdateBins from './useUpdateBins';

export default function useUpdateMap() {
    const dataParams = useSelector((state) => state.dataParams);
    const currentData = useSelector((state) => state.currentData);
    const [updateBins] = useUpdateBins();
    const [, updateLisa] = useLisa();

    useEffect(() => {
        if (!dataParams.lisa) {
            updateBins();
        } else {
            updateLisa()
        }
    }, [dataParams.variable, currentData]);

    return [];
}
