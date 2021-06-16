
import useGetDataColumn from "@webgeoda/hooks/useGetDataColumn";

export default function HookTest(props){
    const columnData = useGetDataColumn(props.variableSpec, props.widgetType);
    console.log(columnData)

    return <></>
}