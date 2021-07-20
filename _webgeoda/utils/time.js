import * as dayjs from 'dayjs';

function parseDates(columns){
    let returnObj = {}
    for (let i=0; i<columns.length; i++){
        let parsedColumn = dayjs(columns[i])
        if (parsedColumn>0) {
            if (returnObj.hasOwnProperty(0)){
            let diff = parsedColumn - returnObj[0].date
            returnObj[diff] = {
                column: columns[i],
                date: parsedColumn
            }
            } else {
                returnObj[0] = {
                    column: columns[i],
                    date: parsedColumn
                } 
            }
        }
    }
    return returnObj
}

function arrangeDates(data, sortedDates, parsedColumns){
    let rowArray = new Array(sortedDates.length);
    for (let i=0; i<sortedDates.length;i++){
        rowArray[i] = data[parsedColumns[sortedDates[i]].column]
    }
    return rowArray
}

function hasDtRows(row){
    const columns = Object.keys(row)
    for (let i=0; i<columns.length;i++){
          if(dayjs(columns[i])>0) return false
    }
    const data = Object.values(row)
    
    for (let i=0; i<data.length; i++){
        if(dayjs(data[i])>0) return columns[i]
    }
  
    throw('Err: Could not find rows or columns with dt data')
}

function getUniqueDates(data, column){
    let returnDates = [];
    for (let i=0;i<data.length;i++){
        if (!returnDates.includes(data[i][column])) returnDates.push(data[i][column])
    }
    return returnDates
}

function outputTable(raw, parsedDates, joinColumn){
    let sortedDates = Object.keys(parsedDates).sort((a,b)=>a-b);
    let dateList = []
    for (let i=0; i<sortedDates.length;i++){
        dateList.push(parsedDates[sortedDates[i]].date)
    }  

    let dataTable = {}  
    for (let i=0; i<raw.length;i++){
      dataTable[raw[i][joinColumn]] = arrangeDates(raw[i], sortedDates, parsedDates)
    }
    return {
      dataTable,
      dateList
    }
}

function outputLongTable(raw, parsedDates, joinColumn, dateColumn, valColumn){
    const sortedDates = Object.keys(parsedDates).sort((a,b)=>a-b);
    let dateIndices = {}
    let dateList = []
    for (let i=0; i<sortedDates.length;i++){
        dateList.push(parsedDates[sortedDates[i]].date)
        dateIndices[parsedDates[sortedDates[i]].column] = i
    }  
  
    let dataTable = {}
  
    for (let i=0; i< raw.length; i++){
        if (dataTable.hasOwnProperty(raw[i][joinColumn])){
            dataTable[raw[i][joinColumn]][dateIndices[raw[i][dateColumn]]] = raw[i][valColumn]
        } else {
            dataTable[raw[i][joinColumn]] = new Array(sortedDates.length).fill(null)
            dataTable[raw[i][joinColumn]][dateIndices[raw[i][dateColumn]]] = raw[i][valColumn]
        }
    }
    return {
      dataTable,
      dateList
    }
}

export function handleTimeSeriesTable(data, joinColumn, dateColumn=false, valColumn=false){
    if (dateColumn) {
      const dates = getUniqueDates(data, dateColumn)
      const parsedDates = parseDates(dates)
      const { dataTable, dateList } = outputLongTable(data, parsedDates, joinColumn, dateColumn, valColumn)
      return { dataTable, dateList } 
    } else {
      const columns = Object.keys(data[0])
      const parsedDates = parseDates(columns)
      const { dataTable, dateList } = outputTable(data, parsedDates, joinColumn)
      return {dataTable,dateList}
    }
}