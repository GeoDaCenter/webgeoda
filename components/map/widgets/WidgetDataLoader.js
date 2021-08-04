import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import useFetchData from "@webgeoda/hooks/useFetchData";
import loaderStyles from "../../layout/Loader.module.css";
import styles from "./Widgets.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function WidgetDataLoader(props){
    const dispatch = useDispatch();
    const fetchData = useFetchData();
    const datasetFetchQueue = useSelector(state => state.datasetFetchQueue);
    const [isFetching, setIsFetching] = React.useState(false);
    
    const popDataQueue = async () => {
        if(datasetFetchQueue.length === 0) return;
        setIsFetching(true);
        const datasetToLoad = datasetFetchQueue[0];
        await fetchData({req: datasetToLoad});
        setIsFetching(false);
        console.log("Loading ", datasetToLoad);
        dispatch({
            type: "REMOVE_FROM_DATA_QUEUE",
            payload: {
                datasets: [datasetToLoad]
            }
        });
    }

    useEffect(() => {
        if(!isFetching) popDataQueue();
    }, [datasetFetchQueue]);

    return (
        <div className={`${styles.widgetDataLoader} ${datasetFetchQueue.length > 0 ? styles.active : ""}`}>
            <FontAwesomeIcon icon={faSpinner} className={`${loaderStyles.spinner} ${styles.spinner}`} />
        </div>
    );
}

WidgetDataLoader.propTypes = {

};

export default WidgetDataLoader;