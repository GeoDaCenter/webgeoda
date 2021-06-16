import { useDispatch, useSelector } from "react-redux";
import styles from "./VariablePanel.module.css";
import { dataPresets } from "../../map-config";

import {
  Listbox,
  ListboxInput,
  ListboxButton,
  ListboxPopover,
  ListboxList,
  ListboxOption,
} from "@reach/listbox";
import "@reach/listbox/styles.css";

export default function VariablePanel(props) {
  const currentVariable = useSelector((state) => state.dataParams.variable);
  const dispatch = useDispatch();

  return (
    <div
      className={
        styles.panelContainer + " " + (props.open ? styles.open : styles.hidden)
      }
    >
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
    </div>
  );
}
