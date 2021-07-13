import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from "react-redux";
import useLisa from '@webgeoda/hooks/useLisa';
import * as ss from 'simple-statistics';
import { getLisaResults } from '@webgeoda/utils/geoda-helpers';
import useGetScatterplotLisa from '@webgeoda/hooks/useGetScatterplotLisa';

function LisaWidget(props) {
    const currentHoverTarget = useSelector((state) => state.currentHoverTarget);
    const dataParams = useSelector((state) => state.dataParams);
    const storedGeojson = useSelector((state) => state.storedGeojson);
    const storedData = useSelector((state) => state.storedData)
    const currentData = useSelector((state) => state.currentData)
    const [getLisa,] = useLisa();
    const [getCachedLisa, updateCachedLisa] = useGetScatterplotLisa();


    const lisaData = getCachedLisa(props.data.variable);
    React.useEffect(async () => {
    if(lisaData == null){
        const lisaData = await getLisa({
        dataParams: props.data.variable,
    });
    updateCachedLisa(props.data.variable, lisaData);
    }
    });


    //TODO - how to access tx.geojson without manual
    const index = storedGeojson[currentData].order.findIndex((o) => o === currentHoverTarget.id)
    console.log(index)

  
    let cl;
    if (lisaData && index!=-1) {
        console.log(lisaData.lisaResults)
        cl = lisaData.lisaResults.clusters[index]
    }
    else {cl='Undefined'}

    return (
    <div>
    <center>
    <br /><b>Mean of all observations:</b> {props.data.mean}
      <br /><b>Standard Dev: </b>{props.data.stdev}
      <br /><b>ID: </b> {currentHoverTarget.id}
      <br /><b>Cluster: </b> {cl}
    </center>
    </div>
  );
}

LisaWidget.propTypes = {
  options: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
};

export default LisaWidget;