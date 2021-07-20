import {
    Slider,
    SliderInput,
    SliderTrack,
    SliderRange,
    SliderHandle,
    SliderMarker,
  } from "@reach/slider";
  import "@reach/slider/styles.css";

import { useSelector, useDispatch } from "react-redux";
import { findDatasetTable} from '@webgeoda/utils/summarize';
import styles from './SliderStyles.module.css';

export default function TimeSlider() {
  const dispatch = useDispatch();
  const dataParams = useSelector((state) => state.dataParams);
  const storedData = useSelector((state) => state.storedData);
  const currentData = useSelector((state) => state.currentData);
  const dataPresets = useSelector((state) => state.dataPresets);
  const nIndex = dataParams?.nIndex;
  
  if (nIndex === undefined) return null;

  const currFile = findDatasetTable(currentData, dataParams.numerator, dataPresets.data)?.file;
  const dateIndices = storedData[currFile]?.dateIndices;

  if (dateIndices === undefined) return null;
  const handleChangeDate = (newVal) => newVal !== nIndex && dispatch({type:'CHANGE_NINDEX', payload: newVal})

  const dateString = `${dateIndices[nIndex]['$y']+1}-${dateIndices[nIndex]['$M']+1}-${dateIndices[nIndex]['$D']}`
  return (
    <div className={styles.sliderContainer}>
      <Slider value={nIndex} min={0} max={dateIndices.length-1} onChange={handleChangeDate}>
          <SliderTrack>
            <SliderRange />
            <SliderMarker />
            <SliderHandle />
          </SliderTrack>
      </Slider>
      
      <span className={styles.dateIndicator} style={{left: `${nIndex/(dateIndices.length-1)*100*0.95}%`}}>
        {dateString}
      </span>
    </div>
  );
}