import styles from "../../components/map/MainMap.module.css";
import MainMap from "../../components/map/MainMap";
import VariablePanel from "../../components/map/VariablePanel";
import MapTooltip from "../../components/map/MapTooltip";
import { useSelector } from "react-redux";


export default function MapContainer(){
    const widgetLocations = useSelector(state => state.widgetLocations);
    const widgetsOnRight = widgetLocations.some(o => o.side === "right");
    
    return (
        <div className={`${styles.mapContainer} ${widgetsOnRight === true && styles.mapContainerRightMargin}`}>
            <MainMap />
            <VariablePanel />
            <MapTooltip />
        </div>
    )
}
            