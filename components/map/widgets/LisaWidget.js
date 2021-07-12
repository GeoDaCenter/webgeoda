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
    console.log(currentHoverTarget.id)
    const [getLisa,] = useLisa();

    // currentHoverTarget.id use find() to map to cluster values in lisa output

    // React.useEffect(async () => {
    //       const lisaData = await getLisa({
    //         dataParams: props.data.variableSpecs[0],
    //   });

  
    return (
    <div>
    <center>
    <br /><b>Mean of all observations:</b> {props.data.mean}
      <br /><b>Standard Dev: </b>{props.data.stdev}
    </center>
    </div>
  );
}

LisaWidget.propTypes = {
  options: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
};

export default LisaWidget;