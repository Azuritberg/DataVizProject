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
  
  
  export function yearsToAllTimeDataset(type, type2, dataset){
    let objs = [];
    for (const t2 of type2) {
      let datamap = dataset.filter(x => x.name == t2).map(x => x.data)[0];
      
      let obj = {
        type: t2,
      }
      for (const t of type) {
        let objectData = datamap.map(x => x[t]).reduce((pv, cv) => pv + cv, 0);
        obj[t] = objectData
        console.log(t2,t, objectData)
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