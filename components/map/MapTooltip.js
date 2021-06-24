import styles from "./MainMap.module.css";
import { useSelector } from "react-redux";

export default function MapTooltip() {
  const currentHoverTarget = useSelector((state) => state.currentHoverTarget);
  
  if (!(typeof window) || !currentHoverTarget.data) return null;

  const rightSide = currentHoverTarget.x > window.innerWidth / 2
  const bottomSide = currentHoverTarget.y > window.innerHeight / 2
  
  const [ 
    xProp, 
    x,
    yProp,
    y
  ] = [
    rightSide ? 'right' : 'left',
    rightSide ? window.innerWidth - currentHoverTarget.x : currentHoverTarget.x,
    bottomSide ? 'bottom' : 'top',
    bottomSide ? window.innerHeight - currentHoverTarget.y - 50: currentHoverTarget.y + 50,
  ]

  return (
    <div
      className={styles.tooltipContainer}
      style={{ [xProp]: x, [yProp]: y}}
    >
      {currentHoverTarget.data.map((entry, idx) => (
        <p key={`tooltip-entry-${idx}`}>
          <b>{entry.name}</b>: {
            +entry.value
              ? Math.round(entry.value * 100) / 100
              : entry.value
            }
        </p>
      ))}
    </div>
  );
}
