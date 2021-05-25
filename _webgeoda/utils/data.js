export const dataFn = (numeratorData, denominatorData, dataParams)  => {
    const { 
      nProperty, nIndex,
      dProperty, dIndex, 
      nType, dType,
      scale
    } = dataParams;
  
    const nRange = nIndex <= dataParams.nRange ? nIndex : dataParams.nRange;
    const dRange = dIndex <= dataParams.dRange ? dIndex : dataParams.dRange;
    
    if (numeratorData === undefined) {
      return null;
    } else if ((nProperty !== null && numeratorData[nProperty] === undefined) && (nIndex !== null && numeratorData[nIndex] === undefined)){
      return null;
    } else if (nType ==='time-series' && dType === 'time-series') {
      if (nRange === null & dRange === null) {
        return (
          (numeratorData[nIndex])
          /
          (denominatorData[dIndex])
          *scale   
        )
  
      } else {
        return (
          ((numeratorData[nIndex]-numeratorData[nIndex-nRange])/nRange)
          /
          ((denominatorData[dIndex]-denominatorData[dIndex-dRange])/dRange)
          *scale   
        )
      }
    } else if (!(dProperty)&&!(nRange)){ // whole count or number -- no range, no normalization
      return (numeratorData[nProperty]||numeratorData[nIndex])*(scale||1)
    } else if (!(dProperty)&&nRange){ // range number, daily or weekly count -- no normalization
      return (numeratorData[nIndex]-numeratorData[nIndex-nRange])/nRange*(scale||1)
    } else if (dProperty&&!(nRange)){ // whole count or number normalized -- no range
      return (numeratorData[nProperty]||numeratorData[nIndex])/(denominatorData[dProperty]||denominatorData[dIndex])*scale
    } else if (dProperty!==null&&nRange!==null&&dRange===null){ // range number, daily or weekly count, normalized to a single value
      return (
        (numeratorData[nIndex]-numeratorData[nIndex-nRange])/nRange)/(denominatorData[dProperty]||denominatorData[dIndex]
          )*scale
    } else {      
      return 0;
    }
}

export function mapFn(val, bins, colors, maptype, table){
  if (val === null) {
    return null;
  } else if (maptype === "natural_breaks") {
    if ((val === 0 && table.indexOf('testing') === -1) || (val === -100 && table.includes('testing'))) return colors[0];

    for (let i=1; i<bins.length; i++) {
      if (val < bins[i]) {
        return colors[i]
      }
    }
    return colors[0];
  } else if (maptype.includes("hinge")) {
    
    if (val === null) return [0,0,0,0];
    
    for (let i=1; i<bins.length; i++) {
      if (val < bins[i]) {
        return colors[i-1]
      }
    }
    return colors[colors.length-1];
  }
}

export function mapFnNb(val, bins, colors, maptype, table){
  if (val === null) return null
  if (val === 0) return colors[0]
  for (let i=1; i<bins.length; i++) {
    if (val < bins[i]) {
      return colors[i]
    }
  }
  return colors[colors.length-1];
}

export function mapFnTesting(val, bins, colors, maptype, table){
  if (val === null) return null
  if (val === -1) return colors[0]
  for (let i=1; i<bins.length; i++) {
    if (val < bins[i]) {
      return colors[i]
    }
  }
  return colors[colors.length-1];
}

export function mapFnHinge(val, bins, colors, maptype, table){
  if (val === null) return [0,0,0,0]
  if (val === 0) return colors[0]
  for (let i=1; i<bins.length; i++) {
    if (val < bins[i]) {
      return colors[i-1]
    }
  }
  return colors[colors.length-1];
}

export const getVarId = (currentData, dataParams) => {
    return `${currentData}-${dataParams.numerator}-${dataParams.nIndex}-${dataParams.nRange}-${dataParams.denominator}-${dataParams.dProperty}-${dataParams.dIndex}-${dataParams.dRange}-${dataParams.scale}`
}

export const shallowEqual = (object1, object2) => { // Thanks @Dmitri Pavlutin
  const keys = Object.keys(object1);
  if (keys.length !== keys.length) return false; 
  for (let i=0; i<keys.length; i++) {
      if (object1[keys[i]] !== object2[keys[i]]) {
          if (keys[i] !== 'nIndex' && keys[i] !== 'dIndex') return false;  
      }
  }
  return true;
};

// this function loops through the current data set and provides data for GeodaJS to create custom breaks 
export const getDataForBins = (numeratorData, denominatorData, dataParams, fixedOrder=false) => {

  let { nProperty, nIndex, dType, dIndex, dProperty} = dataParams;
  let tempDataParams = {...dataParams};
  
  if (nProperty === undefined && nIndex === undefined) {
    nProperty = dataParams.numerator||null
    tempDataParams.nProperty = dataParams.numerator
    tempDataParams.numerator = "properties"
  }
  if (dProperty === undefined && dIndex === undefined) {
    dProperty = dataParams.denominator||null
    tempDataParams.dProperty = dataParams.denominator
    tempDataParams.denominator = "properties"
  }

  // declare empty array for return variables
  let rtn = new Array(fixedOrder ? fixedOrder.length : Object.keys(numeratorData).length);

  // length of data table to loop through
  const keys = fixedOrder || Object.keys(numeratorData);
  const n = keys.length;

  // this checks if the bins generated should be dynamic (generating for each date) or fixed (to the most recent date)
  if (nIndex === null && nProperty === null) {
      // if fixed, get the most recent date
      let tempIndex = numeratorData.length-1;
      // if the denominator is time series data (eg. deaths / cases this week), make the indices the same (most recent)
      let tempDIndex = dType === 'time-series' ? denominatorData.length-1 : dIndex;
      // loop through, do appropriate calculation. add returned value to rtn array
      for (let i=0; i<n; i++){
          rtn[keys[i]] = dataFn(numeratorData[keys[i]], denominatorData[keys[i]], {...dataParams, nIndex:tempIndex, dIndex: tempDIndex})||0
      }
  } else {
      for (let i=0; i<n; i++){
        rtn[i] = dataFn(numeratorData[keys[i]], denominatorData[keys[i]], tempDataParams)||0
      }
  }

  for (let i=0; i<rtn.length;i++){
      if (rtn[i] < 0) rtn[i] = 0
  }

  return rtn;   
}