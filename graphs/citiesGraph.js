import { dataSetCitiesEth, dataSetCitiesGen, dataSetProducersEth, dataSetProducersGen, dataSetAvgEarningsEthnicity, dataSetAvgEarningsGender, dataSetTotalGigsEthnicity, dataSetTotalGigsGender } from '../data/dataInit.js';
import { cities, producers, genders, ethnicties } from '../data/dataInit.js';
import { yearsToAllTimeDataset,  transformToLineData, getMaxValueDatasetOverall} from '../data/auxfunctions.js';


let colors = ["#BE71F5", "#5850EE", "#F034B8", "#00F453", "#ACFF58", "#45F5BC"]
let ethColors = ["#00F453", "#ACFF58", "#45F5BC"];
let testData = yearsToAllTimeDataset(ethnicties, cities, dataSetCitiesEth);
let ymax = getMaxValueDatasetOverall(testData, ethnicties);
console.log(ymax);
// GROUPED BAR CHART
export function renderGroupedBarChartCities(){
  const svg = d3.select("#chart-cities");
  svg.selectAll("*").remove();
  //grab width and height from svg element
  const width = Number(svg.attr("width"));
  const height = Number(svg.attr("height"));
  //define margin stuff
  const margin = {top: 50, right: 30, bottom: 60, left: 30};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  let xA = d3.scaleBand()
    .domain(testData.map(x => x.type))
    .range([0, innerWidth])
    .padding(0.2);

  let xB = d3.scaleBand()
    .domain(ethnicties)
    .range([0, xA.bandwidth()])
    .padding(0.2);

  const color = d3.scaleOrdinal()
    .domain(ethnicties)
    .range(ethColors);

  let y = d3.scaleLinear()
    .domain([0, ymax])
    .range([innerHeight, 0])
    .nice();

    const chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  chartGroup.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xA))
    .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");
  
  chartGroup.append("g")
    .call(d3.axisLeft(y));
  
  // Bars
  chartGroup.append("g")
    .selectAll("g")
    .data(testData)
    .enter()
    .append("g")
      .attr("transform", d => `translate(${xA(d.type)}, 0)`)
    .selectAll("rect")
    .data(d => ethnicties.map(key => ({ key: key, value: d[key] })))
    .enter()
    .append("rect")
      .attr("x", d => xB(d.key))
      .attr("y", d => y(d.value))
      .attr("height", d => {
        return innerHeight - y(d.value)
        })
      .attr("width", xB.bandwidth())
      .attr("fill", d => color(d.key));


  

/*   let selection = svg.selectAll("rect")
    .data(testData)
    .enter();
 */

}
renderGroupedBarChartCities();