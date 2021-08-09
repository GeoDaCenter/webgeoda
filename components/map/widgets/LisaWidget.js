import React from 'react';
import { useContext, useEffect } from "react";
import PropTypes from 'prop-types';
import { useSelector } from "react-redux";
import useLisa from '@webgeoda/hooks/useLisa';
import * as ss from 'simple-statistics';
import { getLisaResults } from '@webgeoda/utils/geoda-helpers';
import useGetScatterplotLisa from '@webgeoda/hooks/useGetScatterplotLisa';
import { standardize } from '@webgeoda/utils/stats';
import { geoda } from '@webgeoda/utils/colors';
import { GeodaContext } from '@webgeoda/contexts';
import { getColumnData } from '@webgeoda/utils/widgets';
import useGetLisa from '@webgeoda/hooks/useGetLisa';

function LisaWidget(props) {
    const geoda = useContext(GeodaContext)
    const currentHoverTarget = useSelector((state) => state.currentHoverTarget);
    const currentHoverId = useSelector ((state) => state.currentHoverId)
    const dataParams = useSelector((state) => state.dataParams);
    // const storedGeojson = useSelector((state) => state.storedGeojson);
    // const storedData = useSelector((state) => state.storedData)
    // const currentData = useSelector((state) => state.currentData)
    const lisaVariable = useSelector((state) => state.lisaVariable)
  //const cachedVariables = useSelector((state) => state.cachedVariables[state.currentData])
  

    const lisaData = useGetLisa({
      variable: lisaVariable,
      getScatterPlot: true,
      id: props.id,
      config: props.config
    });

    if (!Object.keys(lisaData.lisaData).length || currentHoverId===undefined) return null;

    const index = lisaData.order.findIndex((o) => o === currentHoverId)

    let cl, pval, numNeighbors, spatialLag;
    if (lisaData && index!=-1) {
        cl = lisaData.lisaResults.labels[lisaData.lisaResults.clusters[index]]
        pval = lisaData.lisaResults.pvalues[index].toFixed(3)
        numNeighbors = lisaData.lisaResults.neighbors[index]
        spatialLag = lisaData.spatialLags[index].toFixed(3)

    }


    let avg = null;
    let lisaVal = null;
    Object.values(lisaData.lisaData).length==0 ? avg = 'N/A' : avg = ss.mean(Object.values(lisaData.lisaData)).toFixed(3)
    lisaVal = lisaData.lisaData[currentHoverId]

    return (
    <div>
    <center>
    <br /><b>ID: </b> {currentHoverId}
    <br /><b>Mean of all observations:</b> {avg}
    <br /><b> {lisaVariable}: </b> {lisaVal}
    <br /><b> Spatial Lag: </b> {spatialLag}
      <br /><b>Cluster: </b> {cl}
      <br /><b>P-value: </b> {pval}
      <br /><b>Number of Neighbors: </b> {numNeighbors}
      </center>
    </div>
  );
}


// LisaWidget.propTypes = {
//   options: PropTypes.object.isRequired,
//   data: PropTypes.object.isRequired
// };

export default LisaWidget;