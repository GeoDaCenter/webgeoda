 import {useState, useEffect, createRef} from 'react';
import styles from "./Widgets.module.css";
import { useSelector, useDispatch } from "react-redux";
import { find, findIndex } from "@webgeoda/utils/data";
import Draggable from 'react-draggable';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import Widget from "./Widget";

const WidgetCell = ({
    hovered,
    id,
    gridColumnStart,
    gridColumnEnd,
    gridRowStart,
    gridRowEnd
})=>(<div 
    className={`${styles.widgetLayoutCell} ${hovered && styles.hoveredWidgetLayoutCell}`}
    id={id}
    style={{
        gridColumnStart,
        gridColumnEnd,
        gridRowStart,
        gridRowEnd
    }}
    >
        <span></span>
    </div>)

const DraggableWidget = ({
    setIsDragging,
    widget,
    widgets,
    setWidgets,
    setHoverTarget,
    gridRef,
    gridColumnStart,
    gridColumnEnd,
    gridRowStart,
    gridRowEnd,
}) => {

    const draggableEntity = createRef();
    
    const handleDrop = (e) => {
        const currFeature = queryFeatures(e)
        if (currFeature){
            const stringCoordinates = currFeature.slice(-2,)
            let tempArray = [...widgets]
            const spliceIndex = findIndex(
                tempArray, 
                o => (o.coordinates[0] === gridColumnStart && o.coordinates[1] === gridRowStart))
            tempArray.splice(spliceIndex, 1)
            tempArray.push({
                ...widget,
                coordinates: [+stringCoordinates[0],+stringCoordinates[1]]
            })
            setWidgets(tempArray);
            setIsDragging(false);
        } else {
            resetPosition()
        }
    }
    const resetPosition = (e) => {
        draggableEntity.current.state.x = 0;
        draggableEntity.current.state.y = 0;
        setIsDragging(false);
    }

    const queryFeatures = (e) => {
        const currentOpenSquares = gridRef.current.children;
        for (let i=0; i<currentOpenSquares.length;i++){
            const {x,y, width, height} = currentOpenSquares[i].getBoundingClientRect();
            if (x < e.clientX && x+width > e.clientX && y < e.clientY && y+height > e.clientY) {
                return currentOpenSquares[i].id
            }
        }
        return false 
    }
    return (
        <Draggable 
            handle="strong"
            onStart={() => setIsDragging(true)}
            onStop={(e) => handleDrop(e)}
            onDrag={(e) => setHoverTarget(queryFeatures(e))}
            ref={draggableEntity}
            >
            <div 
                className={`box no-cursor ${styles.widgetActiveCell}`}
                style={{ 
                    gridColumnStart,
                    gridColumnEnd,
                    gridRowStart,
                    gridRowEnd,
                }}>
            <strong className={`cursor ${styles.grip}`}><FontAwesomeIcon icon={faGripVertical} /></strong>
                <Widget 
                    config={widget} 
                    id={widget.id}
                    type={widget.type}
                    options={widget.options}
                />
            </div>
        </Draggable>)
}

export default function WidgetLayout(){
    const dispatch = useDispatch()
    const widgetColumns = useSelector((state) => state.dataPresets.layout.widgetColumns);
    const widgetRows = useSelector((state) => state.dataPresets.layout.widgetRows);
    const dataPresets = useSelector((state) => state.dataPresets);
    const widgets = dataPresets.widgets;
    const setWidgets = (newWidgets) => 
        dispatch({
            type:"SET_WIDGET_LOCATIONS",
            payload: newWidgets
        })

    const [isDragging, setIsDragging] = useState(false)
    const [hoverTarget, setHoverTarget] = useState(false)
    const gridRef = createRef()

    let cells = []
    let WidgetCells = []

    for (let i=1; i<widgetColumns+1; i++){
        for (let n=1; n<widgetRows+1; n++){
            
            const widgetInThisCell = find(
                widgets,
                o => (o.coordinates[0] === i && o.coordinates[1] === n)
            )

            !widgetInThisCell && cells.push(<WidgetCell 
                hovered={hoverTarget === `passive-cell-${i}${n}`}
                id={`passive-cell-${i}${n}`}
                key={`passive-cell-${i}${n}`}
                gridColumnStart={i}
                gridColumnEnd={i+1}
                gridRowStart={n}
                gridRowEnd={n+1}
                />)
                
            widgetInThisCell && WidgetCells.push(<DraggableWidget 
                setIsDragging={setIsDragging}
                setHoverTarget={setHoverTarget}
                widget={widgetInThisCell}
                widgets={widgets}
                setWidgets={setWidgets}
                id={`active-cell-${i}${n}`}
                key={`active-cell-${i}${n}`}
                gridRef={gridRef}
                gridColumnStart={i}
                gridColumnEnd={i+1}
                gridRowStart={n}
                gridRowEnd={n+1}
            />)
        }
    }
    
    return (
        <>
            <div 
                className={`${styles.widgetLayoutContainer} ${isDragging && `${styles.widgetLayoutContainerGuides}`}`}
                style={{
                    gridTemplateColumns: `repeat(${widgetColumns}, ${100/widgetColumns}%)`,
                    gridTemplateRows: `repeat(${widgetRows}, ${100/widgetRows}%)`
                }}
                ref={gridRef}
            >
                {cells}
            </div>
            <div 
                className={styles.widgetLayoutContainer}
                style={{
                    gridTemplateColumns: `repeat(${widgetColumns}, ${100/widgetColumns}%)`,
                    gridTemplateRows: `repeat(${widgetRows}, ${100/widgetRows}%)`,
                }}
            >
                {WidgetCells}
            </div>
        </>)

}