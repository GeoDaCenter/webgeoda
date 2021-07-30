import React from "react";
import {useSelector, useDispatch} from "react-redux";
import styles from "./Widgets.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

export default function WidgetTrayHandle(){ //props
    const dispatch = useDispatch();
    const showWidgetTray = useSelector(state => state.showWidgetTray);
    const widgetIsDragging = useSelector(state => state.widgetIsDragging);

    const handleWidgetTrayClick = () => dispatch({type: "SET_SHOW_WIDGET_TRAY", payload: !showWidgetTray});

    return (
        <button id={styles.dropdownHandleRight} className={`${styles.widgetDropdownHandle} ${showWidgetTray || widgetIsDragging ? "" : styles.hidden}`} onClick={handleWidgetTrayClick}>
            <FontAwesomeIcon icon={faAngleRight} className={styles.caret} />
            <p>Widgets</p>
        </button>
    );
}
