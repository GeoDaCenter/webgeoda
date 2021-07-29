import { useSelector, useDispatch } from "react-redux";
import styles from './MapSelection.module.css'
import Tooltip from "@reach/tooltip";
import "@reach/tooltip/styles.css";

export default function MapSelection(){
    const boxSelect = useSelector((state) => state.boxSelect);
    const dispatch = useDispatch();
    
    const changeDims = (props) => dispatch({
        type: "MOVE_SELECT",
        payload: {
            ...props
        }
    })
    const resizeListener = (e) => changeDims({
        width: e.clientX - boxSelect.left,
        height: e.clientY - 60 - boxSelect.top
    })
    const resizeTouchListener = (e) => changeDims({
        width: (e?.targetTouches[0]?.clientX-boxSelect.left)||boxSelect.width,
        height: (e?.targetTouches[0]?.clientY-boxSelect.top)||boxSelect.height
    })
    const removeListener = () => {
        window.removeEventListener('mousemove', resizeListener);
        window.removeEventListener('touchmove', resizeTouchListener);
        window.removeEventListener('mouseup', removeListener);
        window.removeEventListener('touchend', removeListener);
    }
    const startResize = () => {
        window.addEventListener('mousemove', resizeListener);
        window.addEventListener('touchmove', resizeTouchListener);
        window.addEventListener('mouseup', removeListener);
        window.addEventListener('touchend', removeListener);
    }
    const startDrag = () => {
        window.addEventListener('mousemove', dragListener);
        window.addEventListener('touchmove', dragTouchListener);
        window.addEventListener('mouseup', removeDragListener);
        window.addEventListener('touchend', removeDragListener);
    }
    const dragListener = (e) => {changeDims({
        left: e.clientX-boxSelect.width/2,
        top: e.clientY-50-boxSelect.height/2
    })}
    const dragTouchListener = (e) => changeDims({
        left: (e?.targetTouches[0]?.clientX)||boxSelect.width,
        top: (e?.targetTouches[0]?.clientY)||boxSelect.height
    })
    const removeDragListener = () => {
        window.removeEventListener('mousemove', dragListener);
        window.removeEventListener('touchmove', dragTouchListener);
        window.removeEventListener('mouseup', removeDragListener);
        window.removeEventListener('touchend', removeDragListener);
    }
    

    if (!boxSelect.active) return null
    return <div className={styles.selectionBox} style={{...boxSelect}}>
        <div className={styles.buttonContainer}>
            <Tooltip label="Drag Selection">
                <button 
                    className={styles.drag} 
                    onMouseDown={startDrag} 
                    onTouchStart={startDrag}
                    title="Drag Selection"
                    id="drag-seection"
                    >
                    <svg viewBox="0 0 64 64" x="0px" y="0px"><g><path d="M53.39,32.57a1.52,1.52,0,0,0-.33-1.63l-5.84-5.85a1.51,1.51,0,0,0-2.13,2.13l3.29,3.28H33.5V15.62l3.28,3.29a1.51,1.51,0,0,0,2.13-2.13l-5.85-5.84a1.5,1.5,0,0,0-2.12,0l-5.85,5.84a1.51,1.51,0,0,0,2.13,2.13l3.28-3.29V30.5H15.62l3.29-3.28a1.51,1.51,0,0,0-2.13-2.13l-5.84,5.85a1.5,1.5,0,0,0,0,2.12l5.84,5.85a1.51,1.51,0,0,0,2.13-2.13L15.62,33.5H30.5V48.38l-3.28-3.29a1.51,1.51,0,0,0-2.13,2.13l5.85,5.84a1.5,1.5,0,0,0,2.12,0l5.85-5.84a1.51,1.51,0,0,0-2.13-2.13L33.5,48.38V33.5H48.38l-3.29,3.28a1.51,1.51,0,0,0,2.13,2.13l5.84-5.85A1.51,1.51,0,0,0,53.39,32.57Z"></path></g></svg>
                </button>
            </Tooltip>

            <Tooltip label="Resize Selection">
                <button 
                    className={styles.resize} 
                    onMouseDown={startResize} 
                    onTouchStart={startResize}
                    title="Resize Selection"
                    id="resize-selection"
                    >
                    <svg viewBox="0 0 8.4666667 8.4666667" x="0px" y="0px"><g transform="translate(0,-288.53333)"><path d="m 5.5562495,289.59166 v 0.52916 h 0.94878 l -1.665015,1.66502 0.3741367,0.37414 1.665015,-1.66502 v 0.94878 h 0.5291667 v -1.85208 z m -2.303735,3.78168 -1.665015,1.66501 v -0.94878 H 1.0583328 v 1.85209 h 1.8520834 v -0.52917 h -0.94878 l 1.665015,-1.66501 z"></path></g></svg>
                </button>
            </Tooltip>
        </div>
    </div>
}