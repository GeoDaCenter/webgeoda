import styles from './MainMap.module.css';
import { useSelector } from 'react-redux';

export default function MapTooltip(){
    const currentHoverTarget = useSelector(state => state.currentHoverTarget);
    const {x, y, data} = currentHoverTarget;
    
    return (
        <>
            {data && <div className={styles.tooltipContainer} style={{left: x, top: y + 50}}>
                {
                    data.map(entry => <p>{entry.name}: {Math.round(entry.value*100)/100}</p>)
                }
            </div>}
        </>
    )
}