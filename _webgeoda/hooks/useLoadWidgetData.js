import { useSelector, useDispatch } from "react-redux";
import {loadWidget} from "../utils/widgets";

export default function useLoadWidgetData(){
    const dispatch = useDispatch();
    const widgetConfig = useSelector(state => state.widgetConfig);
    return (widgetIndex) => {
        loadWidget(widgetConfig, widgetIndex, dispatch);
        return null;
    }
}