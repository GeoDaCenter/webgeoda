import {
    Slider,
    // SliderInput,
    SliderTrack,
    SliderRange,
    SliderHandle,
    // SliderMarker,
  } from "@reach/slider";
import "@reach/slider/styles.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";

import { useSelector, useDispatch } from "react-redux";

import { findDatasetTable} from '@webgeoda/utils/summarize';
import useTickUpdate from '@webgeoda/hooks/useTickUpdate';
import styles from './SliderStyles.module.css';

export default function TimeSlider() {
  const dispatch = useDispatch();
  const dataParams = useSelector((state) => state.dataParams);
  const storedData = useSelector((state) => state.storedData);
  const currentData = useSelector((state) => state.currentData);
  const dataPresets = useSelector((state) => state.dataPresets);
  const nIndex = dataParams.nIndex;
  const currFile = findDatasetTable(currentData, dataParams.numerator, dataPresets.data)?.file;
  const dateIndices = storedData[currFile]?.dateIndices;
  const [isTicking, setIsTicking, tickTimer, setTickTimer] = useTickUpdate({
    tickFunction: () => dispatch({
      type:'INCREMENT_DATE',
      payload: 1
    }),
    max: dateIndices?.length-1,
    updateTrigger: nIndex,
    resetTriggers: [dataParams.variable]
  })
  const handleChangeDate = (newVal) => newVal !== nIndex && dispatch({type:'CHANGE_NINDEX', payload: newVal})

  if (nIndex === undefined || nIndex === null || dateIndices === undefined || !dateIndices.length) return null;
  
  const dateString = `${dateIndices[nIndex]['$y']+1}-${dateIndices[nIndex]['$M']+1}-${dateIndices[nIndex]['$D']}`
  return (
    <div className={styles.sliderOuterContainer}>
      <div className={styles.playPauseContainer}>
        <button onClick={() => setIsTicking(!isTicking)}>
          <FontAwesomeIcon icon={isTicking ? faPause : faPlay} className={styles.spinner} />
        </button>
      </div>
      <div className={styles.sliderContainer}>
        <Slider value={nIndex} min={0} max={dateIndices.length-1} onChange={handleChangeDate}>
            <SliderTrack>
              <SliderRange />
              <SliderHandle />
            </SliderTrack>
        </Slider>
        
        <span className={styles.dateIndicator} style={{left: `${nIndex/(dateIndices.length-1)*90*0.94+10}%`}}>
          {dateString}
        </span>
        {isTicking && <div className={styles.timerSlider}>
          <Slider value={1000-tickTimer} min={25} step={25} max={975} onChange={newVal => setTickTimer(1000-newVal)}>
              <SliderTrack>
                <SliderRange />
                <SliderHandle />
              </SliderTrack>
          </Slider>
        </div>}
      </div>
    </div>
  );
}