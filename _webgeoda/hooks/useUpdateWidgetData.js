import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from 'react';
import useLisa from './useLisa';


export default function useUpdateWidgetData() {
  const currentData = useSelector((state) => state.currentData);
  const dataPresets = useSelector((state) => state.dataPresets);
  const widgets = dataPresets.widgets;
  const widgetData = useSelector((state) => state.widgetData);
  const dispatch = useDispatch();
  const [getLisa] = useLisa();
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    for (const key in widgetData){
      if (widgetData[key].needsLisa){
        setIsLoading(true)
        const widgetSpec = widgets.find(o => o.id==key)
        updateLisaWidgetData({
          variableName: widgetSpec.xVariable,
          id: key
        })
      }
    }
  },[widgetData])

  const updateLisaWidgetData = async ({
    variableName,
    id,
    geographyName=currentData
  }) => {
    const dataParams = dataPresets.variables.find(o => o.variable === variableName)

    const data = await getLisa({
      dataParams,
      geographyName,
      getScatterPlot: true
    })

    dispatch({
      type: "SET_WIDGET_DATA",
      payload: {
        [id]: data
      }
    })

    setIsLoading(false)
  }
  return [isLoading];
}
