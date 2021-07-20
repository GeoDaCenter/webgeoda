import styles from "../../components/map/MainMap.module.css";
import MainMap from "../../components/map/MainMap";
import VariablePanel from "../../components/map/VariablePanel";
import MapTooltip from "../../components/map/MapTooltip";
import { useSelector } from "react-redux";


export default function MapContainer(){
    const widgetIsDragging = useSelector(state => state.widgetIsDragging);
    const showWidgetTray = useSelector(state => state.showWidgetTray);
    
    return (
        <div className={`${styles.mapContainer} ${(showWidgetTray || widgetIsDragging) && styles.mapContainerRightMargin}`}>
            <MainMap />
            <VariablePanel />
            <MapTooltip />
        </div>
    )
}
            