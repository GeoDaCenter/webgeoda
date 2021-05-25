import styles from '../styles/Map.module.css'

export default function Legend(props){
    return  (
        <div className={styles.legendContainer}>
            {props.variableName && <p className={styles.variableName}>{props.variableName}</p>}
            <div className={styles.legendInnerContainer}>
                <div className={styles.legendColors}>
                    {props.colors?.map((color, i) => <span key={`legend-color-${i}`} style={{backgroundColor: `rgb(${color.join(',')})`}}></span>)}
                </div>
                <div className={styles.legendLabels}>
                    {props.bins?.map((bin, i) => <span key={`legend-label-${i}`}>{bin?.toLocaleString('en')}</span>)}
                </div>
            </div>
        </div>
    )
}