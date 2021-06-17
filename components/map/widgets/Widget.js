import React from 'react';
import PropTypes from 'prop-types';
import styles from './Widgets.module.css';

function Widget(props){
    return (
        <div className={styles.widget}>

        </div>
    );
}

Widget.propTypes = {
    type: PropTypes.oneOf("histogram", "line", "scatter", "scatter3d", "cluster"),
    options: PropTypes.object
};

export default Widget;