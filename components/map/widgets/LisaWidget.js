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

function LisaWidget(props) {
    const geoda = useContext(GeodaContext)
    const currentHoverTarget = useSelector((state) => state.currentHoverTarget);
    const dataParams = useSelector((state) => state.dataParams);
    const storedGeojson = useSelector((state) => state.storedGeojson);
    const storedData = useSelector((state) => state.storedData)
    const currentData = useSelector((state) => state.currentData)
    const cachedVariables = useSelector((state) => state.cachedVariables[currentData])
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

    console.log(lisaData)

  
    

    const index = storedGeojson[currentData].order.findIndex((o) => o === currentHoverTarget.id)

    let val, spatialLag;

    if (lisaData)
    {
      const standardizedVals = standardize(props.data.dataColumn);
      React.useEffect(async () => {
      const spatialLags = await geoda.spatialLag(lisaData.weights, standardizedVals)
      })
      index!=-1 ? val = standardizedVals[index].toFixed(3) : val = null;
      const spatialLag = spatialLags[index]
    }

    
    // TODO: spatial lag

    let cl, pval, numNeighbors, lisaVal;
    if (lisaData && index!=-1) {
        cl = lisaData.lisaResults.labels[lisaData.lisaResults.clusters[index]]
        pval = lisaData.lisaResults.pvalues[index]
        numNeighbors = lisaData.lisaResults.neighbors[index]
        lisaVal = lisaData.lisaResults.lisaValues[index]
    }
    else {cl='Undefined'}


    return (
    <div>
    <center>
    <br /><b>ID: </b> {currentHoverTarget.id}
    <br /><b>Mean of all observations:</b> {props.data.mean}
    <br /><b> {props.data.variable.variable}: </b> {cachedVariables[props.data.variable.variable][currentHoverTarget.id]}
    <br /><b> {props.data.variable.variable} Standardized: </b> {val}
    <br /><b> Spatial Lag: </b> {spatialLag}
      <br /><b>Cluster: </b> {cl}
      <br /><b>Lisa Value: </b> {lisaVal}
      <br /><b>P-value: </b> {pval}
      <br /><b>Number of Neighbors: </b> {numNeighbors}
      </center>
    </div>
  );
}


LisaWidget.propTypes = {
  options: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
};

export default LisaWidget;