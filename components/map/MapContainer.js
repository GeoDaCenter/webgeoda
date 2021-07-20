import styles from "../../components/map/MainMap.module.css";
import MainMap from "../../components/map/MainMap";
import VariablePanel from "../../components/map/VariablePanel";
import MapTooltip from "../../components/map/MapTooltip";
import { useSelector } from "react-redux";


export default function MapContainer(){
    // const widgetConfig = useSelector((state) => state.widgetConfig);
    // const widgetsOnRight = widgetConfig.some(o => o.hidden === true);
    
    return (
        <div className={`${styles.mapContainer} ${false && styles.mapContainerRightMargin}`}> 
        {/* widgetsOnRight ===  */}
            <MainMap />
            <VariablePanel />
            <MapTooltip />
        </div>
    )
}
            