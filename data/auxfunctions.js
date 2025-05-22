import { dataSetAvgEarningsEthnicity, ethnicties , dataSetCitiesEth, genders, dataSetCitiesGen} from "./datainit.js";

// ==== Functions ====
export function getMaxValueDataset(type, dataset){
    let yMax = 0;
    for (const t of type) {
      let arrayCollection = dataset.map(x => x.data).map(x => x.map(y => y[t]));
      for (const array of arrayCollection) {
        let y = array.reduce((pv, cv) => Math.max(pv, cv), -Infinity);
        if(y > yMax) yMax = y;
      }
    }
    return yMax;
  }
export function getMaxValueDatasetOverall(type, dataset){
    let ymax = 0;
    for (const d of dataset) {
        for (const t of type) {
            if(t[d] > ymax) ymax = t[d]
        }
    }
    return ymax
}
export function maxValueLineSet(type, dataset){
  let ymax = 0;
  for (const d of dataset) {
    for (const d2 of d.values) {
      if(d2.value > ymax) ymax = d2.value
    }
  }
  return ymax;
}
export function combineGroups(type, data){
    let a = type[0],b = type[1],c = type[2];
    
    //city of cities
    let returnData = [];
    for(let i = 0; i < 10 ; i++){
        let obj = {
            year: 2015 + i
        }
        obj[a] = 0, obj[b] = 0, obj[c] = 0;
        for (const d of data) {
            
            let theYear = d.data.find(d => d.year == 2015 + i);
            obj[a] += theYear[a];
            obj[b] += theYear[b];
            obj[c] += theYear[c];
        }
        console.log(obj)
        returnData.push(obj);
    }
    return returnData;
}
console.log(combineGroups(ethnicties, dataSetCitiesEth));
  
  
  export function yearsToAllTimeDataset(type, type2, dataset){
    let objs = [];
    for (const t2 of type2) {
      let datamap = dataset.filter(x => x.name == t2).map(x => x.data)[0];
      
      let obj = {
        type: t2,
      }
      for (const t of type) {
        let objectData = datamap.map(x => x[t]).reduce((pv, cv) => pv + cv, 0);
        obj[t] = objectData;
      }
      objs.push(obj);
    }
    return objs
  }
  
  
  
  // == FUNKTION TILL ATT TRANSFORMERA DATA (linjegraf) ==
  export function transformToLineData(data, categories) {
    return categories.map(category => ({
      category,
      values: data.map(d => ({
        year: d.year,
        value: d[category]
      }))
    }));
  }