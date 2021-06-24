import { useDispatch, useSelector } from "react-redux";
import styles from "./VariablePanel.module.css";

import {
  Listbox,
  ListboxOption,
} from "@reach/listbox";
import "@reach/listbox/styles.css";

import {
  Gutter
} from "../layout/Gutter";

export default function VariablePanel(props) {
  const dataParams = useSelector((state => state.dataParams));
  const currentVariable = dataParams.variable;
  const currentData = useSelector((state) => state.currentData);
  const dataPresets = useSelector((state) => state.dataPresets);
  const dispatch = useDispatch();

  return (
    <div
      className={
        styles.panelContainer + " " + (props.open 
          ? styles.open 
          : styles.hidden)
      }
    >
      <p>Variable Select</p>
      <Listbox
        value={currentVariable}
        onChange={(value) =>
          dispatch({ type: "CHANGE_VARIABLE", payload: value })
        }
      >
        {dataPresets.variables.map((entry, i) => (
          <ListboxOption value={entry.variable} key={`variable-list-${i}`}>
            {entry.variable}
          </ListboxOption>
        ))}
      </Listbox>

      {dataPresets.data.length > 1 &&
      <> 
        <Gutter em={1}/>
        <p>Geography Select</p>
        <Listbox
        value={currentData}
        onChange={(value) =>
          dispatch({ type: "CHANGE_DATASET", payload: value })
        }
        >
          {dataPresets.data.map((entry, i) => (
            <ListboxOption value={entry.geojson} key={`geography-list-${i}`} disabled={!(entry.tables.hasOwnProperty(dataParams.numerator)||dataParams.numerator==="properties")}>
              {entry.name}
            </ListboxOption>
          ))}
        </Listbox>
      </>}
    </div>
  );
}
