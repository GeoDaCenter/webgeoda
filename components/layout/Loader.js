import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import styles from "./Loader.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function Loader(props){
    return (
        <div className={`${styles.shade} ${props.displayShade ? "dimmed " : ""}`}>
            <FontAwesomeIcon icon={faSpinner} className={styles.spinner} />
        </div>
    );
}

Loader.propTypes = {
    displayShade: PropTypes.bool
};
Loader.defaultProps = {
    displayShade: true
};

export default Loader;