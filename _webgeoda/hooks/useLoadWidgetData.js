import { useSelector, useDispatch } from "react-redux";
import {loadWidget} from "../utils/widgets";

export default function useLoadWidgetData(){
    const dispatch = useDispatch();
    return (widgetIndex) => {
        const widgetConfig = useSelector(state => state.widgetConfig);
        loadWidget(widgetConfig, widgetIndex, dispatch);
        return null;
    }
}